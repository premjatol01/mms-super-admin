import { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";

export default function PricingEditor({ section, onSave, onCancel, saving }) {
  const [content, setContent] = useState({
    title: section.content?.title || "",
    subtitle: section.content?.subtitle || "",
    note: section.content?.note || "",
  });

  const handleChange = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(content);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between border-b border-theme pb-4">
        <div>
          <h3 className="text-lg font-semibold text-theme">Edit Pricing Section</h3>
          <p className="text-xs text-secondary">
            Header and descriptions for the pricing tiers (plans are dynamically linked from Sub. Packages).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Pricing Section Title"
          value={content.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g. Simple, Transparent Pricing"
          required
        />
        <Input
          label="Subtitle"
          value={content.subtitle}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          placeholder="e.g. Choose the plan that fits your restaurant stage"
        />
      </div>

      <Textarea
        label="Pricing Footnote / Guarantee Note"
        rows={2}
        value={content.note}
        onChange={(e) => handleChange("note", e.target.value)}
        placeholder="e.g. All plans include seamless QR ordering and 24/7 priority customer support."
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-theme">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
