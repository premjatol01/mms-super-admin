import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Palette, ExternalLink } from "lucide-react";
import { useDesignRequestStore } from "../../store/designRequestStore";

const STATUS_LABELS = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export default function DesignRequestsPage() {
  const { requests, loading, fetchRequests, updateStatus } = useDesignRequestStore();
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateStatus(id, status);
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="flex-1 min-h-0 flex flex-col bg-surface border border-theme rounded-xl overflow-hidden shadow-sm">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary-light/20 text-theme border-b border-theme sticky top-0 z-10 backdrop-blur-sm bg-surface/95">
              <tr>
                <th className="px-6 py-3.5 font-medium">Restaurant</th>
                <th className="px-6 py-3.5 font-medium">Description</th>
                <th className="px-6 py-3.5 font-medium">Attachment</th>
                <th className="px-6 py-3.5 font-medium">Date</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-secondary">
                    <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm">Loading design requests...</p>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-secondary">
                    <Palette className="mx-auto h-12 w-12 text-secondary/30 mb-3" />
                    <p>No design requests found.</p>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-primary-light/10 transition-colors group">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-theme">{req.restaurantId?.restaurantName || "Unknown"}</p>
                      <p className="text-xs text-secondary">{req.restaurantId?.email}</p>
                    </td>
                    <td className="px-6 py-3.5 max-w-md">
                      <p className="text-theme whitespace-pre-wrap">{req.description}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      {req.attachment?.url ? (
                        <a
                          href={req.attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary hover:underline text-xs font-medium"
                        >
                          <ExternalLink size={14} /> View File
                        </a>
                      ) : (
                        <span className="text-secondary text-xs italic">No attachment</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-secondary whitespace-nowrap">
                      {format(new Date(req.createdAt), "d MMM yyyy")}
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        disabled={updatingId === req.id}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border border-theme outline-none cursor-pointer disabled:opacity-50 ${
                          STATUS_LABELS[req.status]?.className || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
