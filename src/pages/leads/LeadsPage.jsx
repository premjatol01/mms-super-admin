import { useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useLeadsStore } from "../../store/leadsStore";
import LeadFilters from "./components/LeadFilters";
import LeadKanbanBoard from "./components/LeadKanbanBoard";
import AddEditLeadModal from "./modals/AddEditLeadModal";
import LeadDetailsDrawer from "./modals/LeadDetailsDrawer";
import ConfirmModal from "./modals/ConfirmModal";
import ConvertLeadModal from "./modals/ConvertLeadModal";

export default function LeadsPage() {
  const {
    leads,
    filters,
    setFilter,
    setFilters,
    resetFilters,
    openAddModal,
    openDetails,
    openEditModal,
    openConvertModal,
    getFilteredLeads,
    changeStage,
    fetchLeads
  } = useLeadsStore();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => getFilteredLeads(), [leads, getFilteredLeads]);

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

  const handleChangeStage = (leadId, newStage) => {
    changeStage(leadId, newStage);
    toast.success(`Lead stage updated`);
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
    <div className="flex flex-col h-[calc(100vh-7rem)] overflow-hidden">
      {/* Search & Filters */}
      <div className="flex-none mb-4">
        <LeadFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={setFilters}
          onResetFilters={handleResetFilters}
          leadCount={filteredLeads.length}
          cities={cities}
          onAdd={openAddModal}
        />
      </div>

      {/* Main Kanban Board Container (occupies 100% of rest area) */}
      <div className="flex-1 min-h-0 flex flex-col bg-surface border border-theme rounded-xl p-4 overflow-hidden shadow-sm">
        <LeadKanbanBoard
          leads={filteredLeads}
          onView={handleViewDetails}
          onChangeStage={handleChangeStage}
          onConvert={handleConvertLead}
          onEdit={handleEditLead}
        />
      </div>

      {/* Modals */}
      <AddEditLeadModal />
      <LeadDetailsDrawer />
      <ConfirmModal />
      <ConvertLeadModal />
    </div>
  );
}
