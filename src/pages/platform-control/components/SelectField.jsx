export default function SelectField({ label, options, editing, error, ...selectProps }) {
  return (
    <div>
      <label className="text-xs font-medium text-secondary" htmlFor={selectProps.id}>
        {label}
      </label>
      <select
        {...selectProps}
        disabled={!editing}
        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 ${
          editing ? 'border-theme text-theme bg-surface' : 'border-theme text-secondary bg-gray-50'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
