import { useRestaurantsStore } from "../../../store/restaurantsStore";
import Button from "../../../components/ui/Button";

export default function ConfirmModal() {
  const { showConfirmModal, confirmAction, selectedRestaurant, hideConfirm, toggleStatus } = useRestaurantsStore();

  if (!showConfirmModal || !confirmAction) return null;

  const handleConfirm = () => {
    if (confirmAction === "toggleStatus" && selectedRestaurant) {
      toggleStatus(selectedRestaurant.id);
    }
    // Add more actions as needed
    hideConfirm();
  };

  const getContent = () => {
    switch (confirmAction) {
      case "toggleStatus":
        const isactivating = selectedRestaurant?.status === "inactive";
        return {
          title: isactivating ? "Activate Restaurant?" : "Deactivate Restaurant?",
          message: isactivating 
            ? "This restaurant will become active on the platform." 
            : "This restaurant will no longer remain active on the platform.",
          confirmLabel: isactivating ? "Activate" : "Deactivate",
          variant: "danger",
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