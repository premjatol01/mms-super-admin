import { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";
import { Plus, Trash2 } from "lucide-react";

export default function FeaturesEditor({ section, onSave, onCancel, saving }) {
  const [title, setTitle] = useState(section.content?.title || "");
  const [subtitle, setSubtitle] = useState(section.content?.subtitle || "");
  const [featuresList, setFeaturesList] = useState(
    section.content?.featuresList && Array.isArray(section.content.featuresList)
      ? section.content.featuresList
      : []
  );

  const handleFeatureChange = (index, field, value) => {
    setFeaturesList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddFeature = () => {
    setFeaturesList((prev) => [
      ...prev,
      { title: "New Feature", description: "Brief description of the capability." },
    ]);
  };

  const handleRemoveFeature = (index) => {
    setFeaturesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      subtitle,
      featuresList,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between border-b border-theme pb-4">
        <div>
          <h3 className="text-lg font-semibold text-theme">Edit Platform Features</h3>
          <p className="text-xs text-secondary">Showcase the key tools and value props offered by Tablly.</p>
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
          label="Features Section Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Everything You Need to Run Front & Back of House"
          required
        />
        <Input
          label="Section Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="e.g. Designed to make every shift smoother"
        />
      </div>

      <div className="space-y-3 pt-2 border-t border-theme">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-theme">Features List</h4>
            <p className="text-xs text-secondary">Add or edit individual feature highlight cards.</p>
          </div>
          <Button type="button" size="sm" variant="secondary" onClick={handleAddFeature}>
            <Plus size={14} /> Add Feature
          </Button>
        </div>

        <div className="space-y-3">
          {featuresList.map((item, index) => (
            <div key={index} className="p-4 bg-primary-light/10 border border-theme rounded-xl space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Feature #{index + 1}</span>
                {featuresList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    title="Remove Feature"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <Input
                    label="Feature Title"
                    value={item.title || ""}
                    onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                    placeholder="e.g. Dynamic QR Menus"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    label="Description"
                    rows={2}
                    value={item.description || ""}
                    onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                    placeholder="Short description of this feature..."
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
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
