import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle, Clock, Search, Send, CornerDownRight, Filter } from "lucide-react";
import { useSubscriptionsStore } from "../../../store/subscriptionsStore";
import Button from "../../../components/ui/Button";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function SubscriptionTicketsView() {
  const { tickets, ticketsLoading, fetchTickets, updateTicketStatus, ticketFilter, setTicketFilter } = useSubscriptionsStore();
  const [search, setSearch] = useState("");
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [newStatus, setNewStatus] = useState("resolved");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((tkt) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      tkt.ticketNumber?.toLowerCase().includes(q) ||
      tkt.restaurantName?.toLowerCase().includes(q) ||
      tkt.subject?.toLowerCase().includes(q) ||
      tkt.message?.toLowerCase().includes(q);
    return matchSearch;
  });

  const handleStartReply = (tkt) => {
    setReplyingId(tkt._id || tkt.id);
    setReplyText(tkt.adminReply || "");
    setNewStatus(tkt.status === "open" ? "in_progress" : tkt.status);
  };

  const handleSaveReply = async (ticketId) => {
    setSubmitting(true);
    await updateTicketStatus(ticketId, newStatus, replyText.trim());
    setSubmitting(false);
    setReplyingId(null);
    setReplyText("");
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-surface border border-theme rounded-xl overflow-hidden shadow-sm">
      {/* Filters Bar */}
      <div className="p-4 border-b border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search by restaurant, ticket ID, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-lg border border-theme bg-surface pl-9 pr-3 py-2 text-theme placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "", label: "All Tickets" },
            { key: "open", label: "Open" },
            { key: "in_progress", label: "In Progress" },
            { key: "resolved", label: "Resolved" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTicketFilter(item.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                ticketFilter === item.key
                  ? "bg-primary text-white"
                  : "text-secondary hover:text-theme hover:bg-primary-light/40"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {ticketsLoading ? (
          <div className="text-center py-16 text-secondary text-sm">
            <div className="inline-block w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-theme rounded-xl">
            <MessageSquare size={32} className="mx-auto text-secondary mb-2" />
            <h4 className="text-sm font-semibold text-theme">No tickets found</h4>
            <p className="text-xs text-secondary mt-1">Restaurants have not raised any subscription notes matching your filter.</p>
          </div>
        ) : (
          filteredTickets.map((tkt) => {
            const ticketId = tkt._id || tkt.id;
            const isReplying = replyingId === ticketId;
            const isOpen = tkt.status === "open";
            const isInProgress = tkt.status === "in_progress";
            const isResolved = tkt.status === "resolved";

            return (
              <div
                key={ticketId}
                className="p-4 rounded-xl border border-theme bg-surface hover:border-theme/80 transition-all space-y-3 shadow-xs"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-theme/40">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-primary-light text-primary">
                      {tkt.ticketNumber}
                    </span>
                    <h4 className="text-sm font-bold text-theme">{tkt.subject}</h4>
                    <span className="text-xs text-secondary">from <strong className="text-theme">{tkt.restaurantName}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary">{formatDate(tkt.createdAt)}</span>
                    {isOpen && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        Open
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        In Progress
                      </span>
                    )}
                    {isResolved && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-green-100 text-green-800 border border-green-200">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>

                {/* Submitter & Message */}
                <div className="space-y-1.5">
                  <div className="text-xs text-secondary flex items-center gap-3">
                    <span>Contact: <strong className="text-theme">{tkt.adminName || tkt.adminEmail}</strong></span>
                    {tkt.adminPhone && <span>Phone: <strong className="text-theme">{tkt.adminPhone}</strong></span>}
                  </div>
                  <p className="text-xs text-theme bg-primary-light/10 p-3 rounded-lg border border-theme/30 leading-relaxed">
                    {tkt.message}
                  </p>
                </div>

                {/* Existing Reply */}
                {tkt.adminReply && !isReplying && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 text-xs space-y-1">
                    <div className="flex items-center justify-between text-green-800 dark:text-green-300 font-semibold">
                      <span className="flex items-center gap-1.5"><CornerDownRight size={13} /> Admin Reply:</span>
                      <span className="text-[11px] font-normal">{formatDate(tkt.repliedAt)}</span>
                    </div>
                    <p className="text-green-900 dark:text-green-100 pl-4">{tkt.adminReply}</p>
                  </div>
                )}

                {/* Reply Form */}
                {isReplying ? (
                  <div className="p-3 rounded-xl border border-primary/40 bg-primary-light/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-theme">Reply to {tkt.restaurantName}:</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-secondary">Update Status:</span>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="text-xs rounded border border-theme bg-surface px-2 py-1 text-theme font-semibold"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      className="w-full text-xs rounded-lg border border-theme bg-surface p-2.5 text-theme placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                      placeholder="Type your reply to the restaurant..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />

                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setReplyingId(null)} disabled={submitting}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleSaveReply(ticketId)} loading={submitting}>
                        <Send size={13} /> Send Reply & Update Status
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end pt-1">
                    <Button size="sm" variant="secondary" onClick={() => handleStartReply(tkt)}>
                      <MessageSquare size={13} /> {tkt.adminReply ? "Edit Reply / Status" : "Reply to Ticket"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
