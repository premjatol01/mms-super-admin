import { useState } from "react";
import { useQrConfigStore } from "../data/useQrConfigStore";

function validatePrice(value) {
  if (value === "" || value === null || value === undefined) {
    return "Please enter a valid QR price.";
  }
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) {
    return "Please enter a valid QR price.";
  }
  if (num > 100000) {
    return "Price exceeds the maximum allowed value.";
  }
  return "";
}

function PriceField({ label, value, onChange }) {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const raw = e.target.value;
    onChange(raw === "" ? "" : Number(raw));
    setError(validatePrice(raw));
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-theme">
        {label}
      </label>
      <div className="flex items-center overflow-hidden rounded-lg border border-theme bg-theme focus-within:border-primary">
        <span className="px-3 text-sm text-secondary">₹</span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={handleChange}
          className="w-full bg-transparent py-2 pr-3 text-sm text-theme outline-none"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function PricingTab() {
  const pricing = useQrConfigStore((s) => s.pricing);
  const setPricing = useQrConfigStore((s) => s.setPricing);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-theme bg-surface p-5">
        <h2 className="mb-1 text-sm font-semibold text-theme">QR Pricing</h2>
        <p className="mb-4 text-sm text-secondary">
          Set pricing for additional/paid QR codes purchased by restaurants.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PriceField
            label="Additional Standard QR — Price per QR"
            value={pricing.additionalStandard}
            onChange={(v) => setPricing({ additionalStandard: v })}
          />
          <PriceField
            label="Additional Premium QR — Price per QR"
            value={pricing.additionalPremium}
            onChange={(v) => setPricing({ additionalPremium: v })}
          />
        </div>

        <div className="mt-4 max-w-xs">
          <label className="mb-1 block text-sm font-medium text-theme">
            Currency
          </label>
          <div className="rounded-lg border border-theme bg-primary-light/10 px-3 py-2 text-sm text-secondary">
            {pricing.currency} (₹) — fixed for this platform
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-theme">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary-light/10 text-xs uppercase tracking-wide text-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">QR Type</th>
              <th className="px-4 py-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-theme bg-surface">
              <td className="px-4 py-3 text-theme">Additional Standard</td>
              <td className="px-4 py-3 text-secondary">
                ₹{pricing.additionalStandard || 0}
              </td>
            </tr>
            <tr className="border-t border-theme bg-surface">
              <td className="px-4 py-3 text-theme">Additional Premium</td>
              <td className="px-4 py-3 text-secondary">
                ₹{pricing.additionalPremium || 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
