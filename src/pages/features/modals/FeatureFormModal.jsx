import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Lock } from "lucide-react";
import { toast } from "sonner";
import { useFeatureStore } from "../data/useFeatureStore";
import { CATEGORIES } from "../data/mockData";

const keyPattern = /^[a-z][a-z0-9_]*$/;

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Feature name must be at least 2 characters.")
    .max(60, "Feature name must be under 60 characters."),
  key: z
    .string()
    .trim()
    .min(2, "Feature key must be at least 2 characters.")
    .max(40, "Feature key must be under 40 characters.")
    .regex(
      keyPattern,
      "Use lowercase letters, numbers and underscores only (e.g. restaurant_website)."
    ),
  category: z.enum(CATEGORIES),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(240, "Description must be under 240 characters."),
  status: z.enum(["Active", "Inactive"]),
  displayOrder: z
    .number({ invalid_type_error: "Display order must be a number." })
    .int("Display order must be a whole number.")
    .nonnegative("Display order cannot be negative."),
});

export default function FeatureFormModal() {
  const modal = useFeatureStore((s) => s.formModal);
  const closeForm = useFeatureStore((s) => s.closeForm);
  const addFeature = useFeatureStore((s) => s.addFeature);
  const updateFeature = useFeatureStore((s) => s.updateFeature);
  const isKeyTaken = useFeatureStore((s) => s.isKeyTaken);
  const isNameTaken = useFeatureStore((s) => s.isNameTaken);
  const openUnsavedModal = useFeatureStore((s) => s.openUnsavedModal);

  const isEdit = modal?.mode === "edit";
  const feature = modal?.feature;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      key: "",
      category: "QR",
      description: "",
      status: "Active",
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (feature) {
      reset({
        name: feature.name,
        key: feature.key,
        category: feature.category,
        description: feature.description,
        status: feature.status,
        displayOrder: feature.displayOrder ?? 0,
      });
    } else {
      reset({
        name: "",
        key: "",
        category: "QR",
        description: "",
        status: "Active",
        displayOrder: 0,
      });
    }
  }, [feature, reset]);

  if (!modal) return null;

  const attemptClose = () => {
    if (isDirty) {
      openUnsavedModal(() => closeForm());
    } else {
      closeForm();
    }
  };

  const onSubmit = (values) => {
    if (isNameTaken(values.name, feature?.id)) {
      toast.error("A feature with this name already exists.");
      return;
    }
    if (!isEdit && isKeyTaken(values.key, feature?.id)) {
      toast.error("A feature with this key already exists.");
      return;
    }

    if (isEdit) {
      // Feature key is read-only after creation — never overwritten here.
      const { key: _key, ...rest } = values;
      updateFeature(feature.id, rest);
      toast.success("Feature updated successfully.");
    } else {
      addFeature(values);
      toast.success("Feature created successfully.");
    }
    closeForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-theme">
            {isEdit ? "Edit Feature" : "Add Feature"}
          </h3>
          <button
            onClick={attemptClose}
            className="rounded-lg p-1 text-secondary hover:bg-primary-light/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-theme">
              Feature Name *
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Restaurant Website"
              className="w-full rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-theme">
              Feature Key *
              {isEdit && <Lock className="h-3.5 w-3.5 text-secondary" />}
            </label>
            <input
              {...register("key")}
              disabled={isEdit}
              placeholder="e.g. restaurant_website"
              className="w-full rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary disabled:opacity-60"
            />
            {isEdit ? (
              <p className="mt-1 text-xs text-secondary">
                Feature key cannot be changed after creation.
              </p>
            ) : (
              errors.key && (
                <p className="mt-1 text-xs text-red-500">{errors.key.message}</p>
              )
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-theme">
              Category *
            </label>
            <select
              {...register("category")}
              className="w-full rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-theme">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Short explanation of what this feature provides."
              className="w-full resize-none rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="mb-1 block text-sm font-medium text-theme">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                {...register("displayOrder", { valueAsNumber: true })}
                className="w-full rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
              />
              {errors.displayOrder && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.displayOrder.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={attemptClose}
              className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-primary-light/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isEdit ? "Save Changes" : "Add Feature"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
