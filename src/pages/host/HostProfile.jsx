import { useState } from "react";
import { Alert, Avatar, Button, TextField } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import ChangePassword from "../../components/ChangePassword";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

const initials = (n = "") => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function HostProfile() {
  const { user, application } = useAuth();
  const { updateApplication, updateUser } = useData();
  const [f, setF] = useState({ fullName: application?.fullName || user.name, phone: application?.phone || user.phone, address: application?.address || "", bio: application?.bio || "" });
  const [photoName, setPhotoName] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    if (!f.fullName.trim() || !f.address.trim()) return setMsg({ type: "error", text: "Name and address cannot be empty." });
    if (!/^09\d{9}$/.test(f.phone)) return setMsg({ type: "error", text: "Enter an 11-digit phone number that starts with 09." });
    updateApplication(user.id, f);
    updateUser(user.id, { name: f.fullName.trim(), phone: f.phone });
    setMsg({ type: "success", text: "Host profile saved." });
  };

  return (
    <>
      <PageHeading title="Host Profile" />
      <form onSubmit={save} className="panel" style={{ maxWidth: 690 }} noValidate>
        {msg.text && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: "#FFF1D6", color: "#8A5A00", fontSize: 24, fontWeight: 500 }}>{initials(f.fullName)}</Avatar>
          <div>
            <Button component="label" variant="outlined" color="inherit" sx={{ borderColor: "var(--border)" }}>
              Change photo
              <input hidden type="file" accept="image/*" onChange={(e) => setPhotoName(e.target.files[0]?.name || "")} />
            </Button>
            {photoName && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{photoName}</div>}
          </div>
        </div>
        <TextField fullWidth label="Host name" value={f.fullName} onChange={set("fullName")} sx={{ mb: 2 }} />
        <TextField fullWidth label="Phone" value={f.phone} onChange={set("phone")} sx={{ mb: 2 }} />
        <TextField fullWidth label="Address" value={f.address} onChange={set("address")} sx={{ mb: 2 }} />
        <TextField fullWidth multiline minRows={3} label="Bio" value={f.bio} onChange={set("bio")} sx={{ mb: 3 }} />
        <Button type="submit" variant="contained">Save changes</Button>
      </form>
      <div style={{ maxWidth: 690 }}><ChangePassword /></div>
    </>
  );
}
