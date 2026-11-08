import { useNavigate } from "react-router-dom";
import { 
  X, 
  Edit2, 
  CreditCard, 
  ToggleLeft, 
  ExternalLink, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Info,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useRestaurantsStore } from "../../../store/restaurantsStore";
import { platformFeatures } from "../data/restaurantData";
import Button from "../../../components/ui/Button";
import FormSection from "../../../components/ui/FormSection";
import StatusBadge from "../components/StatusBadge";

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

export default function RestaurantDetailsDrawer() {
  const navigate = useNavigate();
  const { 
    showDetailsDrawer, 
    selectedRestaurant, 
    closeDetails, 
    openEditModal,
    showConfirm,
    detailsDrawerTab,
    setDetailsDrawerTab
  } = useRestaurantsStore();

  if (!showDetailsDrawer || !selectedRestaurant) return null;

  const currentTab = detailsDrawerTab || "overview";
  const rId = selectedRestaurant._id || selectedRestaurant.id || "";
  const packageName = selectedRestaurant.subscription?.packageName || selectedRestaurant.subscription?.packageId?.name || selectedRestaurant.subscription?.package || "N/A";

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Restaurant Header Card */}
      <div className="bg-surface border border-theme rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden">
            {selectedRestaurant.logo ? (
              <img 
                src={selectedRestaurant.logo.startsWith("http") ? selectedRestaurant.logo : `${(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace("/api", "")}${selectedRestaurant.logo}`} 
                alt={selectedRestaurant.name} 
                className="w-full h-full object-cover rounded-xl" 
              />
            ) : (
              (selectedRestaurant.name?.[0] || "R").toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-theme">{selectedRestaurant.name}</h3>
              <StatusBadge status={selectedRestaurant.status} />
            </div>
            <p className="text-sm text-secondary mt-1">ID: {rId ? rId.slice(-8) : "N/A"}</p>
            {selectedRestaurant.description && (
              <p className="text-sm text-secondary mt-2 line-clamp-2">{selectedRestaurant.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact & Location */}
      <FormSection title="Contact & Location">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-secondary">Address</p>
              <p className="text-sm text-theme">
                {selectedRestaurant.address?.fullAddress ? `${selectedRestaurant.address.fullAddress}, ` : ""}{selectedRestaurant.address?.city || "N/A"}
              </p>
              <p className="text-xs text-secondary">
                {[selectedRestaurant.address?.city, selectedRestaurant.address?.state, selectedRestaurant.address?.country].filter(Boolean).join(", ")}
                {selectedRestaurant.address?.pincode ? ` - ${selectedRestaurant.address.pincode}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={16} className="text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-secondary">Restaurant Phone</p>
              <p className="text-sm text-theme">
                {(selectedRestaurant.phone || selectedRestaurant.contact?.primaryPhone) 
                  ? `+91 ${String(selectedRestaurant.phone || selectedRestaurant.contact?.primaryPhone).replace(/\D/g, '').slice(-10)}` 
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={16} className="text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-secondary">Email</p>
              <p className="text-sm text-theme">{selectedRestaurant.email || selectedRestaurant.contact?.email || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe size={16} className="text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-secondary">Website</p>
              <p className="text-sm text-theme">
                {selectedRestaurant.websiteUrl || (typeof selectedRestaurant.website === 'string' ? selectedRestaurant.website : selectedRestaurant.website?.url || selectedRestaurant.website?.subdomain) || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Admin Info */}
      <FormSection title="Restaurant Admin Information">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-medium flex-shrink-0">
            {selectedRestaurant.admin?.name?.[0] || "A"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div>
              <p className="text-xs text-secondary">Admin Name</p>
              <p className="text-sm font-medium text-theme">{selectedRestaurant.admin?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-secondary">Admin Email</p>
              <p className="text-sm text-theme">{selectedRestaurant.admin?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-secondary">Admin Phone</p>
              <p className="text-sm text-theme">
                {selectedRestaurant.admin?.phone 
                  ? `+91 ${String(selectedRestaurant.admin.phone).replace(/\D/g, '').slice(-10)}` 
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-6">
      {/* Current Plan Overview Banner */}
      <div className="bg-primary-light/30 border border-primary/20 rounded-xl p-5 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Active Plan</span>
          <h4 className="text-xl font-bold text-theme mt-0.5">{packageName}</h4>
          <p className="text-xs text-secondary mt-1">
            Duration: {selectedRestaurant.subscription?.durationDisplay || selectedRestaurant.subscription?.duration || "Standard"}
          </p>
        </div>
        <div className="text-right">
          <StatusBadge status={selectedRestaurant.subscription?.status} type="subscription" />
          <p className="text-sm font-bold text-theme mt-2">
            {selectedRestaurant.subscription?.price != null && !isNaN(Number(selectedRestaurant.subscription.price))
              ? `₹${Number(selectedRestaurant.subscription.price).toLocaleString("en-IN")}`
              : "Free"}
          </p>
        </div>
      </div>

      {/* Subscription Details FormSection */}
      <FormSection title="Subscription Details">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-secondary">Package Plan</p>
            <p className="text-sm font-semibold text-theme">{packageName}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">Subscription Status</p>
            <StatusBadge status={selectedRestaurant.subscription?.status} type="subscription" />
          </div>
          <div>
            <p className="text-xs text-secondary">Duration</p>
            <p className="text-sm font-medium text-theme">
              {selectedRestaurant.subscription?.durationDisplay || selectedRestaurant.subscription?.duration || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary">Plan Price</p>
            <p className="text-sm font-medium text-theme">
              {selectedRestaurant.subscription?.price != null && !isNaN(Number(selectedRestaurant.subscription.price))
                ? `₹${Number(selectedRestaurant.subscription.price).toLocaleString("en-IN")}`
                : "-"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-secondary" />
            <div>
              <p className="text-xs text-secondary">Start Date</p>
              <p className="text-sm text-theme">{formatDate(selectedRestaurant.subscription?.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-secondary" />
            <div>
              <p className="text-xs text-secondary">End Date</p>
              <p className="text-sm text-theme">{formatDate(selectedRestaurant.subscription?.endDate)}</p>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Link to Subscriptions Module */}
      <div className="p-4 bg-surface border border-theme rounded-xl flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-theme">Need to change or renew subscription?</p>
          <p className="text-xs text-secondary">Manage billing, renew, assign new packages or change plans in the Subscriptions module.</p>
        </div>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => {
            closeDetails();
            navigate("/subscriptions");
          }}
          className="flex-shrink-0"
        >
          <span>Open Subscriptions</span>
          <ExternalLink size={14} />
        </Button>
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-6">
      {/* Platform Features Grid */}
      <FormSection title="Platform Features" description="Modules and services enabled for this restaurant tier">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {platformFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className="flex items-center justify-between py-2.5 px-3.5 bg-surface border border-theme/60 rounded-lg hover:border-theme transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                {feature.enabled ? (
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle size={16} className="text-gray-400 flex-shrink-0" />
                )}
                <span className="text-sm font-medium text-theme truncate">{feature.name}</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                feature.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {feature.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          ))}
        </div>
      </FormSection>

      {/* Operational Settings */}
      <FormSection title="Operational Settings" description="Live status of ordering and public availability">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-surface border border-theme rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-theme">Accept Orders</p>
              <p className="text-xs text-secondary">Table & online QR ordering</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              selectedRestaurant.settings?.acceptOrders !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}>
              {selectedRestaurant.settings?.acceptOrders !== false ? "Active" : "Paused"}
            </span>
          </div>

          <div className="p-3 bg-surface border border-theme rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-theme">Public Directory</p>
              <p className="text-xs text-secondary">Shown on platform search</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              selectedRestaurant.settings?.showOnPublicWebsite ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {selectedRestaurant.settings?.showOnPublicWebsite ? "Visible" : "Hidden"}
            </span>
          </div>
        </div>
      </FormSection>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={closeDetails} />
      <div className="relative bg-surface w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme bg-surface">
          <div>
            <h2 className="text-lg font-semibold text-theme">Restaurant Details</h2>
            <p className="text-xs text-secondary">{selectedRestaurant.name}</p>
          </div>
          <button 
            onClick={closeDetails} 
            className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors cursor-pointer"
            title="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-theme px-6 bg-surface/50">
          <button
            type="button"
            onClick={() => setDetailsDrawerTab("overview")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              currentTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-theme"
            }`}
          >
            <Info size={16} />
            <span>Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setDetailsDrawerTab("subscription")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              currentTab === "subscription"
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-theme"
            }`}
          >
            <CreditCard size={16} />
            <span>Subscription</span>
          </button>
          <button
            type="button"
            onClick={() => setDetailsDrawerTab("features")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              currentTab === "features"
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-theme"
            }`}
          >
            <ToggleLeft size={16} />
            <span>Features</span>
          </button>
        </div>
        
        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentTab === "overview" && renderOverview()}
          {currentTab === "subscription" && renderSubscription()}
          {currentTab === "features" && renderFeatures()}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-theme bg-surface flex flex-wrap gap-3 justify-between">
          <Button 
            variant={selectedRestaurant.status === "active" ? "danger" : "primary"} 
            onClick={() => showConfirm("toggleStatus", selectedRestaurant)}
          >
            {selectedRestaurant.status === "active" ? "Deactivate" : "Activate"}
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => closeDetails()}>
              Close
            </Button>
            <Button onClick={() => { closeDetails(); openEditModal(selectedRestaurant); }}>
              <Edit2 size={14} /> Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
