import { Star } from "lucide-react";
import ModalShell from "../components/ModalShell.jsx";

function PagePreview({ page }) {
  return (
    <div className="rounded-lg border border-theme bg-white p-6">
      {page.blocks?.length ? (
        <div className="space-y-4">
          {page.blocks.map((block) => {
            if (block.type === "heading") {
              return (
                <h2 key={block.id} className="text-2xl font-semibold text-gray-900">
                  {block.content || "Heading"}
                </h2>
              );
            }
            if (block.type === "button") {
              return (
                <button
                  key={block.id}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                  {block.content || "Button"}
                </button>
              );
            }
            if (block.type === "image") {
              return (
                <div
                  key={block.id}
                  className="flex h-40 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400"
                >
                  {block.content || "Image placeholder"}
                </div>
              );
            }
            return (
              <p key={block.id} className="text-sm leading-relaxed text-gray-600">
                {block.content || "Text content"}
              </p>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-400">This page has no content blocks yet.</p>
      )}
    </div>
  );
}

function TestimonialPreview({ testimonial }) {
  return (
    <div className="rounded-lg border border-theme bg-white p-6">
      <div className="flex gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4"
            fill={i < (testimonial.rating || 0) ? "currentColor" : "none"}
          />
        ))}
      </div>
      <p className="mt-3 text-sm italic text-gray-700">&ldquo;{testimonial.content}&rdquo;</p>
      <p className="mt-3 text-sm font-medium text-gray-900">{testimonial.name}</p>
      {testimonial.role && <p className="text-xs text-gray-500">{testimonial.role}</p>}
    </div>
  );
}

function ReviewPreview({ review }) {
  return (
    <div className="rounded-lg border border-theme bg-white p-6">
      <div className="flex gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4"
            fill={i < (review.rating || 0) ? "currentColor" : "none"}
          />
        ))}
      </div>
      <p className="mt-3 text-sm italic text-gray-700">&ldquo;{review.content}&rdquo;</p>
      <p className="mt-3 text-sm font-medium text-gray-900">{review.reviewer}</p>
    </div>
  );
}

function StaticContentPreview({ data }) {
  const { hero, general } = data;
  return (
    <div className="overflow-hidden rounded-lg border border-theme bg-white">
      <div className="bg-gray-50 px-8 py-14 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">{hero.heading || "Hero heading"}</h2>
        <p className="mt-1 text-lg text-gray-500">{hero.subheading}</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-gray-600">{hero.description}</p>
        <div className="mt-5 flex justify-center gap-3">
          {hero.primaryButtonText && (
            <span className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
              {hero.primaryButtonText}
            </span>
          )}
          {hero.secondaryButtonText && (
            <span className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
              {hero.secondaryButtonText}
            </span>
          )}
        </div>
      </div>
      <div className="border-t border-theme bg-white px-8 py-6 text-center text-xs text-gray-500">
        <p>{general.footerText}</p>
        <p className="mt-1">
          {general.contactInformation} · {general.platformAddress}
        </p>
        <p className="mt-1">{general.copyrightText}</p>
      </div>
    </div>
  );
}

export default function PreviewModal({ open, type, data, onClose }) {
  if (!open || !data) return null;

  const titles = {
    page: `Preview — ${data.name || "Untitled page"}`,
    testimonial: "Preview — Testimonial",
    review: "Preview — Review",
    static: "Preview — Homepage hero & footer",
  };

  return (
    <ModalShell open={open} title={titles[type] || "Preview"} onClose={onClose} wide>
      <p className="mb-3 text-xs text-secondary">
        This is an approximation of how the content will appear on the public website.
      </p>
      {type === "page" && <PagePreview page={data} />}
      {type === "testimonial" && <TestimonialPreview testimonial={data} />}
      {type === "review" && <ReviewPreview review={data} />}
      {type === "static" && <StaticContentPreview data={data} />}
    </ModalShell>
  );
}
