import { QrCode } from "lucide-react";

export default function QRConfigHeader() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light/40">
        <QrCode className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-theme">QR Config</h1>
        <p className="mt-0.5 text-sm text-secondary">
          Manage platform-wide QR availability, layouts, generation rules
          and pricing.
        </p>
      </div>
    </div>
  );
}
