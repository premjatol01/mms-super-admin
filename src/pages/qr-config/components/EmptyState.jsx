import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-theme bg-surface px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/40">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="font-medium text-theme">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-secondary">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
