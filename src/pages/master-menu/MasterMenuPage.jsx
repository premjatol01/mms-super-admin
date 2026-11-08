import { useState, useEffect, useMemo } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import SearchInput from "../../components/ui/SearchInput";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import ImageUploader from "../../components/ui/ImageUploader";
import Pagination from "../restaurants/components/Pagination";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { masterMenuAPI } from "../../api/masterMenu";
import { toast } from "sonner";

export default function MasterMenuPage() {
  const [activeTab, setActiveTab] = useState("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Pagination states
  const [categoryPagination, setCategoryPagination] = useState({ page: 1, limit: 10 });
  const [itemPagination, setItemPagination] = useState({ page: 1, limit: 10 });

  // Form State
  const [formData, setFormData] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catsRes, itemsRes] = await Promise.all([
        masterMenuAPI.getCategories(),
        masterMenuAPI.getItems()
      ]);
      setCategories(catsRes.data || []);
      setItems(itemsRes.data || []);
    } catch (error) {
      toast.error("Failed to fetch master menu data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (activeTab === "categories") {
      setCategoryPagination(prev => ({ ...prev, page: 1 }));
    } else {
      setItemPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  // Filtered & Paginated Categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.description?.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const paginatedCategories = useMemo(() => {
    const start = (categoryPagination.page - 1) * categoryPagination.limit;
    return filteredCategories.slice(start, start + categoryPagination.limit);
  }, [filteredCategories, categoryPagination]);

  // Filtered & Paginated Items
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name?.toLowerCase().includes(q) || 
      item.categoryId?.name?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const paginatedItems = useMemo(() => {
    const start = (itemPagination.page - 1) * itemPagination.limit;
    return filteredItems.slice(start, start + itemPagination.limit);
  }, [filteredItems, itemPagination]);

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "categories") {
        if (!formData.name?.trim()) {
          toast.error("Category name is required");
          setIsSaving(false);
          return;
        }

        const submitData = new FormData();
        submitData.append('name', formData.name.trim());
        if (formData.description) submitData.append('description', formData.description);
        if (formData.status) submitData.append('status', formData.status);

        if (formData.imageFile) {
          submitData.append('image', formData.imageFile);
        } else if (formData.image) {
          submitData.append('image', formData.image);
        } else if (selectedItem && (formData.image === null || formData.image === '')) {
          submitData.append('image', '');
        }

        if (selectedItem) {
          await masterMenuAPI.updateCategory(selectedItem._id, submitData);
          toast.success("Category updated successfully");
        } else {
          await masterMenuAPI.createCategory(submitData);
          toast.success("Category created successfully");
        }
      } else {
        const catId = formData.categoryId?._id || formData.categoryId;
        if (!catId) {
          toast.error("Please select a Category");
          setIsSaving(false);
          return;
        }

        if (!formData.name?.trim()) {
          toast.error("Item name is required");
          setIsSaving(false);
          return;
        }
        
        const submitData = new FormData();
        submitData.append('name', formData.name.trim());
        submitData.append('categoryId', catId);
        if (formData.status) submitData.append('status', formData.status);
        
        if (formData.imageFile) {
          submitData.append('image', formData.imageFile);
        } else if (formData.image) {
          submitData.append('image', formData.image);
        } else if (selectedItem && (formData.image === null || formData.image === '')) {
          submitData.append('image', '');
        }

        if (selectedItem) {
          await masterMenuAPI.updateItem(selectedItem._id, submitData);
          toast.success("Item updated successfully");
        } else {
          await masterMenuAPI.createItem(submitData);
          toast.success("Item created successfully");
        }
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "categories") {
        await masterMenuAPI.deleteCategory(selectedItem._id);
        toast.success("Category deleted successfully");
      } else {
        await masterMenuAPI.deleteItem(selectedItem._id);
        toast.success("Item deleted successfully");
      }
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setIsSaving(false);
    }
  };
  
  const activeCategories = categories.filter(c => c.status === 'active' || !c.status);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Master Menu Card */}
      <div className="flex-1 min-h-0 flex flex-col bg-surface border border-theme rounded-xl overflow-hidden shadow-sm">
        {/* Tabs Bar */}
        <div className="flex-none border-b border-theme flex bg-surface">
          <button
            onClick={() => handleTabChange("categories")}
            className={`px-6 py-3.5 text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "categories"
                ? "border-b-2 border-primary text-primary"
                : "text-secondary hover:text-theme"
            }`}
          >
            <span>Categories</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === "categories" ? "bg-primary-light/50 text-primary font-semibold" : "bg-primary-light/20 text-secondary"
            }`}>
              {categories.length}
            </span>
          </button>
          <button
            onClick={() => handleTabChange("items")}
            className={`px-6 py-3.5 text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "items"
                ? "border-b-2 border-primary text-primary"
                : "text-secondary hover:text-theme"
            }`}
          >
            <span>Menu Items</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === "items" ? "bg-primary-light/50 text-primary font-semibold" : "bg-primary-light/20 text-secondary"
            }`}>
              {items.length}
            </span>
          </button>
        </div>

        {/* Search & Add Button Bar (Add button moved close to Search Input) */}
        <div className="flex-none p-4 border-b border-theme flex flex-wrap items-center justify-between gap-3 bg-surface">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="w-72">
              <SearchInput 
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={`Search ${activeTab === "categories" ? "categories" : "menu items"}...`} 
              />
            </div>
            <Button onClick={handleAdd} className="flex items-center gap-1.5 whitespace-nowrap">
              <Plus size={18} />
              Add {activeTab === "categories" ? "Category" : "Menu Item"}
            </Button>
          </div>

          <div className="text-xs text-secondary font-medium">
            Showing <span className="text-theme font-semibold">{activeTab === "categories" ? filteredCategories.length : filteredItems.length}</span> {activeTab === "categories" ? "categories" : "menu items"}
          </div>
        </div>

        {/* Table Scroll Area with Sticky Thead */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto relative">
          {isLoading ? (
            <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="animate-spin text-primary mb-3" size={32} />
              <p className="text-sm text-secondary">Loading {activeTab === "categories" ? "categories" : "menu items"}...</p>
            </div>
          ) : activeTab === "categories" ? (
            <CategoriesTable categories={paginatedCategories} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <ItemsTable items={paginatedItems} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>

        {/* Pinned Bottom Pagination */}
        <Pagination
          pagination={activeTab === "categories" ? categoryPagination : itemPagination}
          totalItems={activeTab === "categories" ? filteredCategories.length : filteredItems.length}
          onPageChange={(newPage) => {
            if (activeTab === "categories") {
              setCategoryPagination(prev => ({ ...prev, page: newPage }));
            } else {
              setItemPagination(prev => ({ ...prev, page: newPage }));
            }
          }}
          onLimitChange={(newLimit) => {
            if (activeTab === "categories") {
              setCategoryPagination({ page: 1, limit: newLimit });
            } else {
              setItemPagination({ page: 1, limit: newLimit });
            }
          }}
          itemName={activeTab === "categories" ? "categories" : "items"}
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${selectedItem ? "Edit" : "Add"} ${activeTab === "categories" ? "Category" : "Menu Item"}`}
      >
        <div className="space-y-4">
          {activeTab === "categories" ? (
            <>
              <ImageUploader 
                label="Category Image" 
                hint="Upload file or internet URL"
                value={formData.image ? (formData.image.startsWith('http') || formData.image.startsWith('blob:') ? formData.image : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '')}${formData.image}`) : ''} 
                onChange={(url, file) => setFormData({...formData, image: url, imageFile: file})} 
              />
              <Input 
                label="Category Name" 
                value={formData.name || ''} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Appetizers" 
                required 
              />
              <Input 
                label="Description" 
                value={formData.description || ''} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Short description" 
              />
            </>
          ) : (
            <>
              <ImageUploader 
                label="Item Image" 
                hint="Upload file or internet URL"
                value={formData.image ? (formData.image.startsWith('http') || formData.image.startsWith('blob:') ? formData.image : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '')}${formData.image}`) : ''} 
                onChange={(url, file) => setFormData({...formData, image: url, imageFile: file})} 
              />
              <Input 
                label="Item Name" 
                value={formData.name || ''} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Margherita Pizza" 
                required 
              />
              {activeCategories.length > 0 ? (
                <Select 
                  label="Category" 
                  required
                  value={formData.categoryId?._id || formData.categoryId || ''}
                  onChange={(val) => setFormData({...formData, categoryId: val})}
                  placeholder="Select Category"
                  options={activeCategories.map(c => ({ value: c._id, label: c.name }))} 
                />
              ) : (
                <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 p-3 rounded-lg text-sm border border-amber-200 dark:border-amber-900 mt-2">
                  You must create an active Category first before adding a Menu Item.
                </div>
              )}
            </>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={isSaving}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-theme">
            Are you sure you want to delete <span className="font-semibold">{selectedItem?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete} loading={isSaving}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CategoriesTable({ categories, onEdit, onDelete }) {
  if (!categories.length) {
    return (
      <table className="w-full text-left border-collapse">
        <thead className="bg-primary-light/20 border-b border-theme sticky top-0 z-10 backdrop-blur-sm bg-surface/95">
          <tr>
            <th className="px-6 py-3.5 text-sm font-medium text-theme">Category Name</th>
            <th className="px-6 py-3.5 text-sm font-medium text-theme">Description</th>
            <th className="px-6 py-3.5 text-sm font-medium text-theme">Status</th>
            <th className="px-6 py-3.5 text-sm font-medium text-theme text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="px-6 py-20 text-center text-secondary">
              No categories found.
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-primary-light/20 border-b border-theme sticky top-0 z-10 backdrop-blur-sm bg-surface/95">
        <tr>
          <th className="px-6 py-3.5 text-sm font-medium text-theme">Category Name</th>
          <th className="px-6 py-3.5 text-sm font-medium text-theme">Description</th>
          <th className="px-6 py-3.5 text-sm font-medium text-theme">Status</th>
          <th className="px-6 py-3.5 text-sm font-medium text-theme text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) => (
          <tr key={cat._id} className="border-b border-theme hover:bg-primary-light/10 transition-colors">
            <td className="px-6 py-3.5 text-sm font-semibold text-theme">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg overflow-hidden flex items-center justify-center text-primary font-medium shrink-0 border border-theme">
                  {cat.image ? (
                    <img 
                      src={cat.image.startsWith('http') ? cat.image : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '')}${cat.image}`} 
                      alt={cat.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    (cat.name || 'C').charAt(0).toUpperCase()
                  )}
                </div>
                <span>{cat.name}</span>
              </div>
            </td>
            <td className="px-6 py-3.5 text-sm text-secondary">{cat.description || "-"}</td>
            <td className="px-6 py-3.5 text-sm">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                cat.status === 'active' || !cat.status 
                  ? 'bg-green-500/15 text-green-600 dark:text-green-400' 
                  : 'bg-red-500/15 text-red-600 dark:text-red-400'
              }`}>
                {cat.status || 'active'}
              </span>
            </td>
            <td className="px-6 py-3.5 text-right">
              <div className="flex items-center justify-end gap-1">
                <button 
                  onClick={() => onEdit(cat)} 
                  className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light/40 rounded-lg transition-colors cursor-pointer"
                  title="Edit Category"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => onDelete(cat)} 
                  className="p-1.5 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ItemsTable({ items, onEdit, onDelete }) {
  if (!items.length) {
    return (
      <table className="w-full text-left border-collapse">
        <thead className="bg-primary-light/20 border-b border-theme sticky top-0 z-10 backdrop-blur-sm bg-surface/95">
          <tr>
            <th className="px-6 py-3.5 text-sm font-medium text-theme">Item Name</th>
            <th className="px-6 py-3.5 text-sm font-medium text-theme">Category</th>
            <th className="px-6 py-3.5 text-sm font-medium text-theme">Status</th>
            <th className="px-6 py-3.5 text-sm font-medium text-theme text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="px-6 py-20 text-center text-secondary">
              No menu items found.
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-primary-light/20 border-b border-theme sticky top-0 z-10 backdrop-blur-sm bg-surface/95">
        <tr>
          <th className="px-6 py-3.5 text-sm font-medium text-theme">Item Name</th>
          <th className="px-6 py-3.5 text-sm font-medium text-theme">Category</th>
          <th className="px-6 py-3.5 text-sm font-medium text-theme">Status</th>
          <th className="px-6 py-3.5 text-sm font-medium text-theme text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id} className="border-b border-theme hover:bg-primary-light/10 transition-colors">
            <td className="px-6 py-3.5 text-sm font-medium text-theme">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg overflow-hidden flex items-center justify-center text-primary font-medium shrink-0">
                  {item.image ? (
                    <img 
                      src={item.image.startsWith('http') ? item.image : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '')}${item.image}`} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    (item.name || 'M').charAt(0).toUpperCase()
                  )}
                </div>
                <span className="font-semibold">{item.name}</span>
              </div>
            </td>
            <td className="px-6 py-3.5 text-sm text-secondary">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-light/30 text-theme text-xs font-medium">
                {item.categoryId?.name || 'Uncategorized'}
              </span>
            </td>
            <td className="px-6 py-3.5 text-sm">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                item.status === 'active' || !item.status 
                  ? 'bg-green-500/15 text-green-600 dark:text-green-400' 
                  : 'bg-red-500/15 text-red-600 dark:text-red-400'
              }`}>
                {item.status || 'active'}
              </span>
            </td>
            <td className="px-6 py-3.5 text-right">
              <div className="flex items-center justify-end gap-1">
                <button 
                  onClick={() => onEdit(item)} 
                  className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light/40 rounded-lg transition-colors cursor-pointer"
                  title="Edit Item"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => onDelete(item)} 
                  className="p-1.5 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
