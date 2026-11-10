import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Sliders, Building2, Globe } from 'lucide-react';

import SettingsHeader from './components/SettingsHeader';
import GeneralSettingsCard from './components/GeneralSettingsCard';
import MaintenanceModeCard from './components/MaintenanceModeCard';
import PlatformInformationCard from './components/PlatformInformationCard';
import SystemPreferencesCard from './components/SystemPreferencesCard';
import WebsiteConfigurationCard from './components/WebsiteConfigurationCard';
import SaveChangesBar from './components/SaveChangesBar';
import LoadingState from './components/states/LoadingState';
import ErrorState from './components/states/ErrorState';

import ConfirmationModal from './modals/ConfirmationModal';
import UnsavedChangesModal from './modals/UnsavedChangesModal';

import {
  fetchPlatformSettings,
  savePlatformSettings,
  platformSettingsSchema,
} from './data/platformControlData';

const TABS = [
  { id: 'general', label: 'General & Status', icon: Sliders },
  { id: 'company', label: 'Company Information', icon: Building2 },
  { id: 'preferences', label: 'Preferences & Website', icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
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
      companyName: '',
      supportEmail: '',
      supportPhone: '',
      address: '',
      websiteUrl: '',
      copyrightText: '',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12 Hour',
      platformWebsiteEnabled: true,
      restaurantWebsiteAvailability: true,
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
        const logoChanged =
          saved.logoUrl !== savedSettings?.logoUrl ||
          saved.faviconUrl !== savedSettings?.faviconUrl;
        const statusChanged = saved.platformStatus !== savedSettings?.platformStatus;
        const maintenanceChanged =
          saved.maintenanceEnabled !== savedSettings?.maintenanceEnabled;

        setSavedSettings(saved);
        reset(saved);
        setConfirmation(null);

        if (maintenanceChanged) {
          if (saved.maintenanceEnabled) {
            toast.warning(
              'Platform is now in MAINTENANCE MODE. Visitors will see the maintenance notice.'
            );
          } else {
            toast.success(
              'Platform maintenance mode disabled. Services restored to normal.'
            );
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
        setSaveError(
          err.response?.data?.message ||
            err.message ||
            'Failed to update platform settings. Please try again.'
        );
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
      changes.push(
        'Maintenance mode will be activated. Visitors, public restaurant websites, and customer order portals will display the maintenance notice.'
      );
    }

    if (
      changes.length > 0 &&
      formValues.maintenanceEnabled &&
      !savedSettings?.maintenanceEnabled
    ) {
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
      <SettingsHeader
        platformStatus={values.platformStatus || savedSettings?.platformStatus || 'Active'}
      />

      {loadStatus === 'loading' && <LoadingState />}

      {loadStatus === 'error' && <ErrorState variant="load" onRetry={loadData} />}

      {loadStatus === 'ready' && savedSettings && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-theme pb-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === id
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-secondary hover:text-theme hover:bg-primary-light/20'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab 1: General & Status */}
          <div className={activeTab === 'general' ? 'space-y-6' : 'hidden'}>
            <GeneralSettingsCard
              register={register}
              errors={errors}
              editing={true}
              values={values}
              setValue={setValue}
            />
            <MaintenanceModeCard
              values={values}
              setValue={setValue}
              register={register}
              editing={true}
            />
          </div>

          {/* Tab 2: Company Information */}
          <div className={activeTab === 'company' ? 'space-y-6' : 'hidden'}>
            <PlatformInformationCard
              register={register}
              errors={errors}
              editing={true}
            />
          </div>

          {/* Tab 3: System Preferences & Website Configuration */}
          <div className={activeTab === 'preferences' ? 'space-y-6' : 'hidden'}>
            <SystemPreferencesCard register={register} editing={true} />
            <WebsiteConfigurationCard
              values={values}
              setValue={setValue}
              editing={true}
            />
          </div>

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
