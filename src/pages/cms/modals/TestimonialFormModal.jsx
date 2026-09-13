import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import ModalShell from "../components/ModalShell.jsx";

const inputClass =
  "w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-theme outline-none focus:border-primary";
const labelClass = "mb-1.5 block text-sm font-medium text-theme";

const empty = { name: "", role: "", content: "", rating: 5, image: "", status: "draft" };

export default function TestimonialFormModal({ open, testimonial, onRequestClose, onSave }) {
  const [form, setForm] = useState(empty);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(testimonial ? { ...empty, ...testimonial } : empty);
      setDirty(false);
    }
  }, [open, testimonial]);

  if (!open) return null;

  const update = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const isValid = form.name.trim() && form.content.trim();

  return (
    <ModalShell
      open={open}
      title={testimonial ? "Edit testimonial" : "Add testimonial"}
      onClose={() => onRequestClose(dirty)}
      footer={
        <div className="flex justify-end gap-2">
          <button
            disabled={!isValid}
            onClick={() => onSave({ ...form, status: "draft" })}
            className="rounded-lg border border-theme px-3.5 py-2 text-sm font-medium text-theme hover:bg-black/[0.03] disabled:opacity-40"
          >
            Save draft
          </button>
          <button
            disabled={!isValid}
            onClick={() => onSave({ ...form, status: "published" })}
            className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            Publish
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className={labelClass}>Role / company</label>
            <input
              className={inputClass}
              value={form.role}
              onChange={(e) => update({ role: e.target.value })}
              placeholder="Founder, ABC Company"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Testimonial content *</label>
          <textarea
            rows={3}
            className={inputClass}
            value={form.content}
            onChange={(e) => update({ content: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => update({ rating: i + 1 })}>
                  <Star
                    className="h-5 w-5 text-amber-400"
                    fill={i < form.rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Profile image URL</label>
            <input
              className={inputClass}
              value={form.image}
              onChange={(e) => update({ image: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
