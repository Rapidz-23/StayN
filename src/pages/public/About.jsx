import { Typography } from "@mui/material";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const reasons = [
  { icon: VerifiedUserOutlinedIcon, title: "Checked hosts and stays", text: "Every host and every stay is reviewed by the StayN team before it goes live." },
  { icon: PaymentsOutlinedIcon, title: "Clear prices", text: "You see the nightly rate, cleaning fee and service fee before you send a request." },
  { icon: FavoriteBorderIcon, title: "Local and warm", text: "Homes, cabins and resort stays from local hosts in four favorite destinations." },
];

export default function About() {
  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <Typography variant="h2" component="h1" sx={{ mb: 2 }}>About StayN</Typography>
      <Typography sx={{ mb: 4 }}>
        StayN (Stay and Nest) is a simple way to find and book stays in the Philippines. Guests search Tagaytay, Cebu, Palawan and Siargao, send a request, and pay with GCash once the host accepts. Hosts list their place and manage requests in one dashboard. StayN is a college project for IT 305W.
      </Typography>
      <Typography variant="h3" component="h2" sx={{ mb: 2 }}>Why choose StayN</Typography>
      <div className="row g-3 mb-4">
        {reasons.map(({ icon: Icon, title, text }) => (
          <div className="col-12 col-md-4" key={title}>
            <div className="panel" style={{ height: "100%" }}>
              <Icon sx={{ color: "primary.main" }} />
              <div style={{ fontWeight: 500, margin: "8px 0 4px" }}>{title}</div>
              <div style={{ color: "var(--muted)", fontSize: 15 }}>{text}</div>
            </div>
          </div>
        ))}
      </div>
      <Typography variant="h3" component="h2" sx={{ mb: 1 }}>Contact us</Typography>
      <Typography>Questions? Email <a href="mailto:hello@stayn.ph" style={{ color: "var(--primary)" }}>hello@stayn.ph</a>.</Typography>
    </div>
  );
}
