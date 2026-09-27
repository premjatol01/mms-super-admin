import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLeadsStore } from "../../../store/leadsStore";
import { leadStages, restaurantTypes } from "../data/leadData";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";

const getInitialFormData = (lead = null) => ({
  restaurantName: lead?.restaurantName || "",
  address: lead?.address?.fullAddress || "",
  city: lead?.address?.city || "",
  state: lead?.address?.state || "",
  pincode: lead?.address?.pincode || "",
  contactPerson: lead?.contactPerson || "",
  phone: lead?.phone || "",
  email: lead?.email || "",
  restaurantType: lead?.restaurantType || "",
  website: lead?.website || "",
  stage: lead?.stage || "prospect",
  status: lead?.status || "active",
  notes: lead?.notes || ""
});

export default function AddEditLeadModal() {
  const { showAddModal, closeAddModal, addLead, updateLead, editingLead } = useLeadsStore();
  const isEdit = !!editingLead;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (showAddModal) {
      setFormData(getInitialFormData(editingLead));
    }
  }, [showAddModal, editingLead]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.restaurantName.trim()) {
      toast.error("Restaurant name is required");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Restaurant address is required");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!formData.contactPerson.trim()) {
      toast.error("Contact person is required");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    try {
      const lead = {
        restaurantName: formData.restaurantName,
        address: { 
          fullAddress: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: "India"
        },
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        restaurantType: formData.restaurantType,
        website: formData.website,
        stage: formData.stage,
        status: formData.status,
        notes: formData.notes
      };
      
      if (isEdit) {
        await updateLead(editingLead.id, lead);
        toast.success("Lead updated successfully");
      } else {
        await addLead(lead);
        toast.success("Lead created successfully");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save lead");
    } finally {
      setLoading(false);
    }
  };

  if (!showAddModal) return null;

  return (
    <Modal isOpen={showAddModal} onClose={closeAddModal} title={isEdit ? "Edit Lead" : "Add Lead"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Restaurant Information" description="Basic details about the restaurant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Restaurant Name" 
              required 
              maxLength={100}
              value={formData.restaurantName} 
              onChange={(e) => handleChange("restaurantName", e.target.value)} 
              placeholder="Enter restaurant name" 
            />
            <Select 
              label="Restaurant Type" 
              value={formData.restaurantType} 
              onChange={(v) => handleChange("restaurantType", v)} 
              options={restaurantTypes.map(t => ({ value: t, label: t }))}
              placeholder="Select type"
            />
          </div>
          <div className="mt-4">
            <Textarea 
              label="Restaurant Address" 
              required 
              maxLength={200}
              value={formData.address} 
              onChange={(e) => handleChange("address", e.target.value)} 
              placeholder="Street address, area, landmark" 
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Input 
              label="City" 
              required 
              maxLength={50}
              value={formData.city} 
              onChange={(e) => handleChange("city", e.target.value)} 
              placeholder="City" 
            />
            <Input 
              label="State" 
              maxLength={50}
              value={formData.state} 
              onChange={(e) => handleChange("state", e.target.value)} 
              placeholder="State" 
            />
            <Input 
              label="Pincode" 
              maxLength={6}
              pattern="[0-9]{6}"
              value={formData.pincode} 
              onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, ''))} 
              placeholder="Pincode" 
            />
          </div>
        </FormSection>

        <FormSection title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="Contact Person Name" 
              required 
              maxLength={50}
              value={formData.contactPerson} 
              onChange={(e) => handleChange("contactPerson", e.target.value)} 
              placeholder="Full name" 
            />
            <div>
              <label className="block text-sm font-medium text-theme mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex relative">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-theme bg-primary-light/20 text-theme text-sm">
                  +91
                </span>
                <input
                  type="text"
                  required
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
              label="Email Address" 
              type="email"
              maxLength={100}
              value={formData.email} 
              onChange={(e) => handleChange("email", e.target.value)} 
              placeholder="email@example.com" 
            />
          </div>
        </FormSection>

        <FormSection title="Additional Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Website" 
              value={formData.website} 
              onChange={(e) => handleChange("website", e.target.value)} 
              placeholder="https://restaurant.com" 
            />
            <Select 
              label="Lead Stage" 
              value={formData.stage} 
              onChange={(v) => handleChange("stage", v)} 
              options={leadStages.map(s => ({ value: s.value, label: s.label }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Select 
              label="Status" 
              value={formData.status} 
              onChange={(v) => handleChange("status", v)} 
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" }
              ]}
            />
          </div>
        </FormSection>

        <FormSection title="Notes">
          <Textarea 
            value={formData.notes} 
            onChange={(e) => handleChange("notes", e.target.value)} 
            placeholder="Add notes about this lead..."
            rows={3}
          />
        </FormSection>

        <div className="flex justify-end gap-3 pt-4 border-t border-theme">
          <Button type="button" variant="secondary" onClick={closeAddModal}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "Save Changes" : "Create Lead"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}