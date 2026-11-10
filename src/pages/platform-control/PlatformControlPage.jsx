import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import PlatformControlHeader from './components/PlatformControlHeader';
import GeneralSettingsCard from './components/GeneralSettingsCard';
import MaintenanceModeCard from './components/MaintenanceModeCard';
import SaveChangesBar from './components/SaveChangesBar';
import LoadingState from './components/states/LoadingState';
import ErrorState from './components/states/ErrorState';

import ConfirmationModal from './modals/ConfirmationModal';
import UnsavedChangesModal from './modals/UnsavedChangesModal';

import { fetchPlatformSettings, savePlatformSettings, platformSettingsSchema } from './data/platformControlData';

export default function PlatformControlPage() {
  const [loadStatus, setLoadStatus] = useState('loading'); // loading | error | ready
  const [savedSettings, setSavedSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [pendingLeave, setPendingLeave] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: {
      platformName: 'Tablly',
      platformStatus: 'Active',
      maintenanceEnabled: false,
      maintenanceMessage: '',
      logoUrl: '',
      faviconUrl: '',
    },
  });

  const values = watch();

  const loadData = useCallback(() => {
    setLoadStatus('loading');
    fetchPlatformSettings()
      .then((data) => {
        setSavedSettings(data);
        reset(data);
        setLoadStatus('ready');
      })
      .catch(() => setLoadStatus('error'));
  }, [reset]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Warn on tab close/reload with unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const commitSave = (formValues) => {
    setIsSaving(true);
    setSaveError('');

    savePlatformSettings(formValues)
      .then((saved) => {
        const logoChanged = saved.logoUrl !== savedSettings?.logoUrl || saved.faviconUrl !== savedSettings?.faviconUrl;
        const statusChanged = saved.platformStatus !== savedSettings?.platformStatus;
        const maintenanceChanged = saved.maintenanceEnabled !== savedSettings?.maintenanceEnabled;

        setSavedSettings(saved);
        reset(saved);
        setConfirmation(null);

        if (maintenanceChanged) {
          if (saved.maintenanceEnabled) {
            toast.warning('Platform is now in MAINTENANCE MODE. Visitors will see the maintenance message.');
          } else {
            toast.success('Platform maintenance mode disabled. Services restored to normal.');
          }
        } else if (logoChanged) {
          toast.success('Platform logo updated successfully.');
        } else if (statusChanged) {
          toast.success(`Platform status updated to "${saved.platformStatus}".`);
        } else {
          toast.success('Platform settings saved successfully to database.');
        }
      })
      .catch((err) => {
        setSaveError(err.response?.data?.message || err.message || 'Failed to update platform settings. Please try again.');
        setConfirmation(null);
      })
      .finally(() => setIsSaving(false));
  };

  const onSubmit = (formValues) => {
    const changes = [];

    if (formValues.platformStatus !== savedSettings?.platformStatus) {
      changes.push(`Platform status will change to "${formValues.platformStatus}".`);
    }
    if (formValues.maintenanceEnabled && !savedSettings?.maintenanceEnabled) {
      changes.push('Maintenance mode will be activated. Visitors, public restaurant websites, and customer order portals will display the maintenance notice.');
    }

    if (changes.length > 0 && formValues.maintenanceEnabled && !savedSettings?.maintenanceEnabled) {
      setConfirmation({
        title: 'Activate Maintenance Mode?',
        message: changes.join(' '),
        confirmLabel: 'Turn On Maintenance',
        tone: 'disable',
        onConfirm: () => commitSave(formValues),
      });
      return;
    }

    commitSave(formValues);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <PlatformControlHeader platformStatus={values.platformStatus || savedSettings?.platformStatus || 'Active'} />

      {loadStatus === 'loading' && <LoadingState />}

      {loadStatus === 'error' && <ErrorState variant="load" onRetry={loadData} />}

      {loadStatus === 'ready' && savedSettings && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GeneralSettingsCard register={register} errors={errors} editing={true} values={values} setValue={setValue} />
          <MaintenanceModeCard values={values} setValue={setValue} register={register} editing={true} />

          {saveError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-800 dark:text-rose-300">
              {saveError}
            </div>
          )}

          <SaveChangesBar
            onCancel={() => reset(savedSettings)}
            onSave={handleSubmit(onSubmit)}
            isSaving={isSaving}
            isDirty={isDirty}
          />
        </form>
      )}

      <ConfirmationModal
        confirmation={confirmation}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => confirmation?.onConfirm()}
      />

      <UnsavedChangesModal
        open={pendingLeave}
        onStay={() => setPendingLeave(false)}
        onLeave={() => {
          reset(savedSettings);
          setPendingLeave(false);
        }}
      />
    </div>
  );
}
