export default function StatusBadge({ status }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isActive
          ? "bg-secondary-light text-theme"
          : "bg-theme border border-theme text-secondary"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-secondary" : "bg-text-secondary"
        }`}
        style={{
          backgroundColor: isActive
            ? "var(--color-secondary)"
            : "var(--color-text-secondary)",
        }}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
