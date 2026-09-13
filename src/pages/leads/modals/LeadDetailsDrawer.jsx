import { X, Edit2, ArrowRight, Phone, Mail, Building2, MapPin, User } from "lucide-react";
import { useLeadsStore } from "../../../store/leadsStore";
import { leadStages, stageOrder } from "../data/leadData";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import LeadStageBadge from "../components/LeadStageBadge";
import LeadStatusBadge from "../components/LeadStatusBadge";

export default function LeadDetailsDrawer() {
  const { 
    showDetailsDrawer, 
    closeDetails, 
    selectedLead, 
    openEditModal,
    openConvertModal,
    changeStage,
    toggleStatus
  } = useLeadsStore();

  if (!showDetailsDrawer || !selectedLead) return null;

  const leadStageInfo = leadStages.find(s => s.value === selectedLead.stage) || { label: selectedLead.stage };
  const currentStageIndex = stageOrder.indexOf(selectedLead.stage);
  const stageFlow = stageOrder.slice(0, -2); // Exclude converted and lost

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleStageChange = (newStage) => {
    changeStage(selectedLead.id, newStage);
  };

  const handleStatusToggle = () => {
    toggleStatus(selectedLead.id);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={closeDetails} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-surface border-l border-theme flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
          <div>
            <h2 className="text-lg font-semibold text-theme">Lead Details</h2>
            <p className="text-sm text-secondary">{selectedLead.id}</p>
          </div>
          <button onClick={closeDetails} className="p-1 text-secondary hover:text-theme rounded">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Restaurant Info */}
          <div className="bg-primary-light/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white font-medium">
                {selectedLead.restaurantName[0]}
              </div>
              <div>
                <h3 className="font-semibold text-theme">{selectedLead.restaurantName}</h3>
                {selectedLead.restaurantType && (
                  <p className="text-sm text-secondary">{selectedLead.restaurantType}</p>
                )}
              </div>
            </div>
            
            {selectedLead.address && (
              <div className="flex items-start gap-2 text-sm text-secondary">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span>
                  {selectedLead.address.fullAddress}
                  {selectedLead.address.city && `, ${selectedLead.address.city}`}
                  {selectedLead.address.state && `, ${selectedLead.address.state}`}
                  {selectedLead.address.pincode && ` - ${selectedLead.address.pincode}`}
                </span>
              </div>
            )}
            
            {selectedLead.website && (
              <div className="flex items-center gap-2 text-sm text-secondary mt-2">
                <Building2 size={14} />
                <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {selectedLead.website}
                </a>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-theme mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User size={16} className="text-secondary" />
                <span className="text-sm text-theme">{selectedLead.contactPerson}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-secondary" />
                <a href={`tel:${selectedLead.phone}`} className="text-sm text-primary hover:underline">
                  {selectedLead.phone}
                </a>
              </div>
              {selectedLead.email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-secondary" />
                  <a href={`mailto:${selectedLead.email}`} className="text-sm text-primary hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Stage & Status */}
          <div>
            <h4 className="text-sm font-semibold text-theme mb-3">Lead Status</h4>
            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-xs text-secondary mb-1">Stage</p>
                <LeadStageBadge stage={selectedLead.stage} />
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Status</p>
                <LeadStatusBadge status={selectedLead.status} />
              </div>
            </div>
            
            {selectedLead.stage !== "converted" && selectedLead.stage !== "lost" && (
              <div className="flex gap-2">
                <Select 
                  value={selectedLead.stage}
                  onChange={handleStageChange}
                  options={stageFlow.map(s => ({ 
                    value: s, 
                    label: leadStages.find(ls => ls.value === s)?.label || s 
                  }))}
                  placeholder="Change Stage"
                />
                <Button 
                  variant={selectedLead.status === "active" ? "secondary" : "primary"}
                  size="sm"
                  onClick={handleStatusToggle}
                >
                  {selectedLead.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            )}
          </div>

          {/* Lead Tracking */}
          {selectedLead.stage !== "converted" && selectedLead.stage !== "lost" && (
            <div>
              <h4 className="text-sm font-semibold text-theme mb-3">Lead Progress</h4>
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {stageFlow.map((stage, index) => {
                  const stageInfo = leadStages.find(s => s.value === stage);
                  const isCompleted = index < currentStageIndex;
                  const isCurrent = stage === selectedLead.stage;
                  
                  return (
                    <div key={stage} className="flex items-center">
                      <div className={`flex flex-col items-center min-w-[60px]`}>
                        <div className={`w-3 h-3 rounded-full mb-1 ${
                          isCompleted ? "bg-green-500" : isCurrent ? "bg-primary" : "bg-gray-300"
                        }`}>
                          {isCompleted && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="currentColor">
                              <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-[10px] text-center ${isCurrent ? "text-primary font-medium" : "text-secondary"}`}>
                          {stageInfo?.label}
                        </span>
                      </div>
                      {index < stageFlow.length - 1 && (
                        <div className={`w-6 h-0.5 ${index < currentStageIndex ? "bg-green-500" : "bg-gray-300"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedLead.notes && (
            <div>
              <h4 className="text-sm font-semibold text-theme mb-3">Notes</h4>
              <p className="text-sm text-secondary bg-primary-light/10 rounded-lg p-3">
                {selectedLead.notes}
              </p>
            </div>
          )}

          {/* Activity History */}
          <div>
            <h4 className="text-sm font-semibold text-theme mb-3">Activity</h4>
            <div className="space-y-2">
              {(selectedLead.activity || []).slice().reverse().map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-theme">{item.action}</p>
                    <p className="text-xs text-secondary">{formatDate(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme flex gap-3">
          <Button variant="secondary" onClick={() => openEditModal(selectedLead)}>
            <Edit2 size={14} /> Edit Lead
          </Button>
          {selectedLead.stage !== "converted" ? (
            <Button onClick={() => openConvertModal(selectedLead)}>
              <ArrowRight size={14} /> Convert Lead
            </Button>
          ) : (
            <Button variant="secondary">
              <Building2 size={14} /> View Restaurant
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}