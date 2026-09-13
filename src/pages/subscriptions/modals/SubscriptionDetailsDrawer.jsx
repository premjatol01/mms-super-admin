import { X, RefreshCw, Package, Power, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useSubscriptionsStore } from "../../../store/subscriptionsStore";
import { getFeaturesByPackageName } from "../data/featureHelper";
import Button from "../../../components/ui/Button";
import FormSection from "../../../components/ui/FormSection";

export default function SubscriptionDetailsDrawer() {
  const { 
    showDetailsDrawer, 
    selectedSubscription, 
    closeDetails,
    openRenewModal,
    openChangePackageModal, 
    showConfirm 
  } = useSubscriptionsStore();

  if (!showDetailsDrawer || !selectedSubscription) return null;

  const features = getFeaturesByPackageName(selectedSubscription.packageName);
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const end = new Date(selectedSubscription.endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysRemaining = getDaysRemaining();
  const isExpired = selectedSubscription.status === "expired";
  const isCancelled = selectedSubscription.status === "cancelled";
  const isScheduled = selectedSubscription.status === "scheduled";
  const isActive = selectedSubscription.status === "active";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={closeDetails} />
      <div className="relative bg-surface w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme bg-surface">
          <h2 className="text-lg font-semibold text-theme">Subscription Details</h2>
          <button 
            onClick={closeDetails} 
            className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-surface border border-theme rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-theme">{selectedSubscription.restaurantName}</h3>
                <p className="text-sm text-secondary mt-1">ID: {selectedSubscription.id}</p>
              </div>
              <StatusBadge status={selectedSubscription.status} />
            </div>
            <div className="mt-4 pt-4 border-t border-theme grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary">Admin Name</p>
                <p className="text-sm font-medium text-theme">{selectedSubscription.adminName}</p>
              </div>
              <div>
                <p className="text-xs text-secondary">Admin Email</p>
                <p className="text-sm font-medium text-theme">{selectedSubscription.adminEmail}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-theme rounded-xl p-5">
            <h4 className="font-medium text-theme mb-4">Subscription Validity</h4>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-secondary">Start Date</p>
                <p className="text-sm font-medium text-theme">{formatDate(selectedSubscription.startDate)}</p>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-0.5 w-full bg-primary-light relative">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-secondary">End Date</p>
                <p className="text-sm font-medium text-theme">{formatDate(selectedSubscription.endDate)}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              {isActive && daysRemaining > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                  <Clock size={16} />
                  <span className="text-sm font-medium">{daysRemaining} Days Remaining</span>
                </div>
              )}
              {isExpired && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                  <XCircle size={16} />
                  <span className="text-sm font-medium">Expired on {formatDate(selectedSubscription.endDate)}</span>
                </div>
              )}
              {isCancelled && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                  <XCircle size={16} />
                  <span className="text-sm font-medium">Subscription Cancelled</span>
                </div>
              )}
              {isScheduled && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Clock size={16} />
                  <span className="text-sm font-medium">Starts on {formatDate(selectedSubscription.startDate)}</span>
                </div>
              )}
            </div>
          </div>

          <FormSection title="Subscription Information">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary">Package</p>
                <p className="text-sm font-medium text-theme">{selectedSubscription.packageName}</p>
              </div>
              <div>
                <p className="text-xs text-secondary">Duration</p>
                <p className="text-sm font-medium text-theme">{selectedSubscription.durationDisplay}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-secondary" />
                <div>
                  <p className="text-xs text-secondary">Created</p>
                  <p className="text-sm text-theme">{formatDate(selectedSubscription.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-secondary" />
                <div>
                  <p className="text-xs text-secondary">Updated</p>
                  <p className="text-sm text-theme">{formatDate(selectedSubscription.updatedAt)}</p>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Included Features">
            <div className="space-y-2">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-3 py-2 px-3 bg-primary-light/10 rounded-lg">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-theme">{feature.name}</p>
                    <p className="text-xs text-secondary">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </FormSection>
        </div>

        <div className="px-6 py-4 border-t border-theme bg-surface flex flex-wrap gap-3 justify-between">
          <div className="flex gap-2">
            {isActive && (
              <>
                <Button variant="secondary" onClick={() => { closeDetails(); openRenewModal(selectedSubscription); }}>
                  <RefreshCw size={14} /> Renew
                </Button>
                <Button variant="secondary" onClick={() => { closeDetails(); openChangePackageModal(selectedSubscription); }}>
                  <Package size={14} /> Change
                </Button>
                <Button variant="danger" onClick={() => showConfirm("cancel", selectedSubscription)}>
                  Cancel
                </Button>
              </>
            )}
            {(isExpired || isCancelled) && (
              <>
                <Button onClick={() => { closeDetails(); openRenewModal(selectedSubscription); }}>
                  <RefreshCw size={14} /> Renew
                </Button>
                <Button variant="secondary" onClick={() => { closeDetails(); openChangePackageModal(selectedSubscription); }}>
                  <Package size={14} /> Change
                </Button>
              </>
            )}
            {isCancelled && (
              <Button onClick={() => showConfirm("reactivate", selectedSubscription)}>
                <Power size={14} /> Reactivate
              </Button>
            )}
          </div>
          <Button variant="secondary" onClick={closeDetails}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    active: { label: "Active", bg: "#22c55e20", color: "#22c55e" },
    expiring: { label: "Expiring Soon", bg: "#f9731620", color: "#f97316" },
    expired: { label: "Expired", bg: "#ef444420", color: "#ef4444" },
    cancelled: { label: "Cancelled", bg: "#6b728020", color: "#6b7280" },
    scheduled: { label: "Scheduled", bg: "#3b82f620", color: "#3b82f6" },
  };
  
  const { label, bg, color } = config[status] || config.active;
  
  return (
    <span 
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: bg, color }}
    >
      {status === "active" ? <CheckCircle size={12} className="mr-1" /> : 
       status === "expired" || status === "cancelled" ? <XCircle size={12} className="mr-1" /> :
       <Clock size={12} className="mr-1" />}
      {label}
    </span>
  );
}