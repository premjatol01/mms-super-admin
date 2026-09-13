import { leadStages } from "../data/leadData";

export default function LeadStageBadge({ stage }) {
  const stageInfo = leadStages.find(s => s.value === stage) || { label: stage, color: "#94a3b8" };
  
  return (
    <span 
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${stageInfo.color}20`,
        color: stageInfo.color
      }}
    >
      {stageInfo.label}
    </span>
  );
}