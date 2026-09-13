export default function StatusBadge({ status, type = "restaurant" }) {
  const styles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
    expired: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };
  
  const labels = { 
    active: "Active", 
    inactive: "Inactive", 
    expired: "Expired", 
    pending: "Pending" 
  };
  
  const dotColors = {
    active: "bg-green-500",
    inactive: "bg-gray-400",
    expired: "bg-red-500",
    pending: "bg-yellow-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || dotColors.inactive}`} />
      {labels[status] || status}
    </span>
  );
}