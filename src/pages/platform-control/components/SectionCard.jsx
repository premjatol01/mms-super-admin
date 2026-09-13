export default function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-xl border border-theme bg-surface p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-theme">{title}</h2>
        {description && <p className="text-xs text-secondary mt-0.5">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
