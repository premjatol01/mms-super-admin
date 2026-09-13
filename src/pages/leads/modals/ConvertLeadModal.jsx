import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Building2, User, Phone, Mail, CreditCard } from "lucide-react";
import { useLeadsStore } from "../../../store/leadsStore";
import { subscriptionPackages } from "../../../store/restaurantsStore";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

function calculateEndDate(start, days) {
  if (!start) {
    start = new Date().toISOString().split('T')[0];
  }
  const date = new Date(start);
  date.setDate(date.getDate() + parseInt(days));
  return date.toISOString().split('T')[0];
}

export default function ConvertLeadModal() {
  const { 
    showConvertModal, 
    closeConvertModal, 
    selectedLead,
    convertStep,
    setConvertStep,
    convertData,
    updateConvertData,
    convertLead
  } = useLeadsStore();

  const [loading, setLoading] = useState(false);

  if (!showConvertModal) return null;

  const handleNext = () => {
    if (convertStep === 1) {
      // Validate step 1
      if (!convertData.restaurantName.trim()) {
        toast.error("Restaurant name is required");
        return;
      }
      if (!convertData.adminName.trim()) {
        toast.error("Admin name is required");
        return;
      }
      if (!convertData.adminPhone.trim()) {
        toast.error("Admin phone is required");
        return;
      }
      if (convertData.adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(convertData.adminEmail)) {
        toast.error("Please enter a valid email");
        return;
      }
      setConvertStep(2);
    } else if (convertStep === 2) {
      // Validate step 2 - subscription
      if (!convertData.package) {
        toast.error("Please select a subscription package");
        return;
      }
      setConvertStep(3);
    }
  };

  const handleBack = () => {
    if (convertStep > 1) {
      setConvertStep(convertStep - 1);
    }
  };

  const handleComplete = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Generate a new restaurant ID
      const newRestaurantId = `R-${Date.now()}`;
      
      // Create the restaurant
      const restaurant = {
        name: convertData.restaurantName,
        address: {
          fullAddress: convertData.address,
          city: convertData.city,
          state: convertData.state,
          pincode: convertData.pincode,
          country: "India"
        },
        admin: {
          name: convertData.adminName,
          phone: convertData.adminPhone,
          email: convertData.adminEmail
        },
        subscription: {
          package: convertData.package,
          status: "active",
          startDate: new Date().toISOString().split('T')[0],
          endDate: calculateEndDate(new Date().toISOString().split('T')[0], convertData.subscriptionDuration)
        },
        status: convertData.status
      };
      
      // Convert the lead
      convertLead(newRestaurantId);
      toast.success("Lead converted successfully!");
      setLoading(false);
    }, 800);
  };

  const selectedPackage = subscriptionPackages.find(p => p.label === convertData.package);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={closeConvertModal} />
      <div className="relative bg-surface rounded-xl border border-theme w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
          <div>
            <h2 className="text-lg font-semibold text-theme">Convert Lead to Restaurant</h2>
            <p className="text-sm text-secondary">{selectedLead?.restaurantName}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-3 border-b border-theme bg-primary-light/10">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Profile" },
              { num: 2, label: "Subscription" },
              { num: 3, label: "Summary" }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center">
                <div className={`flex items-center gap-2 ${convertStep >= step.num ? "text-primary" : "text-secondary"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    convertStep > step.num 
                      ? "bg-green-500 text-white" 
                      : convertStep === step.num 
                        ? "bg-primary text-white" 
                        : "bg-gray-200"
                  }`}>
                    {convertStep > step.num ? <Check size={14} /> : step.num}
                  </div>
                  <span className="text-sm hidden sm:inline">{step.label}</span>
                </div>
                {index < 2 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-2 ${convertStep > step.num ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {convertStep === 1 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  Converting lead: <strong>{selectedLead?.restaurantName}</strong>
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-theme mb-3 flex items-center gap-2">
                  <Building2 size={16} /> Restaurant Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Restaurant Name" 
                    required
                    value={convertData.restaurantName}
                    onChange={(e) => updateConvertData({ restaurantName: e.target.value })}
                  />
                  <Input 
                    label="City"
                    value={convertData.city}
                    onChange={(e) => updateConvertData({ city: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <Input 
                      label="Address"
                      value={convertData.address}
                      onChange={(e) => updateConvertData({ address: e.target.value })}
                    />
                  </div>
                  <Input 
                    label="State"
                    value={convertData.state}
                    onChange={(e) => updateConvertData({ state: e.target.value })}
                  />
                  <Input 
                    label="Pincode"
                    value={convertData.pincode}
                    onChange={(e) => updateConvertData({ pincode: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-theme mb-3 flex items-center gap-2">
                  <User size={16} /> Admin Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Admin Name" 
                    required
                    value={convertData.adminName}
                    onChange={(e) => updateConvertData({ adminName: e.target.value })}
                  />
                  <Input 
                    label="Phone Number"
                    required
                    value={convertData.adminPhone}
                    onChange={(e) => updateConvertData({ adminPhone: e.target.value })}
                  />
                  <Input 
                    label="Email Address"
                    type="email"
                    value={convertData.adminEmail}
                    onChange={(e) => updateConvertData({ adminEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {convertStep === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-theme mb-4 flex items-center gap-2">
                  <CreditCard size={16} /> Select Subscription Package
                </h4>
                <div className="space-y-3">
                  {subscriptionPackages.map((pkg) => (
                    <label
                      key={pkg.label}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        convertData.package === pkg.label
                          ? "border-primary bg-primary-light/20"
                          : "border-theme hover:bg-primary-light/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="package"
                          checked={convertData.package === pkg.label}
                          onChange={() => updateConvertData({ package: pkg.label })}
                          className="w-4 h-4 text-primary border-theme"
                        />
                        <div>
                          <p className="font-medium text-theme">{pkg.label}</p>
                          <p className="text-sm text-secondary">{pkg.duration} days • All features included</p>
                        </div>
                      </div>
                      <p className="font-semibold text-theme">₹{pkg.price}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                  label="Duration"
                  value={convertData.subscriptionDuration}
                  onChange={(v) => updateConvertData({ subscriptionDuration: v })}
                  options={[
                    { value: "30", label: "30 days" },
                    { value: "90", label: "90 days" },
                    { value: "180", label: "180 days" },
                    { value: "365", label: "1 year" },
                  ]}
                />
                <Select 
                  label="Status"
                  value={convertData.status}
                  onChange={(v) => updateConvertData({ status: v })}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </div>
            </div>
          )}

          {convertStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-theme">Conversion Summary</h3>
                <p className="text-sm text-secondary">Review before completing conversion</p>
              </div>

              <div className="bg-primary-light/10 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary">Restaurant</span>
                  <span className="text-theme font-medium">{convertData.restaurantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Location</span>
                  <span className="text-theme">{convertData.city}{convertData.state && `, ${convertData.state}`}</span>
                </div>
                <div className="border-t border-theme pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-secondary">Admin</span>
                    <span className="text-theme font-medium">{convertData.adminName}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Phone</span>
                  <span className="text-theme">{convertData.adminPhone}</span>
                </div>
                {convertData.adminEmail && (
                  <div className="flex justify-between">
                    <span className="text-secondary">Email</span>
                    <span className="text-theme">{convertData.adminEmail}</span>
                  </div>
                )}
                <div className="border-t border-theme pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-secondary">Package</span>
                    <span className="text-theme font-medium">{selectedPackage?.label || convertData.package}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Duration</span>
                  <span className="text-theme">{convertData.subscriptionDuration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Status</span>
                  <span className="text-green-600 font-medium capitalize">{convertData.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme flex justify-between">
          <div>
            {convertStep > 1 && (
              <Button variant="secondary" onClick={handleBack}>
                <ArrowLeft size={14} /> Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={closeConvertModal}>Cancel</Button>
            {convertStep < 3 ? (
              <Button onClick={handleNext}>
                Continue <ArrowRight size={14} />
              </Button>
            ) : (
              <Button onClick={handleComplete} loading={loading}>
                Complete Conversion
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}