import { useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useQRTemplateStore } from "../../../store/qrTemplateStore";

export default function UploadTemplateModal() {
  const { showUploadModal, closeUploadModal, uploadTemplate, loading } = useQRTemplateStore();
  
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !file) {
      toast.error("Name and Image are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("templateImage", file);

    try {
      await uploadTemplate(formData);
      toast.success("Template uploaded successfully!");
      setName("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.message || "Failed to upload template");
    }
  };

  return (
    <Modal isOpen={showUploadModal} onClose={closeUploadModal} title="Upload New Template">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Template Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g. Standard Pink Template" 
          required 
        />

        <div>
          <label className="block text-sm font-medium text-theme mb-2">Template Image</label>
          <div className="border-2 border-dashed border-theme rounded-xl p-4 text-center cursor-pointer hover:bg-primary-light/5 transition-colors relative"
               onClick={() => document.getElementById('template-upload').click()}
          >
            <input 
              id="template-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 mx-auto object-contain rounded-lg" />
            ) : (
              <div className="py-6 flex flex-col items-center text-secondary">
                <Upload size={32} className="mb-2 opacity-50" />
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs mt-1">JPG, PNG (Max 5MB)</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-theme">
          <Button variant="secondary" onClick={closeUploadModal} type="button">Cancel</Button>
          <Button type="submit" loading={loading} disabled={!file || !name.trim()}>Upload</Button>
        </div>
      </form>
    </Modal>
  );
}
