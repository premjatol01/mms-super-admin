import { Circle } from 'lucide-react';

const TONES = {
  Active: { text: 'text-teal-800', bg: 'bg-secondary-light', border: 'border-teal-200', dot: 'fill-teal-600 text-teal-600' },
  Maintenance: { text: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'fill-amber-500 text-amber-500' },
  Disabled: { text: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200', dot: 'fill-gray-400 text-gray-400' },
};

export default function PlatformStatusBadge({ status }) {
  const tone = TONES[status] ?? TONES.Disabled;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tone.bg} ${tone.text} ${tone.border}`}>
      <Circle size={7} className={tone.dot} />
      {status}
    </span>
  );
}
