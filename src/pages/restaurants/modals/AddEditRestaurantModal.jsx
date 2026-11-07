import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRestaurantsStore, subscriptionPackages } from "../../../store/restaurantsStore";
import { packagesAPI } from "../../../api/packages";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import ImageUploader from "../../../components/ui/ImageUploader";
import { Calendar, Users, CheckCircle2 } from "lucide-react";

const normalizeDuration = (dur) => {
  if (!dur) return "1_month";
  if (dur === "30" || dur === "30_days") return "1_month";
  if (dur === "90" || dur === "90_days" || dur === "3_months") return "6_months";
  if (dur === "180" || dur === "180_days") return "6_months";
  if (dur === "365" || dur === "1_year" || dur === "12_months") return "12_months";
  return dur;
};

const getInitialFormData = (restaurant = null) => ({
  name: restaurant?.name || "",
  logo: restaurant?.logo || null,
  description: restaurant?.description || "",
  address: restaurant?.address?.fullAddress || "",
  city: restaurant?.address?.city || "",
  state: restaurant?.address?.state || "",
  country: restaurant?.address?.country || "India",
  pincode: restaurant?.address?.pincode || "",
  phone: restaurant?.phone || "",
  email: restaurant?.email || "",
  website: restaurant?.website || "",
  adminName: restaurant?.admin?.name || "",
  adminEmail: restaurant?.admin?.email || "",
  adminPhone: restaurant?.admin?.phone || "",
  package: restaurant?.subscription?.packageName || restaurant?.subscription?.package || "Basic",
  duration: normalizeDuration(restaurant?.subscription?.duration),
  startDate: restaurant?.subscription?.startDate ? new Date(restaurant.subscription.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  status: restaurant?.status || "active",
});

function calculateEndDate(start, days) {
  if (!start || !days) return null;
  const date = new Date(start);
  date.setDate(date.getDate() + parseInt(days));
  return date.toISOString().split('T')[0];
}

export default function AddEditRestaurantModal() {
  const { showAddModal, closeAddModal, addRestaurant, updateRestaurant, editingRestaurant } = useRestaurantsStore();
  const isEdit = !!editingRestaurant;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [availablePackages, setAvailablePackages] = useState([]);

  useEffect(() => {
    packagesAPI.getPackages({ status: 'active' })
      .then(res => {
        const pkgs = res.data?.data || res.data || [];
        setAvailablePackages(pkgs);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (showAddModal) {
      setFormData(getInitialFormData(editingRestaurant));
    }
  }, [showAddModal, editingRestaurant]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const effectivePackages = availablePackages.length > 0 ? availablePackages : subscriptionPackages;
  const selectedPkg = effectivePackages.find(p => (p.name || p.label)?.toLowerCase() === (formData.package || '').toLowerCase()) || effectivePackages[0];

  const durationOptions = (selectedPkg?.pricing && selectedPkg.pricing.length > 0)
    ? selectedPkg.pricing.map(item => ({
        value: item.duration,
        label: `${item.durationDisplay} — ₹${item.price.toLocaleString()}${item.isPopular ? ' ★ (Best Value)' : ''}`,
        days: item.durationDays,
        price: item.price,
        display: item.durationDisplay,
        isPopular: item.isPopular
      }))
    : [
        { value: "1_month", label: "1 Month (30 Days) — ₹999", days: 30, price: 999, display: "1 Month (30 Days)" },
        { value: "6_months", label: "6 Months (180 Days) — ₹4,999", days: 180, price: 4999, display: "6 Months (180 Days)" },
        { value: "12_months", label: "12 Months / 1 Year (365 Days) — ₹8,999 ★ (Best Value)", days: 365, price: 8999, display: "12 Months / 1 Year", isPopular: true },
      ];

  const currentDurationTier = durationOptions.find(d => d.value === formData.duration) || durationOptions[0];
  const calculatedEndDate = calculateEndDate(formData.startDate, currentDurationTier?.days || 30);

  const handlePackageChange = (val) => {
    const newPkg = effectivePackages.find(p => (p.name || p.label)?.toLowerCase() === (val || '').toLowerCase());
    const hasCurrentDuration = newPkg?.pricing?.some(pr => pr.duration === formData.duration);
    const newDuration = hasCurrentDuration ? formData.duration : (newPkg?.pricing?.[0]?.duration || "1_month");
    setFormData(prev => ({
      ...prev,
      package: val,
      duration: newDuration
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Restaurant name is required");
      return;
    }
    if (!formData.adminName.trim()) {
      toast.error("Admin name is required");
      return;
    }
    if (!formData.adminEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      toast.error("Valid admin email is required");
      return;
    }
    if (!formData.adminPhone.trim()) {
      toast.error("Admin phone is required");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("City is required");
      return;
    }

    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('phone', formData.phone ? `+91 ${formData.phone.replace(/\D/g, '')}` : '');
      submitData.append('email', formData.email);
      submitData.append('website', formData.website);
      submitData.append('status', formData.status);
      
      submitData.append('address', JSON.stringify({
        city: formData.city, 
        state: formData.state, 
        country: formData.country, 
        pincode: formData.pincode, 
        fullAddress: formData.address 
      }));
      
      submitData.append('admin', JSON.stringify({
        name: formData.adminName, 
        email: formData.adminEmail, 
        phone: formData.adminPhone ? `+91 ${formData.adminPhone.replace(/\D/g, '')}` : '' 
      }));
      
      submitData.append('subscription', JSON.stringify({
        packageId: selectedPkg?._id || null,
        packageName: selectedPkg?.name || selectedPkg?.label || formData.package,
        package: selectedPkg?.name || selectedPkg?.label || formData.package, 
        duration: currentDurationTier?.value || formData.duration,
        durationDays: currentDurationTier?.days || 30,
        durationDisplay: currentDurationTier?.display || `${currentDurationTier?.days || 30} Days`,
        price: currentDurationTier?.price || 0,
        status: formData.package ? "active" : "pending", 
        startDate: formData.startDate || null, 
        endDate: calculatedEndDate || null 
      }));
      
      if (formData.logoFile) {
        submitData.append('logo', formData.logoFile);
      } else if (formData.logo) {
        submitData.append('logo', formData.logo);
      }

      if (isEdit) {
        await updateRestaurant(editingRestaurant._id || editingRestaurant.id, submitData);
        toast.success("Restaurant updated successfully");
      } else {
        await addRestaurant(submitData);
        toast.success("Restaurant created successfully");
      }
    } catch (error) {
      // Error toast is handled by the store
    } finally {
      setLoading(false);
    }
  };

  if (!showAddModal) return null;

  const packageOptions = effectivePackages.map(p => {
    const name = p.name || p.label;
    const tables = p.maxTables || 15;
    return {
      value: name,
      label: `${name} Plan (${tables} Tables Max)`
    };
  });

  return (
    <Modal isOpen={showAddModal} onClose={closeAddModal} title={isEdit ? "Edit Restaurant" : "Add Restaurant"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Restaurant Information" description="Basic details about the restaurant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Restaurant Name" 
              required 
              maxLength={100}
              value={formData.name} 
              onChange={(e) => handleChange("name", e.target.value)} 
              placeholder="Enter restaurant name" 
            />
            <ImageUploader 
              label="Restaurant Logo (Max 1MB)" 
              value={formData.logo ? (formData.logo.startsWith('http') || formData.logo.startsWith('blob:') ? formData.logo : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '')}${formData.logo}`) : ''} 
              onChange={(url, file) => {
                if (file && file.size > 1024 * 1024) {
                  toast.error("Logo size must be under 1MB");
                  return;
                }
                handleChange("logo", url);
                if (file) handleChange("logoFile", file);
              }} 
            />
          </div>
          <div className="mt-4">
            <Textarea 
              label="Description" 
              value={formData.description} 
              onChange={(e) => handleChange("description", e.target.value)} 
              placeholder="Brief description about the restaurant"
              rows={3}
            />
          </div>
        </FormSection>

        <FormSection title="Address Details">
          <div className="space-y-4">
            <Input 
              label="Full Address" 
              value={formData.address} 
              onChange={(e) => handleChange("address", e.target.value)} 
              placeholder="Street address, locality, landmark" 
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input 
                label="City" 
                required 
                value={formData.city} 
                onChange={(e) => handleChange("city", e.target.value)} 
                placeholder="City" 
              />
              <Input 
                label="State" 
                value={formData.state} 
                onChange={(e) => handleChange("state", e.target.value)} 
                placeholder="State" 
              />
              <Input 
                label="Country" 
                value={formData.country} 
                onChange={(e) => handleChange("country", e.target.value)} 
                placeholder="Country" 
              />
              <Input 
                label="Pincode" 
                maxLength={6}
                value={formData.pincode} 
                onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, ''))} 
                placeholder="6-digit PIN" 
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme mb-1.5">Restaurant Phone</label>
              <div className="flex relative">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-theme bg-primary-light/20 text-theme text-sm">
                  +91
                </span>
                <input
                  type="text"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={formData.phone.replace('+91', '').trim()}
                  onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-r-lg border border-theme text-sm text-theme bg-surface focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  placeholder="9876543210"
                />
              </div>
            </div>
            <Input 
              label="Email" 
              type="email" 
              value={formData.email} 
              onChange={(e) => handleChange("email", e.target.value)} 
              placeholder="restaurant@example.com" 
            />
            <Input 
              label="Website" 
              value={formData.website} 
              onChange={(e) => handleChange("website", e.target.value)} 
              placeholder="https://restaurant.com" 
            />
          </div>
        </FormSection>

        <FormSection title="Restaurant Admin Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="Admin Name" 
              required 
              value={formData.adminName} 
              onChange={(e) => handleChange("adminName", e.target.value)} 
              placeholder="John Doe" 
            />
            <Input 
              label="Admin Email" 
              type="email" 
              required 
              value={formData.adminEmail} 
              onChange={(e) => handleChange("adminEmail", e.target.value)} 
              placeholder="admin@restaurant.com" 
            />
            <div>
              <label className="block text-sm font-medium text-theme mb-1.5">Admin Phone <span className="text-red-500">*</span></label>
              <div className="flex relative">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-theme bg-primary-light/20 text-theme text-sm">
                  +91
                </span>
                <input
                  type="text"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={formData.adminPhone.replace('+91', '').trim()}
                  onChange={(e) => handleChange("adminPhone", e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-r-lg border border-theme text-sm text-theme bg-surface focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  placeholder="9876543210"
                />
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Subscription Package" description="Select static package tier and duration">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Package Tier" 
              value={formData.package} 
              onChange={handlePackageChange} 
              options={packageOptions}
              placeholder="Select package"
            />
            <Select 
              label="Subscription Duration" 
              value={formData.duration} 
              onChange={(v) => handleChange("duration", v)} 
              options={durationOptions}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input 
              label="Start Date" 
              type="date" 
              value={formData.startDate} 
              onChange={(e) => handleChange("startDate", e.target.value)} 
            />
            <Select 
              label="Restaurant Status" 
              value={formData.status} 
              onChange={(v) => handleChange("status", v)} 
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]} 
            />
          </div>

          {/* Pricing & Duration Summary Card */}
          <div className="mt-4 p-4 rounded-xl border border-theme bg-primary-light/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-theme text-base">
                  {selectedPkg?.name || selectedPkg?.label || formData.package} Plan
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  <Users size={12} />
                  Up to {selectedPkg?.maxTables || 15} Tables
                </span>
                {currentDurationTier?.isPopular && (
                  <span className="text-[10px] bg-amber-500 text-white font-bold rounded px-1.5 py-0.5 uppercase tracking-wider">
                    Best Value
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary flex items-center gap-1.5">
                <Calendar size={13} className="text-primary" />
                Duration: <span className="font-medium text-theme">{currentDurationTier?.display}</span> ({currentDurationTier?.days} Days)
              </p>
            </div>
            <div className="sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-theme">
              <div className="text-xl font-extrabold text-theme">
                ₹{currentDurationTier?.price ? currentDurationTier.price.toLocaleString() : '0'}
              </div>
              <p className="text-xs text-secondary">
                Valid until: <span className="font-semibold text-theme">{calculatedEndDate || 'N/A'}</span>
              </p>
            </div>
          </div>
        </FormSection>

        <div className="flex justify-end gap-3 pt-4 border-t border-theme">
          <Button type="button" variant="secondary" onClick={closeAddModal}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "Update Restaurant" : "Create Restaurant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
