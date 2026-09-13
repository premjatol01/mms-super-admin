import { QrCode } from "lucide-react";

export default function QRTemplatePreview({ name, size = "md" }) {
  const sizeClasses =
    size === "lg" ? "h-40 w-40" : size === "sm" ? "h-12 w-12" : "h-20 w-20";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-lg border border-theme bg-primary-light/10 ${sizeClasses}`}
    >
      <QrCode
        className={size === "lg" ? "h-16 w-16" : "h-7 w-7"}
        strokeWidth={1.5}
        style={{ color: "var(--color-primary)" }}
      />
      {size === "lg" && (
        <span className="text-xs font-medium text-secondary">{name}</span>
      )}
    </div>
  );
}
