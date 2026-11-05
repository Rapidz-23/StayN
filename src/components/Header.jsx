import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/about", label: "About" },
];

const initials = (name = "") => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function Header() {
  const { user, logout, homePath } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();
  const [navAnchor, setNavAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const unread = user ? notifications.filter((n) => n.userId === user.id && !n.read).length : 0;

  const profilePath = user?.role === "host" ? "/host/profile" : user?.role === "admin" ? null : "/profile";
  const homeLabel = user?.role === "guest" ? "My Reservations" : "Dashboard";

  const go = (path) => { setUserAnchor(null); navigate(path); };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-actions">
          <IconButton aria-label="Open menu" sx={{ display: { lg: "none" } }} onClick={(e) => setNavAnchor(e.currentTarget)}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={navAnchor} open={Boolean(navAnchor)} onClose={() => setNavAnchor(null)}>
            {links.map((l) => (
              <MenuItem key={l.to} component={Link} to={l.to} onClick={() => setNavAnchor(null)}>{l.label}</MenuItem>
            ))}
          </Menu>
          <Link to="/" className="site-logo">StayN</Link>
        </div>

        <nav className="site-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="site-actions">
          {!user ? (
            <>
              <Button component={Link} to="/login">Log in</Button>
              <Button component={Link} to="/register" variant="contained">Sign up</Button>
            </>
          ) : (
            <>
              <IconButton aria-label="Notifications" component={Link} to="/notifications">
                <Badge badgeContent={unread} color="secondary" sx={{ "& .MuiBadge-badge": { color: "#232323", fontWeight: 500 } }}>
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="Account menu" onClick={(e) => setUserAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "#E3F2EF", color: "primary.main", fontSize: 14, fontWeight: 500 }}>{initials(user.name)}</Avatar>
              </IconButton>
              <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={() => setUserAnchor(null)}>
                <MenuItem disabled sx={{ opacity: "1 !important", flexDirection: "column", alignItems: "flex-start" }}>
                  <strong style={{ fontWeight: 500 }}>{user.name}</strong>
                  <span style={{ fontSize: 13, color: "var(--muted)", textTransform: "capitalize" }}>{user.role}</span>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => go(homePath)}>{homeLabel}</MenuItem>
                {user.role === "host" && <MenuItem onClick={() => go("/reservations")}>My Reservations</MenuItem>}
                {profilePath && <MenuItem onClick={() => go(profilePath)}>Profile</MenuItem>}
                <MenuItem onClick={() => { setUserAnchor(null); navigate("/"); setTimeout(logout, 0); }}>Log out</MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
