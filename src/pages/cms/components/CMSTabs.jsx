import { LayoutGrid, FileText, MessageSquareQuote, Star, ImageIcon, PanelsTopLeft } from "lucide-react";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "pages", label: "Pages", icon: FileText },
  { key: "static", label: "Static content", icon: PanelsTopLeft },
  { key: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "media", label: "Media", icon: ImageIcon },
];

export default function CMSTabs({ active, onChange }) {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-theme px-1">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${
              isActive
                ? "border-primary text-theme"
                : "border-transparent text-secondary hover:text-theme"
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
