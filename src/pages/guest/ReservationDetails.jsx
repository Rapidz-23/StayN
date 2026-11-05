import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { Alert, Button, Rating, TextField, Typography } from "@mui/material";
import Photo from "../../components/Photo";
import StatusBadge from "../../components/StatusBadge";
import PriceBox from "../../components/PriceBox";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageHeading from "../../components/PageHeading";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { formatLong } from "../../utils/dates";
import { guestSummary } from "../../utils/guests";
import { canReview } from "../../utils/bookings";

export default function ReservationDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { bookings, payments, reviews, settings, setBookingStatus, addReview, updateReview, deleteMyReview, coverOf } = useData();
  const { user } = useAuth();
  const booking = bookings.find((b) => b.id === id);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [editing, setEditing] = useState(false);
  const { hash } = useLocation();
  useEffect(() => { if (hash === "#review") document.getElementById("review")?.scrollIntoView({ block: "center" }); }, [hash]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!booking || (booking.guestId !== user.id && user.role !== "admin")) return <Navigate to="/not-allowed" replace />;

  const payment = payments.find((p) => p.bookingId === booking.id);
  const review = reviews.find((r) => r.bookingId === booking.id);
  const canCancel = ["pending", "awaiting_payment"].includes(booking.status);

  const startEdit = () => { setRating(review.rating); setComment(review.comment); setReviewError(""); setEditing(true); };

  const submitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return setReviewError("Write a short comment.");
    if (editing && review) {
      updateReview(review.id, { rating, comment: comment.trim(), edited: true });
      setEditing(false);
      return;
    }
    addReview({ bookingId: booking.id, propertyId: booking.propertyId, hostId: booking.hostId, guestId: user.id, guestName: user.name.split(" ")[0] + " " + (user.name.split(" ")[1]?.[0] || "") + ".", rating, comment: comment.trim() });
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <Link to="/reservations" style={{ color: "var(--primary)", textDecoration: "none" }}>← My Reservations</Link>
      <PageHeading title={booking.propertyTitle} action={<StatusBadge status={booking.status} />} />
      {params.get("sent") && <Alert severity="success" sx={{ mb: 3 }}>Request sent. The host will reply soon. You won't be charged until the host accepts.</Alert>}
      {params.get("paid") && <Alert severity="success" sx={{ mb: 3 }}>Payment received. Your stay is confirmed.</Alert>}
      {booking.status === "awaiting_payment" && <Alert severity="info" sx={{ mb: 3 }}>The host approved your request. You still need to pay with GCash to confirm the booking.</Alert>}
      {booking.status === "rejected" && <Alert severity="warning" sx={{ mb: 3 }}>The host could not accept this request. You were not charged.</Alert>}

      <div className="row g-4">
        <div className="col-12 col-md-7">
          <div className="panel">
            <Photo tone={booking.tone} height={180} src={coverOf(booking.propertyId)} />
            <div className="row g-3 mt-1">
              <Info label="Destination" value={booking.destination} />
              <Info label="Guests" value={guestSummary(booking)} />
              <Info label="Check-in" value={formatLong(booking.checkIn)} />
              <Info label="Check-out" value={formatLong(booking.checkOut)} />
            </div>
            <div style={{ marginTop: 16 }}><Link to={`/property/${booking.propertyId}`} style={{ color: "var(--primary)", textDecoration: "none" }}>View property</Link></div>
          </div>
        </div>
        <div className="col-12 col-md-5">
          <div className="panel">
            <Typography variant="h3" component="h2" sx={{ mb: 1.5 }}>Price</Typography>
            <PriceBox price={booking} serviceFeePercent={settings.serviceFeePercent} />

            {booking.status === "awaiting_payment" && (
              <Button component={Link} to={`/reservations/${booking.id}/pay`} fullWidth variant="contained" sx={{ mt: 3, bgcolor: "var(--accent)", "&:hover": { bgcolor: "#c94823" } }}>Pay with GCash</Button>
            )}
            {payment && (
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: 15 }}>
                <Typography sx={{ fontWeight: 500, mb: 1 }}>Payment <StatusBadge status={payment.status} /></Typography>
                <div style={{ color: "var(--muted)" }}>GCash ending {payment.gcashNumber.slice(-4)}</div>
                <div style={{ color: "var(--muted)" }}>Reference {payment.referenceNumber}</div>
              </div>
            )}
            {canCancel && <Button fullWidth color="error" variant="outlined" sx={{ mt: 2 }} onClick={() => setConfirmCancel(true)}>Cancel request</Button>}
            {booking.status === "confirmed" && <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>This booking is paid. To cancel it, contact the StayN team.</Typography>}
          </div>
        </div>
      </div>

      {canReview(booking) && (
        <div className="panel" id="review" style={{ marginTop: 24 }}>
          <Typography variant="h3" component="h2" sx={{ mb: 1.5 }}>Your review</Typography>
          {booking.reviewed && review && !editing ? (
            <>
              <Rating value={review.rating} readOnly />
              <Typography color="text.secondary">{review.comment}</Typography>
              {review.edited && <Typography variant="body2" color="text.secondary">Edited</Typography>}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Button size="small" onClick={startEdit}>Edit</Button>
                <Button size="small" color="error" onClick={() => setConfirmDelete(true)}>Delete</Button>
              </div>
            </>
          ) : (
            <form onSubmit={submitReview} noValidate>
              <Rating value={rating} onChange={(_, v) => setRating(v || 1)} sx={{ mb: 1 }} />
              <TextField fullWidth multiline minRows={3} label="How was your stay?" value={comment} onChange={(e) => setComment(e.target.value)} error={Boolean(reviewError)} helperText={reviewError || "Your review shows on the property page with your first name."} />
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <Button type="submit" variant="contained">{editing ? "Save review" : "Submit review"}</Button>
                {editing && <Button color="inherit" onClick={() => setEditing(false)}>Cancel</Button>}
              </div>
            </form>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete your review?"
        message="It will be removed from the property page. You can write a new one afterwards."
        confirmLabel="Delete review"
        danger
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { deleteMyReview(review.id, booking.id); setRating(5); setComment(""); setConfirmDelete(false); }}
      />

      <ConfirmDialog
        open={confirmCancel}
        title="Cancel this request?"
        message="You have not paid yet, so nothing will be charged."
        confirmLabel="Yes, cancel"
        danger
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => { setBookingStatus(booking.id, "cancelled", { cancelledBy: "guest" }); setConfirmCancel(false); }}
      />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="col-6">
      <div style={{ color: "var(--muted)", fontSize: 14 }}>{label}</div>
      <div style={{ fontWeight: 500 }}>{value}</div>
    </div>
  );
}
