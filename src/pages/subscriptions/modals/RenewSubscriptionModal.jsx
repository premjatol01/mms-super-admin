import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useSubscriptionsStore } from "../../../store/subscriptionsStore";
import { durationOptions } from "../data/subscriptionData";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Select from "../../../components/ui/Select";

export default function RenewSubscriptionModal() {
  const { showRenewModal, closeRenewModal, renewSubscription, selectedSubscription } = useSubscriptionsStore();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(90);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (showRenewModal) {
      setDuration(90);
      setShowConfirm(false);
    }
  }, [showRenewModal]);

  const currentEndDate = selectedSubscription?.endDate ? new Date(selectedSubscription.endDate) : new Date();
  const newEndDate = useMemo(() => {
    const end = new Date(currentEndDate);
    end.setDate(end.getDate() + duration);
    return end.toISOString().split('T')[0];
  }, [currentEndDate, duration]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleSubmit = () => {
    if (!selectedSubscription) return;
    
    setLoading(true);
    
    setTimeout(() => {
      renewSubscription(selectedSubscription.id, duration);
      toast.success("Subscription renewed successfully");
      setLoading(false);
      closeRenewModal();
    }, 500);
  };

  if (!showRenewModal || !selectedSubscription) return null;

  if (showConfirm) {
    return (
      <Modal isOpen={showRenewModal} onClose={closeRenewModal} title="Renew Subscription" size="md">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-theme">Confirm Renewal</h3>
          <div className="bg-primary-light/20 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-secondary">Restaurant:</span>
              <span className="text-sm text-theme font-medium">{selectedSubscription.restaurantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">Current Expiry:</span>
              <span className="text-sm text-theme font-medium">{formatDate(selectedSubscription.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">Renewal Duration:</span>
              <span className="text-sm text-theme font-medium">{duration} Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">New Expiry:</span>
              <span className="text-sm text-theme font-medium">{formatDate(newEndDate)}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>
              Back
            </Button>
            <Button className="flex-1" loading={loading} onClick={handleSubmit}>
              Confirm Renewal
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={showRenewModal} onClose={closeRenewModal} title="Renew Subscription" size="md">
      <div className="space-y-6">
        <div className="bg-primary-light/20 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-secondary">Current Package:</span>
            <span className="text-sm text-theme font-medium">{selectedSubscription.packageName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary">Current Expiry:</span>
            <span className="text-sm text-theme font-medium">{formatDate(selectedSubscription.endDate)}</span>
          </div>
        </div>

        <FormSection title="Renewal Options">
          <Select 
            label="Renewal Duration" 
            value={duration} 
            onChange={(v) => setDuration(parseInt(v))}
            options={durationOptions}
          />
        </FormSection>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-sm text-green-700">New Expiry Date:</span>
            <span className="text-sm font-medium text-green-800">{formatDate(newEndDate)}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-theme">
          <Button variant="secondary" className="flex-1" onClick={closeRenewModal}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => setShowConfirm(true)}>
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}