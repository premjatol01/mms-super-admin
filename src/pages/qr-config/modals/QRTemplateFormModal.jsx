import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useQrConfigStore } from "../data/useQrConfigStore";
import QRTemplatePreview from "../components/QRTemplatePreview";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Template name must be at least 2 characters.")
    .max(40, "Template name must be under 40 characters."),
  type: z.enum(["Default", "Premium"]),
  status: z.enum(["Active", "Inactive"]),
});

export default function QRTemplateFormModal() {
  const modal = useQrConfigStore((s) => s.templateFormModal);
  const close = useQrConfigStore((s) => s.closeTemplateForm);
  const addTemplate = useQrConfigStore((s) => s.addTemplate);
  const updateTemplate = useQrConfigStore((s) => s.updateTemplate);
  const templates = useQrConfigStore((s) => s.templates);

  const isEdit = modal?.mode === "edit";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "Default", status: "Active" },
  });

  useEffect(() => {
    if (modal?.template) {
      reset({
        name: modal.template.name,
        type: modal.template.type,
        status: modal.template.status,
      });
    } else {
      reset({ name: "", type: "Default", status: "Active" });
    }
  }, [modal, reset]);

  if (!modal) return null;

  const watchName = watch("name") || "New Template";

  const onSubmit = (values) => {
    const duplicate = templates.some(
      (t) =>
        t.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
        t.id !== modal.template?.id
    );
    if (duplicate) {
      toast.error("A template with this name already exists.");
      return;
    }

    if (isEdit) {
      updateTemplate(modal.template.id, values);
      toast.success("QR template updated successfully.");
    } else {
      addTemplate(values);
      toast.success("QR template created successfully.");
    }
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-theme">
            {isEdit ? "Edit Template" : "Add Template"}
          </h3>
          <button
            onClick={close}
            className="rounded-lg p-1 text-secondary hover:bg-primary-light/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="flex justify-center">
            <QRTemplatePreview name={watchName} size="lg" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-theme">
              Template Name *
            </label>
            <input
              {...register("name")}
              placeholder="Enter template name"
              className="w-full rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-theme">
              Template Type *
            </label>
            <select
              {...register("type")}
              className="w-full rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
            >
              <option value="Default">Default</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-theme">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-primary-light/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isEdit ? "Save Changes" : "Add Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
