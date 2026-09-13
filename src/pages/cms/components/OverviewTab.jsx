import { FileText, CheckCircle2, PenLine, MessageSquareQuote, Star } from "lucide-react";
import CMSStatsCard from "./CMSStatsCard.jsx";
import { StatsSkeleton } from "./LoadingState.jsx";
import StatusBadge from "./StatusBadge.jsx";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function OverviewTab({ pages, testimonials, reviews, loading }) {
  if (loading) return <StatsSkeleton />;

  const published = pages.filter((p) => p.status === "published").length;
  const drafts = pages.filter((p) => p.status === "draft").length;

  const recentPages = [...pages]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <CMSStatsCard label="Total pages" value={pages.length} icon={FileText} />
        <CMSStatsCard label="Published" value={published} icon={CheckCircle2} tint="secondary" />
        <CMSStatsCard label="Drafts" value={drafts} icon={PenLine} />
        <CMSStatsCard
          label="Testimonials"
          value={testimonials.length}
          icon={MessageSquareQuote}
          tint="secondary"
        />
        <CMSStatsCard label="Platform reviews" value={reviews.length} icon={Star} />
      </div>

      <div className="rounded-xl border border-theme bg-surface">
        <div className="border-b border-theme px-4 py-3">
          <h3 className="text-sm font-medium text-theme">Recently updated pages</h3>
        </div>
        <div className="divide-y divide-theme">
          {recentPages.map((page) => (
            <div key={page.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-theme">{page.name}</p>
                <p className="truncate text-xs text-secondary">{page.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-secondary">{formatDate(page.updatedAt)}</span>
                <StatusBadge status={page.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
