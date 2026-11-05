import { addDays, nightsBetween } from "../utils/dates";
import { priceBreakdown } from "../utils/price";

// Demo data that mirrors the Firestore collections in StayN-Data-Model.
// Photos are placeholder color tiles for now (see components/Photo.jsx).

export const settings = {
  propertyTypes: ["House", "Condo", "Apartment", "Beach house", "Cabin", "Resort stay"],
  amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Parking", "Pool", "Beach access", "Hot shower", "TV"],
  serviceFeePercent: 10,
  listingFee: 500, // one-time fee a host pays for each property they post
};

export const destinations = [
  { name: "Tagaytay", lat: 14.1153, lng: 120.9621, blurb: "Cool air and Taal views" },
  { name: "Cebu", lat: 10.3157, lng: 123.8854, blurb: "City life and island hopping" },
  { name: "Palawan", lat: 9.7392, lng: 118.7353, blurb: "Lagoons and limestone cliffs" },
  { name: "Siargao", lat: 9.7905, lng: 126.1567, blurb: "Surf, sun and slow days" },
];

export const users = [
  { id: "u_admin", name: "StayN Admin", email: "admin@stayn.test", phone: "09170000001", role: "admin", status: "active", emailVerified: true },
  { id: "u_maria", name: "Maria Santos", email: "maria.host@stayn.test", phone: "09181234567", role: "host", status: "active", emailVerified: true },
  { id: "u_paolo", name: "Paolo Reyes", email: "paolo.host@stayn.test", phone: "09191234567", role: "host", status: "active", emailVerified: true },
  { id: "u_ana", name: "Ana Cruz", email: "ana@stayn.test", phone: "09171234567", role: "guest", status: "active", emailVerified: true },
  { id: "u_ben", name: "Ben Garcia", email: "ben@stayn.test", phone: "09201234568", role: "guest", status: "active", emailVerified: true },
  { id: "u_carla", name: "Carla Lim", email: "carla@stayn.test", phone: "09211234569", role: "guest", status: "active", emailVerified: false },
  { id: "u_liza", name: "Liza Mercado", email: "liza@stayn.test", phone: "09201234567", role: "guest", status: "active", emailVerified: true },
  { id: "u_bencruz", name: "Ben Cruz", email: "bencruz@stayn.test", phone: "09211234567", role: "guest", status: "suspended", emailVerified: true },
];

export const hostApplications = [
  { id: "u_maria", userId: "u_maria", idDocument: { name: "drivers-license-sample.jpg", type: "image/jpeg", url: "" }, fullName: "Maria Santos", phone: "09181234567", address: "45 Mabini Street, General Luna, Siargao", bio: "Local host who loves surf and good food.", status: "approved" },
  { id: "u_paolo", userId: "u_paolo", idDocument: { name: "drivers-license-sample.jpg", type: "image/jpeg", url: "" }, fullName: "Paolo Reyes", phone: "09191234567", address: "12 Lahug Road, Cebu City", bio: "Cebu native, happy to share my favorite spots.", status: "approved" },
  { id: "u_carla", userId: "u_carla", fullName: "Carla Lim", phone: "09211234569", address: "Tagaytay City", bio: "I have a lake-view house I would like to rent out.", status: "pending" },
  { id: "u_liza", userId: "u_liza", fullName: "Liza Mercado", phone: "09201234567", address: "Tagaytay City", bio: "Cabin owner for 5 years", status: "pending" },
  { id: "u_bencruz", userId: "u_bencruz", fullName: "Ben Cruz", phone: "09211234567", address: "Puerto Princesa", bio: "Family resort near the bay", status: "pending" },
];

