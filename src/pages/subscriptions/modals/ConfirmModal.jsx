import { useSubscriptionsStore } from "../../../store/subscriptionsStore";
import Button from "../../../components/ui/Button";

export default function ConfirmModal() {
  const { showConfirmModal, confirmAction, selectedSubscription, hideConfirm, cancelSubscription, reactivateSubscription } = useSubscriptionsStore();

  if (!showConfirmModal || !confirmAction || !selectedSubscription) return null;

  const handleConfirm = () => {
    if (confirmAction === "cancel") {
      cancelSubscription(selectedSubscription.id);
    } else if (confirmAction === "reactivate") {
      reactivateSubscription(selectedSubscription.id);
    }
    hideConfirm();
  };

  const getContent = () => {
    switch (confirmAction) {
      case "cancel":
        return {
          title: "Cancel Subscription?",
          message: `${selectedSubscription.restaurantName} will lose access to subscription-controlled features after the subscription is deactivated.`,
          confirmLabel: "Confirm Cancel",
          variant: "danger",
        };
      case "reactivate":
        return {
          title: "Reactivate Subscription?",
          message: `The restaurant's subscription-controlled features will become available according to the assigned package.`,
          confirmLabel: "Reactivate",
          variant: "primary",
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          confirmLabel: "Confirm",
          variant: "primary",
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={hideConfirm} />
      <div className="relative bg-surface rounded-xl border border-theme p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-semibold text-theme mb-2">{content.title}</h3>
        <p className="text-sm text-secondary mb-6">{content.message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={hideConfirm}>Cancel</Button>
          <Button variant={content.variant} onClick={handleConfirm}>
            {content.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}