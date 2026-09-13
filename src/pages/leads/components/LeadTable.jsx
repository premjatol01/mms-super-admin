import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Edit2, ArrowRight, Building2, X } from "lucide-react";
import LeadStageBadge from "./LeadStageBadge";
import LeadStatusBadge from "./LeadStatusBadge";

export default function LeadTable({ 
  leads, 
  selectedLeads, 
  onToggleSelect, 
  onToggleSelectAll,
  onView,
  onEdit,
  onConvert,
  onChangeStage,
  onViewRestaurant
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSelected = leads.length > 0 && leads.every(l => selectedLeads.includes(l.id));

  const handleActionClick = (action, lead) => {
    setOpenDropdownId(null);
    action(lead);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getLocation = (lead) => {
    if (!lead.address) return "-";
    return lead.address.city || "-";
  };

  if (leads.length === 0) {
    return (
      <div className="bg-surface border border-theme rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-light/20">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={false} onChange={() => {}} className="rounded border-theme opacity-50" disabled />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Lead ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-48">Restaurant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-32">Contact Person</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-28">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-40">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Stage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-20">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center text-secondary">
                  No leads found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-theme rounded-xl overflow-hidden" ref={containerRef}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary-light/20">
            <tr>
              <th className="px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  checked={allSelected} 
                  onChange={onToggleSelectAll} 
                  className="rounded border-theme" 
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Lead ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-48">Restaurant</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-32">Contact Person</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-28">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-40">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Stage</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-20">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-theme hover:bg-primary-light/10 transition-colors">
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    checked={selectedLeads.includes(lead.id)} 
                    onChange={() => onToggleSelect(lead.id)} 
                    className="rounded border-theme" 
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-theme">{lead.id}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-theme truncate">{lead.restaurantName}</p>
                  {lead.restaurantType && <p className="text-xs text-secondary">{lead.restaurantType}</p>}
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme truncate">{lead.contactPerson}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme">{lead.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme truncate">{lead.email || "-"}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme">{getLocation(lead)}</p>
                </td>
                <td className="px-4 py-3">
                  <LeadStageBadge stage={lead.stage} />
                </td>
                <td className="px-4 py-3">
                  <LeadStatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme">{formatDate(lead.createdAt)}</p>
                </td>
                <td className="px-4 py-3 relative">
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === lead.id ? null : lead.id);
                      }}
                      className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors"
                    >
                      {openDropdownId === lead.id ? <X size={16} /> : <MoreHorizontal size={16} />}
                    </button>
                    
                    {openDropdownId === lead.id && (
                      <div className="absolute right-0 top-full mt-1 bg-surface border border-theme rounded-lg shadow-lg z-20 w-44">
                        <button 
                          onClick={() => handleActionClick(onView, lead)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light rounded-t-lg transition-colors"
                        >
                          <Eye size={14} /> View Details
                        </button>
                        <button 
                          onClick={() => handleActionClick(onEdit, lead)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light transition-colors"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        
                        {lead.stage !== "converted" && (
                          <button 
                            onClick={() => handleActionClick(onConvert, lead)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-colors"
                          >
                            <ArrowRight size={14} /> Convert Lead
                          </button>
                        )}
                        
                        {lead.stage === "converted" && lead.convertedRestaurantId && (
                          <button 
                            onClick={() => handleActionClick(onViewRestaurant, lead)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-primary hover:bg-primary-light transition-colors"
                          >
                            <Building2 size={14} /> View Restaurant
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}