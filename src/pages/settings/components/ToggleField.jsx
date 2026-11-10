import ToggleSwitch from './ToggleSwitch';

export default function ToggleField({ label, description, checked, onChange, editing }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-theme px-3 py-2.5">
      <div>
        <p className="text-sm font-medium text-theme">{label}</p>
        {description && <p className="text-xs text-secondary mt-0.5">{description}</p>}
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} label={label} disabled={!editing} />
    </div>
  );
}
