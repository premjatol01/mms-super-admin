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
    <div className="space-y-5">
      {/* Search & Filters */}
      <PackageFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        packageCount={filteredPackages.length}
      />

      {/* Table */}
      <PackageTable
        packages={paginatedPackages}
        loading={loading}
        onView={handleViewDetails}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        totalItems={filteredPackages.length}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {/* Modals & Drawers (Add & Edit package modals removed as packages are static) */}
      <PackageDetailsDrawer />
      <ConfirmModal />
    </div>
  );
}
