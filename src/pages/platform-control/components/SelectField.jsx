import Select from '../../../components/ui/Select';

export default function SelectField({ label, options, editing, error, name, value, onChange, ...selectProps }) {
  return (
    <Select
      label={label}
      options={options}
      disabled={!editing}
      error={error}
      value={value}
      onChange={(val) => {
        if (typeof onChange === 'function') {
          onChange({ target: { name, value: val } });
        }
      }}
      name={name}
      {...selectProps}
    />
  );
}