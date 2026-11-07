import { useState, useMemo, useEffect, useRef } from "react";
import { X, SlidersHorizontal, Plus } from "lucide-react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

export default function LeadFilters({ 
  filters, 
  onFilterChange, 
  onApplyFilters,
  onResetFilters, 
  leadCount,
  cities = [],
  onAdd
}) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const drawerRef = useRef(null);

  // Draft filters state inside drawer
  const [draftFilters, setDraftFilters] = useState({
    stage: filters.stage || "",
    status: filters.status || "",
    city: filters.city || "",
    dateRange: filters.dateRange || "",
    converted: filters.converted || "",
  });

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(v => v && v !== "");
  }, [filters]);

  // Sync draft filters when drawer opens
  useEffect(() => {
    if (showFilterDrawer) {
      setDraftFilters({
        stage: filters.stage || "",
        status: filters.status || "",
        city: filters.city || "",
        dateRange: filters.dateRange || "",
        converted: filters.converted || "",
      });
    }
  }, [showFilterDrawer, filters]);

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

  const handleDraftChange = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(draftFilters);
    } else {
      Object.entries(draftFilters).forEach(([k, v]) => onFilterChange(k, v));
    }
    setShowFilterDrawer(false);
  };

  const handleReset = () => {
    setDraftFilters({
      stage: "",
      status: "",
      city: "",
      dateRange: "",
      converted: "",
    });
    onResetFilters();
    setShowFilterDrawer(false);
  };

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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-theme cursor-pointer"
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

        {onAdd && (
          <Button size="sm" onClick={onAdd}>
            <Plus size={14} /> Add Lead
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
                  className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Select 
                  label="Lead Stage" 
                  value={draftFilters.stage} 
                  onChange={(v) => handleDraftChange("stage", v)} 
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
                  value={draftFilters.status} 
                  onChange={(v) => handleDraftChange("status", v)} 
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]} 
                  placeholder="All Status" 
                />
                
                <Select 
                  label="Location" 
                  value={draftFilters.city} 
                  onChange={(v) => handleDraftChange("city", v)} 
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
                  value={draftFilters.dateRange} 
                  onChange={(v) => handleDraftChange("dateRange", v)} 
                  options={[
                    { value: "today", label: "Today" },
                    { value: "this_week", label: "This Week" },
                    { value: "this_month", label: "This Month" },
                  ]} 
                  placeholder="All Time" 
                />

                <Select 
                  label="Conversion Status" 
                  value={draftFilters.converted} 
                  onChange={(v) => handleDraftChange("converted", v)} 
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
                  onClick={handleReset}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button 
                  onClick={handleApply}
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
