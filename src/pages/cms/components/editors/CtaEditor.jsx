import { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";

export default function CtaEditor({ section, onSave, onCancel, saving }) {
  const [content, setContent] = useState({
    title: section.content?.title || "",
    description: section.content?.description || "",
    buttonText: section.content?.buttonText || "",
    buttonLink: section.content?.buttonLink || "",
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
          <h3 className="text-lg font-semibold text-theme">Edit Call to Action Banner</h3>
          <p className="text-xs text-secondary">Bottom banner encouraging restaurants to onboard and try Tablly.</p>
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

      <Input
        label="CTA Title / Headline"
        value={content.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="e.g. Ready to Supercharge Your Restaurant?"
        required
      />

      <Textarea
        label="CTA Description"
        rows={2}
        value={content.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Join hundreds of dining spots already using Tablly to delight guests and grow revenue."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-theme">
        <Input
          label="Button Text"
          value={content.buttonText}
          onChange={(e) => handleChange("buttonText", e.target.value)}
          placeholder="e.g. Get Started Today"
          required
        />
        <Input
          label="Button Link / URL"
          value={content.buttonLink}
          onChange={(e) => handleChange("buttonLink", e.target.value)}
          placeholder="e.g. /login or /signup"
          required
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
