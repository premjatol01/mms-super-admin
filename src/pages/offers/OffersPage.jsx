import { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'sonner';

import OffersHeader from './components/OffersHeader';
import OfferSummaryCards from './components/OfferSummaryCards';
import OfferModuleControl from './components/OfferModuleControl';
import SearchFilters from './components/SearchFilters';
import OfferFeatureTable from './components/OfferFeatureTable';
import OfferFeatureCard from './components/OfferFeatureCard';
import UnsavedChangesBar from './components/UnsavedChangesBar';
import LoadingState from './components/states/LoadingState';
import EmptyState from './components/states/EmptyState';
import SearchEmptyState from './components/states/SearchEmptyState';
import ErrorState from './components/states/ErrorState';

import ConfirmationModal from './modals/ConfirmationModal';
import UnsavedChangesModal from './modals/UnsavedChangesModal';
import OfferFeatureDetailsModal from './modals/OfferFeatureDetailsModal';
import OfferFeatureFormModal from './modals/OfferFeatureFormModal';
import PackageUsageModal from './modals/PackageUsageModal';

import { fetchOffersData } from './data/offersData';

export default function OffersPage() {
  // --- data / load state ---------------------------------------------------
  const [loadStatus, setLoadStatus] = useState('loading'); // loading | error | ready
  const [offerModuleEnabled, setOfferModuleEnabled] = useState(true);
  const [features, setFeatures] = useState([]);

  // Snapshot used to know whether there are unsaved toggle changes, and to
  // revert to on "Discard".
  const [savedSnapshot, setSavedSnapshot] = useState(null);

  // --- filters ---------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [packageUsageFilter, setPackageUsageFilter] = useState('all');

  // --- modal state -------------------------------------------------------
  const [confirmation, setConfirmation] = useState(null); // { title, message, confirmLabel, tone, onConfirm }
  const [viewingFeature, setViewingFeature] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);
  const [packageUsageFeature, setPackageUsageFeature] = useState(null);
  // Drives UnsavedChangesModal. Wire this to true from a router navigation
  // guard (e.g. react-router's useBlocker) when `isDirty` is true and the
  // admin tries to leave the page; the in-tab beforeunload handler below
  // already covers closing/reloading the tab.
  const [pendingNavAway, setPendingNavAway] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(() => {
    setLoadStatus('loading');
    fetchOffersData()
      .then(({ offerModuleEnabled: moduleEnabled, features: loadedFeatures }) => {
        setOfferModuleEnabled(moduleEnabled);
        setFeatures(loadedFeatures);
        setSavedSnapshot({ offerModuleEnabled: moduleEnabled, features: loadedFeatures });
        setLoadStatus('ready');
      })
      .catch(() => setLoadStatus('error'));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOffersData()
      .then(({ offerModuleEnabled: moduleEnabled, features: loadedFeatures }) => {
        setOfferModuleEnabled(moduleEnabled);
        setFeatures(loadedFeatures);
        setSavedSnapshot({ offerModuleEnabled: moduleEnabled, features: loadedFeatures });
      })
      .finally(() => setIsRefreshing(false));
  };

  // --- derived: is there a pending, unsaved toggle change? ------------------
  const isDirty =
    savedSnapshot &&
    (savedSnapshot.offerModuleEnabled !== offerModuleEnabled ||
      savedSnapshot.features.some((f) => {
        const current = features.find((cf) => cf.id === f.id);
        return current && current.status !== f.status;
      }));

  // Warn on browser tab close/reload if there are unsaved changes.
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

  // --- summary counts --------------------------------------------------
  const enabledCount = features.filter((f) => f.status === 'Enabled').length;
  const disabledCount = features.length - enabledCount;

  // --- filtering ---------------------------------------------------------
  const filteredFeatures = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return features
      .filter((f) => {
        if (!term) return true;
        return (
          f.name.toLowerCase().includes(term) ||
          f.key.toLowerCase().includes(term) ||
          f.description.toLowerCase().includes(term) ||
          f.type.toLowerCase().includes(term)
        );
      })
      .filter((f) => statusFilter === 'all' || f.status === statusFilter)
      .filter((f) => typeFilter === 'all' || f.type === typeFilter)
      .filter((f) => {
        if (packageUsageFilter === 'all') return true;
        if (packageUsageFilter === 'used') return f.packages.length > 0;
        return f.packages.length === 0;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [features, searchTerm, statusFilter, typeFilter, packageUsageFilter]);

  const hasActiveFilters =
    searchTerm.trim() !== '' || statusFilter !== 'all' || typeFilter !== 'all' || packageUsageFilter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setPackageUsageFilter('all');
  };

  // --- toggle module ------------------------------------------------------
  const requestToggleModule = () => {
    const willEnable = !offerModuleEnabled;
    setConfirmation({
      title: willEnable ? 'Enable Offer Module?' : 'Disable Offer Module?',
      message: willEnable
        ? 'Restaurants will be able to access offer functionality included in their subscription package.'
        : 'Disabling this module may make offer functionality unavailable to eligible restaurants.',
      confirmLabel: willEnable ? 'Enable' : 'Disable',
      tone: willEnable ? 'enable' : 'disable',
      onConfirm: () => {
        setOfferModuleEnabled(willEnable);
        setConfirmation(null);
      },
    });
  };

  // --- toggle individual feature ------------------------------------------
  const requestToggleFeature = (feature) => {
    const willEnable = feature.status === 'Disabled';
    setConfirmation({
      title: willEnable ? `Enable ${feature.name}?` : `Disable ${feature.name}?`,
      message: willEnable
        ? 'This feature will become available through eligible subscription packages.'
        : 'This feature may become unavailable for restaurants whose subscription package includes this functionality.',
      confirmLabel: willEnable ? 'Enable' : 'Disable',
      tone: willEnable ? 'enable' : 'disable',
      onConfirm: () => {
        setFeatures((prev) =>
          prev.map((f) => (f.id === feature.id ? { ...f, status: willEnable ? 'Enabled' : 'Disabled' } : f))
        );
        setConfirmation(null);
      },
    });
  };

  // --- save / discard pending toggle changes ------------------------------
  const handleSaveChanges = () => {
    const moduleChanged = savedSnapshot.offerModuleEnabled !== offerModuleEnabled;
    setSavedSnapshot({ offerModuleEnabled, features });
    toast.success(moduleChanged ? 'Offer module availability updated successfully.' : 'Offer feature updated successfully.');
  };

  const handleDiscardChanges = () => {
    setOfferModuleEnabled(savedSnapshot.offerModuleEnabled);
    setFeatures(savedSnapshot.features);
  };

  // --- edit feature metadata ------------------------------------------------
  const handleSaveFeatureForm = (featureId, values) => {
    setFeatures((prev) => {
      const next = prev.map((f) => (f.id === featureId ? { ...f, ...values, updatedAt: new Date().toISOString() } : f));
      setSavedSnapshot((snap) => ({ ...snap, features: next }));
      return next;
    });
    setEditingFeature(null);
    toast.success('Offer feature updated successfully.');
  };

  // --- render --------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <OffersHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onViewFeatureUsage={() => {
          const first = features[0];
          if (first) setPackageUsageFeature(first);
        }}
      />

      {loadStatus === 'loading' && <LoadingState />}

      {loadStatus === 'error' && <ErrorState onRetry={loadData} />}

      {loadStatus === 'ready' && (
        <>
          <OfferSummaryCards
            offerModuleEnabled={offerModuleEnabled}
            totalTypes={features.length}
            enabledCount={enabledCount}
            disabledCount={disabledCount}
          />

          <OfferModuleControl enabled={offerModuleEnabled} onToggle={requestToggleModule} />

          {features.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              <SearchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
                packageUsageFilter={packageUsageFilter}
                onPackageUsageFilterChange={setPackageUsageFilter}
              />

              {filteredFeatures.length === 0 ? (
                <SearchEmptyState onClearFilters={clearFilters} />
              ) : (
                <>
                  <OfferFeatureTable
                    features={filteredFeatures}
                    onView={setViewingFeature}
                    onEdit={setEditingFeature}
                    onTogglePackageUsage={setPackageUsageFeature}
                    onToggleStatus={requestToggleFeature}
                  />

                  <div className="md:hidden space-y-3">
                    {filteredFeatures.map((feature) => (
                      <OfferFeatureCard
                        key={feature.id}
                        feature={feature}
                        onView={setViewingFeature}
                        onEdit={setEditingFeature}
                        onTogglePackageUsage={setPackageUsageFeature}
                        onToggleStatus={requestToggleFeature}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

        </>
      )}

      {isDirty && <UnsavedChangesBar onSave={handleSaveChanges} onDiscard={handleDiscardChanges} />}

      <ConfirmationModal
        confirmation={confirmation}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => confirmation?.onConfirm()}
      />

      <UnsavedChangesModal
        open={pendingNavAway}
        onStay={() => setPendingNavAway(false)}
        onDiscard={() => {
          handleDiscardChanges();
          setPendingNavAway(false);
        }}
      />

      <OfferFeatureDetailsModal feature={viewingFeature} onClose={() => setViewingFeature(null)} />

      <OfferFeatureFormModal
        feature={editingFeature}
        onClose={() => setEditingFeature(null)}
        onSave={handleSaveFeatureForm}
      />

      <PackageUsageModal feature={packageUsageFeature} onClose={() => setPackageUsageFeature(null)} />
    </div>
  );
}
