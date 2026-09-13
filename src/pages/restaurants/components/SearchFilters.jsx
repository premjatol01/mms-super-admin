import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";

export default function SearchFilters({ 
  filters, 
  onFilterChange, 
  onResetFilters, 
  restaurantCount 
}) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const drawerRef = useRef(null);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(v => v && v !== "");
  }, [filters]);

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
            placeholder="Search by name, admin, email, or phone..."
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
          {showFilterDrawer ? <ChevronDown size={14} className="rotate-180" /> : <ChevronDown size={14} />}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            <X size={14} /> Clear
          </Button>
        )}

        {/* Filter Side Popup/Drawer */}
        {showFilterDrawer && (
          <div className="absolute right-0 top-full mt-2 bg-surface border border-theme rounded-xl shadow-xl z-50 w-80 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-theme">Filters</h3>
              <button 
                onClick={() => setShowFilterDrawer(false)}
                className="p-1 text-secondary hover:text-theme"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
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
                label="Subscription Status" 
                value={filters.subscriptionStatus} 
                onChange={(v) => onFilterChange("subscriptionStatus", v)} 
                options={[
                  { value: "active", label: "Active" },
                  { value: "expired", label: "Expired" },
                  { value: "pending", label: "Pending" },
                ]} 
                placeholder="All" 
              />
              
              <Select 
                label="Package" 
                value={filters.package} 
                onChange={(v) => onFilterChange("package", v)} 
                options={[
                  { value: "basic", label: "Basic" },
                  { value: "standard", label: "Standard" },
                  { value: "premium", label: "Premium" },
                ]} 
                placeholder="All Packages" 
              />
              
              <Select 
                label="City" 
                value={filters.city} 
                onChange={(v) => onFilterChange("city", v)} 
                options={[
                  { value: "mumbai", label: "Mumbai" },
                  { value: "delhi", label: "Delhi" },
                  { value: "bangalore", label: "Bangalore" },
                  { value: "ahmedabad", label: "Ahmedabad" },
                  { value: "chennai", label: "Chennai" },
                ]} 
                placeholder="All Cities" 
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  type="date" 
                  label="From Date" 
                  value={filters.dateFrom} 
                  onChange={(e) => onFilterChange("dateFrom", e.target.value)} 
                />
                <Input 
                  type="date" 
                  label="To Date" 
                  value={filters.dateTo} 
                  onChange={(e) => onFilterChange("dateTo", e.target.value)} 
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-theme">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => {
                    onResetFilters();
                    setShowFilterDrawer(false);
                  }}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setShowFilterDrawer(false)}
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}