import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRestaurantsStore, subscriptionPackages } from "../../../store/restaurantsStore";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import ImageUploader from "../../../components/ui/ImageUploader";

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
  package: restaurant?.subscription?.package || "",
  duration: "30",
  startDate: restaurant?.subscription?.startDate || "",
  status: restaurant?.status || "active",
});

function calculateEndDate(start, days) {
  if (!start) return null;
  const date = new Date(start);
  date.setDate(date.getDate() + parseInt(days));
  return date.toISOString().split('T')[0];
}

export default function AddEditRestaurantModal() {
  const { showAddModal, closeAddModal, addRestaurant, updateRestaurant, editingRestaurant } = useRestaurantsStore();
  const isEdit = !!editingRestaurant;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (showAddModal) {
      setFormData(getInitialFormData(editingRestaurant));
    }
  }, [showAddModal, editingRestaurant]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

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
        package: formData.package, 
        status: formData.package ? "active" : "pending", 
        startDate: formData.startDate || null, 
        endDate: formData.startDate ? calculateEndDate(formData.startDate, formData.duration) : null 
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
              placeholder="Describe your restaurant" 
              rows={3} 
            />
          </div>
        </FormSection>

        <FormSection title="Address Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Street Address" 
              maxLength={200}
              value={formData.address} 
              onChange={(e) => handleChange("address", e.target.value)} 
              placeholder="123 Main Street" 
            />
            <Input 
              label="City" 
              required 
              value={formData.city} 
              onChange={(e) => handleChange("city", e.target.value)} 
              placeholder="Mumbai" 
            />
            <Input 
              label="State" 
              value={formData.state} 
              onChange={(e) => handleChange("state", e.target.value)} 
              placeholder="Maharashtra" 
            />
            <Input 
              label="Country" 
              value={formData.country} 
              onChange={(e) => handleChange("country", e.target.value)} 
              placeholder="India" 
            />
            <Input 
              label="Pincode" 
              maxLength={6}
              pattern="[0-9]{6}"
              value={formData.pincode} 
              onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, ''))} 
              placeholder="400001" 
            />
          </div>
        </FormSection>

        <FormSection title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label="Restaurant Email" 
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

        <FormSection title="Subscription">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Package" 
              value={formData.package} 
              onChange={(v) => handleChange("package", v)} 
              options={subscriptionPackages.map(p => ({ value: p.label, label: `${p.label} (₹${p.price})` }))}
              placeholder="Select package"
            />
            <Select 
              label="Status" 
              value={formData.status} 
              onChange={(v) => handleChange("status", v)} 
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]} 
            />
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