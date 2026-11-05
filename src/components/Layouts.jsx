import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import VerifyBanner from "./VerifyBanner";
import { useAuth } from "../context/AuthContext";

// Public and guest pages: header, page, footer.
export function PublicLayout() {
  return (
    <div className="app-shell">
      <Header />
      <VerifyBanner />
      <main className="app-main"><Outlet /></main>
      <Footer />
    </div>
  );
}

// Host and admin pages: header and a left sidebar, no footer.
export function DashboardLayout() {
  const { user } = useAuth();
  return (
    <div className="app-shell">
      <Header />
      <VerifyBanner />
      <div className="dash-body">
        <Sidebar role={user.role} />
        <main className="dash-main"><Outlet /></main>
      </div>
    </div>
  );
}
