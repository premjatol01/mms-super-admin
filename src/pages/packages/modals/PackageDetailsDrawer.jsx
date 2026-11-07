import { X, Calendar, CheckCircle, XCircle, Users, Layers, Sparkles } from "lucide-react";
import { usePackagesStore } from "../../../store/packagesStore";
import { getFeatureById } from "../data/featureData";
import Button from "../../../components/ui/Button";
import FormSection from "../../../components/ui/FormSection";

export default function PackageDetailsDrawer() {
  const { 
    showDetailsDrawer, 
    selectedPackage, 
    closeDetails, 
    showConfirm 
  } = usePackagesStore();

  if (!showDetailsDrawer || !selectedPackage) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={closeDetails} />
      <div className="relative bg-surface w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme bg-surface">
          <h2 className="text-lg font-semibold text-theme">Package Details</h2>
          <button 
            onClick={closeDetails} 
            className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Package Header Card */}
          <div className="bg-surface border border-theme rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-2xl font-bold text-theme">{selectedPackage.name}</h3>
                  <span 
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: selectedPackage.status === "active" ? "#22c55e20" : "#ef444420",
                      color: selectedPackage.status === "active" ? "#22c55e" : "#ef4444"
                    }}
                  >
                    {selectedPackage.status === "active" ? <CheckCircle size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                    {selectedPackage.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-secondary mt-2">{selectedPackage.description}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-light/30 text-theme text-sm font-semibold">
                  <Users size={16} className="text-primary" />
                  {selectedPackage.maxTables || 15} Tables Limit
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-theme">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-secondary">Table Capacity</p>
                  <p className="text-sm font-semibold text-theme">Up to {selectedPackage.maxTables || 15} Tables</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-secondary">Features Included</p>
                  <p className="text-sm font-semibold text-theme">{selectedPackage.features?.length || 0} Modules</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flexible Durations & Pricing */}
          <FormSection title="Flexible Durations & Pricing" description="Pricing options available for this package">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedPackage.pricing && selectedPackage.pricing.length > 0 ? (
                selectedPackage.pricing.map((tier) => (
                  <div 
                    key={tier.duration}
                    className={`relative p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      tier.isPopular 
                        ? "border-primary bg-primary-light/15 shadow-sm"
                        : "border-theme bg-surface hover:border-primary/40"
                    }`}
                  >
                    {tier.isPopular && (
                      <span className="absolute -top-2.5 right-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                        Best Value
                      </span>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 text-secondary text-xs mb-1">
                        <Calendar size={13} className="text-primary shrink-0" />
                        <span className="font-medium text-theme">{tier.durationDisplay}</span>
                      </div>
                      <div className="text-2xl font-bold text-theme mt-2">
                        ₹{tier.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-secondary mt-0.5">
                        ≈ ₹{Math.round(tier.price / (tier.durationDays / 30)).toLocaleString()} / month
                      </div>
                    </div>
                    <div className="text-[11px] text-secondary mt-3 pt-2 border-t border-theme/60 flex items-center justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold text-theme">{tier.durationDays} Days</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 border border-theme rounded-xl col-span-3">
                  <p className="text-sm text-theme font-semibold">₹{selectedPackage.price ? selectedPackage.price.toLocaleString() : "0"}</p>
                  <p className="text-xs text-secondary">{selectedPackage.durationDisplay || "Fixed duration"}</p>
                </div>
              )}
            </div>
          </FormSection>

          {/* Package Info Specifications */}
          <FormSection title="Package Specifications">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary">Package Tier</p>
                <p className="text-sm font-medium text-theme">{selectedPackage.name}</p>
              </div>
              <div>
                <p className="text-xs text-secondary">Max Table Capacity</p>
                <p className="text-sm font-medium text-theme">{selectedPackage.maxTables || 15} Tables</p>
              </div>
              <div>
                <p className="text-xs text-secondary">Supported Durations</p>
                <p className="text-sm font-medium text-theme">
                  {selectedPackage.pricing?.map(p => p.durationDays === 30 ? '1 Mo' : p.durationDays === 180 ? '6 Mos' : '1 Yr').join(', ') || '1 Month'}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary">Status</p>
                <p className="text-sm font-medium text-theme capitalize">{selectedPackage.status || "active"}</p>
              </div>
              <div>
                <p className="text-xs text-secondary">Created Date</p>
                <p className="text-sm text-theme">{formatDate(selectedPackage.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-secondary">Last Updated</p>
                <p className="text-sm text-theme">{formatDate(selectedPackage.updatedAt)}</p>
              </div>
            </div>
          </FormSection>

          {/* Features List */}
          <FormSection title="Included Features">
            <div className="space-y-2">
              {selectedPackage.features?.map((featureId) => {
                const feature = getFeatureById(featureId);
                return (
                  <div key={featureId} className="flex items-start gap-3 py-2.5 px-3.5 bg-primary-light/10 rounded-lg">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-theme">{feature ? feature.name : featureId}</p>
                      {feature?.description && (
                        <p className="text-xs text-secondary">{feature.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {(!selectedPackage.features || selectedPackage.features.length === 0) && (
                <p className="text-sm text-secondary">No features assigned</p>
              )}
            </div>
          </FormSection>
        </div>

        {/* Footer Actions (Edit button removed as packages are static) */}
        <div className="px-6 py-4 border-t border-theme bg-surface flex items-center justify-between">
          <Button 
            variant={selectedPackage.status === "active" ? "danger" : "primary"} 
            onClick={() => showConfirm("toggleStatus", selectedPackage)}
          >
            {selectedPackage.status === "active" ? "Deactivate Package" : "Activate Package"}
          </Button>
          <Button variant="secondary" onClick={() => closeDetails()}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
