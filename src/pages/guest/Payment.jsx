import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, TextField, Typography } from "@mui/material";
import PriceBox from "../../components/PriceBox";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { peso } from "../../utils/price";

// Simulated GCash payment: no real money moves.
export default function Payment() {
  const { id } = useParams();
  const { bookings, settings, payBooking } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const booking = bookings.find((b) => b.id === id);
  const [number, setNumber] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  if (!booking || booking.guestId !== user.id) return <Navigate to="/not-allowed" replace />;
  if (booking.status !== "awaiting_payment" && !paid) return <Navigate to={`/reservations/${id}`} replace />;

  const submit = (e) => {
    e.preventDefault();
    if (!/^09\d{9}$/.test(number)) return setError("Enter an 11-digit GCash number that starts with 09.");
    if (!name.trim()) return setError("Enter the account name.");
    if (!/^\d{4}$/.test(pin)) return setError("Enter your 4-digit MPIN.");
    setPaid(true); // keeps the redirect guard above from swallowing the "paid" message
    payBooking(booking.id, { gcashNumber: number, accountName: name.trim() });
    navigate(`/reservations/${booking.id}?paid=1`);
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <Link to={`/reservations/${id}`} style={{ color: "var(--primary)", textDecoration: "none" }}>← Back to reservation</Link>
      <Typography variant="h2" component="h1" sx={{ my: 2 }}>Pay with GCash</Typography>
      <div className="row g-4">
        <div className="col-12 col-md-7">
          <form onSubmit={submit} className="panel" noValidate>
            <Alert severity="info" sx={{ mb: 2 }}>This is a practice payment. No real money is charged.</Alert>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="GCash number" placeholder="09171234567" value={number} onChange={(e) => setNumber(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Account name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="MPIN (4 digits)" type="password" value={pin} onChange={(e) => setPin(e.target.value)} slotProps={{ htmlInput: { maxLength: 4, inputMode: "numeric" } }} sx={{ mb: 3 }} />
            <Button fullWidth type="submit" variant="contained" sx={{ bgcolor: "var(--accent)", "&:hover": { bgcolor: "#c94823" } }}>Pay {peso(booking.total)}</Button>
          </form>
        </div>
        <div className="col-12 col-md-5">
          <div className="panel">
            <Typography sx={{ fontWeight: 500 }}>{booking.propertyTitle}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{booking.checkIn} to {booking.checkOut}</Typography>
            <PriceBox price={booking} serviceFeePercent={settings.serviceFeePercent} />
          </div>
        </div>
      </div>
    </div>
  );
}
