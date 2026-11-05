import { NavLink } from "react-router-dom";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

const hostLinks = [
  { to: "/host", label: "Dashboard", icon: SpaceDashboardOutlinedIcon, end: true },
  { to: "/host/properties", label: "My Properties", icon: HomeOutlinedIcon },
  { to: "/host/bookings", label: "Booking Requests", icon: EventNoteOutlinedIcon },
  { to: "/host/reviews", label: "Reviews", icon: StarBorderIcon },
  { to: "/host/reports", label: "Reports", icon: AssessmentOutlinedIcon },
  { to: "/host/profile", label: "Host Profile", icon: PersonOutlinedIcon },
];

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: SpaceDashboardOutlinedIcon, end: true },
  { to: "/admin/users", label: "Users", icon: PeopleOutlinedIcon },
  { to: "/admin/hosts", label: "Hosts", icon: StorefrontOutlinedIcon },
  { to: "/admin/properties", label: "Properties", icon: HomeOutlinedIcon },
  { to: "/admin/bookings", label: "Reservations", icon: EventNoteOutlinedIcon },
  { to: "/admin/reviews", label: "Reviews", icon: StarBorderIcon },
  { to: "/admin/reports", label: "Reports", icon: AssessmentOutlinedIcon },
  { to: "/admin/settings", label: "Settings", icon: SettingsOutlinedIcon },
];

export default function Sidebar({ role }) {
  const items = role === "admin" ? adminLinks : hostLinks;
  return (
    <nav className="dash-sidebar" aria-label="Dashboard menu">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className="dash-link">
          <Icon fontSize="small" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
