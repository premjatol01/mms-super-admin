import { Loader2, RotateCcw, Save } from "lucide-react";

export default function ConfigurationSaveBar({
  visible,
  saving,
  onReset,
  onSave,
}) {
  if (!visible) return null;

  return (
    <div className="sticky bottom-4 z-10 mt-6 flex items-center justify-between gap-4 rounded-xl border border-theme bg-surface p-4 shadow-lg">
      <p className="text-sm text-secondary">
        You have unsaved QR configuration changes.
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={onReset}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-primary-light/20 disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Changes
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Configuration
        </button>
      </div>
    </div>
  );
}
