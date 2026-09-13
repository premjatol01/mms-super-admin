import SectionCard from './SectionCard';
import ToggleField from './ToggleField';
import TextField from './TextField';

export default function MaintenanceModeCard({ values, setValue, register, editing }) {
  return (
    <SectionCard
      title="Maintenance Mode"
      description="Temporarily make the platform unavailable to restaurants and customers."
    >
      <ToggleField
        label="Maintenance Mode"
        description="When on, the public interface shows the message below instead of the platform."
        checked={values.maintenanceEnabled}
        onChange={(next) => setValue('maintenanceEnabled', next, { shouldDirty: true })}
        editing={editing}
      />

      <TextField
        id="maintenanceMessage"
        label="Maintenance Message"
        textarea
        editing={editing}
        {...register('maintenanceMessage')}
      />
    </SectionCard>
  );
}
