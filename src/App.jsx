import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import PlaceholderPage from "./pages/PlaceholderPage";
import RestaurantsPage from "./pages/restaurants/RestaurantsPage";
import PackagesPage from "./pages/packages/PackagesPage";
import SubscriptionsPage from "./pages/subscriptions/SubscriptionsPage";
import LeadsPage from "./pages/leads/LeadsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<PlaceholderPage title="Dashboard" />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/new" element={<PlaceholderPage title="Create New Package" />} />
          <Route path="/features" element={<PlaceholderPage title="Feature Availability Management" />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/qr-config" element={<PlaceholderPage title="QR Code Configuration" />} />
          <Route path="/cms" element={<PlaceholderPage title="CMS" />} />
          <Route path="/platform-control" element={<PlaceholderPage title="Restaurant Website — Platform Control" />} />
          <Route path="/offers" element={<PlaceholderPage title="Offer — Subscription Control" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}