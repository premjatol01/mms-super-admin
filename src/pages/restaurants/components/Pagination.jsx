import { ChevronLeft, ChevronRight } from "lucide-react";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

export default function Pagination({ 
  pagination, 
  totalItems = 0, 
  onPageChange, 
  onLimitChange,
  itemName = "records"
}) {
  const { page = 1, limit = 10 } = pagination || {};
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div className="flex-none flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-theme bg-surface">
      <p className="text-xs sm:text-sm text-secondary">
        Showing <span className="font-semibold text-theme">{startItem}</span>–<span className="font-semibold text-theme">{endItem}</span> of <span className="font-semibold text-theme">{totalItems}</span> {itemName}
      </p>
      
      <div className="flex items-center gap-3">
        <Select 
          value={String(limit)} 
          onChange={(v) => onLimitChange?.(Number(v))} 
          options={[
            { value: "10", label: "10 / page" },
            { value: "20", label: "20 / page" },
            { value: "50", label: "50 / page" },
          ]} 
          className="w-28 sm:w-32"
        />
        
        <div className="flex items-center gap-1">
          <Button 
            variant="secondary" 
            size="sm" 
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
            className="px-2"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </Button>
          
          <span className="px-2.5 py-1 text-xs sm:text-sm text-theme font-medium whitespace-nowrap">
            Page {page} of {totalPages}
          </span>
          
          <Button 
            variant="secondary" 
            size="sm" 
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
            className="px-2"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
