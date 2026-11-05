import { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as seed from "../data/sampleData";
import { todayISO } from "../utils/dates";

// Front-end demo store. Everything lives in memory and resets on refresh.
// When the Firebase step starts, each function below becomes a call in src/services/.
const DataContext = createContext(null);
let counter = 100;
const nextId = (prefix) => `${prefix}${++counter}`;

export function DataProvider({ children }) {
  const [users, setUsers] = useState(seed.users);
  const [applications, setApplications] = useState(seed.hostApplications);
  const [properties, setProperties] = useState(seed.properties);
  const [bookings, setBookings] = useState(seed.bookings);
  const [payments, setPayments] = useState(seed.payments);
  const [listingFees, setListingFees] = useState(seed.listingFees);
  const [reviews, setReviews] = useState(seed.reviews);
  const [notifications, setNotifications] = useState(seed.notifications);
  const [settings, setSettings] = useState(seed.settings);

  const notify = useCallback((userId, title, message, link = "") => {
    setNotifications((list) => [{ id: nextId("n"), userId, title, message, link, read: false, createdAt: todayISO() }, ...list]);
  }, []);

  const adminIds = users.filter((u) => u.role === "admin").map((u) => u.id);

  const value = useMemo(() => {
    const patch = (setter) => (id, changes) =>
      setter((list) => list.map((x) => (x.id === id ? { ...x, ...changes } : x)));

    const ratingOf = (propertyId) => {
      const list = reviews.filter((r) => r.propertyId === propertyId && r.visible);
      if (!list.length) return { avg: 0, count: 0 };
      return { avg: list.reduce((s, r) => s + r.rating, 0) / list.length, count: list.length };
    };

    return {
      users, applications, properties, bookings, payments, listingFees, reviews, notifications, settings, ratingOf, notify,
      coverOf: (propertyId) => properties.find((x) => x.id === propertyId)?.images?.[0] || "",

      addUser: (u) => { const user = { id: nextId("u"), role: "guest", status: "active", emailVerified: false, ...u }; setUsers((l) => [...l, user]); return user; },
      updateUser: patch(setUsers),

      submitApplication: (userId, form) => {
        setApplications((l) => [...l.filter((a) => a.id !== userId), { id: userId, userId, status: "pending", ...form }]);
        adminIds.forEach((id) => notify(id, "Host application", `${form.fullName} applied to become a host.`, "/admin/hosts"));
      },
      setApplication: (id, status) => {
        setApplications((l) => l.map((a) => (a.id === id ? { ...a, status } : a)));
        if (status === "approved") setUsers((l) => l.map((u) => (u.id === id ? { ...u, role: "host" } : u)));
        if (status === "approved" || status === "rejected")
          notify(id, status === "approved" ? "You are a host" : "Application not approved",
            status === "approved" ? "Your host application was approved. You can now add properties." : "Your host application was not approved.", "/become-host");
      },
      updateApplication: patch(setApplications),

      // Editing patches the property. A new property also takes a listing fee payment ({ gcashNumber, accountName }).
      saveProperty: (p, listingPayment) => {
        if (p.id) { setProperties((l) => l.map((x) => (x.id === p.id ? { ...x, ...p } : x))); return p.id; }
        const id = nextId("p");
        setProperties((l) => [...l, { id, status: "pending", blockedRanges: [], tone: Math.floor(Math.random() * 8), imageCount: 0, images: [], maxPets: 0, titleDocument: null, rejectReason: "", ...p }]);
        if (listingPayment) {
          setListingFees((l) => [...l, {
            id: nextId("lf"), propertyId: id, propertyTitle: p.title, hostId: p.hostId, hostName: p.hostName, amount: settings.listingFee,
            method: "GCash", gcashNumber: listingPayment.gcashNumber, accountName: listingPayment.accountName,
            referenceNumber: `GC-${Math.floor(10000000 + Math.random() * 89999999)}`, paidAt: todayISO(), status: "paid",
          }]);
          notify(p.hostId, "Listing fee paid", `Your listing fee for ${p.title} was received. The StayN team will review it.`, "/host/properties");
        }
        adminIds.forEach((a) => notify(a, "Property waiting", `${p.title} needs approval.`, "/admin/properties"));
        return id;
      },
      setPropertyStatus: (id, status, rejectReason = "") => {
        const prop = properties.find((x) => x.id === id);
        setProperties((l) => l.map((x) => (x.id === id ? { ...x, status, rejectReason } : x)));
        // A rejected property gets its listing fee back (label only, no money moves).
        if (status === "rejected") setListingFees((l) => l.map((f) => (f.propertyId === id && f.status === "paid" ? { ...f, status: "refunded" } : f)));
        if (prop && (status === "approved" || status === "rejected"))
          notify(prop.hostId, status === "approved" ? "Property approved" : "Property rejected",
            status === "approved" ? `${prop.title} is now live.` : `${prop.title} was rejected: ${rejectReason}`, "/host/properties");
      },
      deleteProperty: (id) => setProperties((l) => l.filter((x) => x.id !== id)),

      createBooking: ({ property, checkIn, checkOut, adults, kids, pets, user, price }) => {
        const id = nextId("b");
        setBookings((l) => [{
          id, propertyId: property.id, propertyTitle: property.title, tone: property.tone, destination: property.destination,
          guestId: user.id, guestName: user.name, guestEmail: user.email, guestPhone: user.phone, hostId: property.hostId,
          checkIn, checkOut, adults, kids, pets, guests: adults + kids, ...price, status: "pending", cancelledBy: "", reviewed: false, createdAt: todayISO(),
        }, ...l]);
        notify(property.hostId, "New booking request", `${user.name} asked to book ${property.title}.`, "/host/bookings");
        notify(user.id, "Request sent", `Your request for ${property.title} was sent to the host.`, `/reservations/${id}`);
        return id;
      },
      setBookingStatus: (id, status, extra = {}) => {
        const b = bookings.find((x) => x.id === id);
        setBookings((l) => l.map((x) => (x.id === id ? { ...x, status, ...extra } : x)));
        if (!b) return;
        if (status === "awaiting_payment") notify(b.guestId, "Request accepted", `Your request for ${b.propertyTitle} was accepted. Please pay to confirm.`, `/reservations/${id}`);
        if (status === "rejected") notify(b.guestId, "Request declined", `The host could not accept your request for ${b.propertyTitle}.`, `/reservations/${id}`);
        if (status === "cancelled") notify(b.guestId, "Booking cancelled", `Your booking for ${b.propertyTitle} was cancelled.`, `/reservations/${id}`);
      },
      payBooking: (id, { gcashNumber, accountName }) => {
        const b = bookings.find((x) => x.id === id);
        setPayments((l) => [...l, { id, bookingId: id, guestId: b.guestId, hostId: b.hostId, amount: b.total, method: "GCash", gcashNumber, accountName, referenceNumber: `GC-${Math.floor(10000000 + Math.random() * 89999999)}`, paidAt: todayISO(), status: "paid" }]);
        setBookings((l) => l.map((x) => (x.id === id ? { ...x, status: "confirmed" } : x)));
        notify(b.hostId, "Payment received", `${b.guestName} paid for ${b.propertyTitle}.`, "/host/bookings");
        notify(b.guestId, "Booking confirmed", `Your payment for ${b.propertyTitle} was received.`, `/reservations/${id}`);
      },
      refundPayment: (id) => setPayments((l) => l.map((x) => (x.id === id ? { ...x, status: "refunded" } : x))),

      addReview: (r) => {
        setReviews((l) => [...l, { id: r.bookingId, visible: true, createdAt: todayISO(), ...r }]);
        setBookings((l) => l.map((x) => (x.id === r.bookingId ? { ...x, reviewed: true } : x)));
      },
      updateReview: patch(setReviews),
      // A guest deleting their own review can write a new one afterwards.
      deleteMyReview: (reviewId, bookingId) => {
        setReviews((l) => l.filter((x) => x.id !== reviewId));
        setBookings((l) => l.map((x) => (x.id === bookingId ? { ...x, reviewed: false } : x)));
      },
      deleteReview: (id) => setReviews((l) => l.filter((x) => x.id !== id)),

      markRead: (id) => setNotifications((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))),
      markAllRead: (userId) => setNotifications((l) => l.map((n) => (n.userId === userId ? { ...n, read: true } : n))),

      updateSettings: (changes) => setSettings((s) => ({ ...s, ...changes })),
    };
  }, [users, applications, properties, bookings, payments, listingFees, reviews, notifications, settings, notify, adminIds.join()]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
