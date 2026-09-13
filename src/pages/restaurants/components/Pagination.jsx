import { ChevronLeft, ChevronRight } from "lucide-react";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

export default function Pagination({ pagination, totalItems, onPageChange, onLimitChange }) {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(totalItems / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-theme bg-surface rounded-b-xl">
      <p className="text-sm text-secondary">
        Showing <span className="font-medium text-theme">{startItem}</span>–<span className="font-medium text-theme">{endItem}</span> of <span className="font-medium text-theme">{totalItems}</span> restaurants
      </p>
      
      <div className="flex items-center gap-3">
        <Select 
          value={String(limit)} 
          onChange={(v) => onLimitChange(Number(v))} 
          options={[
            { value: "10", label: "10 / page" },
            { value: "20", label: "20 / page" },
            { value: "50", label: "50 / page" },
          ]} 
          className="w-32"
        />
        
        <div className="flex items-center gap-1">
          <Button 
            variant="secondary" 
            size="sm" 
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-2"
          >
            <ChevronLeft size={16} />
          </Button>
          
          <span className="px-3 py-1.5 text-sm text-theme">
            Page {page} of {totalPages}
          </span>
          
          <Button 
            variant="secondary" 
            size="sm" 
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-2"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}