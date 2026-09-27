import SectionCard from './SectionCard';
import TextField from './TextField';
import ImageUploader from './ImageUploader';
import SelectField from './SelectField';
import PlatformStatusBadge from './PlatformStatusBadge';
import { PLATFORM_STATUS_OPTIONS } from '../data/platformControlData';

export default function GeneralSettingsCard({ register, errors, editing, values, setValue }) {
  return (
    <SectionCard title="General Settings" description="Basic global configuration for the platform.">
      <TextField
        id="platformName"
        label="Platform Name"
        editing={editing}
        error={errors.platformName?.message}
        {...register('platformName')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ImageUploader
          label="Platform Logo"
          value={values.logoUrl ? (values.logoUrl.startsWith('http') || values.logoUrl.startsWith('blob:') ? values.logoUrl : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '')}${values.logoUrl}`) : ''}
          onChange={(url, file) => {
            setValue('logoUrl', url, { shouldDirty: true });
            if (file) setValue('logoFile', file, { shouldDirty: true });
          }}
          editing={editing}
          helpText="PNG, JPG or SVG, up to 2MB."
          shape="rect"
        />
        <ImageUploader
          label="Platform Favicon"
          value={values.faviconUrl ? (values.faviconUrl.startsWith('http') || values.faviconUrl.startsWith('blob:') ? values.faviconUrl : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '')}${values.faviconUrl}`) : ''}
          onChange={(url, file) => {
            setValue('faviconUrl', url, { shouldDirty: true });
            if (file) setValue('faviconFile', file, { shouldDirty: true });
          }}
          editing={editing}
          accept="image/png,image/x-icon,image/vnd.microsoft.icon"
          helpText="PNG or ICO, up to 2MB."
          shape="square"
        />
      </div>

      {editing ? (
        <SelectField
          id="platformStatus"
          label="Platform Status"
          editing={editing}
          options={PLATFORM_STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          {...register('platformStatus')}
        />
      ) : (
        <div>
          <p className="text-xs font-medium text-secondary">Platform Status</p>
          <div className="mt-1.5">
            <PlatformStatusBadge status={values.platformStatus} />
          </div>
        </div>
      )}
    </SectionCard>
  );
}
