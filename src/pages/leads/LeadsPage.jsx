import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useLeadsStore } from "../../store/leadsStore";
import Button from "../../components/ui/Button";
import LeadFilters from "./components/LeadFilters";
import LeadTable from "./components/LeadTable";
import Pagination from "./components/Pagination";
import AddEditLeadModal from "./modals/AddEditLeadModal";
import LeadDetailsDrawer from "./modals/LeadDetailsDrawer";
import ConfirmModal from "./modals/ConfirmModal";
import ConvertLeadModal from "./modals/ConvertLeadModal";

const TABS = [
  { id: "new", label: "New", stages: ["prospect", "new_lead"] },
  { id: "in_process", label: "In Process", stages: ["contacted", "interested", "follow_up"] },
  { id: "final", label: "Final", stages: ["converted", "qualified"] },
  { id: "lost", label: "Lost", stages: ["lost"] },
];

export default function LeadsPage() {
  const {
    filters,
    setFilter,
    resetFilters,
    pagination,
    setPage,
    setLimit,
    selectedLeads,
    toggleSelectAll,
    toggleSelect,
    clearSelection,
    openAddModal,
    openDetails,
    openEditModal,
    showConfirm,
    openConvertModal,
    getFilteredLeads,
  } = useLeadsStore();

  const [activeTab, setActiveTab] = useState("new");

  const filteredLeads = useMemo(() => getFilteredLeads(), [filters, getFilteredLeads]);
  
  const tabLeads = useMemo(() => {
    const currentStages = TABS.find(t => t.id === activeTab)?.stages || [];
    return filteredLeads.filter(lead => currentStages.includes(lead.stage));
  }, [filteredLeads, activeTab]);

  const paginatedLeads = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    return tabLeads.slice(start, start + pagination.limit);
  }, [tabLeads, pagination]);

  const handleFilterChange = (key, value) => {
    setFilter(key, value);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleViewDetails = (lead) => {
    openDetails(lead);
  };

  const handleEditLead = (lead) => {
    openEditModal(lead);
  };

  const handleConvertLead = (lead) => {
    openConvertModal(lead);
  };

  const handleToggleStatus = (lead) => {
    showConfirm("toggleStatus", lead);
  };

  const handleViewRestaurant = (lead) => {
    toast.info(`Viewing restaurant: ${lead.convertedRestaurantId}`);
  };

  // Get unique cities for filter
  const cities = useMemo(() => {
    const citySet = new Set();
    filteredLeads.forEach(lead => {
      if (lead.address?.city) {
        citySet.add(lead.address.city);
      }
    });
    return Array.from(citySet).sort();
  }, [filteredLeads]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-theme">Leads</h1>
          <p className="text-sm text-secondary">Manage and track restaurant prospects</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus size={16} /> Add Lead
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-theme overflow-x-auto no-scrollbar">
        {TABS.map(tab => {
          const count = filteredLeads.filter(l => tab.stages.includes(l.stage)).length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1); // reset to first page when changing tab
              }}
              className={`flex items-center gap-2 whitespace-nowrap pb-3 text-sm font-medium transition-colors relative border-b-2 ${
                isActive
                  ? "border-theme text-theme"
                  : "border-transparent text-secondary hover:text-theme"
              }`}
            >
              {tab.label}
              <span className={`rounded-full px-2 py-0.5 text-xs border ${
                isActive ? "bg-primary-light border-primary text-theme" : "bg-surface border-theme text-secondary"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <LeadFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        leadCount={tabLeads.length}
        cities={cities}
      />

      {/* Table */}
      <LeadTable
        leads={paginatedLeads}
        selectedLeads={selectedLeads}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onView={handleViewDetails}
        onEdit={handleEditLead}
        onConvert={handleConvertLead}
        onChangeStage={() => {}}
        onViewRestaurant={handleViewRestaurant}
      />

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        totalItems={tabLeads.length}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {/* Bulk Actions Bar */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-theme rounded-xl px-6 py-3 shadow-xl flex items-center gap-4 z-40">
          <span className="text-sm text-theme font-medium">{selectedLeads.length} selected</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddEditLeadModal />
      <LeadDetailsDrawer />
      <ConfirmModal />
      <ConvertLeadModal />
    </div>
  );
}