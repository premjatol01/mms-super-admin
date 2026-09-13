import { useMemo, useState } from "react";
import { Toaster, toast } from "sonner";

import CMSHeader from "./components/CMSHeader.jsx";
import CMSTabs from "./components/CMSTabs.jsx";
import OverviewTab from "./components/OverviewTab.jsx";
import PagesTab from "./components/PagesTab.jsx";
import StaticContentTab from "./components/StaticContentTab.jsx";
import TestimonialsTab from "./components/TestimonialsTab.jsx";
import ReviewsTab from "./components/ReviewsTab.jsx";
import MediaTab from "./components/MediaTab.jsx";

import PageEditorModal from "./modals/PageEditorModal.jsx";
import TestimonialFormModal from "./modals/TestimonialFormModal.jsx";
import ReviewFormModal from "./modals/ReviewFormModal.jsx";
import MediaUploadModal from "./modals/MediaUploadModal.jsx";
import PreviewModal from "./modals/PreviewModal.jsx";
import ConfirmationModal from "./modals/ConfirmationModal.jsx";
import UnsavedChangesModal from "./modals/UnsavedChangesModal.jsx";

import {
  initialPages,
  initialTestimonials,
  initialReviews,
  initialMedia,
  initialStaticContent,
} from "./data/mockData.js";

