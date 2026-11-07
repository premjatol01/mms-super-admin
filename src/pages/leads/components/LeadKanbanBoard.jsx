import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { leadStages, stageOrder } from "../data/leadData";
import { MapPin, Phone, MoreVertical, User } from "lucide-react";

export default function LeadKanbanBoard({ 
  leads, 
  onView, 
  onChangeStage, 
  onConvert,
  onEdit
}) {
  const [draggedLead, setDraggedLead] = useState(null);
  const [dropdownMenu, setDropdownMenu] = useState(null);

  useEffect(() => {
    if (!dropdownMenu) return;

    const handleClose = () => setDropdownMenu(null);
    window.addEventListener("click", handleClose);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);

    return () => {
      window.removeEventListener("click", handleClose);
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [dropdownMenu]);

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

  const handleToggleDropdown = (e, lead, stageKey) => {
    e.stopPropagation();
    if (dropdownMenu?.id === lead.id) {
      setDropdownMenu(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = stageKey === 'converted' ? 85 : 45;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

    setDropdownMenu({
      id: lead.id,
      lead,
      stageKey,
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      right: Math.max(16, window.innerWidth - rect.right),
    });
  };

  return (
    <div className="flex-1 min-h-0 flex overflow-x-auto gap-4 pb-2">
      {stageOrder.map((stageKey) => {
        const stageInfo = leadStages.find(s => s.value === stageKey);
        const stageLeads = leads.filter(l => l.stage === stageKey);

        return (
          <div 
            key={stageKey}
            className="flex-none w-80 h-full min-h-0 bg-surface border border-theme rounded-xl flex flex-col overflow-hidden shadow-sm"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stageKey)}
          >
            {/* Column Header */}
            <div className="flex-none p-3 border-b border-theme flex items-center justify-between bg-primary-light/5">
              <h3 className="font-semibold text-theme text-sm flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: stageInfo?.color || "#d9480f" }}
                />
                {stageInfo?.label || stageKey}
              </h3>
              <span className="text-xs font-semibold text-secondary bg-surface px-2 py-0.5 rounded-full border border-theme">
                {stageLeads.length}
              </span>
            </div>

            {/* Column Body - vertically scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 relative">
              {stageLeads.length === 0 ? (
                <div className="h-28 flex items-center justify-center border border-dashed border-theme rounded-lg text-xs text-secondary">
                  No leads in this stage
                </div>
              ) : (
                stageLeads.map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onView(lead)}
                    className="bg-surface border border-theme rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary transition-colors group relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-theme text-sm truncate mr-2">{lead.restaurantName}</h4>
                      <button 
                        onClick={(e) => handleToggleDropdown(e, lead, stageKey)}
                        className={`text-secondary hover:text-theme p-1 rounded transition-opacity cursor-pointer ${
                          dropdownMenu?.id === lead.id ? 'opacity-100 text-primary' : 'opacity-0 group-hover:opacity-100'
                        }`}
                        title="Actions"
                      >
                        <MoreVertical size={14} />
                      </button>
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
                ))
              )}
            </div>
          </div>
        );
      })}

      {/* Portal Dropdown Menu */}
      {dropdownMenu && createPortal(
        <div
          id="lead-card-dropdown"
          style={{
            position: "fixed",
            top: `${dropdownMenu.top}px`,
            right: `${dropdownMenu.right}px`,
            zIndex: 99999,
          }}
          className="bg-surface border border-theme rounded-lg shadow-xl w-44 py-1 animate-in fade-in duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-theme hover:bg-primary-light/50 cursor-pointer transition-colors"
            onClick={() => {
              const target = dropdownMenu.lead;
              setDropdownMenu(null);
              onEdit(target);
            }}
          >
            Edit Lead
          </button>
          {dropdownMenu.stageKey === 'converted' && (
            <button
              className="w-full text-left px-3.5 py-2 text-xs font-medium text-primary hover:bg-primary-light/50 cursor-pointer transition-colors"
              onClick={() => {
                const target = dropdownMenu.lead;
                setDropdownMenu(null);
                onConvert(target);
              }}
            >
              Convert to Restaurant
            </button>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
