import QRTypeToggle from "./QRTypeToggle";
import QRTypeMatrix from "./QRTypeMatrix";
import { useQrConfigStore } from "../data/useQrConfigStore";

const RULE_LABELS = {
  defaultQrRule: "Default QR",
  premiumQrRule: "Premium QR",
  paidQrRule: "Additional Paid QR",
};

export default function RulesTab() {
  const rules = useQrConfigStore((s) => s.rules);
  const setRule = useQrConfigStore((s) => s.setRule);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-theme bg-surface p-5">
        <h2 className="mb-1 text-sm font-semibold text-theme">
          QR Generation Rules
        </h2>
        <p className="mb-2 text-sm text-secondary">
          Controls which QR types restaurants are allowed to generate.
        </p>
        {Object.entries(rules).map(([key, value]) => (
          <QRTypeToggle
            key={key}
            label={RULE_LABELS[key]}
            checked={value}
            onChange={(next) => setRule(key, next)}
          />
        ))}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-theme">
          QR Type Availability Matrix
        </h2>
        <QRTypeMatrix />
      </div>
    </div>
  );
}
