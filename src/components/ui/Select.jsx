import ReactSelect from 'react-select';

export default function Select({ label, error, required, options = [], className = "", placeholder = "Select...", value, onChange, ...props }) {
  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-theme">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <ReactSelect
        value={selectedOption}
        onChange={(selected) => onChange(selected ? selected.value : '')}
        options={options}
        placeholder={placeholder}
        className={className}
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: error ? '#f87171' : state.isFocused ? 'var(--color-primary)' : '#e5e7eb',
            boxShadow: state.isFocused ? `0 0 0 1px ${error ? '#ef4444' : 'var(--color-primary)'}` : 'none',
            '&:hover': {
              borderColor: error ? '#ef4444' : 'var(--color-primary)'
            },
            borderRadius: '0.5rem',
            backgroundColor: 'transparent',
          }),
          menu: (base) => ({
            ...base,
            zIndex: 50,
            backgroundColor: 'white',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected 
              ? 'var(--color-primary)' 
              : state.isFocused 
                ? '#f3f4f6' 
                : 'transparent',
            color: state.isSelected ? 'white' : '#1f2937',
            cursor: 'pointer',
            '&:active': {
              backgroundColor: 'var(--color-primary)'
            }
          }),
          singleValue: (base) => ({
            ...base,
            color: '#1f2937',
          })
        }}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}