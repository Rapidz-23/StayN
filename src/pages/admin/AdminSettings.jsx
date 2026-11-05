import { useState } from "react";
import { Alert, Button, Chip, TextField, Typography } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import { useData } from "../../context/DataContext";

function ListCard({ title, items, onChange, placeholder }) {
  const [text, setText] = useState("");
  const add = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v || items.some((i) => i.toLowerCase() === v.toLowerCase())) return;
    onChange([...items, v]); setText("");
  };
  return (
    <div className="panel" style={{ height: "100%" }}>
      <Typography variant="h3" component="h2" sx={{ mb: 2 }}>{title}</Typography>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {items.map((i) => <Chip key={i} label={i} variant="outlined" onDelete={() => onChange(items.filter((x) => x !== i))} />)}
      </div>
      <form onSubmit={add} style={{ display: "flex", gap: 8 }}>
        <TextField size="small" fullWidth placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />
        <Button type="submit" variant="contained">Add</Button>
      </form>
    </div>
  );
}

export default function AdminSettings() {
  const { settings, updateSettings } = useData();
  const [fee, setFee] = useState(String(settings.serviceFeePercent));
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [listing, setListing] = useState(String(settings.listingFee));
  const [listingMsg, setListingMsg] = useState({ type: "", text: "" });

  const saveFee = (e) => {
    e.preventDefault();
    const n = Number(fee);
    if (!Number.isFinite(n) || n < 0 || n > 50) return setMsg({ type: "error", text: "Enter a percent from 0 to 50." });
    updateSettings({ serviceFeePercent: n });
    setMsg({ type: "success", text: "Service fee saved." });
  };

  const saveListing = (e) => {
    e.preventDefault();
    const n = Number(listing);
    if (!Number.isFinite(n) || n < 0 || n > 100000) return setListingMsg({ type: "error", text: "Enter an amount from 0 to 100,000." });
    updateSettings({ listingFee: n });
    setListingMsg({ type: "success", text: "Listing fee saved." });
  };

  return (
    <>
      <PageHeading title="Categories and Settings" />
      <form onSubmit={saveFee} className="panel mb-4" style={{ maxWidth: 700 }} noValidate>
        <Typography variant="h3" component="h2">Service fee</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Percent of the nightly total</Typography>
        {msg.text && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <TextField size="small" type="number" value={fee} onChange={(e) => setFee(e.target.value)} sx={{ width: 200 }} slotProps={{ input: { endAdornment: "%" } }} />
          <Button type="submit" variant="contained">Save</Button>
        </div>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>New bookings use this percent. Old bookings keep the fee they were saved with.</Typography>
      </form>
      <form onSubmit={saveListing} className="panel mb-4" style={{ maxWidth: 700 }} noValidate>
        <Typography variant="h3" component="h2">Listing fee for hosts</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>One-time fee in pesos that a host pays for each property they post. It is refunded if you reject the property.</Typography>
        {listingMsg.text && <Alert severity={listingMsg.type} sx={{ mb: 2 }}>{listingMsg.text}</Alert>}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <TextField size="small" type="number" value={listing} onChange={(e) => setListing(e.target.value)} sx={{ width: 200 }} slotProps={{ input: { startAdornment: "₱" } }} />
          <Button type="submit" variant="contained">Save</Button>
        </div>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>New properties use this amount. Fees already paid keep the amount they were charged.</Typography>
      </form>
      <div className="row g-4">
        <div className="col-12 col-lg-6"><ListCard title="Categories (property types)" items={settings.propertyTypes} placeholder="New type" onChange={(v) => updateSettings({ propertyTypes: v })} /></div>
        <div className="col-12 col-lg-6"><ListCard title="Amenities" items={settings.amenities} placeholder="New amenity" onChange={(v) => updateSettings({ amenities: v })} /></div>
      </div>
    </>
  );
}
