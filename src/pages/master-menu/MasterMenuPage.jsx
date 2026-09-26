import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import SearchInput from "../../components/ui/SearchInput";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import ImageUploader from "../../components/ui/ImageUploader";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { masterMenuAPI } from "../../api/masterMenu";
import { toast } from "sonner";

export default function MasterMenuPage() {
  const [activeTab, setActiveTab] = useState("categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        if (selectedItem) {
          await masterMenuAPI.updateCategory(selectedItem._id, formData);
          toast.success("Category updated successfully");
        } else {
          await masterMenuAPI.createCategory(formData);
          toast.success("Category created successfully");
        }
      } else {
        const catId = formData.categoryId?._id || formData.categoryId;
        if (!catId) {
          toast.error("Please select a Category");
          setIsSaving(false);
          return;
        }
        
        const submitData = new FormData();
        if (formData.name) submitData.append('name', formData.name);
        submitData.append('categoryId', catId);
        if (formData.status) submitData.append('status', formData.status);
        
        if (formData.imageFile) {
          submitData.append('image', formData.imageFile);
        } else if (formData.image) {
          submitData.append('image', formData.image);
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAdd}>
          <Plus size={18} />
          Add {activeTab === "categories" ? "Category" : "Menu Item"}
        </Button>
      </div>

      <div className="bg-white dark:bg-[var(--color-surface)] border border-theme rounded-xl overflow-hidden">
        <div className="border-b border-theme flex">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "categories"
                ? "border-b-2 border-primary text-primary"
                : "text-secondary hover:text-theme"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "items"
                ? "border-b-2 border-primary text-primary"
                : "text-secondary hover:text-theme"
            }`}
          >
            Menu Items
          </button>
        </div>

        <div className="p-4 border-b border-theme flex justify-between items-center bg-gray-50 dark:bg-[var(--color-background)]">
          <div className="w-72">
            <SearchInput placeholder={`Search ${activeTab}...`} />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : activeTab === "categories" ? (
            <CategoriesTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <ItemsTable items={items} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
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
    return <div className="p-8 text-center text-secondary">No categories found.</div>;
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-theme text-sm text-secondary">
          <th className="px-6 py-4 font-medium">Category Name</th>
          <th className="px-6 py-4 font-medium">Description</th>
          <th className="px-6 py-4 font-medium">Status</th>
          <th className="px-6 py-4 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) => (
          <tr key={cat._id} className="border-b border-theme hover:bg-gray-50 dark:hover:bg-[var(--color-background)]">
            <td className="px-6 py-4 text-sm font-medium text-theme">{cat.name}</td>
            <td className="px-6 py-4 text-sm text-secondary">{cat.description}</td>
            <td className="px-6 py-4 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                {cat.status || 'active'}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => onEdit(cat)} className="p-1.5 text-secondary hover:text-primary transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(cat)} className="p-1.5 text-secondary hover:text-red-500 transition-colors">
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
    return <div className="p-8 text-center text-secondary">No items found.</div>;
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-theme text-sm text-secondary">
          <th className="px-6 py-4 font-medium">Item Name</th>
          <th className="px-6 py-4 font-medium">Category</th>
          <th className="px-6 py-4 font-medium">Status</th>
          <th className="px-6 py-4 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id} className="border-b border-theme hover:bg-gray-50 dark:hover:bg-[var(--color-background)]">
            <td className="px-6 py-4 text-sm font-medium text-theme">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex items-center justify-center text-secondary font-medium">
                  {item.image ? (
                    <img 
                      src={item.image.startsWith('http') ? item.image : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '')}${item.image}`} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    item.name.charAt(0)
                  )}
                </div>
                {item.name}
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-secondary">{item.categoryId?.name || 'Uncategorized'}</td>
            <td className="px-6 py-4 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                {item.status || 'active'}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => onEdit(item)} className="p-1.5 text-secondary hover:text-primary transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(item)} className="p-1.5 text-secondary hover:text-red-500 transition-colors">
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
