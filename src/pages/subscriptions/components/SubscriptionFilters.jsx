import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import { getAllPackages } from "../data/packageHelper";
import { durationOptions } from "../data/subscriptionData";

export default function SubscriptionFilters({ 
  filters, 
  onFilterChange, 
  onResetFilters, 
  subscriptionCount 
}) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const drawerRef = useRef(null);
  const packages = getAllPackages();

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

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search restaurant, admin, package..."
            className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-theme text-sm text-theme bg-surface focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
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
                  label="Status" 
                  value={filters.status} 
                  onChange={(v) => onFilterChange("status", v)} 
                  options={[
                    { value: "active", label: "Active" },
                    { value: "expiring", label: "Expiring Soon" },
                    { value: "expired", label: "Expired" },
                    { value: "cancelled", label: "Cancelled" },
                    { value: "scheduled", label: "Scheduled" },
                  ]} 
                  placeholder="All Status" 
                />
                
                <Select 
                  label="Package" 
                  value={filters.package} 
                  onChange={(v) => onFilterChange("package", v)} 
                  options={packages.map(p => ({ value: p.name, label: p.name }))}
                  placeholder="All Packages" 
                />

                <Select 
                  label="Duration" 
                  value={filters.duration} 
                  onChange={(v) => onFilterChange("duration", v)} 
                  options={durationOptions}
                  placeholder="All Durations" 
                />
              </div>

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