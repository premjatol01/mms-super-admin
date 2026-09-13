import { Power, Layers, CheckCircle2, XCircle } from 'lucide-react';

function SummaryCard({ icon: Icon, label, value, tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'bg-surface border-theme text-theme',
    positive: 'bg-secondary-light border-teal-200 text-teal-900',
    attention: 'bg-primary-light border-rose-200 text-rose-900',
  }[tone];

  return (
    <div className={`rounded-xl border p-4 flex items-center gap-3 ${toneClasses}`}>
      <div className="rounded-lg bg-white/60 p-2">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium opacity-70">{label}</p>
        <p className="text-lg font-semibold leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function OfferSummaryCards({ offerModuleEnabled, totalTypes, enabledCount, disabledCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <SummaryCard
        icon={Power}
        label="Offer Module"
        value={offerModuleEnabled ? 'Enabled' : 'Disabled'}
        tone={offerModuleEnabled ? 'positive' : 'neutral'}
      />
      <SummaryCard icon={Layers} label="Offer Types" value={totalTypes} tone="neutral" />
      <SummaryCard
        icon={CheckCircle2}
        label="Enabled Features"
        value={`${enabledCount} / ${totalTypes}`}
        tone="positive"
      />
      <SummaryCard
        icon={XCircle}
        label="Disabled Features"
        value={`${disabledCount} / ${totalTypes}`}
        tone={disabledCount > 0 ? 'attention' : 'neutral'}
      />
    </div>
  );
}
