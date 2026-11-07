import { useMemo, useEffect } from "react";
import { usePackagesStore } from "../../store/packagesStore";
import PackageFilters from "./components/PackageFilters";
import PackageTable from "./components/PackageTable";
import Pagination from "../restaurants/components/Pagination";
import PackageDetailsDrawer from "./modals/PackageDetailsDrawer";
import ConfirmModal from "./modals/ConfirmModal";

export default function PackagesPage() {
  const {
    packages,
    loading,
    filters,
    setFilter,
    setFilters,
    resetFilters,
    pagination,
    setPage,
    setLimit,
    openDetails,
    showConfirm,
    getFilteredPackages,
    fetchPackages,
  } = usePackagesStore();

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const filteredPackages = useMemo(() => getFilteredPackages(), [filters, getFilteredPackages, packages]);
  
  const paginatedPackages = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    return filteredPackages.slice(start, start + pagination.limit);
  }, [filteredPackages, pagination]);

  const handleFilterChange = (key, value) => {
    setFilter(key, value);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleViewDetails = (pkg) => {
    openDetails(pkg);
  };

  const handleToggleStatus = (pkg) => {
    showConfirm("toggleStatus", pkg);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Search & Filters */}
      <div className="flex-none mb-4">
        <PackageFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={setFilters}
          onResetFilters={handleResetFilters}
          packageCount={filteredPackages.length}
        />
      </div>

      {/* Table & Bottom Pinned Pagination Card */}
      <div className="flex-1 min-h-0 flex flex-col bg-surface border border-theme rounded-xl overflow-hidden shadow-sm">
        <PackageTable
          packages={paginatedPackages}
          loading={loading}
          onView={handleViewDetails}
          onToggleStatus={handleToggleStatus}
        />

        {/* Pinned Pagination at Bottom */}
        <Pagination
          pagination={pagination}
          totalItems={filteredPackages.length}
          onPageChange={setPage}
          onLimitChange={setLimit}
          itemName="packages"
        />
      </div>

      {/* Modals & Drawers */}
      <PackageDetailsDrawer />
      <ConfirmModal />
    </div>
  );
}
