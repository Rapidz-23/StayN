import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Avatar, Breadcrumbs, Button, TextField, Typography } from "@mui/material";
import GuestPicker from "../../components/GuestPicker";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CheckIcon from "@mui/icons-material/Check";
import Photo from "../../components/Photo";
import RatingStars from "../../components/RatingStars";
import PriceBox from "../../components/PriceBox";
import MapView from "../../components/MapView";
import EmptyState from "../../components/EmptyState";
import StarIcon from "@mui/icons-material/Star";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { priceBreakdown } from "../../utils/price";
import { nightsBetween, todayISO } from "../../utils/dates";
import { isAvailable } from "./Explore";

export default function PropertyDetails() {
  const { id } = useParams();
  const { properties, bookings, reviews, settings, ratingOf, createBooking } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === id);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({ adults: 2, kids: 0, pets: 0 });
  const [error, setError] = useState("");

  if (!property || (property.status !== "approved" && user?.id !== property.hostId && user?.role !== "admin"))
    return <div className="container"><EmptyState title="Stay not found" message="This stay is not available." action={<Button component={Link} to="/explore" variant="contained">Back to Explore</Button>} /></div>;

  const { avg, count } = ratingOf(property.id);
  const list = reviews.filter((r) => r.propertyId === property.id && r.visible);
  const nights = checkIn && checkOut && checkOut > checkIn ? nightsBetween(checkIn, checkOut) : 0;
  const price = priceBreakdown(property.nightlyRate, nights || 1, property.cleaningFee, settings.serviceFeePercent);
  const unverified = user && !user.emailVerified;

  const request = () => {
    setError("");
    if (!user) return navigate("/login", { state: { from: `/property/${id}` } });
    if (unverified) return setError("Verify your email before you send a booking request.");
    if (user.id === property.hostId) return setError("You cannot book your own property.");
    if (!nights) return setError("Choose a check-out date after check-in.");
    if (checkIn < todayISO()) return setError("Check-in cannot be in the past.");
    if (guests.adults < 1) return setError("At least 1 adult must be in the group.");
    if (guests.adults + guests.kids > property.maxGuests) return setError(`This stay fits up to ${property.maxGuests} guests (adults and kids together).`);
    if (guests.pets > (property.maxPets || 0)) return setError(property.maxPets ? `This stay accepts up to ${property.maxPets} pet${property.maxPets === 1 ? "" : "s"}.` : "Pets are not allowed at this stay.");
    if (!isAvailable(property, bookings, checkIn, checkOut)) return setError("Those dates are not available. Try different dates.");
    const bookingId = createBooking({ property, checkIn, checkOut, ...guests, user, price: priceBreakdown(property.nightlyRate, nights, property.cleaningFee, settings.serviceFeePercent) });
    navigate(`/reservations/${bookingId}?sent=1`);
  };

  return (
    <div className="container">
      <Breadcrumbs sx={{ mb: 1, fontSize: 14 }}>
        <Link to="/explore" style={{ color: "inherit" }}>Explore</Link>
        <Link to={`/explore?destination=${property.destination}`} style={{ color: "inherit" }}>{property.destination}</Link>
        <span>{property.title}</span>
      </Breadcrumbs>
      <Typography variant="h2" component="h1">{property.title}</Typography>
      <div style={{ display: "flex", gap: 12, alignItems: "center", color: "var(--muted)", marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><PlaceOutlinedIcon fontSize="small" />{property.address}</span>
        <RatingStars avg={avg} count={count} />
        <Link to={`/explore?type=${encodeURIComponent(property.type)}`} style={{ color: "inherit" }}>{property.type}</Link>
      </div>

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-6"><Photo tone={property.tone} height={300} label="Cover photo" src={property.images?.[0]} /></div>
        <div className="col-12 col-md-6">
          <div className="row g-2">
            {[1, 2, 3, 4].map((i) => (
              <div className="col-6" key={i}><Photo tone={property.tone + i} height={146} src={property.images?.[i]} label={property.images?.[i] ? `Property photo ${i + 1}` : ""} /></div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
            <Avatar sx={{ bgcolor: "#FFF1D6", color: "#8A5A00" }}>{property.hostName.split(" ").map((x) => x[0]).join("")}</Avatar>
            <div>
              <div style={{ fontWeight: 500 }}>Hosted by {property.hostName}</div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>{property.maxGuests} guests · {property.bedrooms} bedroom{property.bedrooms > 1 ? "s" : ""} · {property.bathrooms} bathroom{property.bathrooms > 1 ? "s" : ""} · {property.maxPets ? `Up to ${property.maxPets} pet${property.maxPets === 1 ? "" : "s"}` : "No pets"}</div>
            </div>
          </div>

          <Section title="About this stay"><Typography>{property.description}</Typography></Section>
          <Section title="Amenities">
            <div className="row g-2">
              {property.amenities.map((a) => (
                <div className="col-6" key={a}><span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><CheckIcon sx={{ fontSize: 18, color: "primary.main" }} />{a}</span></div>
              ))}
            </div>
          </Section>
          <Section title="House rules">
            <Typography>Check-in after {property.checkInTime} · Check-out before {property.checkOutTime}</Typography>
            <Typography color="text.secondary">{property.houseRules}</Typography>
          </Section>
          <Section title="Where you'll stay"><MapView lat={property.lat} lng={property.lng} /></Section>
          <Section title="Reviews">
            {list.length === 0 ? <Typography color="text.secondary">No reviews yet.</Typography> : list.map((r) => (
              <div key={r.id} className="panel" style={{ padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontWeight: 500 }}>{r.guestName}</strong>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><StarIcon sx={{ fontSize: 18, color: "#FFB347" }} />{r.rating}</span>
                </div>
                <Typography color="text.secondary">{r.comment}</Typography>
              </div>
            ))}
          </Section>
        </div>

        <div className="col-12 col-lg-4">
          <div className="panel" style={{ position: "sticky", top: 16 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 500 }}>₱{property.nightlyRate.toLocaleString("en-PH")} <span style={{ fontSize: 16, fontWeight: 400, color: "var(--muted)" }}>/ night</span></Typography>
            <div className="row g-2 mt-1">
              <div className="col-6"><TextField fullWidth size="small" type="date" label="Check-in" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: todayISO() } }} /></div>
              <div className="col-6"><TextField fullWidth size="small" type="date" label="Check-out" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: checkIn || todayISO() } }} /></div>
              <div className="col-12">
                <GuestPicker value={guests} onChange={setGuests} minAdults={1} maxGuests={property.maxGuests} maxPets={property.maxPets || 0} />
                <Typography variant="caption" color="text.secondary">Up to {property.maxGuests} guests (adults and kids). {property.maxPets ? `Up to ${property.maxPets} pet${property.maxPets === 1 ? "" : "s"}.` : "No pets."}</Typography>
              </div>
            </div>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {unverified && !error && <Alert severity="warning" sx={{ mt: 2 }}>Verify your email to send booking requests.</Alert>}
            <Button fullWidth variant="contained" sx={{ mt: 2, bgcolor: "var(--accent)", "&:hover": { bgcolor: "#c94823" } }} onClick={request}>Request to book</Button>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1, mb: 2 }}>You won't be charged yet.</Typography>
            {nights > 0 && <PriceBox price={price} serviceFeePercent={settings.serviceFeePercent} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ padding: "24px 0", borderBottom: "1px solid var(--border)" }}>
      <Typography variant="h3" component="h2" sx={{ mb: 1.5 }}>{title}</Typography>
      {children}
    </section>
  );
}
