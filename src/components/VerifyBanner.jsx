import { useState } from "react";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { useAuth } from "../context/AuthContext";

// Shown above every page until the email is verified.
export default function VerifyBanner() {
  const { user, verifyEmail } = useAuth();
  const [sent, setSent] = useState(false);
  if (!user || user.emailVerified) return null;
  return (
    <div className="verify-banner">
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <MailOutlinedIcon fontSize="small" />
        <span>Verify your email to send booking requests. We sent a link to <strong>{user.email}</strong>.</span>
      </span>
      <span style={{ display: "inline-flex", gap: 16 }}>
        <button type="button" className="link-button" onClick={() => setSent(true)}>{sent ? "Email sent" : "Resend email"}</button>
        <button type="button" className="link-button" onClick={verifyEmail} title="Demo only: pretends the link was clicked">I verified it (demo)</button>
      </span>
    </div>
  );
}
