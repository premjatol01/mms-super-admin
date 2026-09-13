import { useMemo } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRestaurantsStore } from "../../store/restaurantsStore";
import Button from "../../components/ui/Button";
import SearchFilters from "./components/SearchFilters";
import RestaurantTable from "./components/RestaurantTable";
import Pagination from "./components/Pagination";
import AddEditRestaurantModal from "./modals/AddEditRestaurantModal";
import RestaurantDetailsDrawer from "./modals/RestaurantDetailsDrawer";
import ConfirmModal from "./modals/ConfirmModal";

export default function RestaurantsPage() {
  const {
    filters,
    setFilter,
    resetFilters,
    pagination,
    setPage,
    setLimit,
    selectedRestaurants,
    toggleSelectAll,
    toggleSelect,
    clearSelection,
    openAddModal,
    openDetails,
    openEditModal,
    showConfirm,
    getFilteredRestaurants,
  } = useRestaurantsStore();

  const filteredRestaurants = useMemo(() => getFilteredRestaurants(), [filters, getFilteredRestaurants]);
  
  const paginatedRestaurants = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    return filteredRestaurants.slice(start, start + pagination.limit);
  }, [filteredRestaurants, pagination]);

  const handleFilterChange = (key, value) => {
    setFilter(key, value);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleManageSubscription = (restaurant) => {
    toast.info("Managing subscription for " + restaurant.name);
    openDetails(restaurant);
  };

  const handleManageFeatures = (restaurant) => {
    toast.info("Managing features for " + restaurant.name);
    openDetails(restaurant);
  };

  const handleToggleStatus = (restaurant) => {
    showConfirm("toggleStatus", restaurant);
  };

  const handleBulkActivate = () => {
    toast.success(`Activating ${selectedRestaurants.length} restaurants`);
    clearSelection();
  };

  const handleBulkDeactivate = () => {
    toast.success(`Deactivating ${selectedRestaurants.length} restaurants`);
    clearSelection();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-theme">Restaurants</h1>
          <p className="text-sm text-secondary">Manage restaurants registered on the platform</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus size={16} /> Add Restaurant
        </Button>
      </div>

      {/* Search & Filters */}
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        restaurantCount={filteredRestaurants.length}
      />

      {/* Table */}
      <RestaurantTable
        restaurants={paginatedRestaurants}
        selectedRestaurants={selectedRestaurants}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onView={openDetails}
        onEdit={openEditModal}
        onToggleStatus={handleToggleStatus}
        onManageSubscription={handleManageSubscription}
        onManageFeatures={handleManageFeatures}
      />

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        totalItems={filteredRestaurants.length}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {/* Bulk Actions Bar */}
      {selectedRestaurants.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-theme rounded-xl px-6 py-3 shadow-xl flex items-center gap-4 z-40">
          <span className="text-sm text-theme font-medium">{selectedRestaurants.length} selected</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleBulkActivate}>
              Activate
            </Button>
            <Button variant="secondary" size="sm" onClick={handleBulkDeactivate}>
              Deactivate
            </Button>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddEditRestaurantModal />
      <RestaurantDetailsDrawer />
      <ConfirmModal />
    </div>
  );
}