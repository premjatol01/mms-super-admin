import { useEffect } from "react";
import { Plus, LayoutTemplate, Trash2, Edit3, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";
import { useQRTemplateStore } from "../../store/qrTemplateStore";
import UploadTemplateModal from "./modals/UploadTemplateModal";
import MapCoordinatesModal from "./modals/MapCoordinatesModal";

function TemplateCard({ template, onEdit, onDelete, API_BASE }) {
  return (
    <div className="bg-surface border border-theme rounded-xl overflow-hidden shadow-sm flex flex-col group relative">
      {/* Canvas container for the template image */}
      <div className="relative h-64 bg-gray-100 dark:bg-gray-800/50 border-b border-theme flex items-center justify-center p-3 overflow-hidden group">
        {/* Precise image wrapper that strictly shrink-wraps the rendered image */}
        <div className="relative max-h-full max-w-full inline-block shadow-sm">
          <img 
            src={`${API_BASE}${template.imagePath}`} 
            alt={template.name}
            className="max-h-56 max-w-full w-auto h-auto object-contain rounded-sm select-none block"
            style={{ imageRendering: "auto" }}
          />
          
          {/* QR Preview Box — accurately pinned to the template image, guaranteed 100% true square */}
          {template.qrSize > 0 && (
            <div 
              className="absolute border-2 border-primary bg-primary/25 shadow-md flex items-center justify-center pointer-events-none z-10"
              style={{
                left: `${template.qrX}%`,
                top: `${template.qrY}%`,
                width: `${template.qrSize}%`,
                aspectRatio: '1 / 1', // Guarantees true square, never stretched into a rectangle!
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-0.5">
                <span className="text-[9px] font-bold text-white bg-black/60 px-1 py-0.5 rounded leading-none select-none tracking-wider">
                  QR
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Hover Actions overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
          <button 
            onClick={() => onEdit(template)}
            className="p-2.5 bg-white text-gray-800 rounded-full hover:bg-primary hover:text-white transition-all shadow-md cursor-pointer hover:scale-110"
            title="Map QR Coordinates"
          >
            <Edit3 size={18} />
          </button>
          <button 
            onClick={() => {
              if (window.confirm(`Delete "${template.name}" template?`)) {
                onDelete(template._id);
              }
            }}
            className="p-2.5 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md cursor-pointer hover:scale-110"
            title="Delete Template"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between bg-surface">
        <div>
          <h3 className="font-semibold text-theme truncate" title={template.name}>{template.name}</h3>
          <p className="text-xs text-secondary mt-1 font-mono">
            {template.qrSize > 0 
              ? `Mapped: [${template.qrX.toFixed(1)}%, ${template.qrY.toFixed(1)}%] • Size: ${template.qrSize.toFixed(1)}%` 
              : 'Not mapped yet'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function QRConfigPage() {
  const { 
    templates, 
    loading, 
    fetchTemplates, 
    openUploadModal, 
    openMapModal, 
    deleteTemplate 
  } = useQRTemplateStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-theme">QR Templates & Mapping</h1>
          <p className="text-xs text-secondary mt-0.5">
            Configure custom branded QR code standees and flyers with pixel-perfect square QR zones.
          </p>
        </div>
        <Button onClick={openUploadModal}>
          <Plus size={16} /> Upload Template
        </Button>
      </div>

      {/* Grid */}
      {loading && templates.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-12 text-secondary">Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map(template => (
            <TemplateCard
              key={template._id}
              template={template}
              onEdit={openMapModal}
              onDelete={deleteTemplate}
              API_BASE={API_BASE}
            />
          ))}
          
          {templates.length === 0 && (
            <div className="col-span-full py-16 text-center text-secondary border-2 border-dashed border-theme rounded-xl">
              <LayoutTemplate size={48} className="mx-auto mb-4 opacity-40 text-primary" />
              <p className="font-medium text-theme">No QR templates uploaded yet</p>
              <p className="text-sm mt-1">Click the button above to upload your first high-resolution standee or table flyer template.</p>
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
