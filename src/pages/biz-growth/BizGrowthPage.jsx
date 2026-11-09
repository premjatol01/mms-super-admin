import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  Plus,
  Search,
  Video,
  FileText,
  Newspaper,
  Share2,
  ExternalLink,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Sparkles,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import { bizGrowthApi } from "../../api/bizGrowth.api";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";
import EmptyState from "../../components/ui/EmptyState";
import BizGrowthModal from "./modals/BizGrowthModal";

const TYPE_CONFIG = {
  youtube: { label: "YouTube", icon: Video, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200" },
  blog: { label: "Blog Guide", icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200" },
  news: { label: "News", icon: Newspaper, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200" },
  social: { label: "Social", icon: Share2, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200" },
};

export default function BizGrowthPage() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, youtube: 0, blog: 0, news: 0, social: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bizGrowthApi.getAll({
        search: search.trim() || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      if (res.data?.success) {
        setItems(res.data.data.items || []);
        if (res.data.data.stats) {
          setStats(res.data.data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load Biz Growth resources:", err);
      toast.error("Failed to load Biz Growth resources");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSaveResource = async (payload) => {
    setSaving(true);
    try {
      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        await bizGrowthApi.update(id, payload);
        toast.success("Biz Growth resource updated successfully");
      } else {
        await bizGrowthApi.create(payload);
        toast.success("Biz Growth resource created successfully");
      }
      setModalOpen(false);
      fetchResources();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save resource");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await bizGrowthApi.delete(id);
      toast.success("Resource deleted successfully");
      fetchResources();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete resource");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await bizGrowthApi.toggleStatus(id);
      if (res.data?.success) {
        toast.success(res.data.message || "Status updated");
        setItems((prev) =>
          prev.map((item) => ((item._id === id || item.id === id) ? res.data.data : item))
        );
      }
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-theme">Biz Growth</h1>
            <span className="text-xs bg-primary-soft text-primary font-semibold px-2.5 py-0.5 rounded-full border border-primary/20">
              Learning Hub
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            Curate video masterclasses, growth playbooks, industry news, and marketing tips for restaurant owners.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="shrink-0 flex items-center gap-2 cursor-pointer">
          <Plus size={16} /> Add Resource
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-theme p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary">Total Resources</p>
              <p className="text-xl font-bold text-theme">{stats.total || items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-theme p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-100 text-red-600">
              <Video size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary">YouTube Videos</p>
              <p className="text-xl font-bold text-theme">{stats.youtube || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-theme p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-100 text-emerald-600">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary">Blog Guides</p>
              <p className="text-xl font-bold text-theme">{stats.blog || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-theme p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-100 text-purple-600">
              <Share2 size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary">News & Social</p>
              <p className="text-xl font-bold text-theme">{(stats.news || 0) + (stats.social || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface rounded-xl border border-theme p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search resources by title, topic, or source..."
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: "all", label: "All Types" },
                { value: "youtube", label: "YouTube Videos" },
                { value: "blog", label: "Blog Guides" },
                { value: "news", label: "Industry News" },
                { value: "social", label: "Social Media" },
              ]}
            />
          </div>
          <div className="w-full sm:w-36">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Resources Table / Content */}
      <div className="bg-surface rounded-xl border border-theme overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-secondary">Loading resources...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10">
            <EmptyState
              title="No Biz Growth resources found"
              description="Add articles, YouTube masterclasses, and news links for restaurant owners."
              action={
                <Button onClick={handleOpenCreate} className="mt-4">
                  <Plus size={16} className="mr-1.5" /> Add First Resource
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-surface-soft border-b border-theme text-xs font-semibold text-secondary uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Resource</th>
                  <th className="py-3.5 px-4">Type & Category</th>
                  <th className="py-3.5 px-4">Source / Time</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme">
                {items.map((item) => {
                  const id = item._id || item.id;
                  const typeConf = TYPE_CONFIG[item.type] || TYPE_CONFIG.blog;
                  const TypeIcon = typeConf.icon;
                  const thumb = item.thumbnail
                    ? item.thumbnail.startsWith("http")
                      ? item.thumbnail
                      : `http://localhost:5000${item.thumbnail}`
                    : null;

                  return (
                    <tr key={id} className="hover:bg-primary-soft/10 transition-colors">
                      {/* Resource details */}
                      <td className="py-3.5 px-4 min-w-[280px]">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-12 rounded-lg border border-theme bg-surface-soft overflow-hidden shrink-0 flex items-center justify-center relative">
                            {thumb ? (
                              <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <TypeIcon size={20} className={typeConf.color} />
                            )}
                            {item.featured && (
                              <span className="absolute top-1 right-1 p-0.5 rounded-full bg-amber-500 text-white" title="Featured">
                                <Sparkles size={10} />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-theme text-sm line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-secondary line-clamp-1 mt-0.5">{item.description || "No description provided."}</p>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1 font-mono truncate max-w-xs"
                              >
                                <span>{item.url}</span>
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type & Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeConf.bg}`}>
                            <TypeIcon size={12} />
                            {typeConf.label}
                          </span>
                          <span className="block text-xs text-secondary font-medium">{item.category || "General"}</span>
                        </div>
                      </td>

                      {/* Source & Read Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-xs">
                          <p className="font-semibold text-theme">{item.sourceName || "Tablly Team"}</p>
                          <p className="text-secondary mt-0.5">{item.readTime || (item.type === "youtube" ? "Video" : "Article")}</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            item.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950 dark:text-green-300"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                          title="Click to toggle status"
                        >
                          {item.status === "active" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          <span>{item.status === "active" ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-secondary hover:text-primary hover:bg-surface-soft rounded-lg transition-colors"
                              title="Open link"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-secondary hover:text-primary hover:bg-surface-soft rounded-lg transition-colors cursor-pointer"
                            title="Edit resource"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(id, item.title)}
                            className="p-1.5 text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete resource"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <BizGrowthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingItem}
        onSave={handleSaveResource}
        saving={saving}
      />
    </div>
  );
}
