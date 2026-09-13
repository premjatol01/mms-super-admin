import { X, Edit2, CreditCard, ToggleLeft, ExternalLink, MapPin, Phone, Mail, Globe, Calendar } from "lucide-react";
import { useRestaurantsStore } from "../../../store/restaurantsStore";
import { platformFeatures } from "../data/restaurantData";
import Button from "../../../components/ui/Button";
import FormSection from "../../../components/ui/FormSection";
import StatusBadge from "../components/StatusBadge";

export default function RestaurantDetailsDrawer() {
  const { 
    showDetailsDrawer, 
    selectedRestaurant, 
    closeDetails, 
    openEditModal,
    showConfirm 
  } = useRestaurantsStore();

  if (!showDetailsDrawer || !selectedRestaurant) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={closeDetails} />
      <div className="relative bg-surface w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme bg-surface">
          <h2 className="text-lg font-semibold text-theme">Restaurant Details</h2>
          <button 
            onClick={closeDetails} 
            className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Restaurant Header Card */}
          <div className="bg-surface border border-theme rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {selectedRestaurant.logo ? (
                  <img src={selectedRestaurant.logo} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  selectedRestaurant.name[0]
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-theme">{selectedRestaurant.name}</h3>
                  <StatusBadge status={selectedRestaurant.status} />
                </div>
                <p className="text-sm text-secondary mt-1">ID: {selectedRestaurant.id}</p>
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
                    {selectedRestaurant.address?.fullAddress}, {selectedRestaurant.address?.city}
                  </p>
                  <p className="text-xs text-secondary">
                    {selectedRestaurant.address?.city}, {selectedRestaurant.address?.state}, {selectedRestaurant.address?.country} - {selectedRestaurant.address?.pincode}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-secondary">Phone</p>
                  <p className="text-sm text-theme">{selectedRestaurant.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-secondary">Email</p>
                  <p className="text-sm text-theme">{selectedRestaurant.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-secondary">Website</p>
                  <p className="text-sm text-theme">{selectedRestaurant.website || "N/A"}</p>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Admin Info */}
          <FormSection title="Restaurant Admin">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-medium flex-shrink-0">
                {selectedRestaurant.admin?.name?.[0] || "A"}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <div>
                  <p className="text-xs text-secondary">Name</p>
                  <p className="text-sm font-medium text-theme">{selectedRestaurant.admin?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary">Email</p>
                  <p className="text-sm text-theme">{selectedRestaurant.admin?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary">Phone</p>
                  <p className="text-sm text-theme">{selectedRestaurant.admin?.phone || "N/A"}</p>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Subscription */}
          <FormSection title="Subscription">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary">Package</p>
                <p className="text-sm font-medium text-theme">{selectedRestaurant.subscription?.package || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-secondary">Status</p>
                <StatusBadge status={selectedRestaurant.subscription?.status} />
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-secondary" />
                <div>
                  <p className="text-xs text-secondary">Start Date</p>
                  <p className="text-sm text-theme">{selectedRestaurant.subscription?.startDate || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-secondary" />
                <div>
                  <p className="text-xs text-secondary">End Date</p>
                  <p className="text-sm text-theme">{selectedRestaurant.subscription?.endDate || "N/A"}</p>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Features */}
          <FormSection title="Feature Availability">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {platformFeatures.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between py-2 px-3 bg-primary-light/10 rounded-lg">
                  <span className="text-sm text-theme">{feature.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    feature.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {feature.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>
          </FormSection>
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