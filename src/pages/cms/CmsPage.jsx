import { useState, useEffect } from "react";
import { Layers, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cmsAPI } from "../../api/cms";
import Button from "../../components/ui/Button";
import SectionCard from "./components/SectionCard";

import HeroEditor from "./components/editors/HeroEditor";
import AboutEditor from "./components/editors/AboutEditor";
import FeaturesEditor from "./components/editors/FeaturesEditor";
import PricingEditor from "./components/editors/PricingEditor";
import TestimonialsEditor from "./components/editors/TestimonialsEditor";
import CtaEditor from "./components/editors/CtaEditor";
import FooterEditor from "./components/editors/FooterEditor";

const EDITORS = {
  hero: HeroEditor,
  about: AboutEditor,
  features: FeaturesEditor,
  pricing: PricingEditor,
  testimonials: TestimonialsEditor,
  cta: CtaEditor,
  footer: FooterEditor,
};

export default function CmsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [sections, setSections] = useState([]);
  const [editingSectionId, setEditingSectionId] = useState(null);

  // Fetch live CMS data
  const loadCmsData = async () => {
    setLoading(true);
    try {
      const res = await cmsAPI.getCmsData();
      const payload = res?.data || res;
      if (Array.isArray(payload?.sections)) {
        setSections(payload.sections);
      }
    } catch (err) {
      console.error("Failed to load CMS data:", err);
      toast.error("Failed to load CMS configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  const handleToggleSection = async (sectionId) => {
    setTogglingId(sectionId);
    try {
      const res = await cmsAPI.toggleSection(sectionId);
      setSections((prev) =>
        prev.map((s) => (s.sectionId === sectionId ? { ...s, enabled: !s.enabled } : s))
      );
      toast.success(res?.message || "Section visibility updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle section");
    } finally {
      setTogglingId(null);
    }
  };

  const handleSaveSection = async (updatedContent) => {
    if (!editingSectionId) return;
    setSaving(true);
    try {
      const res = await cmsAPI.updateSection(editingSectionId, { content: updatedContent });
      setSections((prev) =>
        prev.map((s) => (s.sectionId === editingSectionId ? { ...s, content: updatedContent } : s))
      );
      toast.success(res?.message || "Section saved successfully");
      setEditingSectionId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save section content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface border border-theme rounded-xl p-16 text-center">
        <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-secondary">Loading CMS settings...</p>
      </div>
    );
  }

  const editingSection = sections.find((s) => s.sectionId === editingSectionId);

  // If a section is being edited, render its dedicated in-place editor
  if (editingSection) {
    const EditorComponent = EDITORS[editingSection.type];
    if (EditorComponent) {
      return (
        <div className="bg-surface border border-theme rounded-xl p-6 shadow-sm">
          <EditorComponent
            section={editingSection}
            onSave={handleSaveSection}
            onCancel={() => setEditingSectionId(null)}
            saving={saving}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-theme flex items-center gap-2">
            <Layers size={20} className="text-primary" />
            Website Sections
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            Turn sections on or off and customize their content.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={loadCmsData} title="Refresh CMS">
          <RefreshCw size={15} />
        </Button>
      </div>

      {/* Website Sections List */}
      <div className="space-y-3">
        {sections.map((section) => (
          <SectionCard
            key={section.sectionId}
            section={section}
            onEdit={(sec) => setEditingSectionId(sec.sectionId)}
            onToggle={handleToggleSection}
            toggling={togglingId === section.sectionId}
          />
        ))}
      </div>
    </div>
  );
}
