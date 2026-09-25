import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { X, Upload, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { getQrConfigSchema } from "../data/qrConfigSchema";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "40px",
    borderRadius: "8px",
    borderColor: state.isFocused
      ? "var(--color-primary)"
      : "var(--color-border)",
    boxShadow: "none",
    backgroundColor: "var(--color-surface)",
    "&:hover": { borderColor: "var(--color-primary)" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--color-surface)",
    zIndex: 20,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--color-secondary-light)" : "transparent",
    color: "var(--color-text)",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "var(--color-text)" }),
};

export default function QrFormModal({ qrCode, restaurants, onClose, onSubmit }) {
  const isEditMode = Boolean(qrCode);
  const [preview, setPreview] = useState(qrCode?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getQrConfigSchema(isEditMode)),
    defaultValues: {
      name: qrCode?.name || "",
      description: qrCode?.description || "",
      image: undefined,
      assignment: qrCode?.assignment || "all",
      restaurantId: qrCode?.restaurantId || null,
    },
  });

  const assignment = watch("assignment");

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("image", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const restaurantOptions = (restaurants || []).map((r) => ({
    value: r.id,
    label: r.name,
  }));

  const submitHandler = async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values, qrCode);
      toast.success(isEditMode ? "QR code updated" : "QR code added");
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-surface p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-theme">
            {isEditMode ? "Edit QR Code" : "Add QR Code"}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-theme"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="mt-4 flex flex-col gap-4"
        >
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-theme">
              Name
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Table Ordering – Patio"
              className="w-full rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-theme outline-none focus:border-primary"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium text-theme">
              Description <span className="text-secondary">(optional)</span>
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="What is this QR code used for?"
              className="w-full resize-none rounded-lg border border-theme bg-surface px-3 py-2 text-sm text-theme outline-none focus:border-primary"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image upload */}
          <div>
            <label className="mb-1 block text-xs font-medium text-theme">
              QR Code Image
            </label>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-theme bg-theme">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                ) : (
                  <ImageOff size={18} className="text-secondary" />
                )}
              </div>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-theme px-3 py-2 text-xs font-medium text-theme hover:bg-theme">
                <Upload size={14} />
                {preview ? "Replace image" : "Upload image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.image && (
              <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>
            )}
          </div>

          {/* Assignment */}
          <div>
            <label className="mb-2 block text-xs font-medium text-theme">
              Assign to
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-theme">
                <input
                  type="radio"
                  value="all"
                  {...register("assignment")}
                  className="accent-[var(--color-primary)]"
                />
                All users
              </label>
              <label className="flex items-center gap-2 text-sm text-theme">
                <input
                  type="radio"
                  value="restaurant"
                  {...register("assignment")}
                  className="accent-[var(--color-primary)]"
                />
                Specific restaurant
              </label>
            </div>

            {assignment === "restaurant" && (
              <div className="mt-2">
                <Controller
                  name="restaurantId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={restaurantOptions}
                      styles={selectStyles}
                      placeholder="Select a restaurant"
                      value={
                        restaurantOptions.find((o) => o.value === field.value) ||
                        null
                      }
                      onChange={(option) => field.onChange(option?.value || null)}
                    />
                  )}
                />
                {errors.restaurantId && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.restaurantId.message}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-secondary">
                  Only visible to that restaurant's admin.
                </p>
              </div>
            )}
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-theme px-3.5 py-2 text-sm font-medium text-theme hover:bg-theme"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-theme hover:bg-primary-light disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save changes"
                : "Add QR Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
