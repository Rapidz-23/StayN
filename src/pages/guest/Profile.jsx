import { useState } from "react";
import { Alert, Avatar, Button, TextField } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import ChangePassword from "../../components/ChangePassword";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

const initials = (n = "") => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function Profile() {
  const { user } = useAuth();
  const { updateUser } = useData();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [photoName, setPhotoName] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const save = (e) => {
    e.preventDefault();
    if (!name.trim()) return setMsg({ type: "error", text: "Name cannot be empty." });
    if (!/^09\d{9}$/.test(phone)) return setMsg({ type: "error", text: "Enter an 11-digit phone number that starts with 09." });
    updateUser(user.id, { name: name.trim(), phone });
    setMsg({ type: "success", text: "Profile saved." });
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <PageHeading title="Profile" />
      <form onSubmit={save} className="panel" noValidate>
        {msg.text && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: "#FFF1D6", color: "#8A5A00", fontSize: 24, fontWeight: 500 }}>{initials(name)}</Avatar>
          <div>
            <Button component="label" variant="outlined" color="inherit" sx={{ borderColor: "var(--border)" }}>
              Change photo
              <input hidden type="file" accept="image/*" onChange={(e) => setPhotoName(e.target.files[0]?.name || "")} />
            </Button>
            {photoName && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{photoName} (saved when the database is connected)</div>}
          </div>
        </div>
        <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Email" value={user.email} disabled sx={{ mb: 2 }} helperText="Email cannot be changed." />
        <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} sx={{ mb: 3 }} />
        <Button type="submit" variant="contained">Save changes</Button>
      </form>
      <ChangePassword />
    </div>
  );
}
