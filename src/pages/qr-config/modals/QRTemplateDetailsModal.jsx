import { X } from "lucide-react";
import { useQrConfigStore } from "../data/useQrConfigStore";
import QRTemplatePreview from "../components/QRTemplatePreview";
import StatusBadge from "../components/StatusBadge";

export default function QRTemplateDetailsModal() {
  const template = useQrConfigStore((s) => s.templateDetailsModal);
  const close = useQrConfigStore((s) => s.closeTemplateDetails);
  const openTemplateForm = useQrConfigStore((s) => s.openTemplateForm);

  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-theme">
            Template Details
          </h3>
          <button
            onClick={close}
            className="rounded-lg p-1 text-secondary hover:bg-primary-light/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <QRTemplatePreview name={template.name} size="lg" />
        </div>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-theme pb-2">
            <dt className="text-secondary">Template Name</dt>
            <dd className="font-medium text-theme">{template.name}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-theme pb-2">
            <dt className="text-secondary">Type</dt>
            <dd className="font-medium text-theme">{template.type}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-theme pb-2">
            <dt className="text-secondary">Status</dt>
            <dd>
              <StatusBadge status={template.status} />
            </dd>
          </div>
          <div className="flex items-center justify-between border-b border-theme pb-2">
            <dt className="text-secondary">Created</dt>
            <dd className="font-medium text-theme">{template.createdAt}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-secondary">Updated</dt>
            <dd className="font-medium text-theme">{template.updatedAt}</dd>
          </div>
        </dl>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={close}
            className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-primary-light/20"
          >
            Close
          </button>
          <button
            onClick={() => {
              close();
              openTemplateForm("edit", template);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Edit Template
          </button>
        </div>
      </div>
    </div>
  );
}
