import { useMemo } from "react";
import { Plus } from "lucide-react";
import { useSubscriptionsStore } from "../../store/subscriptionsStore";
import Button from "../../components/ui/Button";
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
    filters,
    setFilter,
    resetFilters,
    pagination,
    setPage,
    setLimit,
    openAssignModal,
    openDetails,
    openRenewModal,
    openChangePackageModal,
    getFilteredSubscriptions,
    getSummary,
  } = useSubscriptionsStore();

  const filteredSubscriptions = useMemo(() => getFilteredSubscriptions(), [filters, getFilteredSubscriptions]);
  
  const paginatedSubscriptions = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    return filteredSubscriptions.slice(start, start + pagination.limit);
  }, [filteredSubscriptions, pagination]);

  const summary = useMemo(() => getSummary(), [getFilteredSubscriptions, getSummary]);

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-theme">Subscriptions</h1>
          <p className="text-sm text-secondary">Manage restaurant subscriptions, validity and subscription status.</p>
        </div>
        <Button onClick={openAssignModal}>
          <Plus size={16} /> Assign Subscription
        </Button>
      </div>

      {/* Summary Cards */}
      <SubscriptionSummaryCard summary={summary} />

      {/* Search & Filters */}
      <SubscriptionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        subscriptionCount={filteredSubscriptions.length}
      />

      {/* Table */}
      <SubscriptionTable
        subscriptions={paginatedSubscriptions}
        onView={handleViewDetails}
        onRenew={handleRenew}
        onChangePackage={handleChangePackage}
      />

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        totalItems={filteredSubscriptions.length}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {/* Modals */}
      <AssignSubscriptionModal />
      <SubscriptionDetailsDrawer />
      <RenewSubscriptionModal />
      <ChangePackageModal />
      <ConfirmModal />
    </div>
  );
}