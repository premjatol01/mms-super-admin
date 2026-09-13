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

  const handleSubmit = (e) => {
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
    
    setTimeout(() => {
      const lead = {
        restaurantName: formData.restaurantName,
        address: { 
          fullAddress: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
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
        updateLead(editingLead.id, lead);
        toast.success("Lead updated successfully");
      } else {
        addLead(lead);
        toast.success("Lead created successfully");
      }
      setLoading(false);
    }, 500);
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
              label="Pincode" 
              value={formData.pincode} 
              onChange={(e) => handleChange("pincode", e.target.value)} 
              placeholder="Pincode" 
            />
          </div>
        </FormSection>

        <FormSection title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="Contact Person Name" 
              required 
              value={formData.contactPerson} 
              onChange={(e) => handleChange("contactPerson", e.target.value)} 
              placeholder="Full name" 
            />
            <Input 
              label="Phone Number" 
              required 
              value={formData.phone} 
              onChange={(e) => handleChange("phone", e.target.value)} 
              placeholder="+91 9876543210" 
            />
            <Input 
              label="Email Address" 
              type="email"
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