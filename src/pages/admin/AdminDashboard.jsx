import { Typography } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import { StatCard } from "../host/HostDashboard";
import { useData } from "../../context/DataContext";
import { destinations } from "../../data/sampleData";
import { peso } from "../../utils/price";

export function Bars({ rows, format = (v) => v }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "grid", gridTemplateColumns: "90px 1fr 80px", alignItems: "center", gap: 12, fontSize: 14 }}>
          <span>{r.label}</span>
          <div style={{ background: "#F3EDE4", borderRadius: 6, height: 14 }}>
            <div style={{ width: `${(r.value / max) * 100}%`, background: "var(--primary)", borderRadius: 6, height: 14, minWidth: r.value ? 6 : 0 }} />
          </div>
          <span style={{ textAlign: "right", fontWeight: 500 }}>{format(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { users, properties, bookings, payments } = useData();
  const paid = new Set(payments.filter((p) => p.status === "paid").map((p) => p.bookingId));
  const monthName = (iso) => new Date(`${iso.slice(0, 7)}-01T00:00:00`).toLocaleDateString("en-PH", { month: "short", year: "2-digit" });

  const byMonth = {};
  bookings.forEach((b) => { const k = b.checkIn.slice(0, 7); byMonth[k] = (byMonth[k] || 0) + 1; });
  const monthRows = Object.keys(byMonth).sort().map((k) => ({ label: monthName(`${k}-01`), value: byMonth[k] }));
  const revenueRows = destinations.map((d) => ({
    label: d.name,
    value: bookings.filter((b) => b.destination === d.name && paid.has(b.id)).reduce((s, b) => s + b.total, 0),
  }));

  return (
    <>
      <PageHeading title="Admin Dashboard" subtitle="Platform overview and reports." />
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard label="Users" value={users.length} /></div>
        <div className="col-6 col-xl-3"><StatCard label="Approved properties" value={properties.filter((p) => p.status === "approved").length} hint={`${properties.filter((p) => p.status === "pending").length} waiting`} /></div>
        <div className="col-6 col-xl-3"><StatCard label="Bookings" value={bookings.length} /></div>
        <div className="col-6 col-xl-3"><StatCard label="Paid revenue" value={peso(bookings.filter((b) => paid.has(b.id)).reduce((s, b) => s + b.total, 0))} /></div>
      </div>
      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <div className="panel">
            <Typography variant="h3" component="h2" sx={{ mb: 2 }}>Bookings per month</Typography>
            <Bars rows={monthRows} />
          </div>
        </div>
        <div className="col-12 col-xl-6">
          <div className="panel">
            <Typography variant="h3" component="h2" sx={{ mb: 2 }}>Revenue per destination</Typography>
            <Bars rows={revenueRows} format={peso} />
          </div>
        </div>
      </div>
    </>
  );
}
