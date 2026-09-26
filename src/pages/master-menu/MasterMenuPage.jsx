import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import SearchInput from "../../components/ui/SearchInput";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import ImageUploader from "../../components/ui/ImageUploader";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function MasterMenuPage() {
  const [activeTab, setActiveTab] = useState("categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

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

        <div className="overflow-x-auto">
          {activeTab === "categories" ? (
            <CategoriesTable onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <ItemsTable onEdit={handleEdit} onDelete={handleDelete} />
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
              <Input label="Category Name" defaultValue={selectedItem?.name} placeholder="e.g. Appetizers" required />
              <Input label="Description" defaultValue={selectedItem?.description} placeholder="Short description" />
            </>
          ) : (
            <>
              <ImageUploader label="Item Image" value={selectedItem?.image} />
              <Input label="Item Name" defaultValue={selectedItem?.name} placeholder="e.g. Margherita Pizza" required />
              <Select label="Category" options={[{value: "1", label: "Appetizers"}, {value: "2", label: "Main Course"}, {value: "3", label: "Desserts"}]} />
            </>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Save</Button>
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
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(false)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CategoriesTable({ onEdit, onDelete }) {
  const categories = [
    { id: 1, name: "Appetizers", description: "Starters and light bites", status: "Active" },
    { id: 2, name: "Main Course", description: "Primary dishes", status: "Active" },
    { id: 3, name: "Desserts", description: "Sweets and treats", status: "Active" },
  ];

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
          <tr key={cat.id} className="border-b border-theme hover:bg-gray-50 dark:hover:bg-[var(--color-background)]">
            <td className="px-6 py-4 text-sm font-medium text-theme">{cat.name}</td>
            <td className="px-6 py-4 text-sm text-secondary">{cat.description}</td>
            <td className="px-6 py-4 text-sm">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {cat.status}
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

function ItemsTable({ onEdit, onDelete }) {
  const items = [
    { id: 1, name: "Margherita Pizza", category: "Main Course", status: "Active" },
    { id: 2, name: "Garlic Bread", category: "Appetizers", status: "Active" },
    { id: 3, name: "Chocolate Cake", category: "Desserts", status: "Active" },
  ];

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
          <tr key={item.id} className="border-b border-theme hover:bg-gray-50 dark:hover:bg-[var(--color-background)]">
            <td className="px-6 py-4 text-sm font-medium text-theme">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <img src={`https://placehold.co/100x100?text=${item.name[0]}`} alt={item.name} className="w-full h-full object-cover" />
                </div>
                {item.name}
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-secondary">{item.category}</td>
            <td className="px-6 py-4 text-sm">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {item.status}
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
