import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePackagesStore } from "../../../store/packagesStore";
import { packageFeatureGroups, getAllFeatures } from "../data/featureData";
import { durationOptions } from "../data/packageData";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";

const getInitialFormData = (pkg = null) => ({
  name: pkg?.name || "",
  description: pkg?.description || "",
  duration: pkg?.duration || "30_days",
  features: pkg?.features || [],
  status: pkg?.status || "active",
});

export default function AddEditPackageModal() {
  const { showAddModal, closeAddModal, addPackage, updatePackage, editingPackage } = usePackagesStore();
  const isEdit = !!editingPackage;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (showAddModal) {
      setFormData(getInitialFormData(editingPackage));
    }
  }, [showAddModal, editingPackage]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleFeatureToggle = (featureId) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Package name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (formData.features.length === 0) {
      toast.error("Select at least one feature");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const pkgData = {
        name: formData.name,
        description: formData.description,
        duration: formData.duration,
        features: formData.features,
        status: formData.status,
      };
      
      if (isEdit) {
        updatePackage(editingPackage.id, pkgData);
        toast.success("Package updated successfully");
      } else {
        addPackage(pkgData);
        toast.success("Package created successfully");
      }
      setLoading(false);
    }, 500);
  };

  if (!showAddModal) return null;

  return (
    <Modal isOpen={showAddModal} onClose={closeAddModal} title={isEdit ? "Edit Package" : "Add Package"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Package Information" description="Basic details about the subscription package">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Package Name" 
              required 
              value={formData.name} 
              onChange={(e) => handleChange("name", e.target.value)} 
              placeholder="e.g., Basic, Standard, Premium" 
            />
            <Select 
              label="Duration" 
              required 
              value={formData.duration} 
              onChange={(v) => handleChange("duration", v)} 
              options={durationOptions.map(d => ({ value: d.value, label: d.label }))}
            />
          </div>
          <div className="mt-4">
            <Textarea 
              label="Description" 
              required 
              value={formData.description} 
              onChange={(e) => handleChange("description", e.target.value)} 
              placeholder="Describe what this package includes" 
              rows={3} 
            />
          </div>
        </FormSection>

        <FormSection title="Features" description="Select the features included in this package">
          <div className="space-y-4">
            {packageFeatureGroups.map((group) => (
              <div key={group.group} className="border border-theme rounded-lg p-4">
                <h4 className="font-medium text-theme mb-3">{group.group}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.features.map((feature) => (
                    <label
                      key={feature.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.features.includes(feature.id)
                          ? "border-primary bg-primary-light/20"
                          : "border-theme hover:bg-primary-light/10"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature.id)}
                        onChange={() => handleFeatureToggle(feature.id)}
                        className="mt-0.5 rounded border-theme text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium text-theme text-sm">{feature.name}</p>
                        <p className="text-xs text-secondary">{feature.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-secondary mt-2">
            {formData.features.length} feature(s) selected
          </p>
        </FormSection>

        <FormSection title="Status">
          <Select 
            label="Package Status" 
            value={formData.status} 
            onChange={(v) => handleChange("status", v)} 
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </FormSection>

        <div className="flex justify-end gap-3 pt-4 border-t border-theme">
          <Button type="button" variant="secondary" onClick={closeAddModal}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "Update Package" : "Create Package"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}