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

  const handleSubmit = (e) => {
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
    
    setTimeout(() => {
      const restaurant = {
        name: formData.name,
        logo: formData.logo,
        description: formData.description,
        address: { 
          city: formData.city, 
          state: formData.state, 
          country: formData.country, 
          pincode: formData.pincode, 
          fullAddress: formData.address 
        },
        admin: { 
          name: formData.adminName, 
          email: formData.adminEmail, 
          phone: formData.adminPhone 
        },
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        subscription: { 
          package: formData.package, 
          status: formData.package ? "active" : "pending", 
          startDate: formData.startDate, 
          endDate: formData.startDate ? calculateEndDate(formData.startDate, formData.duration) : null 
        },
        status: formData.status,
      };
      
      if (isEdit) {
        updateRestaurant(editingRestaurant.id, restaurant);
        toast.success("Restaurant updated successfully");
      } else {
        addRestaurant(restaurant);
        toast.success("Restaurant created successfully");
      }
      setLoading(false);
    }, 500);
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
              value={formData.name} 
              onChange={(e) => handleChange("name", e.target.value)} 
              placeholder="Enter restaurant name" 
            />
            <ImageUploader 
              label="Restaurant Logo" 
              value={formData.logo} 
              onChange={(url) => handleChange("logo", url)} 
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
              value={formData.pincode} 
              onChange={(e) => handleChange("pincode", e.target.value)} 
              placeholder="400001" 
            />
          </div>
        </FormSection>

        <FormSection title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Restaurant Phone" 
              value={formData.phone} 
              onChange={(e) => handleChange("phone", e.target.value)} 
              placeholder="+91 9876543210" 
            />
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
            <Input 
              label="Admin Phone" 
              required 
              value={formData.adminPhone} 
              onChange={(e) => handleChange("adminPhone", e.target.value)} 
              placeholder="+91 9876543210" 
            />
          </div>
        </FormSection>

        <FormSection title="Subscription">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Package" 
              value={formData.package} 
              onChange={(v) => handleChange("package", v)} 
              options={subscriptionPackages.map(p => ({ value: p.label, label: `${p.label} (${p.duration} days - ₹${p.price})` }))}
              placeholder="Select package"
            />
            <Select 
              label="Duration" 
              value={formData.duration} 
              onChange={(v) => handleChange("duration", v)} 
              options={[
                { value: "30", label: "30 days" },
                { value: "90", label: "90 days" },
                { value: "180", label: "180 days" },
                { value: "365", label: "1 year" },
              ]} 
            />
            <Input 
              label="Start Date" 
              type="date" 
              value={formData.startDate} 
              onChange={(e) => handleChange("startDate", e.target.value)} 
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