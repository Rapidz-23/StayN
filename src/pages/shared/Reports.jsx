import { useState } from "react";
import { Button, MenuItem, Tab, Tabs, TextField, Typography } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import PageHeading from "../../components/PageHeading";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { StatCard } from "../host/HostDashboard";
import { Bars } from "../admin/AdminDashboard";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { peso } from "../../utils/price";
import { downloadCSV } from "../../utils/csv";
import { formatLong, toISO, todayISO } from "../../utils/dates";

// Reports for hosts (their own properties) and for the admin (the whole platform).
// Tabs: monthly sales, bookings, properties. Each can be downloaded as CSV or printed / saved as PDF.

const monthOf = (iso) => (iso || "").slice(0, 7);
const monthLabel = (m, style = "long") => new Date(`${m}-01T00:00:00`).toLocaleDateString("en-PH", style === "long" ? { month: "long", year: "numeric" } : { month: "short", year: "2-digit" });
const sum = (list, pick) => list.reduce((s, x) => s + pick(x), 0);

// The last `n` months, newest first, as YYYY-MM.
const lastMonths = (n) => {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => toISO(new Date(now.getFullYear(), now.getMonth() - i, 1)).slice(0, 7));
};

function ReportTable({ columns, rows, totals }) {
  const show = (c, v) => (c.badge ? <StatusBadge status={v} /> : c.money ? peso(v) : v);
  const right = (c) => (c.money || c.number ? { textAlign: "right" } : {});
  return (
    <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
      <table className="table align-middle mb-0" style={{ minWidth: 720 }}>
        <thead>
          <tr>{columns.map((c, i) => <th key={c.key} style={{ ...right(c), paddingLeft: i === 0 ? 20 : undefined, whiteSpace: "nowrap" }}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, n) => (
            <tr key={r.id || n}>{columns.map((c, i) => <td key={c.key} style={{ ...right(c), paddingLeft: i === 0 ? 20 : undefined }}>{show(c, r[c.key])}</td>)}</tr>
          ))}
          {totals && (
            <tr style={{ fontWeight: 600 }}>
              {columns.map((c, i) => <td key={c.key} style={{ ...right(c), paddingLeft: i === 0 ? 20 : undefined }}>{i === 0 ? "Total" : totals[c.key] !== undefined ? show(c, totals[c.key]) : ""}</td>)}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Raw values (no peso signs) for the CSV file.
const csvRows = (columns, rows, totals) => [
  columns.map((c) => c.label),
  ...rows.map((r) => columns.map((c) => r[c.key])),
  ...(totals ? [columns.map((c, i) => (i === 0 ? "Total" : totals[c.key] ?? ""))] : []),
];

export default function Reports({ scope }) {
  const { user } = useAuth();
  const { properties, bookings, payments, listingFees, ratingOf } = useData();
  const admin = scope === "admin";
  const [tab, setTab] = useState("sales");
  const [month, setMonth] = useState(todayISO().slice(0, 7));
  const [status, setStatus] = useState("");

  // Hosts only ever see their own numbers.
  const mineProps = properties.filter((p) => admin || p.hostId === user.id);
  const mineBookings = bookings.filter((b) => admin || b.hostId === user.id);
  const minePayments = payments.filter((p) => admin || p.hostId === user.id);
  const mineFees = listingFees.filter((f) => admin || f.hostId === user.id);
  const hostName = (id) => properties.find((p) => p.id === id)?.hostName || "";

  // ---- Monthly sales ----
  const earned = (b) => b.subtotal + b.cleaningFee; // what the host keeps; the service fee stays with StayN
  const saleRows = minePayments
    .filter((p) => p.status === "paid" && monthOf(p.paidAt) === month)
    .map((p) => {
      const b = bookings.find((x) => x.id === p.bookingId);
      if (!b) return null;
      return {
        id: p.id, paidAt: p.paidAt, ref: p.referenceNumber, property: b.propertyTitle, host: hostName(b.propertyId), guest: b.guestName,
        checkIn: b.checkIn, checkOut: b.checkOut, nights: b.nights, total: b.total, hostEarned: earned(b), serviceFee: b.serviceFee,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.paidAt.localeCompare(b.paidAt));
  const feeRows = mineFees
    .filter((f) => monthOf(f.paidAt) === month)
    .map((f) => ({ id: f.id, paidAt: f.paidAt, ref: f.referenceNumber, property: f.propertyTitle, host: f.hostName, amount: f.amount, status: f.status }))
    .sort((a, b) => a.paidAt.localeCompare(b.paidAt));
  const feesPaid = sum(feeRows.filter((f) => f.status === "paid"), (f) => f.amount); // refunded fees are not counted

  const saleCols = [
    { key: "paidAt", label: "Paid on" }, { key: "ref", label: "Reference" }, { key: "property", label: "Property" },
    ...(admin ? [{ key: "host", label: "Host" }] : []),
    { key: "guest", label: "Guest" }, { key: "checkIn", label: "Check-in" }, { key: "checkOut", label: "Check-out" },
    { key: "nights", label: "Nights", number: true }, { key: "total", label: "Guest paid", money: true }, { key: "hostEarned", label: admin ? "Host earned" : "You earned", money: true },
    ...(admin ? [{ key: "serviceFee", label: "Service fee", money: true }] : []),
  ];
  const saleTotals = { nights: sum(saleRows, (r) => r.nights), total: sum(saleRows, (r) => r.total), hostEarned: sum(saleRows, (r) => r.hostEarned), serviceFee: sum(saleRows, (r) => r.serviceFee) };
  const feeCols = [
    { key: "paidAt", label: "Paid on" }, { key: "ref", label: "Reference" }, { key: "property", label: "Property" },
    ...(admin ? [{ key: "host", label: "Host" }] : []),
    { key: "amount", label: "Listing fee", money: true }, { key: "status", label: "Status", badge: true },
  ];

  const monthly = lastMonths(12).reverse().map((m) => {
    const sales = minePayments.filter((p) => p.status === "paid" && monthOf(p.paidAt) === m).map((p) => bookings.find((b) => b.id === p.bookingId)).filter(Boolean);
    const fees = sum(mineFees.filter((f) => f.status === "paid" && monthOf(f.paidAt) === m), (f) => f.amount);
    // Hosts: what they earned. Admin: what StayN keeps (service fees + listing fees).
    return { label: monthLabel(m, "short"), value: admin ? sum(sales, (b) => b.serviceFee) + fees : sum(sales, earned) };
  });

  // ---- Bookings (by check-in month) ----
  const bookingRows = mineBookings
    .filter((b) => monthOf(b.checkIn) === month && (!status || b.status === status))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    .map((b) => ({
      id: b.id, ref: b.id, property: b.propertyTitle, host: hostName(b.propertyId), guest: b.guestName, checkIn: b.checkIn, checkOut: b.checkOut, nights: b.nights,
      adults: b.adults ?? b.guests, kids: b.kids ?? 0, pets: b.pets ?? 0, status: b.status, total: b.total,
    }));
  const bookingCols = [
    { key: "ref", label: "Booking" }, { key: "property", label: "Property" },
    ...(admin ? [{ key: "host", label: "Host" }] : []),
    { key: "guest", label: "Guest" }, { key: "checkIn", label: "Check-in" }, { key: "checkOut", label: "Check-out" }, { key: "nights", label: "Nights", number: true },
    { key: "adults", label: "Adults", number: true }, { key: "kids", label: "Kids", number: true }, { key: "pets", label: "Pets", number: true },
    { key: "status", label: "Status", badge: true }, { key: "total", label: "Total", money: true },
  ];

  // ---- Properties (all time) ----
  const propertyRows = mineProps.map((p) => {
    const paidBookings = minePayments.filter((x) => x.status === "paid" && x.bookingId && bookings.find((b) => b.id === x.bookingId)?.propertyId === p.id);
    return {
      id: p.id, property: p.title, type: p.type, destination: p.destination, host: p.hostName, status: p.status, rate: p.nightlyRate,
      maxGuests: p.maxGuests, maxPets: p.maxPets || 0, paidBookings: paidBookings.length, revenue: sum(paidBookings, (x) => x.amount), rating: ratingOf(p.id).avg ? ratingOf(p.id).avg.toFixed(1) : "",
    };
  });
  const propertyCols = [
    { key: "property", label: "Property" }, { key: "type", label: "Category" }, { key: "destination", label: "Destination" },
    ...(admin ? [{ key: "host", label: "Host" }] : []),
    { key: "status", label: "Status", badge: true }, { key: "rate", label: "Nightly rate", money: true },
    { key: "maxGuests", label: "Max guests", number: true }, { key: "maxPets", label: "Max pets", number: true },
    { key: "paidBookings", label: "Paid bookings", number: true }, { key: "revenue", label: "Guest payments", money: true }, { key: "rating", label: "Rating", number: true },
  ];

  const title = { sales: "Monthly sales", bookings: "Bookings", properties: "Properties" }[tab];
  const periodText = tab === "properties" ? `as of ${formatLong(todayISO())}` : monthLabel(month);

  const download = () => {
    const name = `stayn-${scope}-${tab}${tab === "properties" ? "" : `-${month}`}.csv`;
    if (tab === "sales") {
      const rows = [
        [`StayN ${title} report`, periodText], [],
        ...csvRows(saleCols, saleRows, saleRows.length ? saleTotals : null), [],
        ["Listing fees"],
        ...csvRows(feeCols, feeRows, null),
      ];
      return downloadCSV(name, rows);
    }
    if (tab === "bookings") return downloadCSV(name, csvRows(bookingCols, bookingRows, null));
    return downloadCSV(name, csvRows(propertyCols, propertyRows, null));
  };

  const monthOptions = lastMonths(24);

  return (
    <>
      <PageHeading
        title="Reports"
        subtitle={admin ? "Sales, bookings and properties across StayN." : "Sales, bookings and properties for your listings."}
        action={
          <div className="no-print" style={{ display: "flex", gap: 8 }}>
            <Button variant="outlined" color="inherit" startIcon={<FileDownloadOutlinedIcon />} onClick={download} sx={{ borderColor: "var(--border)" }}>Download CSV</Button>
            <Button variant="outlined" color="inherit" startIcon={<PrintOutlinedIcon />} onClick={() => window.print()} sx={{ borderColor: "var(--border)" }}>Print / Save as PDF</Button>
          </div>
        }
      />

      <div className="print-only" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>StayN {title} report</h2>
        <div>{admin ? "All hosts" : `Host: ${user.name}`} · {periodText} · Generated {formatLong(todayISO())}</div>
      </div>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} className="no-print" sx={{ borderBottom: "1px solid var(--border)", mb: 3 }}>
        <Tab value="sales" label="Monthly sales" sx={{ textTransform: "none" }} />
        <Tab value="bookings" label="Bookings" sx={{ textTransform: "none" }} />
        <Tab value="properties" label="Properties" sx={{ textTransform: "none" }} />
      </Tabs>

      {tab !== "properties" && (
        <div className="no-print" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <TextField select size="small" label="Month" value={month} onChange={(e) => setMonth(e.target.value)} sx={{ minWidth: 180 }}>
            {monthOptions.map((m) => <MenuItem key={m} value={m}>{monthLabel(m)}</MenuItem>)}
          </TextField>
          {tab === "bookings" && (
            <TextField select size="small" label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 200 }}>
              <MenuItem value="">All statuses</MenuItem>
              {["pending", "awaiting_payment", "confirmed", "completed", "rejected", "cancelled"].map((s) => <MenuItem key={s} value={s}>{s.replace("_", " ")}</MenuItem>)}
            </TextField>
          )}
        </div>
      )}

      {tab === "sales" && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-xl-3"><StatCard label="Paid bookings" value={saleRows.length} hint={monthLabel(month)} /></div>
            {admin ? (
              <>
                <div className="col-6 col-xl-3"><StatCard label="Guest payments" value={peso(saleTotals.total)} /></div>
                <div className="col-6 col-xl-3"><StatCard label="StayN revenue" value={peso(saleTotals.serviceFee + feesPaid)} hint={`Service fees ${peso(saleTotals.serviceFee)} + listing fees ${peso(feesPaid)}`} /></div>
                <div className="col-6 col-xl-3"><StatCard label="Host earnings" value={peso(saleTotals.hostEarned)} /></div>
              </>
            ) : (
              <>
                <div className="col-6 col-xl-3"><StatCard label="Nights booked" value={saleTotals.nights} /></div>
                <div className="col-6 col-xl-3"><StatCard label="You earned" value={peso(saleTotals.hostEarned)} /></div>
                <div className="col-6 col-xl-3"><StatCard label="Listing fees paid" value={peso(feesPaid)} hint={`Net ${peso(saleTotals.hostEarned - feesPaid)}`} /></div>
              </>
            )}
          </div>

          <Typography variant="h3" component="h2" sx={{ mb: 1.5 }}>Paid bookings</Typography>
          {saleRows.length === 0
            ? <EmptyState title="No paid bookings" message={`Nothing was paid in ${monthLabel(month)}. Refunded payments are not counted.`} />
            : <ReportTable columns={saleCols} rows={saleRows} totals={saleTotals} />}

          <Typography variant="h3" component="h2" sx={{ mt: 4, mb: 1.5 }}>Listing fees</Typography>
          {feeRows.length === 0
            ? <EmptyState title="No listing fees" message={`No properties were posted in ${monthLabel(month)}.`} />
            : <ReportTable columns={feeCols} rows={feeRows} totals={{ amount: feesPaid }} />}

          <div className="panel no-print" style={{ marginTop: 32 }}>
            <Typography variant="h3" component="h2" sx={{ mb: 2 }}>{admin ? "StayN revenue" : "Your earnings"}, last 12 months</Typography>
            <Bars rows={monthly} format={peso} />
          </div>
        </>
      )}

      {tab === "bookings" && (
        <>
          <Typography color="text.secondary" sx={{ mb: 2 }}>{bookingRows.length} booking{bookingRows.length === 1 ? "" : "s"} with check-in in {monthLabel(month)}</Typography>
          {bookingRows.length === 0 ? <EmptyState title="No bookings" message="No bookings match this month and status." /> : <ReportTable columns={bookingCols} rows={bookingRows} />}
        </>
      )}

      {tab === "properties" && (
        propertyRows.length === 0 ? <EmptyState title="No properties" message="Properties will be listed here." /> : <ReportTable columns={propertyCols} rows={propertyRows} />
      )}
    </>
  );
}
