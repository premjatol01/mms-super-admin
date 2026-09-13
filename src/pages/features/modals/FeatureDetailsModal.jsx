import { X } from "lucide-react";
import { useFeatureStore } from "../data/useFeatureStore";
import FeatureStatusBadge from "../components/FeatureStatusBadge";
import FeatureCategoryBadge from "../components/FeatureCategoryBadge";

export default function FeatureDetailsModal() {
  const feature = useFeatureStore((s) => s.detailsModal);
  const close = useFeatureStore((s) => s.closeDetails);
  const openForm = useFeatureStore((s) => s.openForm);
  const openConfirm = useFeatureStore((s) => s.openConfirm);
  const closeConfirm = useFeatureStore((s) => s.closeConfirm);
  const setFeatureStatus = useFeatureStore((s) => s.setFeatureStatus);

  if (!feature) return null;

  const isActive = feature.status === "Active";
  const packageCount = feature.packages?.length || 0;

  const handleToggleStatus = () => {
    if (isActive) {
      openConfirm({
        title: "Deactivate Feature?",
        description:
          packageCount > 0
            ? `"${feature.name}" is currently used in ${packageCount} subscription package${
                packageCount > 1 ? "s" : ""
              }. Are you sure you want to deactivate it?`
            : `Are you sure you want to deactivate "${feature.name}"?`,
        confirmLabel: "Deactivate",
        tone: "danger",
        onConfirm: () => {
          setFeatureStatus(feature.id, "Inactive");
          closeConfirm();
          close();
        },
      });
    } else {
      openConfirm({
        title: "Activate Feature?",
        description: `"${feature.name}" will become selectable for new subscription package configurations.`,
        confirmLabel: "Activate",
        onConfirm: () => {
          setFeatureStatus(feature.id, "Active");
          closeConfirm();
          close();
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-surface p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-theme">
            Feature Details
          </h3>
          <button
            onClick={close}
            className="rounded-lg p-1 text-secondary hover:bg-primary-light/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <p className="text-lg font-semibold text-theme">{feature.name}</p>
          <FeatureStatusBadge status={feature.status} />
        </div>
        <p className="mt-1 text-xs text-secondary">{feature.key}</p>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-theme pb-2">
            <span className="text-secondary">Category</span>
            <FeatureCategoryBadge category={feature.category} />
          </div>
          <div className="border-b border-theme pb-2">
            <p className="mb-1 text-secondary">Description</p>
            <p className="text-theme">{feature.description}</p>
          </div>
          <div className="flex items-center justify-between border-b border-theme pb-2">
            <span className="text-secondary">Display Order</span>
            <span className="font-medium text-theme">
              {feature.displayOrder}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-theme pb-2">
            <span className="text-secondary">Updated</span>
            <span className="font-medium text-theme">{feature.updatedAt}</span>
          </div>

          <div>
            <p className="mb-2 text-secondary">
              Used in {packageCount} Subscription Package
              {packageCount === 1 ? "" : "s"}
            </p>
            {packageCount > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {feature.packages.map((pkg) => (
                  <li
                    key={pkg}
                    className="rounded-full bg-primary-light/20 px-3 py-1 text-xs font-medium text-theme"
                  >
                    {pkg}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-secondary">
                Not currently used in any package.
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={handleToggleStatus}
            className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-primary-light/20"
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={() => {
              close();
              openForm("edit", feature);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Edit Feature
          </button>
        </div>
      </div>
    </div>
  );
}
