import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Palette, ExternalLink } from "lucide-react";
import { useDesignRequestStore } from "../../store/designRequestStore";

const STATUS_LABELS = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-theme">Design Requests</h1>
          <p className="text-sm text-secondary">Manage design requests from restaurant administrators.</p>
        </div>
      </div>

      <div className="bg-surface border border-theme rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-primary-light/5 text-secondary border-b border-theme">
              <tr>
                <th className="px-6 py-4 font-medium">Restaurant</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Attachment</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-secondary">
                    Loading design requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-secondary">
                    <Palette className="mx-auto h-12 w-12 text-secondary/30 mb-3" />
                    <p>No design requests found.</p>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-primary-light/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-medium text-theme">{req.restaurantId?.restaurantName || "Unknown"}</p>
                      <p className="text-xs text-secondary">{req.restaurantId?.email}</p>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-theme whitespace-pre-wrap">{req.description}</p>
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-secondary whitespace-nowrap">
                      {format(new Date(req.createdAt), "d MMM yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        disabled={updatingId === req.id}
                        className={`text-xs px-2 py-1.5 rounded-lg font-medium border-r-8 border-transparent outline-none cursor-pointer disabled:opacity-50 ${
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
