import SectionCard from './SectionCard';
import TextField from './TextField';

export default function PlatformInformationCard({ register, errors, editing }) {
  return (
    <SectionCard title="Platform Information" description="General company and contact information for the platform.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          id="companyName"
          label="Company Name"
          editing={editing}
          error={errors.companyName?.message}
          {...register('companyName')}
        />
        <TextField
          id="supportEmail"
          label="Support Email"
          type="email"
          editing={editing}
          error={errors.supportEmail?.message}
          {...register('supportEmail')}
        />
        <TextField
          id="supportPhone"
          label="Support Phone"
          editing={editing}
          error={errors.supportPhone?.message}
          {...register('supportPhone')}
        />
        <TextField
          id="websiteUrl"
          label="Website URL"
          editing={editing}
          error={errors.websiteUrl?.message}
          {...register('websiteUrl')}
        />
      </div>

      <TextField
        id="address"
        label="Platform Address"
        textarea
        editing={editing}
        error={errors.address?.message}
        {...register('address')}
      />

      <TextField
        id="copyrightText"
        label="Copyright Text"
        editing={editing}
        error={errors.copyrightText?.message}
        {...register('copyrightText')}
      />
    </SectionCard>
  );
}
