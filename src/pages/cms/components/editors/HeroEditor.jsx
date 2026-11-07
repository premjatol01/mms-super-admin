import { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";

export default function HeroEditor({ section, onSave, onCancel, saving }) {
  const [content, setContent] = useState({
    heading: section.content?.heading || "",
    subheading: section.content?.subheading || "",
    description: section.content?.description || "",
    primaryButtonText: section.content?.primaryButtonText || "",
    primaryButtonLink: section.content?.primaryButtonLink || "",
    secondaryButtonText: section.content?.secondaryButtonText || "",
    secondaryButtonLink: section.content?.secondaryButtonLink || "",
    imageUrl: section.content?.imageUrl || "",
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
          <h3 className="text-lg font-semibold text-theme">Edit Hero Banner</h3>
          <p className="text-xs text-secondary">First section visitors see on the public marketing landing page.</p>
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
          label="Hero Main Heading"
          value={content.heading}
          onChange={(e) => handleChange("heading", e.target.value)}
          placeholder="e.g. Manage Your Restaurant Smarter and Faster"
          required
        />
        <Input
          label="Subheading / Tagline"
          value={content.subheading}
          onChange={(e) => handleChange("subheading", e.target.value)}
          placeholder="e.g. All-in-one QR ordering, menu management, and kitchen sync"
        />
      </div>

      <Textarea
        label="Hero Description"
        rows={3}
        value={content.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Brief introduction explaining what Tablly provides..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-theme">
        <Input
          label="Primary Button Text"
          value={content.primaryButtonText}
          onChange={(e) => handleChange("primaryButtonText", e.target.value)}
          placeholder="e.g. Get Started Free"
        />
        <Input
          label="Primary Button Link / Action"
          value={content.primaryButtonLink}
          onChange={(e) => handleChange("primaryButtonLink", e.target.value)}
          placeholder="e.g. /login or https://..."
        />
        <Input
          label="Secondary Button Text"
          value={content.secondaryButtonText}
          onChange={(e) => handleChange("secondaryButtonText", e.target.value)}
          placeholder="e.g. Explore Demo"
        />
        <Input
          label="Secondary Button Link / Action"
          value={content.secondaryButtonLink}
          onChange={(e) => handleChange("secondaryButtonLink", e.target.value)}
          placeholder="e.g. #demo"
        />
      </div>

      <div className="pt-2 border-t border-theme">
        <Input
          label="Banner Image URL (Optional)"
          value={content.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          placeholder="https://example.com/banner.jpg"
        />
      </div>

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
