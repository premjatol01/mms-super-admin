import { useEffect } from "react";
import { Plus, LayoutTemplate, Trash2, Edit3, CheckCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import { useQRTemplateStore } from "../../store/qrTemplateStore";
import UploadTemplateModal from "./modals/UploadTemplateModal";
import MapCoordinatesModal from "./modals/MapCoordinatesModal";

export default function QRConfigPage() {
  const { 
    templates, 
    loading, 
    fetchTemplates, 
    openUploadModal, 
    openMapModal, 
    deleteTemplate,
    updateTemplate
  } = useQRTemplateStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-end">
        <Button onClick={openUploadModal}>
          <Plus size={16} /> Upload Template
        </Button>
      </div>

      {/* Grid */}
      {loading && templates.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map(template => (
            <div key={template._id} className="bg-surface border border-theme rounded-xl overflow-hidden shadow-sm flex flex-col group relative">
              
              <div className="relative aspect-[3/4] bg-gray-100 border-b border-theme overflow-hidden group">
                <img 
                  src={`${API_BASE}${template.imagePath}`} 
                  alt={template.name}
                  className="w-full h-full object-contain"
                />
                
                {/* QR Preview Box */}
                {template.qrSize > 0 && (
                  <div 
                    className="absolute border-2 border-primary bg-primary/20 shadow-lg backdrop-blur-[1px]"
                    style={{
                      left: `${template.qrX}%`,
                      top: `${template.qrY}%`,
                      width: `${template.qrSize}%`,
                      height: `${template.qrSize}%`,
                    }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center text-primary/80">
                      <span className="text-[10px] font-bold bg-white/80 px-1 rounded">QR ZONE</span>
                    </div>
                  </div>
                )}
                
                {/* Hover Actions overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => openMapModal(template)}
                    className="p-2 bg-white rounded-full hover:bg-primary hover:text-white transition-colors"
                    title="Map Coordinates"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Delete this template?')) deleteTemplate(template._id);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between bg-surface">
                <div>
                  <h3 className="font-semibold text-theme truncate">{template.name}</h3>
                  <p className="text-xs text-secondary mt-1">
                    {template.qrSize > 0 ? `Mapped: [${Math.round(template.qrX)}%, ${Math.round(template.qrY)}%] size: ${Math.round(template.qrSize)}%` : 'Not mapped yet'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {templates.length === 0 && (
            <div className="col-span-full py-12 text-center text-secondary border-2 border-dashed border-theme rounded-xl">
              <LayoutTemplate size={48} className="mx-auto mb-4 opacity-50" />
              <p>No templates uploaded yet.</p>
              <p className="text-sm">Click the button above to add your first QR code template.</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <UploadTemplateModal />
      <MapCoordinatesModal />
    </div>
  );
}
