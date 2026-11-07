import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

export default function PackageFilters({ 
  filters, 
  onFilterChange, 
  onApplyFilters,
  onResetFilters, 
  packageCount 
}) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const drawerRef = useRef(null);

  // Draft filters state inside drawer
  const [draftFilters, setDraftFilters] = useState({
    status: filters.status || "",
    duration: filters.duration || "",
  });

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(v => v && v !== "");
  }, [filters]);

  // Sync draft filters when drawer opens
  useEffect(() => {
    if (showFilterDrawer) {
      setDraftFilters({
        status: filters.status || "",
        duration: filters.duration || "",
      });
    }
  }, [showFilterDrawer, filters]);

  // Close drawer when clicking outside
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
      status: "",
      duration: "",
    });
    onResetFilters();
    setShowFilterDrawer(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="flex-1">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search packages..."
            className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-theme text-sm text-theme bg-surface focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
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

      {/* Filter Button & Reset */}
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

        {/* Filter Drawer */}
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
                  label="Available Duration" 
                  value={draftFilters.duration} 
                  onChange={(v) => handleDraftChange("duration", v)} 
                  options={[
                    { value: "1_month", label: "1 Month (30 Days)" },
                    { value: "6_months", label: "6 Months (180 Days)" },
                    { value: "12_months", label: "12 Months / 1 Year" },
                  ]} 
                  placeholder="All Durations" 
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
