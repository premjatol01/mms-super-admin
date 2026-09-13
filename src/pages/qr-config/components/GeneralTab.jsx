import QRTypeToggle from "./QRTypeToggle";
import { useQrConfigStore } from "../data/useQrConfigStore";

const AVAILABILITY_META = {
  defaultQr: {
    description: "Allow restaurants to use default QR without additional payment.",
  },
  premiumQr: {
    description:
      "Allow premium QR layouts/options for restaurants according to their subscription/package.",
  },
  paidQr: {
    description: "Allow restaurants to purchase/use additional QR codes.",
  },
};

export default function GeneralTab() {
  const availability = useQrConfigStore((s) => s.availability);
  const setAvailability = useQrConfigStore((s) => s.setAvailability);
  const allocation = useQrConfigStore((s) => s.allocation);
  const setAllocation = useQrConfigStore((s) => s.setAllocation);
  const openConfirm = useQrConfigStore((s) => s.openConfirm);
  const closeConfirm = useQrConfigStore((s) => s.closeConfirm);

  const handleToggle = (key, nextValue) => {
    // Disabling a platform-wide setting affects every restaurant — confirm first.
    if (!nextValue) {
      openConfirm({
        title: `Change QR Availability?`,
        description: `Disabling ${AVAILABILITY_META[key] ? availability[key].label : "this option"} will prevent restaurants from using this QR option according to their subscription.`,
        confirmLabel: "Confirm",
        onConfirm: () => {
          setAvailability(key, false);
          closeConfirm();
        },
      });
    } else {
      setAvailability(key, true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-theme bg-surface p-5">
        <h2 className="mb-1 text-sm font-semibold text-theme">
          QR Configuration
        </h2>
        <p className="mb-2 text-sm text-secondary">
          Basic platform-level QR availability.
        </p>
        {Object.entries(availability).map(([key, value]) => (
          <QRTypeToggle
            key={key}
            label={value.label}
            description={AVAILABILITY_META[key]?.description}
            checked={value.enabled}
            onChange={(next) => handleToggle(key, next)}
          />
        ))}
      </div>

      <div className="rounded-xl border border-theme bg-surface p-5">
        <h2 className="mb-1 text-sm font-semibold text-theme">
          Premium QR Allocation
        </h2>
        <p className="mb-4 text-sm text-secondary">
          Number of premium QR layouts included per subscription package.
          Super Admin defines the platform/package rules; Restaurant Admin
          consumes the available allocation.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.entries(allocation).map(([pkg, value]) => (
            <div key={pkg}>
              <label className="mb-1 block text-sm font-medium capitalize text-theme">
                {pkg} Package
              </label>
              <input
                type="number"
                min={0}
                value={value}
                disabled={!availability.premiumQr.enabled}
                onChange={(e) =>
                  setAllocation(pkg, Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
