import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Checkbox, Chip, FormControlLabel, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PageHeading from "../../components/PageHeading";
import MapView from "../../components/MapView";
import DocumentPicker from "../../components/DocumentPicker";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { destinations } from "../../data/sampleData";
import { checkFile, readFile } from "../../utils/files";
import { peso } from "../../utils/price";

const MAX_PHOTOS = 5;

const blank = {
  title: "", type: "", destination: "", address: "", description: "", nightlyRate: "", cleaningFee: "0",
  maxGuests: "2", maxPets: "0", bedrooms: "1", bathrooms: "1", amenities: [], houseRules: "", checkInTime: "2:00 PM", checkOutTime: "12:00 PM",
  lat: 14.1153, lng: 120.9621,
};

// Add and Edit share this form (Edit is prefilled).
export default function PropertyForm() {
  const { id } = useParams();
  const { user, application } = useAuth();
  const { properties, settings, saveProperty, updateApplication } = useData();
  const navigate = useNavigate();
  const existing = id ? properties.find((p) => p.id === id) : null;
  const [f, setF] = useState(existing ? { ...blank, ...existing, maxPets: String(existing.maxPets || 0) } : blank);
  const [images, setImages] = useState(existing?.images || []);
  const [titleDoc, setTitleDoc] = useState(existing?.titleDocument || null);
  const [idDoc, setIdDoc] = useState(null); // a new ID upload; the one already on file lives on the host application
  const [pay, setPay] = useState({ gcashNumber: "", accountName: user?.name || "", pin: "" });
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");

  if (id && (!existing || existing.hostId !== user.id)) return <Navigate to="/not-allowed" replace />;

  const idOnFile = application?.idDocument || null;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setPayField = (k) => (e) => setPay({ ...pay, [k]: e.target.value });
  const pickDestination = (e) => {
    const d = destinations.find((x) => x.name === e.target.value);
    setF({ ...f, destination: d.name, lat: d.lat, lng: d.lng });
  };
  const toggleAmenity = (a) => setF({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] });

  // Photos: checked one by one, then added until the limit is reached.
  const addPhotos = async (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    setPhotoError("");
    const room = MAX_PHOTOS - images.length;
    if (files.length > room) setPhotoError(`You can add up to ${MAX_PHOTOS} photos. Only the first ${room} were added.`);
    const accepted = [];
    for (const file of files.slice(0, Math.max(room, 0))) {
      const bad = checkFile(file);
      if (bad) { setPhotoError(bad); continue; }
      accepted.push(await readFile(file));
    }
    setImages((list) => [...list, ...accepted]);
  };
  const removePhoto = (i) => setImages((list) => list.filter((_, n) => n !== i));
  const makeCover = (i) => setImages((list) => [list[i], ...list.filter((_, n) => n !== i)]);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!f.title.trim() || !f.type || !f.destination || !f.address.trim() || !f.description.trim()) return setError("Fill in the title, type, destination, address and description.");
    if (!(Number(f.nightlyRate) > 0)) return setError("The nightly rate must be more than 0.");
    if (Number(f.cleaningFee) < 0) return setError("The cleaning fee cannot be negative.");
    if (!(Number(f.maxGuests) >= 1)) return setError("Max guests must be at least 1.");
    if (!(Number.isInteger(Number(f.maxPets)) && Number(f.maxPets) >= 0)) return setError("Max pets must be 0 or more. Use 0 if pets are not allowed.");
    if (images.length < 1 && (!existing || existing.images?.length)) return setError("Add at least 1 photo of the property.");
    if (!titleDoc) return setError("Upload the title of the property (or other proof that you own it).");
    if (!existing) {
      if (!idDoc && !idOnFile) return setError("Upload a valid government ID.");
      if (!/^09\d{9}$/.test(pay.gcashNumber)) return setError("Enter an 11-digit GCash number that starts with 09 to pay the listing fee.");
      if (!pay.accountName.trim()) return setError("Enter the GCash account name.");
      if (!/^\d{4}$/.test(pay.pin)) return setError("Enter your 4-digit MPIN.");
    }

    if (idDoc) updateApplication(user.id, { idDocument: idDoc });
    saveProperty({
      ...(existing ? { id: existing.id } : { hostId: user.id, hostName: application?.fullName || user.name }),
      title: f.title.trim(), type: f.type, destination: f.destination, address: f.address.trim(), description: f.description.trim(),
      nightlyRate: Number(f.nightlyRate), cleaningFee: Number(f.cleaningFee), maxGuests: Number(f.maxGuests), maxPets: Number(f.maxPets),
      bedrooms: Number(f.bedrooms), bathrooms: Number(f.bathrooms),
      amenities: f.amenities, houseRules: f.houseRules, checkInTime: f.checkInTime, checkOutTime: f.checkOutTime, lat: f.lat, lng: f.lng,
      images, imageCount: images.length || existing?.imageCount || 0, titleDocument: titleDoc,
    }, existing ? null : { gcashNumber: pay.gcashNumber, accountName: pay.accountName.trim() });
    navigate("/host/properties");
  };

  return (
    <>
      <Link to="/host/properties" style={{ color: "var(--primary)", textDecoration: "none" }}>← My Properties</Link>
      <PageHeading title={existing ? "Edit property" : "Add property"} subtitle={existing ? undefined : "New properties are reviewed by the StayN team before they go live."} />
      <form onSubmit={submit} className="panel" style={{ maxWidth: 820 }} noValidate>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <div className="row g-3">
          <div className="col-12"><TextField fullWidth label="Title" value={f.title} onChange={set("title")} /></div>
          <div className="col-12 col-md-6"><TextField select fullWidth label="Category" value={f.type} onChange={set("type")}>{settings.propertyTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></div>
          <div className="col-12 col-md-6"><TextField select fullWidth label="Destination" value={f.destination} onChange={pickDestination}>{destinations.map((d) => <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>)}</TextField></div>
          <div className="col-12"><TextField fullWidth label="Address" value={f.address} onChange={set("address")} /></div>
          <div className="col-12"><TextField fullWidth multiline minRows={3} label="Description" value={f.description} onChange={set("description")} /></div>
          <div className="col-6 col-md-3"><TextField fullWidth type="number" label="Nightly rate (₱)" value={f.nightlyRate} onChange={set("nightlyRate")} /></div>
          <div className="col-6 col-md-3"><TextField fullWidth type="number" label="Cleaning fee (₱)" value={f.cleaningFee} onChange={set("cleaningFee")} /></div>
          <div className="col-6 col-md-3"><TextField fullWidth type="number" label="Max guests" helperText="Adults and kids together" value={f.maxGuests} onChange={set("maxGuests")} slotProps={{ htmlInput: { min: 1 } }} /></div>
          <div className="col-6 col-md-3"><TextField fullWidth type="number" label="Max pets" helperText="0 = no pets" value={f.maxPets} onChange={set("maxPets")} slotProps={{ htmlInput: { min: 0 } }} /></div>
          <div className="col-6"><TextField fullWidth type="number" label="Bedrooms" value={f.bedrooms} onChange={set("bedrooms")} /></div>
          <div className="col-6"><TextField fullWidth type="number" label="Bathrooms" value={f.bathrooms} onChange={set("bathrooms")} /></div>
          <div className="col-6"><TextField fullWidth label="Check-in time" value={f.checkInTime} onChange={set("checkInTime")} /></div>
          <div className="col-6"><TextField fullWidth label="Check-out time" value={f.checkOutTime} onChange={set("checkOutTime")} /></div>
          <div className="col-12"><TextField fullWidth multiline minRows={2} label="House rules" value={f.houseRules} onChange={set("houseRules")} /></div>
        </div>

        <Typography sx={{ fontWeight: 500, mt: 3 }}>Amenities</Typography>
        <div className="row">
          {settings.amenities.map((a) => (
            <div className="col-6 col-md-4" key={a}><FormControlLabel control={<Checkbox checked={f.amenities.includes(a)} onChange={() => toggleAmenity(a)} />} label={a} /></div>
          ))}
        </div>

        <Typography sx={{ fontWeight: 500, mt: 2, mb: 1 }}>Pin the location</Typography>
        <MapView lat={f.lat} lng={f.lng} height={240} onPick={({ lat, lng }) => setF({ ...f, lat, lng })} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Click the map to move the pin. It starts at the destination you picked.</Typography>

        <Typography sx={{ fontWeight: 500, mt: 3 }}>Photos ({images.length} of {MAX_PHOTOS})</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>JPG, PNG or WEBP, up to 5 MB each. The first photo is the cover.</Typography>
        {photoError && <Alert severity="warning" sx={{ mb: 1 }} onClose={() => setPhotoError("")}>{photoError}</Alert>}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          {images.map((img, i) => (
            <div key={img.url.slice(-24) + i} style={{ width: 132 }}>
              <div style={{ position: "relative" }}>
                <img src={img.url} alt={`Property photo ${i + 1}`} style={{ width: 132, height: 99, objectFit: "cover", borderRadius: 8, display: "block" }} />
                <IconButton size="small" aria-label={`Remove photo ${i + 1}`} onClick={() => removePhoto(i)} sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(255,255,255,.9)", "&:hover": { bgcolor: "#fff" } }}><CloseIcon fontSize="small" /></IconButton>
                {i === 0 && <Chip label="Cover" size="small" sx={{ position: "absolute", left: 4, bottom: 4, bgcolor: "#146C60", color: "#fff" }} />}
              </div>
              {i > 0 && <Button size="small" onClick={() => makeCover(i)}>Make cover</Button>}
            </div>
          ))}
        </div>
        {images.length < MAX_PHOTOS && (
          <Button component="label" variant="outlined" color="inherit" sx={{ borderColor: "var(--border)" }}>
            Upload photos
            <input hidden type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addPhotos} />
          </Button>
        )}

        <Typography sx={{ fontWeight: 500, mt: 4 }}>Documents</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Only the StayN team can see these. We check them before your property goes live.</Typography>
        <div style={{ display: "grid", gap: 12 }}>
          <DocumentPicker
            label="Title of the property"
            hint="Copy of the TCT or OCT, or other proof that you own or may rent out this place."
            value={titleDoc}
            onChange={setTitleDoc}
          />
          {idOnFile && !idDoc ? (
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <Typography sx={{ fontWeight: 500 }}>Valid government ID</Typography>
              <Typography variant="body2" color="text.secondary">On file: {idOnFile.name}. You only need to upload it once.</Typography>
              <Button component="label" size="small" sx={{ mt: 0.5 }}>
                Replace ID
                <input hidden type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={async (e) => { const file = e.target.files[0]; e.target.value = ""; if (file && !checkFile(file, { allowPdf: true })) setIdDoc(await readFile(file)); }} />
              </Button>
            </div>
          ) : (
            <DocumentPicker label="Valid government ID" hint="Driver's license, passport, UMID, PhilID or another government ID with your photo." value={idDoc} onChange={setIdDoc} />
          )}
        </div>

        {!existing && (
          <div style={{ marginTop: 32, border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
            <Typography sx={{ fontWeight: 500 }}>Listing fee: {peso(settings.listingFee)}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>A one-time fee for each property you post. It is paid with GCash when you submit, and refunded if the StayN team rejects the property.</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>This is a practice payment. No real money is charged.</Alert>
            <div className="row g-3">
              <div className="col-12 col-md-4"><TextField fullWidth size="small" label="GCash number" placeholder="09171234567" value={pay.gcashNumber} onChange={setPayField("gcashNumber")} /></div>
              <div className="col-12 col-md-4"><TextField fullWidth size="small" label="Account name" value={pay.accountName} onChange={setPayField("accountName")} /></div>
              <div className="col-12 col-md-4"><TextField fullWidth size="small" label="MPIN (4 digits)" type="password" value={pay.pin} onChange={setPayField("pin")} slotProps={{ htmlInput: { maxLength: 4, inputMode: "numeric" } }} /></div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <Button type="submit" variant="contained">{existing ? "Save changes" : `Pay ${peso(settings.listingFee)} and submit`}</Button>
          <Button component={Link} to="/host/properties" color="inherit">Cancel</Button>
        </div>
      </form>
    </>
  );
}
