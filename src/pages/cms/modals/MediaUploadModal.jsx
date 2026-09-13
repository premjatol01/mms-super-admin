import { useRef, useState } from "react";
import { AlertCircle, UploadCloud } from "lucide-react";
import ModalShell from "../components/ModalShell.jsx";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

export default function MediaUploadModal({ open, onRequestClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | uploading | uploaded | failed
  const inputRef = useRef(null);

  if (!open) return null;

  const reset = () => {
    setFile(null);
    setPreviewUrl("");
    setError("");
    setStatus("idle");
  };

  const handleFile = (selected) => {
    if (!selected) return;
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Only JPG, PNG and WebP images are supported.");
      setStatus("failed");
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File exceeds the ${MAX_SIZE_MB}MB size limit.`);
      setStatus("failed");
      return;
    }
    setError("");
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setStatus("idle");
  };

  const simulateUpload = () => {
    if (!file) return;
    setStatus("uploading");
    setTimeout(() => {
      setStatus("uploaded");
      onUpload({
        id: `md-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        url: previewUrl,
      });
    }, 900);
  };

  return (
    <ModalShell
      open={open}
      title="Upload media"
      onClose={() => {
        reset();
        onRequestClose(false);
      }}
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              reset();
              onRequestClose(false);
            }}
            className="rounded-lg border border-theme px-3.5 py-2 text-sm font-medium text-theme hover:bg-black/[0.03]"
          >
            Cancel
          </button>
          <button
            disabled={!file || status === "uploading" || status === "uploaded"}
            onClick={simulateUpload}
            className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            {status === "uploading" ? "Uploading..." : "Upload"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-theme px-6 py-10 text-center hover:bg-black/[0.02]"
        >
          <UploadCloud className="h-6 w-6 text-secondary" />
          <span className="text-sm text-theme">Select a file to upload</span>
          <span className="text-xs text-secondary">JPG, PNG or WebP, up to {MAX_SIZE_MB}MB</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {file && !error && (
          <div className="flex items-center gap-3 rounded-lg border border-theme p-3">
            {previewUrl && (
              <img src={previewUrl} alt={file.name} className="h-14 w-14 rounded-md object-cover" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-theme">{file.name}</p>
              <p className="text-xs text-secondary">
                {file.type} · {(file.size / 1024).toFixed(0)} KB
              </p>
              {status === "uploading" && <p className="mt-1 text-xs text-primary">Uploading...</p>}
              {status === "uploaded" && <p className="mt-1 text-xs text-emerald-600">Uploaded</p>}
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
