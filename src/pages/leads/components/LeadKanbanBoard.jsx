import { useState } from "react";
import { leadStages, stageOrder } from "../data/leadData";
import { MapPin, Phone, Mail, Building2, MoreVertical, ArrowRight, User } from "lucide-react";

export default function LeadKanbanBoard({ 
  leads, 
  onView, 
  onChangeStage, 
  onConvert,
  onEdit
}) {
  const [draggedLead, setDraggedLead] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.setData("text/plain", lead.id);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedLead(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (!draggedLead) return;
    
    if (draggedLead.stage !== targetStage) {
      if (targetStage === "converted") {
        onConvert(draggedLead);
      } else {
        onChangeStage(draggedLead.id, targetStage);
      }
    }
    setDraggedLead(null);
  };

  return (
    <div className="flex h-full min-h-[600px] overflow-x-auto gap-4 pb-4">
      {stageOrder.map((stageKey) => {
        const stageInfo = leadStages.find(s => s.value === stageKey);
        const stageLeads = leads.filter(l => l.stage === stageKey);

        return (
          <div 
            key={stageKey}
            className="flex-none w-80 bg-surface border border-theme rounded-xl flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stageKey)}
          >
            {/* Column Header */}
            <div className="p-3 border-b border-theme flex items-center justify-between bg-primary-light/5 rounded-t-xl">
              <h3 className="font-semibold text-theme flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: stageInfo.color }}
                />
                {stageInfo.label}
              </h3>
              <span className="text-xs font-medium text-secondary bg-surface px-2 py-0.5 rounded-full border border-theme">
                {stageLeads.length}
              </span>
            </div>

            {/* Column Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 relative">
              {stageLeads.map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onView(lead)}
                  className="bg-surface border border-theme rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary transition-colors group relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-theme text-sm">{lead.restaurantName}</h4>
                    <div className="relative">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setOpenDropdownId(openDropdownId === lead.id ? null : lead.id); 
                        }}
                        className={`text-secondary hover:text-theme transition-opacity ${openDropdownId === lead.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                        <MoreVertical size={14} />
                      </button>
                      
                      {openDropdownId === lead.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }} 
                          />
                          <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-theme rounded-lg shadow-lg z-20 py-1">
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-theme hover:bg-primary-light"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                                onEdit(lead);
                              }}
                            >
                              Edit Lead
                            </button>
                            {stageKey === 'converted' && (
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary-light font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  onConvert(lead);
                                }}
                              >
                                Convert to Restaurant
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <User size={12} className="flex-shrink-0" />
                      <span className="truncate">{lead.contactPerson}</span>
                    </div>
                    {lead.address?.city && (
                      <div className="flex items-center gap-2 text-xs text-secondary">
                        <MapPin size={12} className="flex-shrink-0" />
                        <span className="truncate">{lead.address.city}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <Phone size={12} className="flex-shrink-0" />
                      <span>{lead.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}


