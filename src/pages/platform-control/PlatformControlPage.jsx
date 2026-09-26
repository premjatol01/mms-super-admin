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
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  // Drives UnsavedChangesModal. Wire this to true from a router navigation
  // guard (e.g. react-router's useBlocker) when the form is dirty and the
  // admin tries to leave the page; the in-tab beforeunload handler below
  // already covers closing/reloading the tab.
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
    defaultValues: {},
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

  // Warn on tab close/reload while mid-edit with unsaved changes.
  useEffect(() => {
    const handler = (e) => {
      if (isEditing && isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isEditing, isDirty]);

  const handleEdit = () => {
    setSaveError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset(savedSettings);
    setSaveError('');
    setIsEditing(false);
  };

  const commitSave = (formValues) => {
    setIsSaving(true);
    setSaveError('');

    savePlatformSettings(formValues)
      .then((saved) => {
        const logoChanged = saved.logoUrl !== savedSettings.logoUrl || saved.faviconUrl !== savedSettings.faviconUrl;
        const statusChanged = saved.platformStatus !== savedSettings.platformStatus;

        setSavedSettings(saved);
        reset(saved);
        setIsEditing(false);
        setConfirmation(null);

        if (logoChanged) {
          toast.success('Platform logo updated successfully.');
        } else if (statusChanged) {
          toast.success('Platform status updated successfully.');
        } else {
          toast.success('Platform configuration updated successfully.');
        }
      })
      .catch(() => {
        setSaveError('Failed to update platform configuration. Please try again.');
        setConfirmation(null);
      })
      .finally(() => setIsSaving(false));
  };

  const onSubmit = (formValues) => {
    const changes = [];

    if (formValues.platformStatus !== savedSettings.platformStatus) {
      changes.push(`Platform status will change to "${formValues.platformStatus}".`);
    }
    if (formValues.maintenanceEnabled && !savedSettings.maintenanceEnabled) {
      changes.push('Maintenance mode will be turned on, making the platform unavailable to visitors.');
    }
    if (!formValues.platformWebsiteEnabled && savedSettings.platformWebsiteEnabled) {
      changes.push('The platform website will be turned off.');
    }
    if (!formValues.restaurantWebsiteAvailability && savedSettings.restaurantWebsiteAvailability) {
      changes.push('Restaurant websites will become unavailable platform-wide.');
    }

    if (changes.length > 0) {
      const isRisky = changes.some((c) => !c.includes('Active'));
      setConfirmation({
        title: 'Confirm platform changes?',
        message: changes.join(' '),
        confirmLabel: 'Save changes',
        tone: isRisky ? 'disable' : 'enable',
        onConfirm: () => commitSave(formValues),
      });
      return;
    }

    commitSave(formValues);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <PlatformControlHeader editing={isEditing} onEdit={handleEdit} />

      {loadStatus === 'loading' && <LoadingState />}

      {loadStatus === 'error' && <ErrorState variant="load" onRetry={loadData} />}

      {loadStatus === 'ready' && savedSettings && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GeneralSettingsCard register={register} errors={errors} editing={isEditing} values={values} setValue={setValue} />
          <MaintenanceModeCard values={values} setValue={setValue} register={register} editing={isEditing} />

          {saveError && (
            <div className="rounded-lg border border-rose-200 bg-primary-light/30 px-4 py-3 text-sm text-rose-800">
              {saveError}
            </div>
          )}

          {isEditing && <SaveChangesBar onCancel={handleCancel} onSave={handleSubmit(onSubmit)} isSaving={isSaving} />}
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
          handleCancel();
          setPendingLeave(false);
        }}
      />
    </div>
  );
}
