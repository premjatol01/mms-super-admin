import { Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

const ROUTE_TITLES = {
  "/": { title: "Dashboard", desc: "Overview of platform" },
  "/master-menu": { title: "Master Menu", desc: "Manage global menu items and categories" },
  "/restaurants": { title: "Restaurants", desc: "Manage all onboarded restaurants" },
  "/leads": { title: "Leads", desc: "Manage and track restaurant prospects" },
  "/packages": { title: "Subscription Packages", desc: "Manage available subscription tiers" },
  "/features": { title: "Feature Management", desc: "Configure features and limits" },
  "/subscriptions": { title: "Subscriptions", desc: "Track active restaurant subscriptions" },
  "/qr-config": { title: "QR Configuration", desc: "Global QR code settings" },
  "/cms": { title: "CMS", desc: "Content Management System" },
  "/platform-control": { title: "Platform Control", desc: "Global platform settings" },
  "/settings": { title: "Settings", desc: "System settings" },
  "/profile": { title: "Profile", desc: "Your super-admin profile" },
};

export default function Header() {
  const location = useLocation();
  const current = ROUTE_TITLES[location.pathname] || { title: "Super Admin Panel", desc: "" };

  return (
    <header className="h-16 bg-surface border-b border-theme flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-theme font-semibold text-lg leading-tight">{current.title}</h1>
        {current.desc && <p className="text-xs text-secondary">{current.desc}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-secondary hover:bg-primary-light hover:text-theme transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
