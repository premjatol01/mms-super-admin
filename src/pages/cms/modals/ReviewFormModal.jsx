import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import ModalShell from "../components/ModalShell.jsx";

const inputClass =
  "w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-theme outline-none focus:border-primary";
const labelClass = "mb-1.5 block text-sm font-medium text-theme";

const empty = { reviewer: "", content: "", rating: 5, status: "draft" };

export default function ReviewFormModal({ open, review, onRequestClose, onSave }) {
  const [form, setForm] = useState(empty);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(review ? { ...empty, ...review } : empty);
      setDirty(false);
    }
  }, [open, review]);

  if (!open) return null;

  const update = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const isValid = form.reviewer.trim() && form.content.trim();

  return (
    <ModalShell
      open={open}
      title={review ? "Edit review" : "Add review"}
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
        <div>
          <label className={labelClass}>Reviewer name *</label>
          <input
            className={inputClass}
            value={form.reviewer}
            onChange={(e) => update({ reviewer: e.target.value })}
            placeholder="Aisha Khan"
          />
        </div>

        <div>
          <label className={labelClass}>Review content *</label>
          <textarea
            rows={3}
            className={inputClass}
            value={form.content}
            onChange={(e) => update({ content: e.target.value })}
          />
        </div>

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
      </div>
    </ModalShell>
  );
}
