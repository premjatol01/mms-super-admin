import { z } from "zod";

const MAX_IMAGE_SIZE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

// `isEditMode` relaxes the image requirement: an existing QR code already
// has an image, so re-uploading one is optional on edit, required on add.
export const getQrConfigSchema = (isEditMode) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(60, "Name must be under 60 characters"),
      description: z
        .string()
        .trim()
        .max(300, "Description must be under 300 characters")
        .optional()
        .or(z.literal("")),
      image: z
        .any()
        .optional()
        .refine(
          (file) => !file || file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024,
          `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`
        )
        .refine(
          (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Image must be PNG, JPG, or SVG"
        ),
      assignment: z.enum(["all", "restaurant"]),
      restaurantId: z.string().optional().nullable(),
    })
    .refine((data) => isEditMode || !!data.image, {
      message: "Please upload a QR code image",
      path: ["image"],
    })
    .refine(
      (data) => data.assignment !== "restaurant" || !!data.restaurantId,
      {
        message: "Please select a restaurant",
        path: ["restaurantId"],
      }
    );
