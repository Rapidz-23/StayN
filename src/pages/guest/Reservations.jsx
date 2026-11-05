import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Tab, Tabs, Typography } from "@mui/material";
import Photo from "../../components/Photo";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import PageHeading from "../../components/PageHeading";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { formatRange, todayISO } from "../../utils/dates";
import { peso } from "../../utils/price";
import { guestSummary } from "../../utils/guests";
import { canReview } from "../../utils/bookings";

const tabOf = (b) => {
  if (["rejected", "cancelled"].includes(b.status)) return "cancelled";
  if (b.status === "completed" || (b.status === "confirmed" && b.checkOut < todayISO())) return "past";
  return "upcoming";
};

export default function Reservations() {
  const { bookings, coverOf } = useData();
  const { user } = useAuth();
  const [tab, setTab] = useState("upcoming");
  const mine = bookings.filter((b) => b.guestId === user.id);
  const list = mine.filter((b) => tabOf(b) === tab).sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  return (
    <div className="container">
      <PageHeading title="My Reservations" />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: "1px solid var(--border)", mb: 3 }}>
        <Tab value="upcoming" label="Upcoming" sx={{ textTransform: "none" }} />
        <Tab value="past" label="Past" sx={{ textTransform: "none" }} />
        <Tab value="cancelled" label="Cancelled" sx={{ textTransform: "none" }} />
      </Tabs>

      {list.length === 0 ? (
        <EmptyState title="No reservations here" message="Find a stay you love and send a request." action={<Button component={Link} to="/explore" variant="contained">Explore stays</Button>} />
      ) : list.map((b) => (
        <div key={b.id} className="panel" style={{ padding: 16, marginBottom: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 96, flexShrink: 0 }}><Photo tone={b.tone} ratio="4 / 3" radius={8} src={coverOf(b.propertyId)} /></div>
          <div style={{ flex: "1 1 220px", minWidth: 0 }}>
            <Typography sx={{ fontWeight: 500 }} noWrap>{b.propertyTitle}</Typography>
            <Typography variant="body2" color="text.secondary">{b.destination} · {formatRange(b.checkIn, b.checkOut)} · {guestSummary(b)}</Typography>
          </div>
          <div style={{ textAlign: "right", display: "grid", gap: 4, justifyItems: "end" }}>
            <strong style={{ fontWeight: 500 }}>{peso(b.total)}</strong>
            <StatusBadge status={b.status} />
          </div>
          {b.status === "awaiting_payment" ? (
            <Button component={Link} to={`/reservations/${b.id}/pay`} variant="contained" sx={{ bgcolor: "var(--accent)", "&:hover": { bgcolor: "#c94823" } }}>Pay with GCash</Button>
          ) : canReview(b) && !b.reviewed ? (
            <Button component={Link} to={`/reservations/${b.id}#review`} variant="outlined">Write a review</Button>
          ) : (
            <Button component={Link} to={`/reservations/${b.id}`}>View details</Button>
          )}
        </div>
      ))}
    </div>
  );
}
