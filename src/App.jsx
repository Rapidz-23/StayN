import { Routes, Route } from "react-router-dom";
import { PublicLayout, DashboardLayout } from "./components/Layouts";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/public/Home";
import Explore from "./pages/public/Explore";
import PropertyDetails from "./pages/public/PropertyDetails";
import About from "./pages/public/About";
import { Login, Register, ForgotPassword } from "./pages/public/AuthPages";
import { NotFound, NotAllowed } from "./pages/public/NotFound";
import Reservations from "./pages/guest/Reservations";
import ReservationDetails from "./pages/guest/ReservationDetails";
import Payment from "./pages/guest/Payment";
import Profile from "./pages/guest/Profile";
import Notifications from "./pages/guest/Notifications";
import BecomeHost from "./pages/guest/BecomeHost";
import HostDashboard from "./pages/host/HostDashboard";
import HostProperties from "./pages/host/HostProperties";
import PropertyForm from "./pages/host/PropertyForm";
import Availability from "./pages/host/Availability";
import HostBookings from "./pages/host/HostBookings";
import HostReviews from "./pages/host/HostReviews";
import HostProfile from "./pages/host/HostProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminHosts from "./pages/admin/AdminHosts";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";
import Reports from "./pages/shared/Reports";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/not-allowed" element={<NotAllowed />} />

        {/* Any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservations/:id" element={<ReservationDetails />} />
          <Route path="/reservations/:id/pay" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/become-host" element={<BecomeHost />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Host dashboard */}
      <Route element={<ProtectedRoute roles={["host"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/host/properties" element={<HostProperties />} />
          <Route path="/host/properties/new" element={<PropertyForm />} />
          <Route path="/host/properties/:id/edit" element={<PropertyForm />} />
          <Route path="/host/properties/:id/availability" element={<Availability />} />
          <Route path="/host/bookings" element={<HostBookings />} />
          <Route path="/host/reviews" element={<HostReviews />} />
          <Route path="/host/reports" element={<Reports scope="host" />} />
          <Route path="/host/profile" element={<HostProfile />} />
        </Route>
      </Route>

      {/* Admin dashboard */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/hosts" element={<AdminHosts />} />
          <Route path="/admin/properties" element={<AdminProperties />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/reports" element={<Reports scope="admin" />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
