import { useEffect } from "react";
import { Users, MessageSquare, QrCode, Zap } from "lucide-react";
import { useSubscriptionsStore } from "../../store/subscriptionsStore";
import SubscriptionFilters from "./components/SubscriptionFilters";
import SubscriptionTable from "./components/SubscriptionTable";
import SubscriptionSummaryCard from "./components/SubscriptionSummaryCard";
import SubscriptionTicketsView from "./components/SubscriptionTicketsView";
import PaymentSettingsView from "./components/PaymentSettingsView";
import Pagination from "../restaurants/components/Pagination";
import AssignSubscriptionModal from "./modals/AssignSubscriptionModal";
import SubscriptionDetailsDrawer from "./modals/SubscriptionDetailsDrawer";
import RenewSubscriptionModal from "./modals/RenewSubscriptionModal";
import ChangePackageModal from "./modals/ChangePackageModal";
import ConfirmModal from "./modals/ConfirmModal";
import VerifyPaymentModal from "./modals/VerifyPaymentModal";

export default function SubscriptionsPage() {
  const {
    activeTab,
    setActiveTab,
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
    if (activeTab === "subscriptions") {
      fetchSubscriptions();
    }
  }, [filters, pagination.page, pagination.limit, activeTab, fetchSubscriptions]);

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

  const pendingVerificationCount = summary?.pendingVerification || 0;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] space-y-3.5">
      {/* Summary Cards */}
      <div className="flex-none">
        <SubscriptionSummaryCard summary={summary} />
      </div>

      {/* Module Tabs Header */}
      <div className="flex-none flex items-center justify-between border-b border-theme pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("subscriptions")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "subscriptions"
                ? "bg-primary text-white shadow-xs"
                : "text-secondary hover:text-theme hover:bg-primary-light/40"
            }`}
          >
            <Users size={14} />
            Subscriptions
            {pendingVerificationCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-white animate-pulse">
                <Zap size={9} /> {pendingVerificationCount} New
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "tickets"
                ? "bg-primary text-white shadow-xs"
                : "text-secondary hover:text-theme hover:bg-primary-light/40"
            }`}
          >
            <MessageSquare size={14} />
            Support Tickets & Notes
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("paymentConfig")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "paymentConfig"
                ? "bg-primary text-white shadow-xs"
                : "text-secondary hover:text-theme hover:bg-primary-light/40"
            }`}
          >
            <QrCode size={14} />
            Payment QR & Settings
          </button>
        </div>
      </div>

      {/* Tab 1: Subscriptions List */}
      {activeTab === "subscriptions" && (
        <div className="flex-1 min-h-0 flex flex-col space-y-3">
          {/* Search, Filters & Assign Button */}
          <div className="flex-none">
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
        </div>
      )}

      {/* Tab 2: Support Tickets & Notes */}
      {activeTab === "tickets" && (
        <SubscriptionTicketsView />
      )}

      {/* Tab 3: Payment Settings (QR & UPI) */}
      {activeTab === "paymentConfig" && (
        <PaymentSettingsView />
      )}

      {/* Modals & Drawers */}
      <VerifyPaymentModal />
      <AssignSubscriptionModal />
      <SubscriptionDetailsDrawer />
      <RenewSubscriptionModal />
      <ChangePackageModal />
      <ConfirmModal />
    </div>
  );
}
