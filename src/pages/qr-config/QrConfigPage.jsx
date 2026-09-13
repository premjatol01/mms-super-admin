import { useEffect, useState } from "react";
import { SlidersHorizontal, LayoutTemplate, ListChecks, Tag } from "lucide-react";
import { toast } from "sonner";

import { useQrConfigStore } from "./data/useQrConfigStore";

import QRConfigHeader from "./components/QRConfigHeader";
import QRConfigSummaryCards from "./components/QRConfigSummaryCard";
import Tabs from "./components/Tabs";
import GeneralTab from "./components/GeneralTab";
import TemplatesTab from "./components/TemplatesTab";
import RulesTab from "./components/RulesTab";
import PricingTab from "./components/PricingTab";
import ConfigurationSaveBar from "./components/ConfigurationSaveBar";
import ErrorState from "./components/ErrorState";
import {
  SummaryCardsSkeleton,
  ConfigFormSkeleton,
} from "./components/LoadingSkeleton";

import ConfirmationModal from "./modals/ConfirmationModal";
import UnsavedChangesModal from "./modals/UnsavedChangesModal";
import QRTemplateFormModal from "./modals/QRTemplateFormModal";
import QRTemplateDetailsModal from "./modals/QRTemplateDetailsModal";

const TABS = [
  { key: "general", label: "General", icon: SlidersHorizontal },
  { key: "templates", label: "Templates", icon: LayoutTemplate },
  { key: "rules", label: "Rules", icon: ListChecks },
  { key: "pricing", label: "Pricing", icon: Tag },
];

export default function QrConfigPage() {
  const [activeTab, setActiveTab] = useState("general");

  const loading = useQrConfigStore((s) => s.loading);
  const loadError = useQrConfigStore((s) => s.loadError);
  const saving = useQrConfigStore((s) => s.saving);
  const isDirty = useQrConfigStore((s) => s.isDirty);
  const availability = useQrConfigStore((s) => s.availability);
  const templates = useQrConfigStore((s) => s.templates);

  const fetchConfig = useQrConfigStore((s) => s.fetchConfig);
  const saveConfig = useQrConfigStore((s) => s.saveConfig);
  const resetChanges = useQrConfigStore((s) => s.resetChanges);

  const confirmModal = useQrConfigStore((s) => s.confirmModal);
  const closeConfirm = useQrConfigStore((s) => s.closeConfirm);
  const showUnsavedModal = useQrConfigStore((s) => s.showUnsavedModal);
  const closeUnsavedModal = useQrConfigStore((s) => s.closeUnsavedModal);
  const pendingNavigationAction = useQrConfigStore(
    (s) => s.pendingNavigationAction
  );
  const templateFormModal = useQrConfigStore((s) => s.templateFormModal);
  const templateDetailsModal = useQrConfigStore((s) => s.templateDetailsModal);

  useEffect(() => {
    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warn on browser tab close / refresh if there are unsaved changes.
  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleTabChange = (nextTab) => {
    if (isDirty) {
      useQrConfigStore
        .getState()
        .openUnsavedModal(() => setActiveTab(nextTab));
      return;
    }
    setActiveTab(nextTab);
  };

  const handleSave = async () => {
    const result = await saveConfig();
    if (result.ok) {
      toast.success("QR configuration updated successfully.");
    } else {
      toast.error("Unable to save QR configuration. No changes were applied.");
    }
  };

  const activeTemplateCount = templates.filter(
    (t) => t.status === "Active"
  ).length;

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <QRConfigHeader />

      <div className="mt-6 space-y-6">
        {loading ? (
          <SummaryCardsSkeleton />
        ) : loadError ? null : (
          <QRConfigSummaryCards
            availability={availability}
            activeTemplateCount={activeTemplateCount}
          />
        )}

        {loadError ? (
          <ErrorState description={loadError} onRetry={fetchConfig} />
        ) : (
          <>
            <Tabs tabs={TABS} active={activeTab} onChange={handleTabChange} />

            {loading ? (
              <ConfigFormSkeleton />
            ) : (
              <>
                {activeTab === "general" && <GeneralTab />}
                {activeTab === "templates" && <TemplatesTab />}
                {activeTab === "rules" && <RulesTab />}
                {activeTab === "pricing" && <PricingTab />}
              </>
            )}
          </>
        )}
      </div>

      <ConfigurationSaveBar
        visible={isDirty && !loading && !loadError}
        saving={saving}
        onReset={resetChanges}
        onSave={handleSave}
      />

      <ConfirmationModal config={confirmModal} onCancel={closeConfirm} />
      <UnsavedChangesModal
        open={showUnsavedModal}
        onStay={closeUnsavedModal}
        onLeave={() => {
          resetChanges();
          pendingNavigationAction?.();
          closeUnsavedModal();
        }}
      />
      {templateFormModal && <QRTemplateFormModal />}
      {templateDetailsModal && <QRTemplateDetailsModal />}
    </div>
  );
}
