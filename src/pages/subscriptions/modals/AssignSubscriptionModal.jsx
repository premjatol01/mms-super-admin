import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useSubscriptionsStore } from "../../../store/subscriptionsStore";
import { getAllPackages } from "../data/packageHelper";
import { getFeaturesByIds } from "../data/featureHelper";
import { durationOptions } from "../data/subscriptionData";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { CheckCircle } from "lucide-react";

// Mock restaurant data - in real app would come from restaurants store
const mockRestaurants = [
  { id: "RST-001", name: "ABC Restaurant", adminName: "John Doe", adminEmail: "john@abcrestaurant.com" },
  { id: "RST-002", name: "XYZ Cafe", adminName: "Sarah Smith", adminEmail: "sarah@xyzcafe.com" },
  { id: "RST-003", name: "Food Corner", adminName: "Mike Johnson", adminEmail: "mike@foodcorner.com" },
  { id: "RST-004", name: "Golden Dragon", adminName: "Lee Wang", adminEmail: "lee@goldendragon.com" },
  { id: "RST-005", name: "Pizza Palace", adminName: "Anna Brown", adminEmail: "anna@pizzapalace.com" },
  { id: "RST-007", name: "Sushi Master", adminName: "Yuki Tanaka", adminEmail: "yuki@sushimaster.com" },
  { id: "RST-008", name: "Burger Barn", adminName: "Tom Harris", adminEmail: "tom@burgerbarn.com" },
];

const getInitialFormData = () => ({
  restaurantId: "",
  restaurantName: "",
  adminName: "",
  adminEmail: "",
  packageName: "",
  duration: 30,
  startDate: new Date().toISOString().split('T')[0],
});

export default function AssignSubscriptionModal() {
  const { showAssignModal, closeAssignModal, assignSubscription } = useSubscriptionsStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [showConfirm, setShowConfirm] = useState(false);

  const packages = getAllPackages();
  const selectedPackage = packages.find(p => p.name === formData.packageName);
  const features = selectedPackage ? getFeaturesByIds(selectedPackage.features) : [];

  useEffect(() => {
    if (showAssignModal) {
      setFormData(getInitialFormData());
      setShowConfirm(false);
    }
  }, [showAssignModal]);

  const handleRestaurantChange = (restaurantId) => {
    const restaurant = mockRestaurants.find(r => r.id === restaurantId);
    setFormData(prev => ({
      ...prev,
      restaurantId,
      restaurantName: restaurant?.name || "",
      adminName: restaurant?.adminName || "",
      adminEmail: restaurant?.adminEmail || "",
    }));
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const calculatedEndDate = useMemo(() => {
    if (!formData.startDate || !formData.duration) return "";
    const start = new Date(formData.startDate);
    start.setDate(start.getDate() + formData.duration);
    return start.toISOString().split('T')[0];
  }, [formData.startDate, formData.duration]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.restaurantId) {
      toast.error("Please select a restaurant");
      return;
    }
    if (!formData.packageName) {
      toast.error("Please select a package");
      return;
    }
    if (!formData.startDate) {
      toast.error("Please select a start date");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      assignSubscription({
        restaurantId: formData.restaurantId,
        restaurantName: formData.restaurantName,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        packageName: formData.packageName,
        duration: formData.duration,
        startDate: formData.startDate,
      });
      toast.success("Subscription assigned successfully");
      setLoading(false);
    }, 500);
  };

  if (!showAssignModal) return null;

  if (showConfirm) {
    return (
      <Modal isOpen={showAssignModal} onClose={closeAssignModal} title="Assign Subscription" size="lg">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-theme">Confirm Assignment</h3>
          <p className="text-sm text-secondary">
            You are assigning the <strong>{formData.packageName}</strong> package to <strong>{formData.restaurantName}</strong> for {formData.duration} days.
          </p>
          <div className="bg-primary-light/20 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-secondary">Start Date:</span>
              <span className="text-sm text-theme font-medium">{formatDate(formData.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">End Date:</span>
              <span className="text-sm text-theme font-medium">{formatDate(calculatedEndDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">Features:</span>
              <span className="text-sm text-theme font-medium">{features.length} Features</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button className="flex-1" loading={loading} onClick={handleSubmit}>
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={showAssignModal} onClose={closeAssignModal} title="Assign Subscription" size="lg">
      <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="space-y-6">
        <FormSection title="Restaurant Information" description="Select the restaurant to assign subscription">
          <Select 
            label="Restaurant *" 
            value={formData.restaurantId} 
            onChange={handleRestaurantChange}
            options={mockRestaurants.map(r => ({ 
              value: r.id, 
              label: `${r.name} (Admin: ${r.adminName})` 
            }))}
            placeholder="Select Restaurant"
          />
        </FormSection>

        <FormSection title="Subscription Package" description="Select the package to assign">
          <Select 
            label="Package *" 
            value={formData.packageName} 
            onChange={(v) => handleChange("packageName", v)}
            options={packages.map(p => ({ value: p.name, label: p.name }))}
            placeholder="Select Package"
          />

          {selectedPackage && (
            <div className="mt-4 p-4 border border-theme rounded-lg">
              <h4 className="font-medium text-theme mb-2">{selectedPackage.name}</h4>
              <p className="text-sm text-secondary mb-3">{selectedPackage.description}</p>
              <div className="flex items-center gap-2 text-sm text-secondary mb-3">
                <span>Duration: {selectedPackage.durationDisplay}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-secondary">Included Features:</p>
                {features.map(f => (
                  <div key={f.id} className="flex items-center gap-2 text-sm text-theme">
                    <CheckCircle size={14} className="text-green-600" />
                    {f.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormSection>

        <FormSection title="Subscription Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Start Date *" 
              type="date" 
              value={formData.startDate} 
              onChange={(e) => handleChange("startDate", e.target.value)} 
            />
            <Select 
              label="Duration" 
              value={formData.duration} 
              onChange={(v) => handleChange("duration", parseInt(v))}
              options={durationOptions}
            />
          </div>
          {calculatedEndDate && (
            <div className="mt-4 p-3 bg-primary-light/20 rounded-lg">
              <p className="text-sm">
                <span className="text-secondary">End Date: </span>
                <span className="text-theme font-medium">{formatDate(calculatedEndDate)}</span>
              </p>
            </div>
          )}
        </FormSection>

        <div className="flex justify-end gap-3 pt-4 border-t border-theme">
          <Button type="button" variant="secondary" onClick={closeAssignModal}>Cancel</Button>
          <Button type="submit">
            Continue to Confirm
          </Button>
        </div>
      </form>
    </Modal>
  );
}