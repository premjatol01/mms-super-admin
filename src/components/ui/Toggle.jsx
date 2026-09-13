export default function Toggle({ checked, onChange, label, description, disabled = false }) {
  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex flex-shrink-0 h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? "bg-primary" : "bg-[var(--color-border)]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  if (!label && !description) return toggle;

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {label && <p className="text-sm font-medium text-theme">{label}</p>}
        {description && <p className="text-xs text-secondary mt-0.5">{description}</p>}
      </div>
      {toggle}
    </div>
  );
}
