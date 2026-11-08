import { useState, useEffect } from "react";
import { Upload, QrCode, Save, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useSubscriptionsStore } from "../../../store/subscriptionsStore";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const base = apiBase.replace(/\/api\/?$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function PaymentSettingsView() {
  const { paymentConfig, configLoading, fetchPaymentConfig, savePaymentConfig } = useSubscriptionsStore();

  const [upiId, setUpiId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [instructions, setInstructions] = useState("");
  const [qrFile, setQrFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPaymentConfig();
  }, []);

  useEffect(() => {
    if (paymentConfig) {
      setUpiId(paymentConfig.paymentUpiId || "tablly@upi");
      setAccountName(paymentConfig.paymentAccountName || "Tablly Technologies");
      setBankDetails(paymentConfig.paymentBankDetails || "");
      setInstructions(
        paymentConfig.paymentInstructions ||
          "Scan the QR code using any UPI app (GPay, PhonePe, Paytm), complete the payment, and upload the screenshot with transaction reference / UTR number."
      );
      if (paymentConfig.paymentQrUrl) {
        setPreviewUrl(getImageUrl(paymentConfig.paymentQrUrl));
      }
    }
  }, [paymentConfig]);

  const handleQrChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("paymentUpiId", upiId.trim());
      formData.append("paymentAccountName", accountName.trim());
      formData.append("paymentBankDetails", bankDetails.trim());
      formData.append("paymentInstructions", instructions.trim());
      if (qrFile) {
        formData.append("paymentQr", qrFile);
      }

      await savePaymentConfig(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (configLoading && !paymentConfig) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-center text-secondary text-sm">
        <div className="inline-block w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2" />
        <p>Loading payment settings...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-surface border border-theme rounded-xl overflow-hidden shadow-sm p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <div>
          <h3 className="text-base font-bold text-theme">Manual Payment & QR Configuration</h3>
          <p className="text-xs text-secondary mt-0.5">
            This Payment QR Code and UPI ID will be displayed to restaurant admins when they buy or renew their subscription plans.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* QR Code Upload Card */}
          <div className="p-4 border border-theme rounded-xl bg-surface space-y-3">
            <label className="text-xs font-bold text-theme block">Payment QR Code Image</label>
            <div className="flex items-center gap-5">
              <div className="w-36 h-36 border border-theme rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-xs">
                {previewUrl ? (
                  <img src={previewUrl} alt="Payment QR" className="w-full h-full object-contain rounded" />
                ) : (
                  <div className="text-center text-secondary text-xs">
                    <QrCode size={36} className="mx-auto mb-1 opacity-40" />
                    <span>No QR Uploaded</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById("qr-upload-input")?.click()}
                >
                  <Upload size={14} /> Upload New QR Code
                </Button>
                <input
                  id="qr-upload-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleQrChange}
                />
                <p className="text-[11px] text-secondary">
                  Upload your merchant UPI QR code (GPay, PhonePe, Paytm, or BharatPe). Recommended size: 500x500 px.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="UPI ID"
              required
              placeholder="e.g., yourcompany@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              helper="The UPI VPA where restaurants will send payments"
            />
            <Input
              label="Account / Merchant Name"
              required
              placeholder="e.g., Tablly Technologies"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          <Input
            label="Bank Details (Optional)"
            placeholder="e.g., HDFC Bank, A/C: 50200012345678, IFSC: HDFC0001234"
            value={bankDetails}
            onChange={(e) => setBankDetails(e.target.value)}
            helper="Optional NEFT / IMPS transfer details"
          />

          <div>
            <label className="text-xs font-medium text-theme block mb-1">Payment Instructions for Restaurants</label>
            <textarea
              rows={3}
              className="w-full text-xs rounded-lg border border-theme bg-surface p-2.5 text-theme placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instructions displayed to restaurants when making payment..."
            />
          </div>

          <div className="pt-3 border-t border-theme flex justify-end">
            <Button type="submit" loading={saving} disabled={saving}>
              <Save size={14} /> Save Payment Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
