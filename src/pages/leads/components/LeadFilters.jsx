import { useState, useMemo, useEffect, useRef } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

export default function LeadFilters({ 
  filters, 
  onFilterChange, 
  onResetFilters, 
  leadCount,
  cities = []
}) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const drawerRef = useRef(null);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(v => v && v !== "");
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setShowFilterDrawer(false);
      }
    };
    if (showFilterDrawer) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterDrawer]);

  const cityOptions = useMemo(() => {
    return cities.map(c => ({ value: c.toLowerCase(), label: c }));
  }, [cities]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search restaurant, contact person, phone or email..."
            className="w-full px-4 py-2.5 rounded-lg border border-theme text-sm text-theme bg-surface focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-theme"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 relative" ref={drawerRef}>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className="relative"
        >
          <SlidersHorizontal size={14} /> 
          Filters 
          {hasActiveFilters && (
            <span className="ml-1.5 w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            <X size={14} /> Clear
          </Button>
        )}

        {showFilterDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilterDrawer(false)} />
            <div className="relative bg-surface w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-theme bg-surface">
                <h2 className="text-lg font-semibold text-theme">Filters</h2>
                <button 
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Select 
                  label="Lead Stage" 
                  value={filters.stage} 
                  onChange={(v) => onFilterChange("stage", v)} 
                  options={[
                    { value: "prospect", label: "Prospect" },
                    { value: "new_lead", label: "New Lead" },
                    { value: "contacted", label: "Contacted" },
                    { value: "qualified", label: "Qualified" },
                    { value: "interested", label: "Interested" },
                    { value: "follow_up", label: "Follow-up" },
                    { value: "converted", label: "Converted" },
                    { value: "lost", label: "Lost" },
                  ]} 
                  placeholder="All Stages" 
                />
                
                <Select 
                  label="Status" 
                  value={filters.status} 
                  onChange={(v) => onFilterChange("status", v)} 
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]} 
                  placeholder="All Status" 
                />
                
                <Select 
                  label="Location" 
                  value={filters.city} 
                  onChange={(v) => onFilterChange("city", v)} 
                  options={cityOptions.length > 0 ? cityOptions : [
                    { value: "mumbai", label: "Mumbai" },
                    { value: "delhi", label: "Delhi" },
                    { value: "bangalore", label: "Bangalore" },
                    { value: "ahmedabad", label: "Ahmedabad" },
                    { value: "jaipur", label: "Jaipur" },
                    { value: "udaipur", label: "Udaipur" },
                    { value: "jodhpur", label: "Jodhpur" },
                  ]} 
                  placeholder="All Locations" 
                />
                
                <Select 
                  label="Created Date" 
                  value={filters.dateRange} 
                  onChange={(v) => onFilterChange("dateRange", v)} 
                  options={[
                    { value: "today", label: "Today" },
                    { value: "this_week", label: "This Week" },
                    { value: "this_month", label: "This Month" },
                  ]} 
                  placeholder="All Time" 
                />

                <Select 
                  label="Conversion Status" 
                  value={filters.converted} 
                  onChange={(v) => onFilterChange("converted", v)} 
                  options={[
                    { value: "converted", label: "Converted" },
                    { value: "not_converted", label: "Not Converted" },
                  ]} 
                  placeholder="All" 
                />
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-theme bg-surface flex gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    onResetFilters();
                    setShowFilterDrawer(false);
                  }}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button 
                  onClick={() => setShowFilterDrawer(false)}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}