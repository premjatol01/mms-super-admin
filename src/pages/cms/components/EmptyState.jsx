export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-theme px-6 py-14 text-center">
      {Icon && (
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-secondary-light text-theme">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <p className="text-sm font-medium text-theme">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-secondary">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
