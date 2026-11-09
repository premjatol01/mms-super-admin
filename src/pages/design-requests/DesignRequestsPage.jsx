import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  Palette, 
  ExternalLink, 
  UtensilsCrossed, 
  QrCode, 
  Upload, 
  CheckCircle2, 
  X
} from "lucide-react";
import { useDesignRequestStore } from "../../store/designRequestStore";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

export default function DesignRequestsPage() {
  const { requests, loading, fetchRequests, updateStatus } = useDesignRequestStore();
  const [updatingId, setUpdatingId] = useState(null);
  
  // Fulfillment Modal State (when marking completed or uploading design asset)
  const [fulfillModalReq, setFulfillModalReq] = useState(null);
  const [completedFile, setCompletedFile] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [isSubmittingFulfill, setIsSubmittingFulfill] = useState(false);

  useEffect(() => {
    fetchRequests(true);
  }, [fetchRequests]);

  const handleStatusChange = async (req, newStatus) => {
    if (!newStatus) return;
    if (newStatus === "completed") {
      // Open fulfillment modal so admin can upload finished design
      setFulfillModalReq(req);
      setAdminRemarks(req.adminRemarks || "Your design request has been completed. The finalized assets are attached.");
      setCompletedFile(null);
      return;
    }

    setUpdatingId(req.id);
    try {
      await updateStatus(req.id, newStatus);
      toast.success("Status updated to " + newStatus);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFulfillSubmit = async () => {
    if (!fulfillModalReq) return;
    setIsSubmittingFulfill(true);
    try {
      const formData = new FormData();
      formData.append("status", "completed");
      if (adminRemarks) formData.append("adminRemarks", adminRemarks);
      if (completedFile) formData.append("completedAttachment", completedFile);

      await updateStatus(fulfillModalReq.id, formData);
      toast.success("Design request completed with final assets!");
      setFulfillModalReq(null);
    } catch {
      toast.error("Failed to complete request");
    } finally {
      setIsSubmittingFulfill(false);
    }
  };

  const getFileUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="flex-1 min-h-0 flex flex-col bg-surface border border-theme rounded-xl overflow-hidden shadow-sm">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary-light/20 text-theme border-b border-theme sticky top-0 z-10 backdrop-blur-sm bg-surface/95">
              <tr>
                <th className="px-5 py-3.5 font-medium">Restaurant</th>
                <th className="px-4 py-3.5 font-medium">Type</th>
                <th className="px-5 py-3.5 font-medium">Instructions & Requirements</th>
                <th className="px-4 py-3.5 font-medium">Initial Reference</th>
                <th className="px-4 py-3.5 font-medium">Completed Output</th>
                <th className="px-4 py-3.5 font-medium">Requested</th>
                <th className="px-4 py-3.5 font-medium">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {loading && requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-secondary">
                    Loading requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-secondary">
                    <Palette size={36} className="mx-auto mb-2 text-secondary opacity-40" />
                    No design requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const isMenu = req.requestType === "Menu Design" || !req.requestType;
                  const isUpdating = updatingId === req.id;
                  const refUrl = req.attachment?.url || req.attachment;
                  const compUrl = req.completedAttachment?.url;

                  return (
                    <tr key={req.id} className="hover:bg-primary-light/10 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-theme">
                        <p className="font-semibold text-theme">{req.restaurantId?.name || req.restaurant?.name || "Restaurant"}</p>
                        <p className="text-xs text-secondary">{req.restaurantId?.email || req.restaurant?.email || ""}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          isMenu 
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                            : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        }`}>
                          {isMenu ? <UtensilsCrossed size={13} /> : <QrCode size={13} />}
                          {req.requestType || "Menu Design"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 max-w-sm">
                        {req.title && <p className="font-semibold text-theme text-xs mb-0.5">{req.title}</p>}
                        <p className="text-secondary text-xs line-clamp-2" title={req.description}>
                          {req.description}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {refUrl ? (
                          <a
                            href={getFileUrl(refUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                          >
                            <ExternalLink size={13} /> {req.attachment?.name || "Reference File"}
                          </a>
                        ) : (
                          <span className="text-secondary text-xs italic">None</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {compUrl ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={getFileUrl(compUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-green-600 hover:underline text-xs font-semibold"
                            >
                              <CheckCircle2 size={13} /> Final Asset
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setFulfillModalReq(req);
                                setAdminRemarks(req.adminRemarks || "");
                                setCompletedFile(null);
                              }}
                              className="text-xs text-secondary hover:text-theme underline cursor-pointer"
                            >
                              (Update)
                            </button>
                          </div>
                        ) : (
                          <span className="text-secondary text-xs italic">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-secondary text-xs whitespace-nowrap">
                        {format(new Date(req.createdAt), "d MMM yyyy")}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Select
                            value={req.status}
                            onChange={(val) => handleStatusChange(req, val)}
                            disabled={isUpdating}
                            options={STATUS_OPTIONS}
                            className="w-36"
                          />
                          {req.status !== "completed" && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setFulfillModalReq(req);
                                setAdminRemarks("Your design request has been completed. The finalized assets are attached.");
                                setCompletedFile(null);
                              }}
                              title="Upload finished design file"
                              className="text-xs shrink-0"
                            >
                              <Upload size={13} /> Fulfill
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fulfillment Modal (Upload Completed Design Asset & Remarks) */}
      {fulfillModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-surface border border-theme rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <div>
                <h3 className="text-base font-bold text-theme">Fulfill & Complete Design Request</h3>
                <p className="text-xs text-secondary">{fulfillModalReq.restaurantId?.name || fulfillModalReq.restaurant?.name} - {fulfillModalReq.requestType || "Menu Design"}</p>
              </div>
              <button
                type="button"
                onClick={() => setFulfillModalReq(null)}
                className="p-1 text-secondary hover:text-theme rounded cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <p className="text-xs text-secondary mb-1">Request Summary:</p>
              <p className="text-xs text-theme bg-primary-light/20 p-2.5 rounded-lg italic line-clamp-3">
                "{fulfillModalReq.description}"
              </p>
            </div>

            <div>
              <Textarea
                label="Confirmation Remarks / Notes to Restaurant"
                rows={3}
                placeholder="e.g. Your menu design is finalized with your brand colors. See attached file."
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme mb-1.5">
                Upload Finished Design File (PNG, JPG, PDF)
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setCompletedFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-theme border border-theme rounded-lg p-2.5 bg-surface cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary hover:file:text-white"
              />
              {completedFile && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  Selected: {completedFile.name} ({(completedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-theme">
              <Button
                variant="secondary"
                onClick={() => setFulfillModalReq(null)}
                disabled={isSubmittingFulfill}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFulfillSubmit}
                loading={isSubmittingFulfill}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 size={16} /> Complete & Send Design
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
