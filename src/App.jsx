import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import PlaceholderPage from "./pages/PlaceholderPage";
import RestaurantsPage from "./pages/restaurants/RestaurantsPage";
import PackagesPage from "./pages/packages/PackagesPage";
import SubscriptionsPage from "./pages/subscriptions/SubscriptionsPage";
import LeadsPage from "./pages/leads/LeadsPage";
import QRConfigPage from "./pages/qr-config/QRConfigPage";
import SettingsPage from "./pages/settings/SettingsPage";
import LoginPage from "./pages/auth/LoginPage";
import MasterMenuPage from "./pages/master-menu/MasterMenuPage";
import DesignRequestsPage from "./pages/design-requests/DesignRequestsPage";
import BizGrowthPage from "./pages/biz-growth/BizGrowthPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (Accessible only when NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes (Accessible only when logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<PlaceholderPage title="Dashboard" />} />
            <Route path="/master-menu" element={<MasterMenuPage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/biz-growth" element={<BizGrowthPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/design-requests" element={<DesignRequestsPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/packages/new" element={<PlaceholderPage title="Create New Package" />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/qr-config" element={<QRConfigPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/platform-control" element={<Navigate to="/settings" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
