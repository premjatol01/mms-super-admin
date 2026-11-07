import { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";

export default function AboutEditor({ section, onSave, onCancel, saving }) {
  const [content, setContent] = useState({
    title: section.content?.title || "",
    subtitle: section.content?.subtitle || "",
    description: section.content?.description || "",
    stat1Value: section.content?.stat1Value || "",
    stat1Label: section.content?.stat1Label || "",
    stat2Value: section.content?.stat2Value || "",
    stat2Label: section.content?.stat2Label || "",
    stat3Value: section.content?.stat3Value || "",
    stat3Label: section.content?.stat3Label || "",
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
          <h3 className="text-lg font-semibold text-theme">Edit About Tablly</h3>
          <p className="text-xs text-secondary">Platform background, vision, and core stats.</p>
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
          label="About Section Title"
          value={content.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g. Built for Modern Restaurateurs"
          required
        />
        <Input
          label="Section Subtitle"
          value={content.subtitle}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          placeholder="e.g. Empowering hospitality businesses of all sizes"
        />
      </div>

      <Textarea
        label="About Story / Description"
        rows={3}
        value={content.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Detailed explanation of the platform mission..."
      />

      <div className="pt-2 border-t border-theme">
        <h4 className="text-sm font-medium text-theme mb-3">Key Highlight Statistics</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2 p-3 bg-primary-light/10 border border-theme rounded-lg">
            <Input
              label="Stat 1 Value"
              value={content.stat1Value}
              onChange={(e) => handleChange("stat1Value", e.target.value)}
              placeholder="e.g. 500+"
            />
            <Input
              label="Stat 1 Label"
              value={content.stat1Label}
              onChange={(e) => handleChange("stat1Label", e.target.value)}
              placeholder="e.g. Restaurants Powered"
            />
          </div>

          <div className="space-y-2 p-3 bg-primary-light/10 border border-theme rounded-lg">
            <Input
              label="Stat 2 Value"
              value={content.stat2Value}
              onChange={(e) => handleChange("stat2Value", e.target.value)}
              placeholder="e.g. 2.5M+"
            />
            <Input
              label="Stat 2 Label"
              value={content.stat2Label}
              onChange={(e) => handleChange("stat2Label", e.target.value)}
              placeholder="e.g. Orders Processed"
            />
          </div>

          <div className="space-y-2 p-3 bg-primary-light/10 border border-theme rounded-lg">
            <Input
              label="Stat 3 Value"
              value={content.stat3Value}
              onChange={(e) => handleChange("stat3Value", e.target.value)}
              placeholder="e.g. 99.9%"
            />
            <Input
              label="Stat 3 Label"
              value={content.stat3Label}
              onChange={(e) => handleChange("stat3Label", e.target.value)}
              placeholder="e.g. Platform Uptime"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-theme">
        <Input
          label="About Section Image URL"
          value={content.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          placeholder="https://example.com/about.jpg"
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
