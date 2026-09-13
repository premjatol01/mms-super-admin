export default function Pagination({ pagination, totalItems, onPageChange, onLimitChange }) {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-sm text-secondary">
        Showing {start}–{end} of {totalItems} leads
      </div>
      
      <div className="flex items-center gap-2">
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="px-2 py-1 rounded border border-theme text-sm text-theme bg-surface"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded border border-theme text-theme hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  page === pageNum 
                    ? "bg-primary text-white" 
                    : "border border-theme text-theme hover:bg-primary-light"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded border border-theme text-theme hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}