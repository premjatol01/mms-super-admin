import { useState } from "react";
import { X, CheckCircle, XCircle, ExternalLink, Calendar, DollarSign, User, FileText, AlertCircle } from "lucide-react";
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

export default function VerifyPaymentModal() {
  const { verifyingPayment, showVerifyPaymentModal, closeVerifyPaymentModal, reviewPayment } = useSubscriptionsStore();
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showVerifyPaymentModal || !verifyingPayment) return null;

  const payment = verifyingPayment;
  const rawUrl = payment.screenshotUrl || payment.screenshot?.url || payment.screenshot?.dataUrl || "";
  const imageUrl = getImageUrl(rawUrl);

  const handleConfirm = async () => {
    setLoading(true);
    await reviewPayment(payment._id || payment.id, "confirmed", reviewNote);
    setLoading(false);
  };

  const handleReject = async () => {
    if (!reviewNote.trim()) {
      alert("Please provide a rejection note explaining why the payment proof was rejected.");
      return;
    }
    setLoading(true);
    await reviewPayment(payment._id || payment.id, "rejected", reviewNote);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={closeVerifyPaymentModal} />
      <div className="relative bg-surface rounded-2xl border border-theme w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme bg-surface">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h3 className="text-base font-bold text-theme">Verify Payment Screenshot</h3>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Review transaction proof and confirm subscription activation for {payment.restaurantName}.
            </p>
          </div>
          <button
            type="button"
            onClick={closeVerifyPaymentModal}
            className="p-1.5 text-secondary hover:text-theme rounded-lg hover:bg-primary-light transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Restaurant & Plan Details Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-primary-light/20 border border-theme rounded-xl text-xs">
            <div>
              <span className="text-secondary block mb-0.5">Restaurant</span>
              <strong className="text-theme text-sm">{payment.restaurantName}</strong>
            </div>
            <div>
              <span className="text-secondary block mb-0.5">Plan Requested</span>
              <strong className="text-theme text-sm">{payment.planName}</strong>
              <span className="block text-[11px] text-secondary">({payment.durationDisplay || `${payment.durationDays || 30} Days`})</span>
            </div>
            <div>
              <span className="text-secondary block mb-0.5">Amount Paid</span>
              <strong className="text-theme text-sm text-green-600 dark:text-green-400">
                ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
              </strong>
            </div>
            <div>
              <span className="text-secondary block mb-0.5">UTR / Ref Number</span>
              <strong className="text-theme font-mono">{payment.transactionRef || "Not provided"}</strong>
            </div>
          </div>

          {/* User Contact & Note */}
          <div className="text-xs p-3.5 bg-surface border border-theme rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-secondary">Submitted By: <strong className="text-theme">{payment.adminName || payment.adminEmail || "Restaurant Admin"}</strong> ({payment.adminPhone || payment.adminEmail})</span>
              <span className="text-secondary">{payment.requestedAt || payment.createdAt ? new Date(payment.requestedAt || payment.createdAt).toLocaleString("en-IN") : ""}</span>
            </div>
            {payment.userNote && (
              <p className="pt-2 mt-1 border-t border-theme/40 text-secondary">
                <strong className="text-theme">Restaurant Note:</strong> "{payment.userNote}"
              </p>
            )}
          </div>

          {/* Payment Screenshot Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-theme">Uploaded Payment Screenshot:</label>
              {imageUrl && (
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                >
                  <ExternalLink size={12} /> Open Full Size
                </a>
              )}
            </div>

            <div className="p-3 bg-black/5 dark:bg-black/30 rounded-xl border border-theme flex items-center justify-center min-h-[220px] max-h-[360px] overflow-auto">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Payment Screenshot"
                  className="max-h-[340px] max-w-full object-contain rounded-lg border border-theme shadow-sm"
                />
              ) : (
                <div className="text-center p-6 text-secondary text-xs">
                  <AlertCircle size={24} className="mx-auto mb-1 opacity-50" />
                  No screenshot image found for this payment request.
                </div>
              )}
            </div>
          </div>

          {/* Review Note Input */}
          <div>
            <label className="text-xs font-semibold text-theme block mb-1">
              Admin Remarks / Review Note (Optional for approval, required for rejection)
            </label>
            <input
              type="text"
              className="w-full text-xs rounded-lg border border-theme bg-surface px-3 py-2 text-theme placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g., Payment received and verified in HDFC account"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-theme bg-surface">
          <Button
            type="button"
            variant="secondary"
            onClick={closeVerifyPaymentModal}
            disabled={loading}
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={handleReject}
              disabled={loading}
            >
              <XCircle size={14} /> Reject Payment
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white border-green-600"
              onClick={handleConfirm}
              loading={loading}
              disabled={loading}
            >
              <CheckCircle size={14} /> Confirm & Activate Subscription
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
