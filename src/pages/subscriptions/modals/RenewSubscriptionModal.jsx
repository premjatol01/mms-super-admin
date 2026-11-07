import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useSubscriptionsStore } from "../../../store/subscriptionsStore";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Select from "../../../components/ui/Select";

const renewDurationOptions = [
  { value: "30", label: "30 Days (1 Month)" },
  { value: "90", label: "90 Days (3 Months)" },
  { value: "180", label: "180 Days (6 Months)" },
  { value: "365", label: "365 Days (1 Year)" },
];

export default function RenewSubscriptionModal() {
  const { showRenewModal, closeRenewModal, renewSubscription, selectedSubscription } = useSubscriptionsStore();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(30);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (showRenewModal) {
      setDuration(30);
      setShowConfirm(false);
    }
  }, [showRenewModal]);

  const currentEndDate = selectedSubscription?.endDate ? new Date(selectedSubscription.endDate) : new Date();
  const now = new Date();
  const baseDate = currentEndDate > now ? currentEndDate : now;

  const newEndDate = useMemo(() => {
    const end = new Date(baseDate);
    end.setDate(end.getDate() + Number(duration));
    return end.toISOString().split('T')[0];
  }, [baseDate, duration]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleSubmit = async () => {
    if (!selectedSubscription) return;
    
    setLoading(true);
    const subId = selectedSubscription._id || selectedSubscription.id;
    const durOpt = renewDurationOptions.find(d => Number(d.value) === Number(duration));

    const result = await renewSubscription(subId, {
      duration: Number(duration),
      durationDays: Number(duration),
      durationDisplay: durOpt?.label || `${duration} Days`
    });

    setLoading(false);
    if (result?.success) {
      closeRenewModal();
    }
  };

  if (!showRenewModal || !selectedSubscription) return null;

  if (showConfirm) {
    return (
      <Modal isOpen={showRenewModal} onClose={closeRenewModal} title="Confirm Renewal" size="md">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-theme">Confirm Subscription Renewal</h3>
          <div className="bg-primary-light/20 rounded-xl p-4 space-y-2.5 border border-theme">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Restaurant:</span>
              <span className="text-theme font-medium">{selectedSubscription.restaurantName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Package:</span>
              <span className="text-theme font-medium">{selectedSubscription.packageName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Current Expiry:</span>
              <span className="text-theme font-medium">{formatDate(selectedSubscription.endDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Added Duration:</span>
              <span className="text-theme font-semibold">{duration} Days</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-theme">
              <span className="text-secondary">New Expiry Date:</span>
              <span className="text-primary font-bold">{formatDate(newEndDate)}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>
              Back
            </Button>
            <Button className="flex-1" loading={loading} onClick={handleSubmit}>
              Confirm & Renew
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={showRenewModal} onClose={closeRenewModal} title="Renew Subscription" size="md">
      <div className="space-y-6">
        <div className="bg-primary-light/20 rounded-xl p-4 border border-theme">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-secondary">Restaurant:</span>
            <span className="text-theme font-semibold">{selectedSubscription.restaurantName}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-secondary">Current Package:</span>
            <span className="text-theme font-medium">{selectedSubscription.packageName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-secondary">Current Expiry:</span>
            <span className="text-theme font-medium">{formatDate(selectedSubscription.endDate)}</span>
          </div>
        </div>

        <FormSection title="Renewal Duration" description="Choose how many days to extend this subscription">
          <Select 
            label="Extension Duration" 
            value={String(duration)} 
            onChange={(v) => setDuration(parseInt(v))}
            options={renewDurationOptions}
          />
          <div className="mt-3 p-3 bg-surface border border-theme rounded-lg text-sm flex justify-between items-center">
            <span className="text-secondary">Projected Expiry Date:</span>
            <span className="text-primary font-bold">{formatDate(newEndDate)}</span>
          </div>
        </FormSection>

        <div className="flex justify-end gap-3 pt-4 border-t border-theme">
          <Button variant="secondary" onClick={closeRenewModal}>Cancel</Button>
          <Button onClick={() => setShowConfirm(true)}>
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
