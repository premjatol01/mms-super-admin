import { useRef, useState } from 'react';
import { UploadCloud, X, Loader2, ImageOff } from 'lucide-react';

const MAX_SIZE_MB = 2;

export default function ImageUploader({
  label,
  value,
  onChange,
  editing,
  accept = 'image/png,image/jpeg,image/svg+xml',
  helpText,
  shape = 'rect', // 'rect' for logo, 'square' for favicon
}) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    setError('');

    if (!accept.split(',').includes(file.type)) {
      setError('Unsupported file type.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setIsUploading(true);
    const previewUrl = URL.createObjectURL(file);

    // Simulated upload latency — swap for a real upload call.
    setTimeout(() => {
      onChange(previewUrl);
      setIsUploading(false);
    }, 500);
  };

  return (
    <div>
      <label className="text-xs font-medium text-secondary">{label}</label>

      <div className="mt-1 flex items-center gap-4">
        <div
          className={`flex items-center justify-center border border-theme bg-gray-50 overflow-hidden ${
            shape === 'square' ? 'h-14 w-14 rounded-lg' : 'h-14 w-28 rounded-lg'
          }`}
        >
          {isUploading ? (
            <Loader2 size={18} className="animate-spin text-secondary" />
          ) : value ? (
            <img src={value} alt={`${label} preview`} className="h-full w-full object-contain" />
          ) : (
            <ImageOff size={18} className="text-secondary" />
          )}
        </div>

        {editing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-theme px-3 py-1.5 text-xs font-medium text-theme hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <UploadCloud size={14} />
              {value ? 'Replace' : 'Upload'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-theme px-3 py-1.5 text-xs font-medium text-secondary hover:bg-gray-50 transition-colors"
              >
                <X size={14} />
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {helpText && !error && <p className="mt-1 text-xs text-secondary">{helpText}</p>}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
