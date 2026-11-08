import { useState, useRef, useEffect } from "react";
import { Upload, Globe, X, Image as ImageIcon, Link as LinkIcon, RefreshCw, AlertCircle } from "lucide-react";
import Button from "./Button";

export default function ImageUploader({ value, onChange, label, hint }) {
  const [preview, setPreview] = useState(value || null);
  const [mode, setMode] = useState("file"); // "file" | "url"
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isImgError, setIsImgError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setPreview(value || null);
    setIsImgError(false);
    if (value && (value.startsWith("http://") || value.startsWith("https://"))) {
      setUrlInput(value);
    }
  }, [value]);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setIsImgError(false);
    setUrlError("");
    onChange?.(url, file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlError("Please enter an image URL");
      return;
    }
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      setUrlError("URL must start with http:// or https://");
      return;
    }

    setUrlError("");
    setIsImgError(false);
    setPreview(trimmed);
    onChange?.(trimmed, null);
  };

  const handleRemove = () => {
    setPreview(null);
    setUrlInput("");
    setUrlError("");
    setIsImgError(false);
    onChange?.(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-theme">{label}</label>
          {hint && <span className="text-xs text-secondary">{hint}</span>}
        </div>
      )}

      {!preview ? (
        <div className="space-y-3">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-lg p-1 bg-surface border border-theme max-w-xs">
            <button
              type="button"
              onClick={() => { setMode("file"); setUrlError(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                mode === "file"
                  ? "bg-primary text-white shadow-sm"
                  : "text-secondary hover:text-theme"
              }`}
            >
              <Upload size={13} />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => { setMode("url"); setUrlError(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                mode === "url"
                  ? "bg-primary text-white shadow-sm"
                  : "text-secondary hover:text-theme"
              }`}
            >
              <Globe size={13} />
              Internet URL
            </button>
          </div>

          {mode === "file" ? (
            /* File Upload Area */
            <div
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-theme rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary-light/10 transition-colors text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-primary-light/30 flex items-center justify-center text-primary mb-2 group-hover:scale-105 transition-transform">
                <Upload size={20} />
              </div>
              <p className="text-sm font-medium text-theme">Click or drag & drop to upload</p>
              <p className="text-xs text-secondary mt-0.5">JPG, PNG, WEBP up to 5MB</p>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
            </div>
          ) : (
            /* Internet URL Input Area */
            <div className="border border-theme rounded-xl p-4 bg-surface space-y-3">
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">Paste online image URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                      <LinkIcon size={14} />
                    </span>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyUrl(); } }}
                      placeholder="https://images.unsplash.com/... or https://..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-theme bg-surface text-theme placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <Button type="button" size="sm" onClick={handleApplyUrl}>
                    Apply
                  </Button>
                </div>
                {urlError && <p className="text-xs text-red-500 mt-1">{urlError}</p>}
                <p className="text-[11px] text-secondary mt-1.5">
                  Tip: Copy an image address from Google Images, Unsplash, or any image CDN.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview Box */
        <div className="relative rounded-xl overflow-hidden border border-theme bg-surface group">
          <div className="w-full h-44 bg-theme flex items-center justify-center overflow-hidden">
            {isImgError ? (
              <div className="flex flex-col items-center justify-center p-4 text-center text-secondary">
                <AlertCircle size={28} className="text-red-500 mb-1" />
                <p className="text-xs font-medium text-theme">Failed to load image preview</p>
                <p className="text-[11px] text-secondary">The image link may be invalid or restricted.</p>
              </div>
            ) : (
              <img
                src={preview}
                alt="Preview"
                onError={() => setIsImgError(true)}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Quick Info & Actions Toolbar */}
          <div className="p-2.5 bg-surface border-t border-theme flex items-center justify-between gap-2">
            <span className="text-xs text-secondary truncate max-w-[200px]" title={preview}>
              {preview.startsWith("blob:") ? "Local file selected" : preview.startsWith("data:") ? "Image loaded" : preview}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPreview(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="text-xs py-1 px-2.5 h-auto flex items-center gap-1"
              >
                <RefreshCw size={12} />
                Change
              </Button>
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={handleRemove}
                className="text-xs py-1 px-2.5 h-auto flex items-center gap-1"
              >
                <X size={12} />
                Remove
              </Button>
            </div>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
        </div>
      )}
    </div>
  );
}
