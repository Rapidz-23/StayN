import { useState } from "react";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import PriceBox from "../../components/PriceBox";
import { useData } from "../../context/DataContext";
import { formatRange } from "../../utils/dates";
import { peso } from "../../utils/price";
import { guestSummary } from "../../utils/guests";

const STATUSES = ["pending", "awaiting_payment", "confirmed", "completed", "rejected", "cancelled"];

export default function AdminBookings() {
  const { bookings, payments, settings, setBookingStatus, refundPayment } = useData();
  const [filter, setFilter] = useState("");
  const [detail, setDetail] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const list = bookings.filter((b) => !filter || b.status === filter);
  const paymentOf = (b) => payments.find((p) => p.bookingId === b.id);

  const cancel = () => {
    setBookingStatus(cancelling.id, "cancelled", { cancelledBy: "admin" });
    if (paymentOf(cancelling)) refundPayment(cancelling.id); // label only, no money moves
    setCancelling(null);
  };

  return (
    <>
      <PageHeading title="Reservations" action={
        <TextField select size="small" label="Status" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ minWidth: 200 }}>
          <MenuItem value="">All</MenuItem>
          {STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s.replace("_", " ")}</MenuItem>)}
        </TextField>
      } />
      <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
        <table className="table align-middle mb-0" style={{ minWidth: 900 }}>
          <thead><tr><th style={{ paddingLeft: 20 }}>Guest</th><th>Property</th><th>Dates</th><th>Total</th><th>Status</th><th>Payment</th><th style={{ paddingRight: 20 }}>Actions</th></tr></thead>
          <tbody>
            {list.map((b) => {
              const pay = paymentOf(b);
              return (
                <tr key={b.id}>
                  <td style={{ paddingLeft: 20 }}>{b.guestName}</td><td>{b.propertyTitle}</td><td>{formatRange(b.checkIn, b.checkOut)}</td><td>{peso(b.total)}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>{pay ? <StatusBadge status={pay.status} /> : <span style={{ color: "var(--muted)" }}>Not paid</span>}</td>
                  <td style={{ paddingRight: 20, whiteSpace: "nowrap" }}>
                    <Button size="small" onClick={() => setDetail(b)}>Details</Button>
                    {b.status === "confirmed" && <Button size="small" color="error" onClick={() => setCancelling(b)}>Cancel</Button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>Details shows the reference number and amount. Cancelling a Confirmed booking marks the payment as Refunded (a label only, no money moves).</Typography>

      <ConfirmDialog open={Boolean(detail)} title={detail?.propertyTitle || ""} confirmLabel="Close" onClose={() => setDetail(null)} onConfirm={() => setDetail(null)}>
        {detail && (
          <div style={{ marginTop: 8 }}>
            <p style={{ marginBottom: 4 }}>{detail.guestName} · {detail.guestEmail}</p>
            <p style={{ color: "var(--muted)" }}>{formatRange(detail.checkIn, detail.checkOut)} · {guestSummary(detail)} · <StatusBadge status={detail.status} /></p>
            <PriceBox price={detail} serviceFeePercent={settings.serviceFeePercent} />
            {paymentOf(detail) ? (
              <p style={{ marginTop: 12, fontSize: 14 }}>GCash ending {paymentOf(detail).gcashNumber.slice(-4)} · Ref {paymentOf(detail).referenceNumber} · {peso(paymentOf(detail).amount)} <StatusBadge status={paymentOf(detail).status} /></p>
            ) : <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>No payment yet.</p>}
          </div>
        )}
      </ConfirmDialog>
      <ConfirmDialog open={Boolean(cancelling)} title="Cancel this booking?" message="The guest is told, and the payment is marked Refunded." confirmLabel="Cancel booking" danger onClose={() => setCancelling(null)} onConfirm={cancel} />
    </>
  );
}
