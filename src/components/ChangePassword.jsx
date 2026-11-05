import { useState } from "react";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

// Used on the guest Profile page and the Host Profile page.
export default function ChangePassword() {
  const { changePassword } = useAuth();
  const [f, setF] = useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    if (!f.current) return setMsg({ type: "error", text: "Enter your current password." });
    if (f.next.length < 6) return setMsg({ type: "error", text: "Use a new password with at least 6 characters." });
    if (f.next === f.current) return setMsg({ type: "error", text: "The new password must be different from the current one." });
    if (f.next !== f.confirm) return setMsg({ type: "error", text: "The new passwords do not match." });
    const result = changePassword(f.current, f.next);
    if (!result.ok) return setMsg({ type: "error", text: result.error });
    setF({ current: "", next: "", confirm: "" });
    setMsg({ type: "success", text: "Password changed." });
  };

  return (
    <form onSubmit={submit} className="panel" style={{ marginTop: 24 }} noValidate>
      <Typography variant="h3" component="h2" sx={{ mb: 2 }}>Change password</Typography>
      {msg.text && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}
      <TextField fullWidth label="Current password" type="password" autoComplete="current-password" value={f.current} onChange={set("current")} sx={{ mb: 2 }} />
      <TextField fullWidth label="New password" type="password" autoComplete="new-password" value={f.next} onChange={set("next")} sx={{ mb: 2 }} />
      <TextField fullWidth label="Confirm new password" type="password" autoComplete="new-password" value={f.confirm} onChange={set("confirm")} sx={{ mb: 3 }} />
      <Button type="submit" variant="contained">Update password</Button>
    </form>
  );
}
