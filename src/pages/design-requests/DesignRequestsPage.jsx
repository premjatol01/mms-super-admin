import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Palette, ExternalLink } from "lucide-react";
import { useDesignRequestStore } from "../../store/designRequestStore";
import Select from "../../components/ui/Select";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

export default function DesignRequestsPage() {
  const { requests, loading, fetchRequests, updateStatus } = useDesignRequestStore();
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusChange = async (id, status) => {
    if (!status) return;
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
                <th className="px-6 py-3.5 font-medium">Requested On</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-secondary">
                    Loading requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-secondary">
                    <Palette size={32} className="mx-auto mb-2 text-secondary opacity-40" />
                    No design requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-primary-light/10 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-theme">
                      {req.restaurant?.name || "Unknown Restaurant"}
                    </td>
                    <td className="px-6 py-3.5 text-secondary max-w-xs truncate" title={req.description}>
                      {req.description}
                    </td>
                    <td className="px-6 py-3.5">
                      {req.attachment ? (
                        <a
                          href={req.attachment}
                          target="_blank"
                          rel="noreferrer"
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
                      <Select
                        value={req.status}
                        onChange={(val) => handleStatusChange(req.id, val)}
                        disabled={updatingId === req.id}
                        options={STATUS_OPTIONS}
                        className="w-36"
                      />
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