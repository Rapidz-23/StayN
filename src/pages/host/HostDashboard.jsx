import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { formatRange, todayISO } from "../../utils/dates";
import { peso } from "../../utils/price";
import { guestSummary } from "../../utils/guests";

export function StatCard({ label, value, hint }) {
  return (
    <div className="panel" style={{ padding: 20, height: "100%" }}>
      <div style={{ color: "var(--muted)", fontSize: 14 }}>{label}</div>
      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 28, lineHeight: "40px" }}>{value}</div>
      {hint && <div style={{ color: "var(--muted)", fontSize: 13 }}>{hint}</div>}
    </div>
  );
}

// Host earnings = nightly total + cleaning fee on paid bookings (the service fee stays with StayN).
export const hostEarning = (b) => b.subtotal + b.cleaningFee;

export default function HostDashboard() {
  const { user } = useAuth();
  const { properties, bookings, payments } = useData();
  const mineProps = properties.filter((p) => p.hostId === user.id);
  const mine = bookings.filter((b) => b.hostId === user.id);
  const paidIds = new Set(payments.filter((p) => p.status === "paid").map((p) => p.bookingId));
  const earned = mine.filter((b) => paidIds.has(b.id)).reduce((s, b) => s + hostEarning(b), 0);
  const pending = mine.filter((b) => b.status === "pending");
  const upcoming = mine.filter((b) => ["awaiting_payment", "confirmed"].includes(b.status) && b.checkOut >= todayISO());
  const month = todayISO().slice(0, 7);
  const thisMonth = mine.filter((b) => paidIds.has(b.id) && b.checkIn.startsWith(month)).reduce((s, b) => s + hostEarning(b), 0);

  return (
    <>
      <PageHeading title="Host Dashboard" subtitle={`Welcome back, ${user.name.split(" ")[0]}.`} action={<Button component={Link} to="/host/properties/new" variant="contained">Add property</Button>} />
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard label="Properties" value={mineProps.length} hint={`${mineProps.filter((p) => p.status === "approved").length} live`} /></div>
        <div className="col-6 col-xl-3"><StatCard label="Pending requests" value={pending.length} /></div>
        <div className="col-6 col-xl-3"><StatCard label="Upcoming stays" value={upcoming.length} /></div>
        <div className="col-6 col-xl-3"><StatCard label="Total earned" value={peso(earned)} /></div>
      </div>

      <div className="panel mb-4">
        <div className="d-flex justify-content-between align-items-baseline">
          <Typography variant="h3" component="h2" sx={{ mb: 1 }}>Earnings summary</Typography>
          <Link to="/host/reports" style={{ color: "var(--primary)", textDecoration: "none" }}>Monthly sales report</Link>
        </div>
        <div className="row g-3">
          <div className="col-12 col-md-4"><div style={{ color: "var(--muted)", fontSize: 14 }}>Paid bookings</div><strong style={{ fontWeight: 500 }}>{mine.filter((b) => paidIds.has(b.id)).length}</strong></div>
          <div className="col-12 col-md-4"><div style={{ color: "var(--muted)", fontSize: 14 }}>Stays this month</div><strong style={{ fontWeight: 500 }}>{peso(thisMonth)}</strong></div>
          <div className="col-12 col-md-4"><div style={{ color: "var(--muted)", fontSize: 14 }}>All time</div><strong style={{ fontWeight: 500 }}>{peso(earned)}</strong></div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-baseline mb-2">
        <Typography variant="h3" component="h2">Recent requests</Typography>
        <Link to="/host/bookings" style={{ color: "var(--primary)", textDecoration: "none" }}>See all</Link>
      </div>
      {mine.length === 0 ? <EmptyState title="No requests yet" message="Requests for your stays will show up here." /> : (
        <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
          {mine.slice(0, 5).map((b, i) => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 20px", borderTop: i ? "1px solid var(--border)" : 0, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 500 }}>{b.guestName} · {b.propertyTitle}</div>
                <div style={{ color: "var(--muted)", fontSize: 14 }}>{formatRange(b.checkIn, b.checkOut)} · {guestSummary(b)}</div>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
