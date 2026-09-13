import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, Plus, Trash2 } from "lucide-react";
import ModalShell from "../components/ModalShell.jsx";
import { blockTypes } from "../data/mockData.js";

const inputClass =
  "w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-theme outline-none focus:border-primary";
const labelClass = "mb-1.5 block text-sm font-medium text-theme";

const emptyPage = {
  name: "",
  slug: "",
  status: "draft",
  seoTitle: "",
  metaDescription: "",
  ogImage: "",
  blocks: [],
};

let blockCounter = 0;

export default function PageEditorModal({
  open,
  page,
  onClose,
  onRequestClose,
  onSave,
  onPreview,
}) {
  const [form, setForm] = useState(emptyPage);
  const [section, setSection] = useState("content");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(page ? { ...emptyPage, ...page } : emptyPage);
      setSection("content");
      setDirty(false);
    }
  }, [open, page]);

  if (!open) return null;

  const update = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const addBlock = (type) => {
    blockCounter += 1;
    update({
      blocks: [
        ...form.blocks,
        { id: `new-${Date.now()}-${blockCounter}`, type: type.toLowerCase().replace(" ", ""), content: "" },
      ],
    });
  };

  const updateBlock = (id, content) => {
    update({ blocks: form.blocks.map((b) => (b.id === id ? { ...b, content } : b)) });
  };

  const removeBlock = (id) => {
    update({ blocks: form.blocks.filter((b) => b.id !== id) });
  };

  const moveBlock = (index, direction) => {
    const next = [...form.blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ blocks: next });
  };

  const isValid = form.name.trim() && form.slug.trim();

  return (
    <ModalShell
      open={open}
      title={page ? `Edit ${page.name}` : "Create page"}
      onClose={() => onRequestClose(dirty)}
      wide
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => onPreview(form)}
            className="inline-flex items-center gap-2 rounded-lg border border-theme px-3.5 py-2 text-sm font-medium text-theme hover:bg-black/[0.03]"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <div className="flex gap-2">
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
        </div>
      }
    >
      <div className="mb-4 flex gap-1 border-b border-theme">
        {[
          { key: "content", label: "Basic info & content" },
          { key: "seo", label: "SEO" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition ${
              section === s.key
                ? "border-primary text-theme"
                : "border-transparent text-secondary hover:text-theme"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === "content" && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Page name *</label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="About Us"
              />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => update({ slug: e.target.value })}
                placeholder="/about"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className={labelClass + " mb-0"}>Content blocks</label>
              <div className="flex flex-wrap justify-end gap-1.5">
                {blockTypes.slice(0, 4).map((type) => (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className="inline-flex items-center gap-1 rounded-md border border-theme px-2 py-1 text-xs font-medium text-theme hover:bg-black/[0.03]"
                  >
                    <Plus className="h-3 w-3" />
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {form.blocks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-theme px-4 py-8 text-center text-sm text-secondary">
                No content blocks yet. Add a block to start building this page.
              </div>
            ) : (
              <div className="space-y-2">
                {form.blocks.map((block, index) => (
                  <div key={block.id} className="rounded-lg border border-theme p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-secondary-light px-2 py-0.5 text-xs font-medium capitalize text-theme">
                        {block.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveBlock(index, -1)}
                          disabled={index === 0}
                          className="rounded p-1 text-secondary hover:bg-black/[0.05] disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveBlock(index, 1)}
                          disabled={index === form.blocks.length - 1}
                          className="rounded p-1 text-secondary hover:bg-black/[0.05] disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeBlock(block.id)}
                          className="rounded p-1 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      rows={block.type === "paragraph" || block.type === "richtext" ? 3 : 1}
                      className={inputClass}
                      placeholder={`${block.type} content`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {section === "seo" && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>SEO title</label>
            <input
              className={inputClass}
              value={form.seoTitle}
              onChange={(e) => update({ seoTitle: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Meta description</label>
            <textarea
              rows={3}
              className={inputClass}
              value={form.metaDescription}
              onChange={(e) => update({ metaDescription: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>OG / social image URL</label>
            <input
              className={inputClass}
              value={form.ogImage}
              onChange={(e) => update({ ogImage: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      )}
    </ModalShell>
  );
}
