import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { useLeadsStore } from "../../../store/leadsStore";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";

export default function ConfirmModal() {
  const { showConfirmModal, hideConfirm, confirmAction, selectedLead, toggleStatus } = useLeadsStore();
  const [loading, setLoading] = useState(false);

  if (!showConfirmModal) return null;

  const handleConfirm = () => {
    setLoading(true);
    
    setTimeout(() => {
      if (confirmAction === "toggleStatus" && selectedLead) {
        toggleStatus(selectedLead.id);
        toast.success(`Lead ${selectedLead.status === "active" ? "deactivated" : "activated"} successfully`);
      }
      setLoading(false);
      hideConfirm();
    }, 500);
  };

  const isDeactivating = selectedLead?.status === "active";

  return (
    <Modal isOpen={showConfirmModal} onClose={hideConfirm} title="Confirm Action" size="sm">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-yellow-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-theme mb-2">
          {isDeactivating ? "Deactivate Lead?" : "Activate Lead?"}
        </h3>
        
        <p className="text-sm text-secondary mb-6">
          {isDeactivating 
            ? `Are you sure you want to deactivate "${selectedLead?.restaurantName}"? This lead will no longer appear in active lists.`
            : `Are you sure you want to activate "${selectedLead?.restaurantName}"?`
          }
        </p>

        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={hideConfirm}>
            Cancel
          </Button>
          <Button 
            variant={isDeactivating ? "danger" : "primary"} 
            onClick={handleConfirm}
            loading={loading}
          >
            {isDeactivating ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}