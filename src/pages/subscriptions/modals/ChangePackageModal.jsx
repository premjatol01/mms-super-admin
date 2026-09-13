import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSubscriptionsStore } from "../../../store/subscriptionsStore";
import { getAllPackages } from "../data/packageHelper";
import { getFeaturesByIds } from "../data/featureHelper";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Select from "../../../components/ui/Select";
import { CheckCircle, XCircle } from "lucide-react";

export default function ChangePackageModal() {
  const { showChangePackageModal, closeChangePackageModal, changePackage, selectedSubscription } = useSubscriptionsStore();
  const [loading, setLoading] = useState(false);
  const [newPackageName, setNewPackageName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const packages = getAllPackages();
  const currentPackage = packages.find(p => p.name === selectedSubscription?.packageName);
  const newPackage = packages.find(p => p.name === newPackageName);
  
  const currentFeatures = currentPackage ? getFeaturesByIds(currentPackage.features) : [];
  const newFeatures = newPackage ? getFeaturesByIds(newPackage.features) : [];

  useEffect(() => {
    if (showChangePackageModal && selectedSubscription) {
      setNewPackageName(selectedSubscription.packageName);
      setShowConfirm(false);
    }
  }, [showChangePackageModal, selectedSubscription]);

  const handleSubmit = () => {
    if (!selectedSubscription || !newPackageName) return;
    if (newPackageName === selectedSubscription.packageName) {
      toast.error("Please select a different package");
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      changePackage(selectedSubscription.id, newPackageName);
      toast.success("Package changed successfully");
      setLoading(false);
      closeChangePackageModal();
    }, 500);
  };

  if (!showChangePackageModal || !selectedSubscription) return null;

  const availablePackages = packages.filter(p => p.name !== selectedSubscription.packageName);

  if (showConfirm) {
    return (
      <Modal isOpen={showChangePackageModal} onClose={closeChangePackageModal} title="Change Package" size="lg">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-theme">Confirm Package Change</h3>
          <p className="text-sm text-secondary">
            You are changing the package for <strong>{selectedSubscription.restaurantName}</strong> from <strong>{selectedSubscription.packageName}</strong> to <strong>{newPackageName}</strong>.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-700">Changing the package may change the features available to the restaurant.</p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button className="flex-1" loading={loading} onClick={handleSubmit}>
              Confirm Change
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={showChangePackageModal} onClose={closeChangePackageModal} title="Change Package" size="lg">
      <div className="space-y-6">
        <div className="bg-primary-light/20 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-secondary">Restaurant:</span>
            <span className="text-sm text-theme font-medium">{selectedSubscription.restaurantName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-secondary">Current Package:</span>
            <span className="text-sm text-theme font-medium">{selectedSubscription.packageName}</span>
          </div>
        </div>

        <FormSection title="Select New Package">
          <Select 
            label="New Package" 
            value={newPackageName} 
            onChange={setNewPackageName}
            options={availablePackages.map(p => ({ value: p.name, label: p.name }))}
            placeholder="Select Package"
          />
        </FormSection>

        {newPackage && (
          <FormSection title="Feature Comparison">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-theme">
                    <th className="text-left py-2 text-secondary">Feature</th>
                    <th className="text-center py-2 text-secondary">Current</th>
                    <th className="text-center py-2 text-secondary">New</th>
                  </tr>
                </thead>
                <tbody>
                  {[...new Set([...currentFeatures, ...newFeatures].map(f => f.id))].map(featureId => {
                    const currentFeature = currentFeatures.find(f => f.id === featureId);
                    const newFeature = newFeatures.find(f => f.id === featureId);
                    return (
                      <tr key={featureId} className="border-b border-theme/50">
                        <td className="py-2 text-theme">{newFeature?.name || currentFeature?.name}</td>
                        <td className="text-center py-2">
                          {currentFeature ? <CheckCircle size={16} className="mx-auto text-green-600" /> : <XCircle size={16} className="mx-auto text-gray-400" />}
                        </td>
                        <td className="text-center py-2">
                          {newFeature ? <CheckCircle size={16} className="mx-auto text-green-600" /> : <XCircle size={16} className="mx-auto text-gray-400" />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </FormSection>
        )}

        <div className="flex gap-3 pt-4 border-t border-theme">
          <Button variant="secondary" className="flex-1" onClick={closeChangePackageModal}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => setShowConfirm(true)} disabled={newPackageName === selectedSubscription?.packageName}>
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}