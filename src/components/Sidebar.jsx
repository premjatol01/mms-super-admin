import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  ClipboardList,
  Package,
  ToggleLeft,
  CreditCard,
  QrCode,
  FileText,
  Globe,
  Tag,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Restaurants", icon: Store, path: "/restaurants" },
  { label: "Leads", icon: ClipboardList, path: "/leads" },
  { label: "Sub. Packages", icon: Package, path: "/packages" },
  { label: "Features", icon: ToggleLeft, path: "/features" },
  { label: "Subscriptions", icon: CreditCard, path: "/subscriptions" },
  { label: "QR Config", icon: QrCode, path: "/qr-config" },
  { label: "CMS", icon: FileText, path: "/cms" },
  { label: "Platform Control", icon: Globe, path: "/platform-control" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside
      className={`relative flex flex-col h-screen bg-surface border-r border-theme transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-theme overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-primary flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
          SA
        </div>
        {!collapsed && (
          <span className="font-semibold text-theme text-sm truncate">Super Admin</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-theme hover:bg-primary-light"
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Profile, Settings, Logout */}
      <div className={`border-t border-theme p-2 flex ${collapsed ? "flex-col items-center gap-1" : "flex-row items-center justify-around"}`}>
        <button
          onClick={() => navigate("/profile")}
          title="Profile"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-theme hover:bg-primary-light transition-colors"
        >
          <User size={18} />
        </button>

        <button
          onClick={() => navigate("/settings")}
          title="Settings"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-theme hover:bg-primary-light transition-colors"
        >
          <Settings size={18} />
        </button>

        <button
          onClick={() => navigate("/login")}
          title="Logout"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-secondary hover:bg-red-100 hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-surface border border-theme flex items-center justify-center text-secondary hover:text-theme transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
