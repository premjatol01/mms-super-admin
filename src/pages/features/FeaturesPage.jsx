import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { useFeatureStore } from "./data/useFeatureStore";

import FeatureHeader from "./components/FeatureHeader";
import FeatureSummaryCards from "./components/FeatureSummaryCards";
import FeatureFilters from "./components/FeatureFilters";
import FeatureTable from "./components/FeatureTable";
import FeatureCard from "./components/FeatureCard";
import Pagination from "./components/Pagination";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import { SummaryCardsSkeleton, TableSkeleton } from "./components/LoadingSkeleton";

import FeatureFormModal from "./modals/FeatureFormModal";
import FeatureDetailsModal from "./modals/FeatureDetailsModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import UnsavedChangesModal from "./modals/UnsavedChangesModal";

export default function FeaturesPage() {
  const features = useFeatureStore((s) => s.features);
  const loading = useFeatureStore((s) => s.loading);
  const loadError = useFeatureStore((s) => s.loadError);

  const search = useFeatureStore((s) => s.search);
  const categoryFilter = useFeatureStore((s) => s.categoryFilter);
  const statusFilter = useFeatureStore((s) => s.statusFilter);
  const sortBy = useFeatureStore((s) => s.sortBy);
  const sortDir = useFeatureStore((s) => s.sortDir);
  const page = useFeatureStore((s) => s.page);
  const pageSize = useFeatureStore((s) => s.pageSize);

  const fetchFeatures = useFeatureStore((s) => s.fetchFeatures);
  const setSearch = useFeatureStore((s) => s.setSearch);
  const setCategoryFilter = useFeatureStore((s) => s.setCategoryFilter);
  const setStatusFilter = useFeatureStore((s) => s.setStatusFilter);
  const setSort = useFeatureStore((s) => s.setSort);
  const setPage = useFeatureStore((s) => s.setPage);
  const setFeatureStatus = useFeatureStore((s) => s.setFeatureStatus);

  const openForm = useFeatureStore((s) => s.openForm);
  const openDetails = useFeatureStore((s) => s.openDetails);
  const openConfirm = useFeatureStore((s) => s.openConfirm);
  const closeConfirm = useFeatureStore((s) => s.closeConfirm);
  const confirmModal = useFeatureStore((s) => s.confirmModal);
  const formModal = useFeatureStore((s) => s.formModal);
  const detailsModal = useFeatureStore((s) => s.detailsModal);
  const showUnsavedModal = useFeatureStore((s) => s.showUnsavedModal);
  const closeUnsavedModal = useFeatureStore((s) => s.closeUnsavedModal);
  const pendingCloseAction = useFeatureStore((s) => s.pendingCloseAction);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = features.filter((f) => {
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.key.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "All" || f.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All" || f.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    const sorted = [...list].sort((a, b) => {
      let av = a[sortBy];
      let bv = b[sortBy];
      if (sortBy === "packages") {
        av = a.packages?.length || 0;
        bv = b.packages?.length || 0;
      }
      if (typeof av === "string") {
        return sortDir === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });

    return sorted;
  }, [features, search, categoryFilter, statusFilter, sortBy, sortDir]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleToggleStatus = (feature) => {
    const packageCount = feature.packages?.length || 0;
    if (feature.status === "Active") {
      openConfirm({
        title: "Deactivate Feature?",
        description:
          packageCount > 0
            ? `"${feature.name}" is currently used in ${packageCount} subscription package${
                packageCount > 1 ? "s" : ""
              }. Are you sure you want to deactivate it?`
            : `Are you sure you want to deactivate "${feature.name}"?`,
        confirmLabel: "Deactivate",
        tone: "danger",
        onConfirm: () => {
          setFeatureStatus(feature.id, "Inactive");
          toast.success("Feature deactivated successfully.");
          closeConfirm();
        },
      });
    } else {
      openConfirm({
        title: "Activate Feature?",
        description: `"${feature.name}" will become selectable for new subscription package configurations.`,
        confirmLabel: "Activate",
        onConfirm: () => {
          setFeatureStatus(feature.id, "Active");
          toast.success("Feature activated successfully.");
          closeConfirm();
        },
      });
    }
  };

  const hasAnyFeatures = features.length > 0;
  const hasFilteredResults = filtered.length > 0;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <FeatureHeader onAddFeature={() => openForm("create")} />

      <div className="mt-6 space-y-6">
        {loading ? (
          <SummaryCardsSkeleton />
        ) : loadError ? null : (
          <FeatureSummaryCards features={features} />
        )}

        {loadError ? (
          <ErrorState description={loadError} onRetry={fetchFeatures} />
        ) : loading ? (
          <TableSkeleton />
        ) : !hasAnyFeatures ? (
          <EmptyState onAddFeature={() => openForm("create")} />
        ) : (
          <>
            <FeatureFilters
              search={search}
              onSearchChange={setSearch}
              category={categoryFilter}
              onCategoryChange={setCategoryFilter}
              status={statusFilter}
              onStatusChange={setStatusFilter}
            />

            {!hasFilteredResults ? (
              <EmptyState variant="no-results" />
            ) : (
              <>
                <FeatureTable
                  features={paged}
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={setSort}
                  onView={openDetails}
                  onEdit={(f) => openForm("edit", f)}
                  onToggleStatus={handleToggleStatus}
                  onViewUsage={openDetails}
                />
                <div className="space-y-3 sm:hidden">
                  {paged.map((f) => (
                    <FeatureCard
                      key={f.id}
                      feature={f}
                      onView={openDetails}
                      onEdit={(feat) => openForm("edit", feat)}
                    />
                  ))}
                </div>

                <Pagination
                  page={page}
                  pageSize={pageSize}
                  total={filtered.length}
                  onPageChange={setPage}
                />
              </>
            )}
          </>
        )}
      </div>

      {formModal && <FeatureFormModal />}
      {detailsModal && <FeatureDetailsModal />}
      <ConfirmationModal config={confirmModal} onCancel={closeConfirm} />
      <UnsavedChangesModal
        open={showUnsavedModal}
        onStay={closeUnsavedModal}
        onLeave={() => {
          pendingCloseAction?.();
          closeUnsavedModal();
        }}
      />
    </div>
  );
}
