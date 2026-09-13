import { Plus, Search } from "lucide-react";
import { useMemo } from "react";
import { useQrConfigStore } from "../data/useQrConfigStore";
import QRTemplateTable from "./QRTemplateTable";
import QRTemplateCard from "./QRTemplateCard";
import EmptyState from "./EmptyState";

export default function TemplatesTab() {
  const templates = useQrConfigStore((s) => s.templates);
  const search = useQrConfigStore((s) => s.templateSearch);
  const typeFilter = useQrConfigStore((s) => s.templateTypeFilter);
  const statusFilter = useQrConfigStore((s) => s.templateStatusFilter);
  const page = useQrConfigStore((s) => s.templatePage);
  const pageSize = useQrConfigStore((s) => s.templatePageSize);

  const setSearch = useQrConfigStore((s) => s.setTemplateSearch);
  const setTypeFilter = useQrConfigStore((s) => s.setTemplateTypeFilter);
  const setStatusFilter = useQrConfigStore((s) => s.setTemplateStatusFilter);
  const setPage = useQrConfigStore((s) => s.setTemplatePage);

  const openTemplateForm = useQrConfigStore((s) => s.openTemplateForm);
  const openTemplateDetails = useQrConfigStore((s) => s.openTemplateDetails);
  const openConfirm = useQrConfigStore((s) => s.openConfirm);
  const closeConfirm = useQrConfigStore((s) => s.closeConfirm);
  const setTemplateStatus = useQrConfigStore((s) => s.setTemplateStatus);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = t.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesType = typeFilter === "All" || t.type === typeFilter;
      const matchesStatus =
        statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [templates, search, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleToggleStatus = (template) => {
    const nextStatus = template.status === "Active" ? "Inactive" : "Active";
    if (nextStatus === "Inactive") {
      openConfirm({
        title: "Deactivate Template?",
        description:
          "This template will no longer be available for new QR generation.",
        confirmLabel: "Deactivate",
        onConfirm: () => {
          setTemplateStatus(template.id, "Inactive");
          closeConfirm();
        },
      });
    } else {
      setTemplateStatus(template.id, "Active");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-lg border border-theme bg-theme py-2 pl-9 pr-3 text-sm text-theme outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
          >
            <option>All</option>
            <option>Default</option>
            <option>Premium</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button
            onClick={() => openTemplateForm("create")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Template
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No QR templates available."
          description="Create your first QR layout/template."
          actionLabel="+ Add Template"
          onAction={() => openTemplateForm("create")}
        />
      ) : (
        <>
          <QRTemplateTable
            templates={paged}
            onView={openTemplateDetails}
            onEdit={(t) => openTemplateForm("edit", t)}
            onToggleStatus={handleToggleStatus}
          />
          <div className="space-y-3 sm:hidden">
            {paged.map((t) => (
              <QRTemplateCard
                key={t.id}
                template={t}
                onView={openTemplateDetails}
                onEdit={(tp) => openTemplateForm("edit", tp)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          {filtered.length > pageSize && (
            <div className="flex items-center justify-between text-sm text-secondary">
              <span>
                Showing {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div className="flex gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-lg border border-theme px-3 py-1.5 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg border border-theme px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
