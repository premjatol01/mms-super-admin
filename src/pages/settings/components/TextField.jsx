export default function TextField({ label, error, editing, textarea, ...inputProps }) {
  const Component = textarea ? 'textarea' : 'input';

  return (
    <div>
      <label className="text-xs font-medium text-secondary" htmlFor={inputProps.id}>
        {label}
      </label>
      <Component
        {...inputProps}
        disabled={!editing}
        rows={textarea ? 3 : undefined}
        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 ${
          editing ? 'border-theme text-theme bg-surface' : 'border-theme text-secondary bg-gray-50'
        }`}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
