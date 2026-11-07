import { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";
import Select from "../../../../components/ui/Select";
import { Plus, Trash2, Star } from "lucide-react";

export default function TestimonialsEditor({ section, onSave, onCancel, saving }) {
  const [title, setTitle] = useState(section.content?.title || "");
  const [subtitle, setSubtitle] = useState(section.content?.subtitle || "");
  const [testimonialsList, setTestimonialsList] = useState(
    section.content?.testimonialsList && Array.isArray(section.content.testimonialsList)
      ? section.content.testimonialsList
      : []
  );

  const handleItemChange = (index, field, value) => {
    setTestimonialsList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAdd = () => {
    setTestimonialsList((prev) => [
      ...prev,
      {
        name: "Restaurant Partner",
        role: "Owner / Manager",
        quote: "Tablly has transformed our table operations and made our guests very happy.",
        rating: 5,
      },
    ]);
  };

  const handleRemove = (index) => {
    setTestimonialsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      subtitle,
      testimonialsList,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between border-b border-theme pb-4">
        <div>
          <h3 className="text-lg font-semibold text-theme">Edit Customer Stories</h3>
          <p className="text-xs text-secondary">Manage testimonials and reviews from partner restaurants.</p>
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
          label="Testimonials Section Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Trusted by Hospitality Leaders"
          required
        />
        <Input
          label="Section Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="e.g. See what restaurant owners and managers have to say"
        />
      </div>

      <div className="space-y-3 pt-2 border-t border-theme">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-theme">Testimonials List</h4>
            <p className="text-xs text-secondary">Add or edit individual restaurant quotes.</p>
          </div>
          <Button type="button" size="sm" variant="secondary" onClick={handleAdd}>
            <Plus size={14} /> Add Testimonial
          </Button>
        </div>

        <div className="space-y-3">
          {testimonialsList.map((item, index) => (
            <div key={index} className="p-4 bg-primary-light/10 border border-theme rounded-xl space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-semibold text-primary">Story #{index + 1}</span>
                </div>
                {testimonialsList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    title="Remove Testimonial"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Author / Owner Name"
                  value={item.name || ""}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  placeholder="e.g. Rakesh Kumar"
                  required
                />
                <Input
                  label="Role / Restaurant"
                  value={item.role || ""}
                  onChange={(e) => handleItemChange(index, "role", e.target.value)}
                  placeholder="e.g. Owner, Urban Cafe"
                  required
                />
                <Select
                  label="Star Rating"
                  value={String(item.rating || 5)}
                  onChange={(v) => handleItemChange(index, "rating", Number(v))}
                  options={[
                    { value: "5", label: "5 Stars (★★★★★)" },
                    { value: "4", label: "4 Stars (★★★★☆)" },
                    { value: "3", label: "3 Stars (★★★☆☆)" },
                  ]}
                />
              </div>

              <Textarea
                label="Quote / Review Content"
                rows={2}
                value={item.quote || ""}
                onChange={(e) => handleItemChange(index, "quote", e.target.value)}
                placeholder="What did they say about Tablly?..."
                required
              />
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
