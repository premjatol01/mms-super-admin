import { useEffect, useState } from "react";
import { Eye, Save } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

const inputClass =
  "w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-theme outline-none focus:border-primary";
const labelClass = "mb-1.5 block text-sm font-medium text-theme";

export default function StaticContentTab({ staticContent, onSave, onPreview }) {
  const [hero, setHero] = useState(staticContent.hero);
  const [general, setGeneral] = useState(staticContent.general);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setHero(staticContent.hero);
    setGeneral(staticContent.general);
    setDirty(false);
  }, [staticContent]);

  const updateHero = (patch) => {
    setHero((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const updateGeneral = (patch) => {
    setGeneral((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const handleSave = () => {
    onSave({ hero, general });
    setDirty(false);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-xl border border-theme bg-surface">
        <div className="flex items-center justify-between border-b border-theme px-4 py-3">
          <div>
            <h3 className="text-sm font-medium text-theme">Hero section</h3>
            <p className="text-xs text-secondary">The first thing visitors see on the homepage.</p>
          </div>
          <StatusBadge status={hero.status} />
        </div>
        <div className="space-y-4 px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Hero heading</label>
              <input
                className={inputClass}
                value={hero.heading}
                onChange={(e) => updateHero({ heading: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Hero subheading</label>
              <input
                className={inputClass}
                value={hero.subheading}
                onChange={(e) => updateHero({ subheading: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Hero description</label>
            <textarea
              rows={2}
              className={inputClass}
              value={hero.description}
              onChange={(e) => updateHero({ description: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Primary button text</label>
              <input
                className={inputClass}
                value={hero.primaryButtonText}
                onChange={(e) => updateHero({ primaryButtonText: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Primary button link</label>
              <input
                className={inputClass}
                value={hero.primaryButtonLink}
                onChange={(e) => updateHero({ primaryButtonLink: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Secondary button text</label>
              <input
                className={inputClass}
                value={hero.secondaryButtonText}
                onChange={(e) => updateHero({ secondaryButtonText: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Secondary button link</label>
              <input
                className={inputClass}
                value={hero.secondaryButtonLink}
                onChange={(e) => updateHero({ secondaryButtonLink: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Hero image URL</label>
            <input
              className={inputClass}
              value={hero.image}
              onChange={(e) => updateHero({ image: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="sm:w-48">
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={hero.status}
              onChange={(e) => updateHero({ status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* General static content */}
      <div className="rounded-xl border border-theme bg-surface">
        <div className="border-b border-theme px-4 py-3">
          <h3 className="text-sm font-medium text-theme">Static content</h3>
          <p className="text-xs text-secondary">
            Reusable text shown across the public website (footer, contact, legal notices).
          </p>
        </div>
        <div className="space-y-4 px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Footer text</label>
              <input
                className={inputClass}
                value={general.footerText}
                onChange={(e) => updateGeneral({ footerText: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Contact information</label>
              <input
                className={inputClass}
                value={general.contactInformation}
                onChange={(e) => updateGeneral({ contactInformation: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Platform address</label>
              <input
                className={inputClass}
                value={general.platformAddress}
                onChange={(e) => updateGeneral({ platformAddress: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Support information</label>
              <input
                className={inputClass}
                value={general.supportInformation}
                onChange={(e) => updateGeneral({ supportInformation: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Copyright text</label>
              <input
                className={inputClass}
                value={general.copyrightText}
                onChange={(e) => updateGeneral({ copyrightText: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Call-to-action text</label>
            <textarea
              rows={2}
              className={inputClass}
              value={general.ctaText}
              onChange={(e) => updateGeneral({ ctaText: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => onPreview({ hero, general })}
          className="inline-flex items-center gap-2 rounded-lg border border-theme px-3.5 py-2 text-sm font-medium text-theme hover:bg-black/[0.03]"
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>
        <button
          disabled={!dirty}
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
        >
          <Save className="h-4 w-4" />
          Save changes
        </button>
      </div>
    </div>
  );
}