const nowIso = () => new Date().toISOString();

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  // Content state — replace with real API data once endpoints are wired up.
  const [pages, setPages] = useState(initialPages);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [reviews, setReviews] = useState(initialReviews);
  const [media, setMedia] = useState(initialMedia);
  const [staticContent, setStaticContent] = useState(initialStaticContent);

  // Modal state
  const [pageEditor, setPageEditor] = useState({ open: false, page: null });
  const [testimonialForm, setTestimonialForm] = useState({ open: false, testimonial: null });
  const [reviewForm, setReviewForm] = useState({ open: false, review: null });
  const [mediaUpload, setMediaUpload] = useState(false);
  const [preview, setPreview] = useState({ open: false, type: null, data: null });
  const [confirmation, setConfirmation] = useState(null); // { title, description, confirmLabel, destructive, onConfirm }
  const [unsaved, setUnsaved] = useState(null); // { onStay, onDiscard, onSave }

  const stats = useMemo(
    () => ({
      totalPages: pages.length,
      published: pages.filter((p) => p.status === "published").length,
      drafts: pages.filter((p) => p.status === "draft").length,
    }),
    [pages]
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  const handlePreviewWebsite = () => {
    toast.info("Opening public website preview...");
  };

  const closeConfirmation = () => setConfirmation(null);

  const requestConfirmation = (config) => setConfirmation(config);

  // ---------- Pages ----------
  const openCreatePage = () => setPageEditor({ open: true, page: null });
  const openEditPage = (page) => setPageEditor({ open: true, page });

  const handlePageEditorClose = (dirty) => {
    if (!dirty) {
      setPageEditor({ open: false, page: null });
      return;
    }
    setUnsaved({
      onStay: () => setUnsaved(null),
      onDiscard: () => {
        setUnsaved(null);
        setPageEditor({ open: false, page: null });
      },
      onSave: () => {
        setUnsaved(null);
        // The editor's own Save/Publish buttons persist data; here we just close.
        setPageEditor({ open: false, page: null });
      },
    });
  };

  const handleSavePage = (form) => {
    const editingId = pageEditor.page?.id;
    if (editingId) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...form,
                updatedAt: nowIso(),
                publishedAt:
                  form.status === "published" ? p.publishedAt || nowIso() : p.publishedAt,
              }
            : p
        )
      );
      toast.success(form.status === "published" ? "Page published successfully." : "Page updated successfully.");
    } else {
      const newPage = {
        ...form,
        id: `pg-${Date.now()}`,
        updatedAt: nowIso(),
        publishedAt: form.status === "published" ? nowIso() : null,
      };
      setPages((prev) => [newPage, ...prev]);
      toast.success("Page created successfully.");
    }
    setPageEditor({ open: false, page: null });
  };

  const handlePreviewPage = (page) => setPreview({ open: true, type: "page", data: page });

  const handleTogglePagePublish = (page) => {
    const publishing = page.status !== "published";
    requestConfirmation({
      title: publishing ? "Publish page?" : "Unpublish page?",
      description: publishing
        ? "This page will become available on the public website."
        : "This page will no longer be publicly visible.",
      confirmLabel: publishing ? "Publish" : "Unpublish",
      onConfirm: () => {
        setPages((prev) =>
          prev.map((p) =>
            p.id === page.id
              ? {
                  ...p,
                  status: publishing ? "published" : "draft",
                  updatedAt: nowIso(),
                  publishedAt: publishing ? nowIso() : p.publishedAt,
                }
              : p
          )
        );
        toast.success(publishing ? "Page published successfully." : "Page unpublished successfully.");
        closeConfirmation();
      },
    });
  };

  const handleDuplicatePage = (page) => {
    const copy = {
      ...page,
      id: `pg-${Date.now()}`,
      name: `${page.name} (Copy)`,
      slug: `${page.slug}-copy`,
      status: "draft",
      updatedAt: nowIso(),
      publishedAt: null,
    };
    setPages((prev) => [copy, ...prev]);
    toast.success("Page duplicated successfully.");
  };

  const handleDeletePage = (page) => {
    requestConfirmation({
      title: "Delete this content?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => {
        setPages((prev) => prev.filter((p) => p.id !== page.id));
        toast.success("Content deleted successfully.");
        closeConfirmation();
      },
    });
  };

  // ---------- Static content ----------
  const handleSaveStaticContent = (next) => {
    setStaticContent(next);
    toast.success("Content updated successfully.");
  };

  const handlePreviewStatic = (data) => setPreview({ open: true, type: "static", data });

  // ---------- Testimonials ----------
  const openCreateTestimonial = () => setTestimonialForm({ open: true, testimonial: null });
  const openEditTestimonial = (testimonial) => setTestimonialForm({ open: true, testimonial });

  const handleTestimonialFormClose = (dirty) => {
    if (!dirty) {
      setTestimonialForm({ open: false, testimonial: null });
      return;
    }
    setUnsaved({
      onStay: () => setUnsaved(null),
      onDiscard: () => {
        setUnsaved(null);
        setTestimonialForm({ open: false, testimonial: null });
      },
      onSave: () => {
        setUnsaved(null);
        setTestimonialForm({ open: false, testimonial: null });
      },
    });
  };

  const handleSaveTestimonial = (form) => {
    const editingId = testimonialForm.testimonial?.id;
    if (editingId) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...form, updatedAt: nowIso() } : t))
      );
      toast.success("Testimonial updated successfully.");
    } else {
      setTestimonials((prev) => [
        { ...form, id: `ts-${Date.now()}`, updatedAt: nowIso() },
        ...prev,
      ]);
      toast.success("Testimonial created successfully.");
    }
    setTestimonialForm({ open: false, testimonial: null });
  };

  const handlePreviewTestimonial = (t) => setPreview({ open: true, type: "testimonial", data: t });

  const handleToggleTestimonialPublish = (t) => {
    const publishing = t.status !== "published";
    setTestimonials((prev) =>
      prev.map((item) =>
        item.id === t.id
          ? { ...item, status: publishing ? "published" : "draft", updatedAt: nowIso() }
          : item
      )
    );
    toast.success(publishing ? "Testimonial published successfully." : "Testimonial unpublished successfully.");
  };

  const handleDeleteTestimonial = (t) => {
    requestConfirmation({
      title: "Delete this content?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => {
        setTestimonials((prev) => prev.filter((item) => item.id !== t.id));
        toast.success("Content deleted successfully.");
        closeConfirmation();
      },
    });
  };

  // ---------- Reviews ----------
  const openCreateReview = () => setReviewForm({ open: true, review: null });
  const openEditReview = (review) => setReviewForm({ open: true, review });

  const handleReviewFormClose = (dirty) => {
    if (!dirty) {
      setReviewForm({ open: false, review: null });
      return;
    }
    setUnsaved({
      onStay: () => setUnsaved(null),
      onDiscard: () => {
        setUnsaved(null);
        setReviewForm({ open: false, review: null });
      },
      onSave: () => {
        setUnsaved(null);
        setReviewForm({ open: false, review: null });
      },
    });
  };

  const handleSaveReview = (form) => {
    const editingId = reviewForm.review?.id;
    if (editingId) {
      setReviews((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form, date: r.date } : r))
      );
      toast.success("Review updated successfully.");
    } else {
      setReviews((prev) => [
        { ...form, id: `rv-${Date.now()}`, date: nowIso(), order: prev.length + 1 },
        ...prev,
      ]);
      toast.success("Review created successfully.");
    }
    setReviewForm({ open: false, review: null });
  };

  const handlePreviewReview = (r) => setPreview({ open: true, type: "review", data: r });

  const handleToggleReviewPublish = (r) => {
    const publishing = r.status !== "published";
    setReviews((prev) =>
      prev.map((item) => (item.id === r.id ? { ...item, status: publishing ? "published" : "draft" } : item))
    );
    toast.success(publishing ? "Review published successfully." : "Review unpublished successfully.");
  };

  const handleDeleteReview = (r) => {
    requestConfirmation({
      title: "Delete this content?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => {
        setReviews((prev) => prev.filter((item) => item.id !== r.id));
        toast.success("Content deleted successfully.");
        closeConfirmation();
      },
    });
  };

  // ---------- Media ----------
  const handleUploadMedia = (newMedia) => {
    setMedia((prev) => [newMedia, ...prev]);
    toast.success("Media uploaded successfully.");
    setMediaUpload(false);
  };

  const handleCopyMediaUrl = (m) => {
    if (m.url && navigator?.clipboard) {
      navigator.clipboard.writeText(m.url);
    }
    toast.success("Media URL copied.");
  };

  const handleDeleteMedia = (m) => {
    requestConfirmation({
      title: "Delete this content?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => {
        setMedia((prev) => prev.filter((item) => item.id !== m.id));
        toast.success("Content deleted successfully.");
        closeConfirmation();
      },
    });
  };

  return (
    <div className="min-h-screen bg-theme">
      {/* Remove this Toaster if one is already mounted at the app root. */}
      <Toaster richColors position="top-right" />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <CMSHeader onPreviewWebsite={handlePreviewWebsite} onRefresh={handleRefresh} refreshing={refreshing} />

        <div className="mt-4">
          <CMSTabs active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="mt-6">
          {activeTab === "overview" && (
            <OverviewTab pages={pages} testimonials={testimonials} reviews={reviews} loading={false} />
          )}

          {activeTab === "pages" && (
            <PagesTab
              pages={pages}
              loading={false}
              error={false}
              onRetry={() => {}}
              onCreate={openCreatePage}
              onEdit={openEditPage}
              onPreview={handlePreviewPage}
              onTogglePublish={handleTogglePagePublish}
              onDuplicate={handleDuplicatePage}
              onDelete={handleDeletePage}
            />
          )}

          {activeTab === "static" && (
            <StaticContentTab
              staticContent={staticContent}
              onSave={handleSaveStaticContent}
              onPreview={handlePreviewStatic}
            />
          )}

          {activeTab === "testimonials" && (
            <TestimonialsTab
              testimonials={testimonials}
              loading={false}
              error={false}
              onRetry={() => {}}
              onCreate={openCreateTestimonial}
              onEdit={openEditTestimonial}
              onPreview={handlePreviewTestimonial}
              onTogglePublish={handleToggleTestimonialPublish}
              onDelete={handleDeleteTestimonial}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsTab
              reviews={reviews}
              loading={false}
              error={false}
              onRetry={() => {}}
              onCreate={openCreateReview}
              onEdit={openEditReview}
              onPreview={handlePreviewReview}
              onTogglePublish={handleToggleReviewPublish}
              onDelete={handleDeleteReview}
            />
          )}

          {activeTab === "media" && (
            <MediaTab
              media={media}
              loading={false}
              error={false}
              onRetry={() => {}}
              onUpload={() => setMediaUpload(true)}
              onCopy={handleCopyMediaUrl}
              onDelete={handleDeleteMedia}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <PageEditorModal
        open={pageEditor.open}
        page={pageEditor.page}
        onRequestClose={handlePageEditorClose}
        onSave={handleSavePage}
        onPreview={(form) => setPreview({ open: true, type: "page", data: form })}
      />

      <TestimonialFormModal
        open={testimonialForm.open}
        testimonial={testimonialForm.testimonial}
        onRequestClose={handleTestimonialFormClose}
        onSave={handleSaveTestimonial}
      />

      <ReviewFormModal
        open={reviewForm.open}
        review={reviewForm.review}
        onRequestClose={handleReviewFormClose}
        onSave={handleSaveReview}
      />

      <MediaUploadModal
        open={mediaUpload}
        onRequestClose={() => setMediaUpload(false)}
        onUpload={handleUploadMedia}
      />

      <PreviewModal
        open={preview.open}
        type={preview.type}
        data={preview.data}
        onClose={() => setPreview({ open: false, type: null, data: null })}
      />

      <ConfirmationModal
        open={!!confirmation}
        title={confirmation?.title}
        description={confirmation?.description}
        confirmLabel={confirmation?.confirmLabel}
        destructive={confirmation?.destructive}
        onConfirm={confirmation?.onConfirm}
        onCancel={closeConfirmation}
      />

      <UnsavedChangesModal
        open={!!unsaved}
        onStay={unsaved?.onStay}
        onDiscard={unsaved?.onDiscard}
        onSave={unsaved?.onSave}
      />
    </div>
  );
}
