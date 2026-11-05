import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PropertyCard from "../../components/PropertyCard";
import GuestPicker from "../../components/GuestPicker";
import { useData } from "../../context/DataContext";
import { destinations } from "../../data/sampleData";

const destinationColors = {
  Tagaytay: ["#E3F2EF", "#146C60"], Cebu: ["#FFF1D6", "#8A5A00"], Palawan: ["#E3F2EF", "#146C60"], Siargao: ["#FBE4DD", "#B23A1B"],
};

const destinationImages = {
  Tagaytay: "/TAGAYTAY.jpg",
  Cebu: "/CEBU.jpg",
  Palawan: "/PALAWAN.jpg",
  Siargao: "/SIARGAO.jpg",
};

const steps = [
  { icon: SearchIcon, title: "1. Search", text: "Pick a place and your dates." },
  { icon: EventAvailableOutlinedIcon, title: "2. Request", text: "Send a request. The host replies." },
  { icon: HomeOutlinedIcon, title: "3. Pay and stay", text: "Pay with GCash. Pack your bags." },
];

export default function Home() {
  const { properties, ratingOf, settings } = useData();
  const navigate = useNavigate();
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({ adults: 2, kids: 0, pets: 0 });

 
  const featured = properties
    .filter((p) => p.status === "approved")
    .sort((a, b) => ratingOf(b.id).avg - ratingOf(a.id).avg)
    .slice(0, 6);

  const search = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (where) q.set("destination", where);
    if (checkIn) q.set("checkIn", checkIn);
    if (checkOut) q.set("checkOut", checkOut);
    Object.entries(guests).forEach(([k, n]) => { if (n) q.set(k, n); });
    navigate(`/explore?${q.toString()}`);
  };

  return (
    <>
      <section style={{ background: "linear-gradient(rgba(14,79,70,.9), rgba(20,108,96,.85))", color: "#FFF8F0", padding: "64px 16px", marginTop: -48, marginBottom: 48, textAlign: "center" }}>
        <div className="container">
          <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 30, md: 40 }, lineHeight: { xs: "38px", md: "48px" } }}>Your home away from home.</Typography>
          <Typography sx={{ mt: 1, mb: 4 }}>Find cozy stays in Tagaytay, Cebu, Palawan and Siargao.</Typography>
          <form onSubmit={search} className="search-bar" style={{ padding: 16, maxWidth: 900, margin: "0 auto", color: "var(--text)", textAlign: "left" }}>
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-3">
                <TextField select fullWidth size="small" label="Where" value={where} onChange={(e) => setWhere(e.target.value)}>
                  <MenuItem value="">Anywhere</MenuItem>
                  {destinations.map((d) => <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>)}
                </TextField>
              </div>
              <div className="col-6 col-md-2">
                <TextField fullWidth size="small" type="date" label="Check-in" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
              </div>
              <div className="col-6 col-md-2">
                <TextField fullWidth size="small" type="date" label="Check-out" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
              </div>
              <div className="col-6 col-md-2">
                <GuestPicker value={guests} onChange={setGuests} />
              </div>
              <div className="col-6 col-md-3">
                <Button type="submit" variant="contained" fullWidth>Search stays</Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <div className="container">
        <Typography variant="h3" component="h2" sx={{ mb: 2 }}>Pick a destination</Typography>
        <div className="row g-3 mb-5">
          {destinations.map((d) => {
            const [bg, fg] = destinationColors[d.name];
            const image = destinationImages[d.name];
            return (
              <div className="col-6 col-lg-3" key={d.name}>
                <Link to={`/explore?destination=${d.name}`} style={{
                  display: "flex",
                  alignItems: "flex-end",
                  height: 140,
                  padding: 16,
                  borderRadius: 12,
                  background: image ? `linear-gradient(rgba(7,18,16,0.28), rgba(11,18,16,0.68)), url(${image}) center/cover no-repeat` : bg,
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 700,
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                }}>
                  <div>
                    <div style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{d.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, opacity: 1, color: "#F5F7F7", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{d.blurb}</div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <Typography variant="h3" component="h2" sx={{ mb: 2 }}>Browse by category</Typography>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
          {settings.propertyTypes.map((t) => {
            const n = properties.filter((p) => p.status === "approved" && p.type === t).length;
            return (
              <Link key={t} to={`/explore?type=${encodeURIComponent(t)}`} style={{ padding: "10px 18px", border: "1px solid var(--border)", borderRadius: 999, background: "var(--surface)", color: "var(--text)", textDecoration: "none", fontWeight: 500 }}>
                {t} <span style={{ color: "var(--muted)", fontWeight: 400 }}>({n})</span>
              </Link>
            );
          })}
        </div>

        <div className="d-flex justify-content-between align-items-baseline mb-2">
          <Typography variant="h3" component="h2">Featured stays</Typography>
          <Link to="/explore" style={{ color: "var(--primary)", textDecoration: "none" }}>See all stays</Link>
        </div>
        <div className="row g-4 mb-5">
          {featured.map((p) => (
            <div className="col-12 col-md-6 col-lg-4" key={p.id}><PropertyCard property={p} /></div>
          ))}
        </div>

        <Typography variant="h3" component="h2" sx={{ mb: 2 }}>How it works</Typography>
        <div className="row g-3 mb-5">
          {steps.map(({ icon: Icon, title, text }) => (
            <div className="col-12 col-md-4" key={title}>
              <div className="panel" style={{ padding: 20 }}>
                <Icon sx={{ color: "primary.main" }} />
                <div style={{ fontWeight: 500, marginTop: 8 }}>{title}</div>
                <div style={{ color: "var(--muted)", fontSize: 15 }}>{text}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--secondary)", borderRadius: 12, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Typography variant="h3" component="h2">Have a place to share?</Typography>
            <Typography>Become a host and welcome guests across the Philippines.</Typography>
          </div>
          <Button component={Link} to="/become-host" variant="contained">Become a host</Button>
        </div>
      </div>
    </>
  );
}
