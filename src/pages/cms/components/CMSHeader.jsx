import { ExternalLink, RefreshCw } from "lucide-react";

export default function CMSHeader({ onPreviewWebsite, onRefresh, refreshing }) {
  return (
    <div className="flex flex-col gap-4 border-b border-theme pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-theme">CMS</h1>
        <p className="mt-1 text-sm text-secondary">
          Manage content and public-facing information for the platform website.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-lg border border-theme bg-surface px-3 py-2 text-sm font-medium text-theme transition hover:bg-black/[0.03]"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
        <button
          onClick={onPreviewWebsite}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          <ExternalLink className="h-4 w-4" />
          Preview website
        </button>
      </div>
    </div>
  );
}
