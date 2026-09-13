export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-secondary">
        Showing {start}–{end} of {total} features
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-theme px-3 py-1.5 text-sm text-theme disabled:opacity-40"
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 rounded-lg text-sm font-medium ${
              p === page
                ? "bg-primary text-white"
                : "text-secondary hover:bg-primary-light/20"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-theme px-3 py-1.5 text-sm text-theme disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
