import { useEffect } from "react";
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
    restaurants,
    loading,
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
    fetchRestaurants,
    bulkUpdateStatus,
  } = useRestaurantsStore();

  useEffect(() => {
    fetchRestaurants();
  }, [filters, pagination.page, pagination.limit, fetchRestaurants]);

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

  const handleSendInvite = async (restaurant) => {
    try {
      toast.loading("Sending invitation...", { id: "invite" });
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/restaurants/${restaurant._id || restaurant.id}/send-invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Invitation sent to ${restaurant.admin?.email}`, { id: "invite" });
      } else {
        toast.error(data.message || 'Failed to send invite', { id: "invite" });
      }
    } catch (err) {
      toast.error('Network error', { id: "invite" });
    }
  };

  const handleBulkActivate = async () => {
    try {
      await bulkUpdateStatus(selectedRestaurants, 'active');
      toast.success(`Activated ${selectedRestaurants.length} restaurants`);
    } catch (err) {
      toast.error('Failed to activate restaurants');
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      await bulkUpdateStatus(selectedRestaurants, 'inactive');
      toast.success(`Deactivated ${selectedRestaurants.length} restaurants`);
    } catch (err) {
      toast.error('Failed to deactivate restaurants');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Search & Filters */}
      <div className="flex-none mb-5">
        <SearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          restaurantCount={pagination.total}
          onAdd={openAddModal}
        />
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-hidden bg-surface border border-theme rounded-xl flex flex-col mb-5">
        <div className="flex-1 overflow-auto">
          <RestaurantTable
            restaurants={restaurants}
            loading={loading}
            selectedRestaurants={selectedRestaurants}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onView={openDetails}
            onEdit={openEditModal}
            onToggleStatus={handleToggleStatus}
            onManageSubscription={handleManageSubscription}
            onManageFeatures={handleManageFeatures}
              onSendInvite={handleSendInvite}
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="flex-none">
        <Pagination
          pagination={pagination}
          totalItems={pagination.total}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </div>

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
