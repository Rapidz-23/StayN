import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Alert, Button, TextField, Typography } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { formatLong, overlaps, parseISO, toISO, todayISO } from "../../utils/dates";

export default function Availability() {
  const { id } = useParams();
  const { user } = useAuth();
  const { properties, bookings, saveProperty } = useData();
  const property = properties.find((p) => p.id === id);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");

  if (!property || property.hostId !== user.id) return <Navigate to="/not-allowed" replace />;

  const reserved = bookings.filter((b) => b.propertyId === id && ["confirmed", "awaiting_payment"].includes(b.status));
  const dayState = (date) => {
    const d = toISO(date);
    if (reserved.some((b) => d >= b.checkIn && d < b.checkOut)) return "reserved";
    if (property.blockedRanges.some((r) => d >= r.start && d < r.end)) return "blocked";
    return "";
  };

  const addRange = (e) => {
    e.preventDefault();
    setError("");
    if (!start || !end || end <= start) return setError("Pick a start date and an end date after it.");
    if (start < todayISO()) return setError("Blocked dates cannot start in the past.");
    if (reserved.some((b) => overlaps(start, end, b.checkIn, b.checkOut))) return setError("Those dates overlap a reservation. Choose other dates.");
    saveProperty({ id, blockedRanges: [...property.blockedRanges, { start, end }] });
    setStart(""); setEnd("");
  };

  const removeRange = (i) => saveProperty({ id, blockedRanges: property.blockedRanges.filter((_, idx) => idx !== i) });

  return (
    <>
      <Link to="/host/properties" style={{ color: "var(--primary)", textDecoration: "none" }}>← My Properties</Link>
      <PageHeading title="Availability" subtitle={property.title} />
      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="panel">
            <Calendar
              defaultView="month"
              tileClassName={({ date, view }) => (view === "month" ? `day-${dayState(date) || "free"}` : null)}
              minDate={parseISO(todayISO())}
            />
            <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 14, color: "var(--muted)", flexWrap: "wrap" }}>
              <span><i className="legend-dot" style={{ background: "#146C60" }} /> Reserved</span>
              <span><i className="legend-dot" style={{ background: "#FFB347" }} /> Blocked by you</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <form onSubmit={addRange} className="panel mb-3" noValidate>
            <Typography variant="h3" component="h2" sx={{ mb: 2 }}>Block dates</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <div className="row g-2">
              <div className="col-6"><TextField fullWidth size="small" type="date" label="From" value={start} onChange={(e) => setStart(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} /></div>
              <div className="col-6"><TextField fullWidth size="small" type="date" label="Until" value={end} onChange={(e) => setEnd(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} /></div>
            </div>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Block these dates</Button>
          </form>
          <div className="panel">
            <Typography variant="h3" component="h2" sx={{ mb: 1 }}>Blocked ranges</Typography>
            {property.blockedRanges.length === 0 ? <Typography color="text.secondary">No blocked dates.</Typography> : property.blockedRanges.map((r, i) => (
              <div key={`${r.start}-${i}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: i ? "1px solid var(--border)" : 0 }}>
                <span>{formatLong(r.start)} to {formatLong(r.end)}</span>
                <Button size="small" color="error" onClick={() => removeRange(i)}>Remove</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
