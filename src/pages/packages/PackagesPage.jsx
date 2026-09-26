import { useMemo } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { usePackagesStore } from "../../store/packagesStore";
import Button from "../../components/ui/Button";
import PackageFilters from "./components/PackageFilters";
import PackageTable from "./components/PackageTable";
import Pagination from "../restaurants/components/Pagination";
import AddEditPackageModal from "./modals/AddEditPackageModal";
import PackageDetailsDrawer from "./modals/PackageDetailsDrawer";
import ConfirmModal from "./modals/ConfirmModal";

export default function PackagesPage() {
  const {
    filters,
    setFilter,
    resetFilters,
    pagination,
    setPage,
    setLimit,
    openAddModal,
    openDetails,
    openEditModal,
    showConfirm,
    getFilteredPackages,
  } = usePackagesStore();

  const filteredPackages = useMemo(() => getFilteredPackages(), [filters, getFilteredPackages]);
  
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

  const handleEditPackage = (pkg) => {
    openEditModal(pkg);
  };

  const handleToggleStatus = (pkg) => {
    showConfirm("toggleStatus", pkg);
  };

  // Calculate feature counts
  const featureCounts = useMemo(() => {
    const counts = {};
    filteredPackages.forEach(pkg => {
      counts[pkg.id] = pkg.features?.length || 0;
    });
    return counts;
  }, [filteredPackages]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3">
        <Button onClick={openAddModal}>
          <Plus size={16} /> Add Package
        </Button>
      </div>

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
        onView={handleViewDetails}
        onEdit={handleEditPackage}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        totalItems={filteredPackages.length}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {/* Modals */}
      <AddEditPackageModal />
      <PackageDetailsDrawer />
      <ConfirmModal />
    </div>
  );
}