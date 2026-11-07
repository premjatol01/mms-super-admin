import { useEffect } from "react";
import { useSubscriptionsStore } from "../../store/subscriptionsStore";
import SubscriptionFilters from "./components/SubscriptionFilters";
import SubscriptionTable from "./components/SubscriptionTable";
import SubscriptionSummaryCard from "./components/SubscriptionSummaryCard";
import Pagination from "../restaurants/components/Pagination";
import AssignSubscriptionModal from "./modals/AssignSubscriptionModal";
import SubscriptionDetailsDrawer from "./modals/SubscriptionDetailsDrawer";
import RenewSubscriptionModal from "./modals/RenewSubscriptionModal";
import ChangePackageModal from "./modals/ChangePackageModal";
import ConfirmModal from "./modals/ConfirmModal";

export default function SubscriptionsPage() {
  const {
    subscriptions,
    loading,
    summary,
    filters,
    setFilter,
    setFilters,
    resetFilters,
    pagination,
    setPage,
    setLimit,
    openAssignModal,
    openDetails,
    openRenewModal,
    openChangePackageModal,
    fetchSubscriptions,
  } = useSubscriptionsStore();

  useEffect(() => {
    fetchSubscriptions();
  }, [filters, pagination.page, pagination.limit, fetchSubscriptions]);

  const handleFilterChange = (key, value) => {
    setFilter(key, value);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleViewDetails = (sub) => {
    openDetails(sub);
  };

  const handleRenew = (sub) => {
    openRenewModal(sub);
  };

  const handleChangePackage = (sub) => {
    openChangePackageModal(sub);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Summary Cards */}
      <div className="flex-none mb-4">
        <SubscriptionSummaryCard summary={summary} />
      </div>

      {/* Search, Filters & Assign Button */}
      <div className="flex-none mb-4">
        <SubscriptionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={setFilters}
          onResetFilters={handleResetFilters}
          subscriptionCount={pagination.total || subscriptions.length}
          onAssign={openAssignModal}
        />
      </div>

      {/* Table & Bottom Pinned Pagination Card */}
      <div className="flex-1 min-h-0 flex flex-col bg-surface border border-theme rounded-xl overflow-hidden shadow-sm">
        <SubscriptionTable
          subscriptions={subscriptions}
          loading={loading}
          onView={handleViewDetails}
          onRenew={handleRenew}
          onChangePackage={handleChangePackage}
        />

        {/* Pinned Pagination Bar */}
        <Pagination
          pagination={pagination}
          totalItems={pagination.total || subscriptions.length}
          onPageChange={setPage}
          onLimitChange={setLimit}
          itemName="subscriptions"
        />
      </div>

      {/* Modals & Drawers */}
      <AssignSubscriptionModal />
      <SubscriptionDetailsDrawer />
      <RenewSubscriptionModal />
      <ChangePackageModal />
      <ConfirmModal />
    </div>
  );
}