const P = (id, title, type, destination, hostId, hostName, nightlyRate, cleaningFee, maxGuests, bedrooms, bathrooms, status, amenities, address, lat, lng, tone) => ({
  id, title, type, destination, hostId, hostName, nightlyRate, cleaningFee, maxGuests, bedrooms, bathrooms, status, amenities, address, lat, lng, tone,
  description: `${title} is a calm, clean place to rest in ${destination}. Wake up to fresh air, cook in the kitchen, and enjoy the neighborhood at your own pace. The host replies quickly and is happy to share local tips.`,
  houseRules: "No smoking indoors. Quiet hours from 10 PM to 7 AM. No parties. Please keep the place tidy.",
  checkInTime: "2:00 PM", checkOutTime: "12:00 PM", rejectReason: "", blockedRanges: [], imageCount: 5,
  maxPets: 0, images: [], titleDocument: { name: "title-sample.pdf", type: "application/pdf", url: "" },
});

export const properties = [
  P("p1", "Ridge View House", "Cabin", "Tagaytay", "u_maria", "Maria Santos", 3200, 400, 4, 2, 1, "approved", ["Wi-Fi", "Kitchen", "Parking", "Hot shower"], "Aguinaldo Highway, Tagaytay", 14.1153, 120.9621, 0),
  P("p2", "Pine and Fog House", "House", "Tagaytay", "u_paolo", "Paolo Reyes", 4500, 500, 6, 3, 2, "approved", ["Wi-Fi", "Air conditioning", "Kitchen", "Parking", "TV"], "Mendez Road, Tagaytay", 14.1, 120.93, 1),
  P("p3", "Mactan Shore Beach House", "Beach house", "Cebu", "u_maria", "Maria Santos", 5800, 600, 8, 4, 3, "approved", ["Wi-Fi", "Air conditioning", "Kitchen", "Pool", "Beach access", "TV"], "Mactan Island, Lapu-Lapu City", 10.31, 123.98, 2),
  P("p4", "Cozy Lahug House", "House", "Cebu", "u_paolo", "Paolo Reyes", 2200, 300, 4, 2, 1, "approved", ["Wi-Fi", "Air conditioning", "Kitchen", "Hot shower"], "Lahug, Cebu City", 10.33, 123.9, 3),
  P("p5", "El Nido Lagoon Resort Stay", "Resort stay", "Palawan", "u_maria", "Maria Santos", 6500, 0, 2, 1, 1, "approved", ["Wi-Fi", "Air conditioning", "Pool", "Beach access", "Hot shower"], "El Nido, Palawan", 11.18, 119.39, 4),
  P("p6", "Puerto Princesa Garden Cabin", "Cabin", "Palawan", "u_paolo", "Paolo Reyes", 2800, 300, 3, 1, 1, "approved", ["Wi-Fi", "Kitchen", "Parking"], "Puerto Princesa City", 9.7392, 118.7353, 5),
  P("p7", "Cloud 9 Surf Cabin", "Cabin", "Siargao", "u_maria", "Maria Santos", 2500, 300, 2, 1, 1, "approved", ["Wi-Fi", "Beach access", "Hot shower"], "General Luna, Siargao", 9.7905, 126.1567, 6),
  P("p8", "General Luna Beach House", "Beach house", "Siargao", "u_paolo", "Paolo Reyes", 4200, 500, 6, 3, 2, "approved", ["Wi-Fi", "Air conditioning", "Kitchen", "Beach access", "TV"], "General Luna, Siargao", 9.78, 126.15, 7),
  P("p9", "Taal Lake Resort Stay", "Resort stay", "Tagaytay", "u_maria", "Maria Santos", 5000, 500, 4, 2, 2, "pending", ["Wi-Fi", "Air conditioning", "Pool", "Parking"], "Taal Lake Road, Tagaytay", 14.08, 120.95, 0),
  P("p10", "Old Moalboal House", "House", "Cebu", "u_paolo", "Paolo Reyes", 1900, 200, 3, 1, 1, "inactive", ["Wi-Fi", "Kitchen"], "Moalboal, Cebu", 9.95, 123.4, 3),
];

// How many pets each place accepts (0 = no pets).
const petLimits = { p1: 2, p3: 3, p4: 1, p6: 2, p8: 2, p13: 1 };
properties.forEach((x) => { x.maxPets = petLimits[x.id] || 0; });

