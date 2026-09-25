import { Users, Store } from "lucide-react";

export default function AssignmentBadge({ assignment, restaurantName }) {
  const isAll = assignment === "all";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
      {isAll ? <Users size={14} /> : <Store size={14} />}
      {isAll ? "All restaurants" : restaurantName || "Unassigned restaurant"}
    </span>
  );
}
