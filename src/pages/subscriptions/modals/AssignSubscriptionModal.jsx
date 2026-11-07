import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useSubscriptionsStore } from "../../../store/subscriptionsStore";
import { restaurantAPI } from "../../../api/restaurantAPI";
import { packagesAPI } from "../../../api/packages";
import { getFeaturesByIds } from "../data/featureHelper";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { CheckCircle, Calendar, Users } from "lucide-react";

const getInitialFormData = () => ({
  restaurantId: "",
  restaurantName: "",
  adminName: "",
  adminEmail: "",
  packageId: "",
  packageName: "",
  duration: 30,
  durationDisplay: "1 Month (30 Days)",
  price: 0,
  startDate: new Date().toISOString().split('T')[0],
});

export default function AssignSubscriptionModal() {
  const { showAssignModal, closeAssignModal, assignSubscription } = useSubscriptionsStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [showConfirm, setShowConfirm] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    if (showAssignModal) {
      setFormData(getInitialFormData());
      setShowConfirm(false);
      
      // Load real restaurants
      restaurantAPI.getRestaurants({ limit: 100 })
        .then(res => setRestaurants(res.data?.data || res.data || []))
        .catch(() => {});

      // Load real packages
      packagesAPI.getPackages({ status: 'active' })
        .then(res => {
          const pkgs = res.data?.data || res.data || [];
          setPackages(pkgs);
          if (pkgs.length > 0 && !formData.packageName) {
            const first = pkgs[0];
            const firstTier = first.pricing?.[0];
            setFormData(prev => ({
              ...prev,
              packageId: first._id,
              packageName: first.name,
              duration: firstTier?.durationDays || 30,
              durationDisplay: firstTier?.durationDisplay || "1 Month (30 Days)",
              price: firstTier?.price || first.price || 0
            }));
          }
        })
        .catch(() => {});
    }
  }, [showAssignModal]);

  const selectedPackage = packages.find(p => (p._id === formData.packageId || p.name === formData.packageName)) || packages[0];
  const features = selectedPackage ? getFeaturesByIds(selectedPackage.features || []) : [];

  const handleRestaurantChange = (rId) => {
    const restaurant = restaurants.find(r => (r._id || r.id) === rId);
    setFormData(prev => ({
      ...prev,
      restaurantId: rId,
      restaurantName: restaurant?.name || "",
      adminName: restaurant?.admin?.name || "",
      adminEmail: restaurant?.admin?.email || "",
    }));
  };

  const handlePackageChange = (pName) => {
    const pkg = packages.find(p => p.name === pName);
    const firstTier = pkg?.pricing?.[0];
    setFormData(prev => ({
      ...prev,
      packageId: pkg?._id || "",
      packageName: pName,
      duration: firstTier?.durationDays || 30,
      durationDisplay: firstTier?.durationDisplay || "1 Month (30 Days)",
      price: firstTier?.price || pkg?.price || 0
    }));
  };

  const handleDurationChange = (durVal) => {
    const days = Number(durVal);
    const tier = selectedPackage?.pricing?.find(p => p.durationDays === days);
    setFormData(prev => ({
      ...prev,
      duration: days,
      durationDisplay: tier?.durationDisplay || `${days} Days`,
      price: tier?.price || prev.price
    }));
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const calculatedEndDate = useMemo(() => {
    if (!formData.startDate || !formData.duration) return "";
    const start = new Date(formData.startDate);
    start.setDate(start.getDate() + Number(formData.duration));
    return start.toISOString().split('T')[0];
  }, [formData.startDate, formData.duration]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
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
    
    const result = await assignSubscription({
      restaurantId: formData.restaurantId,
      packageId: selectedPackage?._id || formData.packageId,
      packageName: formData.packageName,
      duration: Number(formData.duration),
      durationDisplay: formData.durationDisplay,
      price: Number(formData.price) || 0,
      startDate: formData.startDate,
    });

    setLoading(false);
    if (result?.success) {
      closeAssignModal();
    }
  };

  if (!showAssignModal) return null;

  const durationSelectOptions = (selectedPackage?.pricing && selectedPackage.pricing.length > 0)
    ? selectedPackage.pricing.map(item => ({
        value: String(item.durationDays),
        label: `${item.durationDisplay} — ₹${item.price.toLocaleString()}${item.isPopular ? ' ★ (Best Value)' : ''}`
      }))
    : [
        { value: "30", label: "1 Month (30 Days)" },
        { value: "180", label: "6 Months (180 Days)" },
        { value: "365", label: "12 Months / 1 Year" }
      ];

  if (showConfirm) {
    return (
      <Modal isOpen={showAssignModal} onClose={closeAssignModal} title="Confirm Subscription Assignment" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-secondary">
            You are assigning the <strong className="text-theme font-semibold">{formData.packageName}</strong> package to <strong className="text-theme font-semibold">{formData.restaurantName}</strong>.
          </p>
          <div className="bg-primary-light/20 rounded-xl p-4 space-y-2.5 border border-theme">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Restaurant:</span>
              <span className="text-theme font-medium">{formData.restaurantName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Package Tier:</span>
              <span className="text-theme font-medium">{formData.packageName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Duration:</span>
              <span className="text-theme font-medium">{formData.durationDisplay} ({formData.duration} Days)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Price:</span>
              <span className="text-theme font-bold">₹{formData.price?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Start Date:</span>
              <span className="text-theme font-medium">{formatDate(formData.startDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">End Date:</span>
              <span className="text-theme font-semibold text-primary">{formatDate(calculatedEndDate)}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>
              Back
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
            options={restaurants.map(r => ({ 
              value: r._id || r.id, 
              label: `${r.name} (Admin: ${r.admin?.name || '-'})` 
            }))}
            placeholder="Select Restaurant"
          />
        </FormSection>

        <FormSection title="Subscription Package" description="Select the package and duration">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Package Tier *" 
              value={formData.packageName} 
              onChange={handlePackageChange}
              options={packages.map(p => ({ value: p.name, label: `${p.name} (${p.maxTables || 15} Tables limit)` }))}
              placeholder="Select Package"
            />
            <Select 
              label="Duration Option *" 
              value={String(formData.duration)} 
              onChange={handleDurationChange}
              options={durationSelectOptions}
            />
          </div>

          {selectedPackage && (
            <div className="mt-4 p-4 border border-theme rounded-xl bg-primary-light/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-theme text-base">{selectedPackage.name} Package</h4>
                  <p className="text-xs text-secondary mt-0.5">{selectedPackage.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-theme">₹{formData.price?.toLocaleString()}</span>
                  <p className="text-[11px] text-secondary">{formData.durationDisplay}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-theme/60">
                <p className="text-xs font-semibold text-secondary mb-2">Included Modules & Features:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {features.map(f => (
                    <div key={f.id} className="flex items-center gap-2 text-xs text-theme">
                      <CheckCircle size={13} className="text-green-600 flex-shrink-0" />
                      <span>{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </FormSection>

        <FormSection title="Subscription Timeline">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Start Date *" 
              type="date" 
              value={formData.startDate} 
              onChange={(e) => handleChange("startDate", e.target.value)} 
            />
            <div>
              <label className="block text-sm font-medium text-theme mb-1.5">Calculated End Date</label>
              <div className="px-3.5 py-2.5 rounded-lg border border-theme bg-surface text-sm font-semibold text-theme">
                {calculatedEndDate ? formatDate(calculatedEndDate) : "N/A"}
              </div>
            </div>
          </div>
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
