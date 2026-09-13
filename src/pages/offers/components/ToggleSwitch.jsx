export default function ToggleSwitch({ checked, onChange, label, size = 'md' }) {
  const dims = size === 'sm' ? { track: 'h-5 w-9', knob: 'h-3.5 w-3.5', translate: 'translate-x-4' } : { track: 'h-7 w-[52px]', knob: 'h-5 w-5', translate: 'translate-x-7' };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 ${dims.track} ${
        checked ? 'bg-teal-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block ${dims.knob} transform rounded-full bg-white shadow transition-transform ${
          checked ? dims.translate : 'translate-x-1'
        }`}
      />
    </button>
  );
}