// Use the local public images for the Tagaytay and Cebu listings.
properties[0].images = ["/T1.jpg", "/T2.jpg", "/T3.jpg", "/T4.jpg", "/T5.jpg"];
properties[0].imageCount = properties[0].images.length;
properties[1].images = ["/TT1.jpg", "/TT2.jpg", "/TT3.jpg", "/TT4.jpg", "/TT5.jpg"];
properties[1].imageCount = properties[1].images.length;
properties[2].images = ["/C1.jpg", "/C2.jpg", "/C3.jpg", "/C4.jpg", "/C5.jpg"];
properties[2].imageCount = properties[2].images.length;
properties[3].images = ["/CC1.jpg", "/CC2.jpg", "/CC3.jpg", "/CC4.jpg", "/CC5.jpg"];
properties[3].imageCount = properties[3].images.length;
properties[4].images = ["/E1.jpg", "/E2.jpg", "/E3.jpg", "/E4.jpg", "/E5.jpg"];
properties[4].imageCount = properties[4].images.length;
properties[5].images = ["/EE1.jpg", "/EE2.jpg", "/EE3.jpg", "/EE4.jpg", "/EE5.jpg"];
properties[5].imageCount = properties[5].images.length;
properties[6].images = ["/S1.jpg", "/S2.jpg", "/S3.jpg", "/S4.jpg", "/S5.jpg"];
properties[6].imageCount = properties[6].images.length;
properties[7].images = ["/SS1.jpg", "/SS2.jpg", "/SS3.jpg", "/SS4.jpg", "/SS5.jpg"];
properties[7].imageCount = properties[7].images.length;

// Block a few days on the first property so the availability calendar has something to show.
properties[0].blockedRanges = [{ start: addDays(20), end: addDays(23) }];

const fee = settings.serviceFeePercent;
const B = (id, propertyId, guestId, startOffset, nights, status, extra = {}) => {
  const p = properties.find((x) => x.id === propertyId);
  const g = users.find((x) => x.id === guestId);
  const checkIn = addDays(startOffset);
  const checkOut = addDays(startOffset + nights);
  const n = nightsBetween(checkIn, checkOut);
  const price = priceBreakdown(p.nightlyRate, n, p.cleaningFee, fee);
  return {
    id, propertyId, propertyTitle: p.title, tone: p.tone, destination: p.destination,
    guestId, guestName: g.name, guestEmail: g.email, guestPhone: g.phone, hostId: p.hostId,
    checkIn, checkOut, nights: n, adults: 2, kids: 0, pets: 0, guests: 2, ...price, status, cancelledBy: "", reviewed: false, createdAt: addDays(Math.min(-3, startOffset - 5)), ...extra,
  };
};

export const bookings = [
  B("b1", "p1", "u_ana", 14, 2, "pending", { adults: 2, kids: 1, pets: 1, guests: 3 }),
  B("b2", "p7", "u_ben", 21, 3, "awaiting_payment"),
  B("b3", "p3", "u_ana", 30, 2, "confirmed", { adults: 2, kids: 2, guests: 4 }),
  B("b4", "p4", "u_ben", -30, 2, "completed", { reviewed: true }),
  B("b5", "p5", "u_ana", -28, 3, "completed"),
  B("b6", "p2", "u_ben", 32, 2, "rejected"),
  B("b7", "p8", "u_ana", 34, 1, "cancelled", { cancelledBy: "guest" }),
  // Older paid stays so the monthly sales report has several months to show.
  B("b8", "p3", "u_ben", -62, 3, "completed", { adults: 3, kids: 1, guests: 4 }),
  B("b9", "p2", "u_ana", -95, 2, "completed"),
  B("b10", "p7", "u_ana", -9, 2, "completed"),
];

export const payments = [
  { id: "b3", bookingId: "b3", guestId: "u_ana", hostId: "u_maria", amount: bookings[2].total, method: "GCash", gcashNumber: "09171234567", accountName: "Ana Cruz", referenceNumber: "GC-20481937", paidAt: addDays(0), status: "paid" },
  { id: "b4", bookingId: "b4", guestId: "u_ben", hostId: "u_paolo", amount: bookings[3].total, method: "GCash", gcashNumber: "09201234568", accountName: "Ben Garcia", referenceNumber: "GC-20481212", paidAt: addDays(-35), status: "paid" },
  { id: "b5", bookingId: "b5", guestId: "u_ana", hostId: "u_maria", amount: bookings[4].total, method: "GCash", gcashNumber: "09171234567", accountName: "Ana Cruz", referenceNumber: "GC-20480555", paidAt: addDays(-33), status: "paid" },
];

