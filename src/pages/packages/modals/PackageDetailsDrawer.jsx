import { X, Edit2, Calendar, CheckCircle, XCircle } from "lucide-react";
import { usePackagesStore } from "../../../store/packagesStore";
import { getFeatureById } from "../data/featureData";
import Button from "../../../components/ui/Button";
import FormSection from "../../../components/ui/FormSection";

export default function PackageDetailsDrawer() {
  const { 
    showDetailsDrawer, 
    selectedPackage, 
    closeDetails, 
    openEditModal,
    showConfirm 
  } = usePackagesStore();

  if (!showDetailsDrawer || !selectedPackage) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={closeDetails} />
      <div className="relative bg-surface w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme bg-surface">
          <h2 className="text-lg font-semibold text-theme">Package Details</h2>
          <button 
            onClick={closeDetails} 
            className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Package Header Card */}
          <div className="bg-surface border border-theme rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-theme">{selectedPackage.name}</h3>
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: selectedPackage.status === "active" ? "#22c55e20" : "#ef444420",
                      color: selectedPackage.status === "active" ? "#22c55e" : "#ef4444"
                    }}
                  >
                    {selectedPackage.status === "active" ? <CheckCircle size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                    {selectedPackage.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-secondary mt-1">ID: {selectedPackage.id}</p>
                <p className="text-sm text-theme mt-3">{selectedPackage.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-theme">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-secondary" />
                <span className="text-sm text-secondary">Duration:</span>
                <span className="text-sm font-medium text-theme">{selectedPackage.durationDisplay}</span>
              </div>
              <div>
                <span className="text-sm text-secondary">Features:</span>
                <span className="text-sm font-medium text-theme ml-1">{selectedPackage.features?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Package Info */}
          <FormSection title="Package Information">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary">Duration</p>
                <p className="text-sm font-medium text-theme">{selectedPackage.durationDisplay}</p>
              </div>
              <div>
                <p className="text-xs text-secondary">Status</p>
                <span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: selectedPackage.status === "active" ? "#22c55e20" : "#ef444420",
                    color: selectedPackage.status === "active" ? "#22c55e" : "#ef4444"
                  }}
                >
                  {selectedPackage.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-secondary" />
                <div>
                  <p className="text-xs text-secondary">Created</p>
                  <p className="text-sm text-theme">{formatDate(selectedPackage.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-secondary" />
                <div>
                  <p className="text-xs text-secondary">Last Updated</p>
                  <p className="text-sm text-theme">{formatDate(selectedPackage.updatedAt)}</p>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Features List */}
          <FormSection title="Included Features">
            <div className="space-y-2">
              {selectedPackage.features?.map((featureId) => {
                const feature = getFeatureById(featureId);
                if (!feature) return null;
                return (
                  <div key={featureId} className="flex items-start gap-3 py-2 px-3 bg-primary-light/10 rounded-lg">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-theme">{feature.name}</p>
                      <p className="text-xs text-secondary">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
              {(!selectedPackage.features || selectedPackage.features.length === 0) && (
                <p className="text-sm text-secondary">No features selected</p>
              )}
            </div>
          </FormSection>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-theme bg-surface flex flex-wrap gap-3 justify-between">
          <Button 
            variant={selectedPackage.status === "active" ? "danger" : "primary"} 
            onClick={() => showConfirm("toggleStatus", selectedPackage)}
          >
            {selectedPackage.status === "active" ? "Deactivate" : "Activate"}
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => closeDetails()}>
              Close
            </Button>
            <Button onClick={() => { closeDetails(); openEditModal(selectedPackage); }}>
              <Edit2 size={14} /> Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}