import {
  LayoutTemplate,
  Info,
  Layers,
  CreditCard,
  MessageSquare,
  Sparkles,
  PanelBottom,
  Edit,
} from "lucide-react";
import Toggle from "../../../components/ui/Toggle";
import Button from "../../../components/ui/Button";

const SECTION_ICONS = {
  hero: LayoutTemplate,
  about: Info,
  features: Layers,
  pricing: CreditCard,
  testimonials: MessageSquare,
  cta: Sparkles,
  footer: PanelBottom,
};

function getSectionMeta(section) {
  const c = section.content || {};
  switch (section.type) {
    case "hero":
      return c.heading ? `Headline: "${c.heading.substring(0, 32)}..."` : "No headline yet";
    case "about":
      return c.title ? `Title: "${c.title}"` : "About content";
    case "features":
      return `${c.featuresList?.length || 0} features configured`;
    case "pricing":
      return "Linked with subscription packages";
    case "testimonials":
      return `${c.testimonialsList?.length || 0} partner stories`;
    case "cta":
      return c.buttonText ? `CTA: "${c.buttonText}"` : "Call to action";
    case "footer":
      return c.supportEmail ? `Email: ${c.supportEmail}` : "Footer information";
    default:
      return "";
  }
}

export default function SectionCard({ section, onEdit, onToggle, toggling }) {
  const Icon = SECTION_ICONS[section.type] || Info;
  const meta = getSectionMeta(section);

  return (
    <div
      className={`border border-theme rounded-xl p-4 bg-surface transition-all ${
        section.enabled ? "hover:border-primary/50 shadow-sm" : "opacity-60 bg-surface/50"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="p-2.5 rounded-xl bg-primary-light/20 text-primary shrink-0 flex items-center justify-center">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-theme text-sm sm:text-base">{section.title}</h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                  section.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {section.enabled ? "Active" : "Hidden"}
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5 line-clamp-1">
              {section.description}
              {meta && <span className="text-theme font-medium"> &middot; {meta}</span>}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <Toggle
            checked={section.enabled}
            onChange={() => onToggle(section.sectionId)}
            disabled={toggling}
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(section)}
            className="flex items-center gap-1.5"
          >
            <Edit size={14} />
            <span>Edit Content</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
