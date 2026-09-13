import { Circle } from 'lucide-react';

/**
 * Small pill showing Enabled / Disabled, with a dot so status never relies on color alone.
 */
export default function StatusBadge({ status, size = 'md' }) {
  const isEnabled = status === 'Enabled';

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${sizeClasses} ${
        isEnabled
          ? 'bg-secondary-light text-teal-800 border-teal-200'
          : 'bg-gray-100 text-gray-600 border-gray-200'
      }`}
    >
      <Circle
        className={isEnabled ? 'fill-teal-600 text-teal-600' : 'fill-gray-400 text-gray-400'}
        size={7}
      />
      {status}
    </span>
  );
}
