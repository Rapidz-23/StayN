import { useState } from "react";
import { Alert, Button, Tab, Tabs, Typography } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { formatRange, overlaps, todayISO } from "../../utils/dates";
import { peso } from "../../utils/price";
import { hostEarning } from "./HostDashboard";
import { guestSummary } from "../../utils/guests";

const tabOf = (b) => {
  if (b.status === "pending") return "pending";
  if (["awaiting_payment", "confirmed"].includes(b.status) && b.checkOut >= todayISO()) return "upcoming";
  return "past";
};

export default function HostBookings() {
  const { user } = useAuth();
  const { bookings, setBookingStatus } = useData();
  const [tab, setTab] = useState("pending");
  const [rejecting, setRejecting] = useState(null);
  const [error, setError] = useState("");
  const mine = bookings.filter((b) => b.hostId === user.id);
  const list = mine.filter((b) => tabOf(b) === tab);
  const counts = { pending: mine.filter((b) => tabOf(b) === "pending").length };

  // Accepting checks that no other accepted or paid stay overlaps (the Firestore step makes this a transaction).
  const accept = (b) => {
    setError("");
    const clash = bookings.some((o) => o.id !== b.id && o.propertyId === b.propertyId && ["awaiting_payment", "confirmed"].includes(o.status) && overlaps(b.checkIn, b.checkOut, o.checkIn, o.checkOut));
    if (clash) return setError(`Another stay already overlaps ${formatRange(b.checkIn, b.checkOut)} at ${b.propertyTitle}. Reject this request instead.`);
    setBookingStatus(b.id, "awaiting_payment");
  };

  return (
    <>
      <PageHeading title="Booking Requests" />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: "1px solid var(--border)", mb: 3 }}>
        <Tab value="pending" label={`Pending (${counts.pending})`} sx={{ textTransform: "none" }} />
        <Tab value="upcoming" label="Upcoming" sx={{ textTransform: "none" }} />
        <Tab value="past" label="Past" sx={{ textTransform: "none" }} />
      </Tabs>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

      {list.length === 0 ? <EmptyState title="Nothing here" message="Requests will show up in this tab." /> : list.map((b) => (
        <div key={b.id} className="panel" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <Typography sx={{ fontWeight: 500 }}>{b.propertyTitle}</Typography>
              <Typography variant="body2" color="text.secondary">{formatRange(b.checkIn, b.checkOut)} · {b.nights} nights · {guestSummary(b)}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Guest: <strong style={{ fontWeight: 500 }}>{b.guestName}</strong> · {b.guestEmail} · {b.guestPhone}</Typography>
            </div>
            <div style={{ textAlign: "right", display: "grid", gap: 6, justifyItems: "end" }}>
              <StatusBadge status={b.status} />
              <span>You earn <strong style={{ fontWeight: 500 }}>{peso(hostEarning(b))}</strong></span>
              {b.status === "pending" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="contained" onClick={() => accept(b)}>Accept</Button>
                  <Button variant="outlined" color="inherit" sx={{ borderColor: "var(--border)" }} onClick={() => setRejecting(b)}>Reject</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={Boolean(rejecting)}
        title="Reject this request?"
        message={rejecting ? `${rejecting.guestName} will be told you could not accept ${formatRange(rejecting.checkIn, rejecting.checkOut)}.` : ""}
        confirmLabel="Reject"
        danger
        onClose={() => setRejecting(null)}
        onConfirm={() => { setBookingStatus(rejecting.id, "rejected"); setRejecting(null); }}
      />
    </>
  );
}
