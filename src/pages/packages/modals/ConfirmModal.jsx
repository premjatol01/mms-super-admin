import { usePackagesStore } from "../../../store/packagesStore";
import Button from "../../../components/ui/Button";

export default function ConfirmModal() {
  const { showConfirmModal, confirmAction, selectedPackage, hideConfirm, toggleStatus, deletePackage } = usePackagesStore();

  if (!showConfirmModal || !confirmAction) return null;

  const handleConfirm = () => {
    if (confirmAction === "toggleStatus" && selectedPackage) {
      toggleStatus(selectedPackage.id);
    } else if (confirmAction === "delete" && selectedPackage) {
      deletePackage(selectedPackage.id);
    }
    hideConfirm();
  };

  const getContent = () => {
    switch (confirmAction) {
      case "toggleStatus":
        const isActivating = selectedPackage?.status === "inactive";
        return {
          title: isActivating ? "Activate Package?" : "Deactivate Package?",
          message: isActivating 
            ? "This package will become available for restaurants." 
            : "This package will no longer be available for new restaurants.",
          confirmLabel: isActivating ? "Activate" : "Deactivate",
          variant: "danger",
        };
      case "delete":
        return {
          title: "Delete Package?",
          message: `Are you sure you want to delete "${selectedPackage?.name}"? This action cannot be undone.`,
          confirmLabel: "Delete",
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