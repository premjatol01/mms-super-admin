import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import PlaceholderPage from "./pages/PlaceholderPage";
import RestaurantsPage from "./pages/restaurants/RestaurantsPage";
import PackagesPage from "./pages/packages/PackagesPage";
import SubscriptionsPage from "./pages/subscriptions/SubscriptionsPage";
import LeadsPage from "./pages/leads/LeadsPage";
import QrConfig from "./pages/qr-config/QrConfig";
import FeaturesPage from "./pages/features/FeaturesPage";
import PlatformControlPage from "./pages/platform-control/PlatformControlPage";
import CmsPage from "./pages/cms/CmsPage";
import LoginPage from "./pages/auth/LoginPage";
import MasterMenuPage from "./pages/master-menu/MasterMenuPage";
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
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/packages/new" element={<PlaceholderPage title="Create New Package" />} />
            <Route path="/features" element={<FeaturesPage title="Feature Availability Management" />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/qr-config" element={<QrConfig title="QR Code Configuration" />} />
            <Route path="/cms" element={<CmsPage title="CMS" />} />
            <Route path="/platform-control" element={<PlatformControlPage title="Restaurant Website — Platform Control" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}