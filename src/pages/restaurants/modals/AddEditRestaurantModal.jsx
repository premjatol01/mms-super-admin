import { useState, useEffect } from "react";
import { toast } from "sonner";
import SelectReact from "react-select";
import { useRestaurantsStore, subscriptionPackages } from "../../../store/restaurantsStore";
import { packagesAPI } from "../../../api/packages";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import ImageUploader from "../../../components/ui/ImageUploader";
import { Calendar, Users } from "lucide-react";
import { INDIAN_STATES, COUNTRY_OPTIONS, selectCustomStyles } from "../../../constants/addressConstants";

// Helper to strictly extract 10 digits without any country code (strips +91 or leading 91)
const clean10Digits = (val) => {
  if (!val) return "";
  let digits = String(val).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  return digits;
};

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
  houseNumber: restaurant?.detailedAddress?.line1 !== undefined ? restaurant.detailedAddress.line1 : (restaurant?.detailedAddress?.houseNumber || ""),
  street: restaurant?.detailedAddress?.line2 !== undefined ? restaurant.detailedAddress.line2 : (restaurant?.detailedAddress?.street !== undefined ? restaurant.detailedAddress.street : ""),
  area: restaurant?.detailedAddress?.area || "",
  landmark: restaurant?.detailedAddress?.landmark || "",
  city: restaurant?.detailedAddress?.city || restaurant?.address?.city || "",
  state: restaurant?.detailedAddress?.state || restaurant?.address?.state || "Rajasthan",
  country: restaurant?.detailedAddress?.country || restaurant?.address?.country || "India",
  pincode: restaurant?.detailedAddress?.pincode || restaurant?.address?.pincode || "",
  address: restaurant?.address?.fullAddress || "",
  // Contact Information (Clean 10 digits without 91 code)
  phone: clean10Digits(restaurant?.phone || restaurant?.contact?.primaryPhone),
  email: restaurant?.email || restaurant?.contact?.email || "",
  website: restaurant?.websiteUrl || (typeof restaurant?.website === 'string' ? restaurant?.website : restaurant?.website?.url || restaurant?.website?.subdomain) || "",
  // Admin Information (Clean 10 digits without 91 code)
  adminName: restaurant?.admin?.name || "",
  adminEmail: restaurant?.admin?.email || "",
  adminPhone: clean10Digits(restaurant?.admin?.phone),
  adminHouseNumber: restaurant?.admin?.personalAddress?.line1 || "",
  adminStreet: restaurant?.admin?.personalAddress?.line2 || "",
  adminArea: restaurant?.admin?.personalAddress?.area || "",
  adminLandmark: restaurant?.admin?.personalAddress?.landmark || "",
  adminCity: restaurant?.admin?.personalAddress?.city || "",
  adminState: restaurant?.admin?.personalAddress?.state || "Rajasthan",
  adminCountry: restaurant?.admin?.personalAddress?.country || "India",
  adminPincode: restaurant?.admin?.personalAddress?.pincode || "",
  // Subscription Package
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
    
    // Restaurant basic validation
    if (!formData.name.trim()) {
      toast.error("Restaurant name is required");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!formData.state?.trim()) {
      toast.error("State is required");
      return;
    }
    if (!formData.pincode?.trim()) {
      toast.error("PIN code is required");
      return;
    }
    if (formData.country === "India" && !/^\d{6}$/.test(formData.pincode.trim())) {
      toast.error("PIN code must be a valid 6-digit number");
      return;
    }
    if (!formData.country?.trim()) {
      toast.error("Country is required");
      return;
    }

    // Contact Information validation
    const cleanRestPhone = clean10Digits(formData.phone);
    if (formData.phone && cleanRestPhone.length !== 10) {
      toast.error("Restaurant phone must be a valid 10-digit mobile number");
      return;
    }

    // Admin Information validation
    if (!formData.adminName.trim()) {
      toast.error("Admin name is required");
      return;
    }
    if (!formData.adminEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      toast.error("Valid admin email is required");
      return;
    }
    const cleanAdminPhone = clean10Digits(formData.adminPhone);
    if (!cleanAdminPhone || cleanAdminPhone.length !== 10) {
      toast.error("Admin phone must be a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      
      // Contact Information (Strictly 10 digits, NO country code added in DB)
      submitData.append('phone', cleanRestPhone);
      submitData.append('email', formData.email.trim().toLowerCase());
      submitData.append('website', formData.website.trim());
      submitData.append('websiteUrl', formData.website.trim());
      submitData.append('contact', JSON.stringify({
        primaryPhone: cleanRestPhone,
        email: formData.email.trim().toLowerCase()
      }));

      submitData.append('status', formData.status);
      
      const houseNumber = (formData.houseNumber || '').trim();
      const street = (formData.street || '').trim();
      const area = (formData.area || '').trim();
      const landmark = (formData.landmark || '').trim();
      const city = (formData.city || '').trim();
      const state = (formData.state || '').trim();
      const pincode = (formData.pincode || '').trim();
      const country = (formData.country || 'India').trim();

      const fullAddress = [
        houseNumber,
        street,
        area,
        landmark ? `Near ${landmark}` : '',
        city,
        state,
        pincode,
        country
      ].filter(Boolean).join(', ');

      submitData.append('detailedAddress', JSON.stringify({
        line1: houseNumber,
        line2: street,
        area,
        landmark,
        city,
        state,
        pincode,
        country
      }));

      submitData.append('address', JSON.stringify({
        city, 
        state, 
        country, 
        pincode, 
        fullAddress: fullAddress || formData.address?.trim() || ''
      }));
      
      // Admin Information (Strictly 10 digits, NO country code added in DB)
      submitData.append('admin', JSON.stringify({
        name: formData.adminName.trim(), 
        email: formData.adminEmail.trim().toLowerCase(), 
        phone: cleanAdminPhone,
        personalAddress: {
          line1: (formData.adminHouseNumber || '').trim(),
          line2: (formData.adminStreet || '').trim(),
          area: (formData.adminArea || '').trim(),
          landmark: (formData.adminLandmark || '').trim(),
          city: (formData.adminCity || '').trim(),
          state: (formData.adminState || 'Rajasthan').trim(),
          country: (formData.adminCountry || 'India').trim(),
          pincode: (formData.adminPincode || '').trim()
        }
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

  const currentStateOption = INDIAN_STATES.find(
    (s) => s.value.toLowerCase() === (formData.state || "").toLowerCase()
  ) || (formData.state ? { value: formData.state, label: formData.state } : null);

  const currentCountryOption = COUNTRY_OPTIONS.find(
    (c) => c.value.toLowerCase() === (formData.country || "India").toLowerCase()
  ) || { value: formData.country || "India", label: formData.country || "India" };

  const currentAdminStateOption = INDIAN_STATES.find(
    (s) => s.value.toLowerCase() === (formData.adminState || "").toLowerCase()
  ) || (formData.adminState ? { value: formData.adminState, label: formData.adminState } : null);

  const currentAdminCountryOption = COUNTRY_OPTIONS.find(
    (c) => c.value.toLowerCase() === (formData.adminCountry || "India").toLowerCase()
  ) || { value: formData.adminCountry || "India", label: formData.adminCountry || "India" };

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

        <FormSection title="Restaurant Address Details" description="Structured address fields matching website map and restaurant profile">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="House / Building / Flat No."
                value={formData.houseNumber}
                onChange={(e) => handleChange("houseNumber", e.target.value)}
                placeholder="e.g. Shop 4 / Flat 12 / Plot 45"
              />
            </div>

            <div>
              <Input
                label="Street Address / Road"
                value={formData.street}
                onChange={(e) => handleChange("street", e.target.value)}
                placeholder="e.g. Station Road, MG Marg"
              />
            </div>

            <div>
              <Input
                label="Area / Locality"
                value={formData.area}
                onChange={(e) => handleChange("area", e.target.value)}
                placeholder="e.g. Shastri Nagar, Tilak Nagar"
              />
            </div>

            <div>
              <Input
                label="Landmark"
                value={formData.landmark}
                onChange={(e) => handleChange("landmark", e.target.value)}
                placeholder="e.g. Opposite City Hospital"
              />
            </div>

            <div>
              <Input
                label="City"
                required
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="e.g. Barmer, Jaipur"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <SelectReact
                options={INDIAN_STATES}
                value={currentStateOption}
                onChange={(opt) => handleChange("state", opt?.value || "")}
                placeholder="Select State"
                styles={selectCustomStyles}
                isClearable
              />
            </div>

            <div>
              <Input
                label="PIN Code"
                required
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="e.g. 344001 (6 digits)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme mb-1.5">
                Country <span className="text-red-500">*</span>
              </label>
              <SelectReact
                options={COUNTRY_OPTIONS}
                value={currentCountryOption}
                onChange={(opt) => handleChange("country", opt?.value || "India")}
                styles={selectCustomStyles}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Contact Information" description="Public contact details for the restaurant">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme mb-1.5">Restaurant Phone</label>
              <div className="flex relative">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-theme bg-primary-light/20 text-theme text-sm select-none">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, '').slice(0, 10))}
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

        <FormSection title="Restaurant Admin Information" description="Administrator credentials and phone number">
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
              <label className="block text-sm font-medium text-theme mb-1.5">
                Admin Phone <span className="text-red-500">*</span>
              </label>
              <div className="flex relative">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-theme bg-primary-light/20 text-theme text-sm select-none">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={formData.adminPhone}
                  onChange={(e) => handleChange("adminPhone", e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-3 py-2 rounded-r-lg border border-theme text-sm text-theme bg-surface focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  placeholder="9876543210"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-theme">
            <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Admin Personal Address</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="House / Building / Flat No."
                  value={formData.adminHouseNumber}
                  onChange={(e) => handleChange("adminHouseNumber", e.target.value)}
                  placeholder="e.g. Flat 101 / House 22"
                />
              </div>

              <div>
                <Input
                  label="Street Address / Road"
                  value={formData.adminStreet}
                  onChange={(e) => handleChange("adminStreet", e.target.value)}
                  placeholder="e.g. Civil Lines, Main Road"
                />
              </div>

              <div>
                <Input
                  label="Area / Locality"
                  value={formData.adminArea}
                  onChange={(e) => handleChange("adminArea", e.target.value)}
                  placeholder="e.g. Tilak Nagar"
                />
              </div>

              <div>
                <Input
                  label="Landmark"
                  value={formData.adminLandmark}
                  onChange={(e) => handleChange("adminLandmark", e.target.value)}
                  placeholder="e.g. Near Water Tank"
                />
              </div>

              <div>
                <Input
                  label="City"
                  value={formData.adminCity}
                  onChange={(e) => handleChange("adminCity", e.target.value)}
                  placeholder="e.g. Barmer, Jaipur"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme mb-1.5">
                  State
                </label>
                <SelectReact
                  options={INDIAN_STATES}
                  value={currentAdminStateOption}
                  onChange={(opt) => handleChange("adminState", opt?.value || "")}
                  placeholder="Select State"
                  styles={selectCustomStyles}
                  isClearable
                />
              </div>

              <div>
                <Input
                  label="PIN Code"
                  maxLength={6}
                  value={formData.adminPincode}
                  onChange={(e) => handleChange("adminPincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="e.g. 344001 (6 digits)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme mb-1.5">
                  Country
                </label>
                <SelectReact
                  options={COUNTRY_OPTIONS}
                  value={currentAdminCountryOption}
                  onChange={(opt) => handleChange("adminCountry", opt?.value || "India")}
                  styles={selectCustomStyles}
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
