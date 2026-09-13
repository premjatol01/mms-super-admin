export default function LeadStatusBadge({ status }) {
  const isActive = status === "active";
  
  return (
    <span 
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: isActive ? "#22c55e20" : "#ef444420",
        color: isActive ? "#22c55e" : "#ef4444"
      }}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}