import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSubscriptionsStore } from "../../../store/subscriptionsStore";
import { packagesAPI } from "../../../api/packages";
import { getFeaturesByIds } from "../data/featureHelper";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FormSection from "../../../components/ui/FormSection";
import Select from "../../../components/ui/Select";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function ChangePackageModal() {
  const { showChangePackageModal, closeChangePackageModal, changePackage, selectedSubscription } = useSubscriptionsStore();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [newPackageName, setNewPackageName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (showChangePackageModal) {
      packagesAPI.getPackages({ status: 'active' })
        .then(res => {
          const pkgs = res.data?.data || res.data || [];
          setPackages(pkgs);
          const firstOther = pkgs.find(p => p.name !== selectedSubscription?.packageName);
          if (firstOther) {
            setNewPackageName(firstOther.name);
          }
        })
        .catch(() => {});
      setShowConfirm(false);
    }
  }, [showChangePackageModal, selectedSubscription]);

  const currentPackage = packages.find(p => p.name === selectedSubscription?.packageName);
  const newPackage = packages.find(p => p.name === newPackageName);
  
  const currentFeatures = currentPackage ? getFeaturesByIds(currentPackage.features || []) : [];
  const newFeatures = newPackage ? getFeaturesByIds(newPackage.features || []) : [];

  const handleSubmit = async () => {
    if (!selectedSubscription || !newPackageName) return;
    if (newPackageName === selectedSubscription.packageName) {
      toast.error("Please select a different package");
      return;
    }
    
    setLoading(true);
    const subId = selectedSubscription._id || selectedSubscription.id;
    const result = await changePackage(subId, { 
      packageName: newPackageName,
      packageId: newPackage?._id 
    });
    setLoading(false);

    if (result?.success) {
      closeChangePackageModal();
    }
  };

  if (!showChangePackageModal || !selectedSubscription) return null;

  const availablePackages = packages.filter(p => p.name !== selectedSubscription.packageName);

  if (showConfirm) {
    return (
      <Modal isOpen={showChangePackageModal} onClose={closeChangePackageModal} title="Confirm Package Change" size="lg">
        <div className="space-y-4">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-theme">
              You are switching the package for <strong className="font-semibold">{selectedSubscription.restaurantName}</strong> from <strong className="font-semibold">{selectedSubscription.packageName}</strong> to <strong className="font-semibold">{newPackageName}</strong>. This immediately updates the restaurant's active features.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-theme">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>
              Back
            </Button>
            <Button className="flex-1" loading={loading} onClick={handleSubmit}>
              Confirm & Switch Package
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={showChangePackageModal} onClose={closeChangePackageModal} title="Change Subscription Package" size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 p-4 bg-primary-light/10 border border-theme rounded-xl">
          <div>
            <p className="text-xs text-secondary">Restaurant</p>
            <p className="text-sm font-semibold text-theme">{selectedSubscription.restaurantName}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">Current Active Package</p>
            <p className="text-sm font-semibold text-theme">{selectedSubscription.packageName}</p>
          </div>
        </div>

        <FormSection title="Target Package Tier" description="Select a new package tier to upgrade or downgrade">
          <Select 
            label="New Package" 
            value={newPackageName} 
            onChange={(v) => setNewPackageName(v)}
            options={availablePackages.map(p => ({ 
              value: p.name, 
              label: `${p.name} Plan (${p.maxTables || 15} Tables limit)` 
            }))}
            placeholder="Select New Package"
          />
        </FormSection>

        {newPackage && (
          <FormSection title="Feature Comparison">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 border border-theme rounded-xl bg-surface">
                <p className="text-xs font-semibold text-secondary mb-2">Current ({selectedSubscription.packageName}):</p>
                <div className="space-y-1.5">
                  {currentFeatures.map(f => (
                    <div key={f.id} className="flex items-center gap-2 text-xs text-theme">
                      <CheckCircle size={13} className="text-secondary" />
                      <span>{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3.5 border border-primary/40 rounded-xl bg-primary-light/15">
                <p className="text-xs font-semibold text-primary mb-2">New ({newPackage.name}):</p>
                <div className="space-y-1.5">
                  {newFeatures.map(f => (
                    <div key={f.id} className="flex items-center gap-2 text-xs text-theme font-medium">
                      <CheckCircle size={13} className="text-green-600" />
                      <span>{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FormSection>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-theme">
          <Button variant="secondary" onClick={closeChangePackageModal}>Cancel</Button>
          <Button onClick={() => setShowConfirm(true)} disabled={!newPackageName || newPackageName === selectedSubscription.packageName}>
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
