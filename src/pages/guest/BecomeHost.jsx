import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, TextField, Typography } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import StatusBadge from "../../components/StatusBadge";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

export default function BecomeHost() {
  const { user, application } = useAuth();
  const { submitApplication } = useData();
  const [f, setF] = useState({ fullName: user.name, phone: user.phone, address: "", bio: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!f.fullName.trim() || !f.address.trim() || !f.bio.trim()) return setError("Fill in your name, address and a short bio.");
    if (!/^09\d{9}$/.test(f.phone)) return setError("Enter an 11-digit phone number that starts with 09.");
    submitApplication(user.id, f);
  };

  if (application) {
    const text = {
      pending: "Your application is with the StayN team. We will notify you when it is reviewed.",
      approved: "You are an approved host. You can add and manage properties.",
      rejected: "Your application was not approved this time.",
      deactivated: "Your host account is deactivated. Contact the StayN team.",
    }[application.status];
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <PageHeading title="Become a Host" />
        <div className="panel">
          <Typography sx={{ fontWeight: 500, mb: 1 }}>Application status <StatusBadge status={application.status} /></Typography>
          <Typography color="text.secondary">{text}</Typography>
          {application.status === "approved" && <Button component={Link} to="/host" variant="contained" sx={{ mt: 2 }}>Go to dashboard</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <PageHeading title="Become a Host" subtitle="Tell us a little about you. The StayN team reviews every application." />
      <form onSubmit={submit} className="panel" noValidate>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField fullWidth label="Full name" value={f.fullName} onChange={set("fullName")} sx={{ mb: 2 }} />
        <TextField fullWidth label="Phone" value={f.phone} onChange={set("phone")} sx={{ mb: 2 }} />
        <TextField fullWidth label="Address" value={f.address} onChange={set("address")} sx={{ mb: 2 }} />
        <TextField fullWidth multiline minRows={3} label="Short bio" value={f.bio} onChange={set("bio")} sx={{ mb: 3 }} />
        <Button type="submit" variant="contained">Send application</Button>
      </form>
    </div>
  );
}
