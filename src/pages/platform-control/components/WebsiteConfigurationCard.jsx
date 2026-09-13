import SectionCard from './SectionCard';
import ToggleField from './ToggleField';

export default function WebsiteConfigurationCard({ values, setValue, editing }) {
  return (
    <SectionCard
      title="Website Configuration"
      description="Platform-level website availability. Restaurant-specific website content is managed by the Restaurant Admin."
    >
      <ToggleField
        label="Platform Website"
        description="Turns the platform's own public website on or off."
        checked={values.platformWebsiteEnabled}
        onChange={(next) => setValue('platformWebsiteEnabled', next, { shouldDirty: true })}
        editing={editing}
      />
      <ToggleField
        label="Restaurant Website Platform Availability"
        description="Controls whether restaurant websites are available across the platform, not their content."
        checked={values.restaurantWebsiteAvailability}
        onChange={(next) => setValue('restaurantWebsiteAvailability', next, { shouldDirty: true })}
        editing={editing}
      />
    </SectionCard>
  );
}
