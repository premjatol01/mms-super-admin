import SectionCard from './SectionCard';
import SelectField from './SelectField';
import {
  CURRENCY_OPTIONS,
  TIMEZONE_OPTIONS,
  DATE_FORMAT_OPTIONS,
  TIME_FORMAT_OPTIONS,
} from '../data/platformControlData';

export default function SystemPreferencesCard({ register, editing }) {
  return (
    <SectionCard title="System Preferences" description="Default preferences applied across the platform.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField id="currency" label="Currency" editing={editing} options={CURRENCY_OPTIONS} {...register('currency')} />
        <SelectField id="timezone" label="Timezone" editing={editing} options={TIMEZONE_OPTIONS} {...register('timezone')} />
        <SelectField id="dateFormat" label="Date Format" editing={editing} options={DATE_FORMAT_OPTIONS} {...register('dateFormat')} />
        <SelectField id="timeFormat" label="Time Format" editing={editing} options={TIME_FORMAT_OPTIONS} {...register('timeFormat')} />
      </div>
    </SectionCard>
  );
}
