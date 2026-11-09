import { useState, useEffect } from "react";
import { Youtube, FileText, Newspaper, Share2, Upload, Link as LinkIcon, Check, Sparkles } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

const RESOURCE_TYPES = [
  { id: "youtube", label: "YouTube Video", icon: Youtube, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/40 border-red-200" },
  { id: "blog", label: "Blog Post", icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200" },
  { id: "news", label: "News Link", icon: Newspaper, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200" },
  { id: "social", label: "Social Media", icon: Share2, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200" },
];

const CATEGORY_OPTIONS = [
  { value: "Marketing", label: "Marketing & Footfall" },
  { value: "Menu & Pricing", label: "Menu & Pricing" },
  { value: "Operations", label: "Operations & Kitchen" },
  { value: "Customer Retention", label: "Customer Retention" },
  { value: "Staff Management", label: "Staff & Service" },
  { value: "Cost Reduction", label: "Cost & Waste Reduction" },
  { value: "Technology", label: "Tech & Ordering" },
];

const PLATFORM_OPTIONS = [
  { value: "Instagram", label: "Instagram" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Twitter", label: "Twitter / X" },
  { value: "Facebook", label: "Facebook" },
  { value: "YouTube", label: "YouTube" },
];

const extractYoutubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function BizGrowthModal({ isOpen, onClose, initialData, onSave, saving }) {
  const isEditing = Boolean(initialData?._id || initialData?.id);

  const [type, setType] = useState("youtube");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Marketing");
  const [platform, setPlatform] = useState("Instagram");
  const [sourceName, setSourceName] = useState("");
  const [readTime, setReadTime] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || "youtube");
      setTitle(initialData.title || "");
      setUrl(initialData.url || "");
      setDescription(initialData.description || "");
      setCategory(initialData.category || "Marketing");
      setPlatform(initialData.platform || "Instagram");
      setSourceName(initialData.sourceName || "");
      setReadTime(initialData.readTime || "");
      setThumbnailUrl(initialData.thumbnail && !initialData.thumbnail.startsWith("/uploads") ? initialData.thumbnail : "");
      setThumbnailPreview(
        initialData.thumbnail
          ? initialData.thumbnail.startsWith("http")
            ? initialData.thumbnail
            : `http://localhost:5000${initialData.thumbnail}`
          : ""
      );
      setFeatured(Boolean(initialData.featured));
      setStatus(initialData.status || "active");
      setThumbnailFile(null);
    } else {
      setType("youtube");
      setTitle("");
      setUrl("");
      setDescription("");
      setCategory("Marketing");
      setPlatform("Instagram");
      setSourceName("Tablly Growth Lab");
      setReadTime("10 min video");
      setThumbnailUrl("");
      setThumbnailFile(null);
      setThumbnailPreview("");
      setFeatured(false);
      setStatus("active");
    }
  }, [initialData, isOpen]);

  // When type changes, adjust default readTime & source
  const handleTypeChange = (newType) => {
    setType(newType);
    if (!isEditing) {
      if (newType === "youtube") {
        setReadTime("10 min video");
        setSourceName("YouTube Masterclass");
      } else if (newType === "blog") {
        setReadTime("5 min read");
        setSourceName("Tablly Growth Lab");
      } else if (newType === "news") {
        setReadTime("3 min read");
        setSourceName("Industry News");
      } else if (newType === "social") {
        setReadTime("Social Post");
        setSourceName("Instagram");
      }
    }
  };

  // Auto-preview YouTube thumbnail when URL changes
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrl(val);
    if (type === "youtube" && !thumbnailFile && !thumbnailUrl) {
      const ytId = extractYoutubeId(val);
      if (ytId) {
        setThumbnailPreview(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setThumbnailUrl("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (thumbnailFile) {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("type", type);
      formData.append("url", url.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("platform", platform);
      formData.append("sourceName", sourceName.trim());
      formData.append("readTime", readTime.trim());
      formData.append("featured", featured);
      formData.append("status", status);
      formData.append("thumbnail", thumbnailFile);
      onSave(formData);
    } else {
      let finalThumb = thumbnailUrl.trim();
      if (!finalThumb && type === "youtube" && url) {
        const ytId = extractYoutubeId(url);
        if (ytId) finalThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
      onSave({
        title: title.trim(),
        type,
        url: url.trim(),
        description: description.trim(),
        category,
        platform,
        sourceName: sourceName.trim(),
        readTime: readTime.trim(),
        thumbnail: finalThumb || (initialData?.thumbnail || ""),
        featured,
        status,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Biz Growth Resource" : "Add Biz Growth Resource"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Resource Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
            Resource Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RESOURCE_TYPES.map((t) => {
              const Icon = t.icon;
              const active = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTypeChange(t.id)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-theme bg-surface hover:bg-surface-soft text-theme"
                  }`}
                >
                  <Icon size={16} className={active ? "text-white" : t.color} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <Input
          label="Resource Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 10 Proven Marketing Strategies to Fill Restaurant Tables"
          required
        />

        {/* Target URL */}
        <div className="space-y-1">
          <Input
            label={
              type === "youtube"
                ? "YouTube Video URL"
                : type === "social"
                ? "Social Media Post or Profile Link"
                : type === "news"
                ? "News Article Link"
                : "Blog / Article URL"
            }
            value={url}
            onChange={handleUrlChange}
            placeholder={
              type === "youtube"
                ? "https://www.youtube.com/watch?v=..."
                : type === "social"
                ? "https://instagram.com/p/..."
                : "https://example.com/article"
            }
          />
        </div>

        {/* Category & Platform / Read Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={setCategory}
            options={CATEGORY_OPTIONS}
          />

          {type === "social" ? (
            <Select
              label="Platform"
              value={platform}
              onChange={setPlatform}
              options={PLATFORM_OPTIONS}
            />
          ) : (
            <Input
              label="Duration / Read Time"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="e.g. 5 min read / 12 min video"
            />
          )}

          <Input
            label="Source / Channel Name"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="e.g. Tablly Insights, Forbes"
          />
        </div>

        {/* Thumbnail: URL or File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-theme">
            Thumbnail Image
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-1 w-full space-y-2">
              <Input
                value={thumbnailUrl}
                onChange={(e) => {
                  setThumbnailUrl(e.target.value);
                  setThumbnailPreview(e.target.value);
                  setThumbnailFile(null);
                }}
                placeholder="Paste image URL (or upload below)"
              />
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-theme text-xs font-semibold text-secondary hover:text-theme bg-surface hover:bg-surface-soft cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {thumbnailFile && (
                  <span className="text-xs text-primary font-medium truncate max-w-xs">
                    {thumbnailFile.name}
                  </span>
                )}
              </div>
            </div>

            {thumbnailPreview ? (
              <div className="w-28 h-20 rounded-xl overflow-hidden border border-theme bg-surface-soft shrink-0 relative">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-28 h-20 rounded-xl border border-dashed border-theme flex items-center justify-center text-secondary/40 text-xs shrink-0">
                No preview
              </div>
            )}
          </div>
        </div>

        {/* Short Summary */}
        <Textarea
          label="Short Summary / Key Takeaway"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Give restaurant owners a clear idea of what they will learn from this resource..."
          rows={3}
        />

        {/* Featured & Status Checkboxes */}
        <div className="pt-2 border-t border-theme flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm text-theme cursor-pointer select-none">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <span className="font-medium flex items-center gap-1">
              <Sparkles size={14} className="text-amber-500" />
              Feature on Hub Banner
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm text-theme cursor-pointer select-none">
            <span className="text-secondary text-xs">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-surface border border-theme rounded-lg px-2.5 py-1 text-xs text-theme focus:outline-none"
            >
              <option value="active">Active (Visible)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </select>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-theme flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !title.trim()}>
            {saving ? "Saving..." : isEditing ? "Update Resource" : "Create Resource"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