// Paid stays added for the sales report (the guest's phone is used as the GCash number).
const paid = (bookingId, daysAgo, ref) => {
  const b = bookings.find((x) => x.id === bookingId);
  return { id: bookingId, bookingId, guestId: b.guestId, hostId: b.hostId, amount: b.total, method: "GCash", gcashNumber: b.guestPhone, accountName: b.guestName, referenceNumber: ref, paidAt: addDays(-daysAgo), status: "paid" };
};
payments.push(paid("b8", 70, "GC-20479001"), paid("b9", 100, "GC-20478442"), paid("b10", 14, "GC-20481644"));

// One listing fee per posted property, paid when the host submitted it.
const feeDays = { p1: 180, p2: 160, p3: 150, p4: 140, p5: 120, p6: 100, p7: 90, p8: 75, p9: 1, p10: 60 };
export const listingFees = properties.map((p) => ({
  id: `lf_${p.id}`, propertyId: p.id, propertyTitle: p.title, hostId: p.hostId, hostName: p.hostName, amount: settings.listingFee,
  method: "GCash", gcashNumber: p.hostId === "u_maria" ? "09181234567" : "09191234567", accountName: p.hostName,
  referenceNumber: `GC-1${String(30000 + Number(p.id.slice(1)) * 137).padStart(7, "0")}`, paidAt: addDays(-feeDays[p.id]), status: "paid",
}));

export const reviews = [
  { id: "b4", bookingId: "b4", propertyId: "p4", hostId: "u_paolo", guestId: "u_ben", guestName: "Ben G.", rating: 5, comment: "Clean, quiet and close to everything. Paolo was quick to reply.", visible: true },
  { id: "r2", bookingId: "r2", propertyId: "p1", hostId: "u_maria", guestId: "u_ana", guestName: "Ana S.", rating: 5, comment: "Felt like home. The host was so kind.", visible: true },
  { id: "r3", bookingId: "r3", propertyId: "p7", hostId: "u_maria", guestId: "u_ben", guestName: "Ben G.", rating: 4, comment: "Great spot near the waves. A bit warm at noon.", visible: true },
  { id: "r4", bookingId: "r4", propertyId: "p3", hostId: "u_maria", guestId: "u_ana", guestName: "Ana C.", rating: 5, comment: "The beach is steps away. We loved it.", visible: true },
  { id: "r5", bookingId: "r5", propertyId: "p6", hostId: "u_paolo", guestId: "u_ben", guestName: "Liza M.", rating: 1, comment: "Rude comment removed from view.", visible: false },
];

export const notifications = [
  { id: "n1", userId: "u_ana", title: "Request sent", message: "Your request for Ridge View House was sent to the host.", link: "/reservations/b1", read: false, createdAt: addDays(-2) },
  { id: "n2", userId: "u_ben", title: "Request accepted", message: "Your request for Cloud 9 Surf Cabin was accepted. Please pay to confirm.", link: "/reservations/b2", read: false, createdAt: addDays(-1) },
  { id: "n3", userId: "u_ana", title: "Booking confirmed", message: "Your payment for Mactan Shore Beach House was received.", link: "/reservations/b3", read: true, createdAt: addDays(-6) },
  { id: "n4", userId: "u_maria", title: "New booking request", message: "Ana Cruz asked to book Ridge View House.", link: "/host/bookings", read: false, createdAt: addDays(-2) },
  { id: "n5", userId: "u_admin", title: "Host application", message: "Carla Lim applied to become a host.", link: "/admin/hosts", read: false, createdAt: addDays(-1) },
  { id: "n6", userId: "u_admin", title: "Property waiting", message: "Taal Lake Resort Stay needs approval.", link: "/admin/properties", read: false, createdAt: addDays(-1) },
];
