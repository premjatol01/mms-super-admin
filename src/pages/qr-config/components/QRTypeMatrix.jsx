import { Check, X } from "lucide-react";
import { qrTypeMatrix } from "../data/mockData";

export default function QRTypeMatrix() {
  return (
    <div className="overflow-hidden rounded-xl border border-theme">
      <table className="w-full text-left text-sm">
        <thead className="bg-primary-light/10 text-xs uppercase tracking-wide text-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">QR Type</th>
            <th className="px-4 py-3 font-medium">Available</th>
            <th className="px-4 py-3 font-medium">Subscription Controlled</th>
            <th className="px-4 py-3 font-medium">Paid</th>
          </tr>
        </thead>
        <tbody>
          {qrTypeMatrix.map((row) => (
            <tr key={row.type} className="border-t border-theme bg-surface">
              <td className="px-4 py-3 font-medium text-theme">{row.type}</td>
              <td className="px-4 py-3">
                {row.available ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </td>
              <td className="px-4 py-3 text-secondary">
                {row.subscriptionControlled}
              </td>
              <td className="px-4 py-3">
                {row.paid ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
