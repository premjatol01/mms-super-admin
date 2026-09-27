import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Maximize, Save, Info } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { useQRTemplateStore } from "../../../store/qrTemplateStore";

export default function MapCoordinatesModal() {
  const { showMapModal, closeMapModal, selectedTemplate, updateTemplate, loading } = useQRTemplateStore();

  // box.x, box.y  = position as % of image width / height
  // box.size       = % of image WIDTH only → used for both w & h in pixels to keep it square
  const [box, setBox] = useState({ x: 40, y: 40, size: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Actual rendered pixel dimensions of the image element
  const [imgDims, setImgDims] = useState({ w: 1, h: 1 });

  const imgRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    if (selectedTemplate) {
      setBox({
        x: selectedTemplate.qrX ?? 40,
        y: selectedTemplate.qrY ?? 40,
        size: selectedTemplate.qrSize || 20,
      });
    }
  }, [selectedTemplate]);

  if (!showMapModal || !selectedTemplate) return null;

  // Capture rendered image dimensions on load so we can compute the square height correctly
  const handleImgLoad = (e) => {
    setImgDims({ w: e.target.offsetWidth, h: e.target.offsetHeight });
  };

  // Width stays as % of image width
  const boxWidthPct = box.size;
  // Convert width → pixels, then express that same pixel size as % of image height → perfect square
  const boxWidthPx   = (imgDims.w * box.size) / 100;
  const boxHeightPct = imgDims.h > 0 ? (boxWidthPx / imgDims.h) * 100 : box.size;

  const handlePointerDown = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'move')   setIsDragging(true);
    if (action === 'resize') setIsResizing(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging && !isResizing) return;
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();

    if (isDragging) {
      const dx = (e.movementX / rect.width)  * 100;
      const dy = (e.movementY / rect.height) * 100;

      setBox(prev => {
        const hPct = ((rect.width * prev.size / 100) / rect.height) * 100;
        const newX = Math.max(0, Math.min(prev.x + dx, 100 - prev.size));
        const newY = Math.max(0, Math.min(prev.y + dy, 100 - hPct));
        return { ...prev, x: newX, y: newY };
      });
    } else if (isResizing) {
      // Resize via X movement only → width changes → height auto-follows in pixels → stays square
      const ds = (e.movementX / rect.width) * 100;

      setBox(prev => {
        const minSize = 5;
        const maxByX = 100 - prev.x;
        const maxByY = ((100 - prev.y) * rect.width) / rect.height;
        const newSize = Math.max(minSize, Math.min(prev.size + ds, maxByX, maxByY));
        return { ...prev, size: newSize };
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleSave = async () => {
    try {
      await updateTemplate(selectedTemplate._id, {
        qrX: parseFloat(box.x.toFixed(2)),
        qrY: parseFloat(box.y.toFixed(2)),
        qrSize: parseFloat(box.size.toFixed(2)),
      });
      toast.success("Coordinates mapped successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to save coordinates");
    }
  };

  return (
    <Modal isOpen={showMapModal} onClose={closeMapModal} title={`Map QR Zone — ${selectedTemplate.name}`} size="4xl">
      <div className="flex flex-col md:flex-row gap-6">

        {/* ── Left: Interactive Canvas ── */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-theme overflow-hidden flex items-center justify-center p-4 min-h-[500px]">
          <div
            className="relative shadow-md"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ touchAction: 'none' }}
          >
            <img
              ref={imgRef}
              src={`${API_BASE}${selectedTemplate.imagePath}`}
              alt="Template"
              className="max-h-[65vh] w-auto pointer-events-none select-none block"
              onLoad={handleImgLoad}
            />

            {/* QR Zone — pixel-perfect square */}
            <div
              className={`absolute border-2 border-primary flex items-center justify-center cursor-move transition-colors
                ${isDragging
                  ? 'bg-primary/40 shadow-xl shadow-primary/40'
                  : 'bg-primary/20 shadow-lg hover:bg-primary/30'}`}
              style={{
                left:   `${box.x}%`,
                top:    `${box.y}%`,
                width:  `${boxWidthPct}%`,
                height: `${boxHeightPct}%`,   // same pixels as width → true square
              }}
              onPointerDown={(e) => handlePointerDown(e, 'move')}
            >
              {/* Corner brackets — QR-code style */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />

              <span className="text-white font-bold bg-black/50 px-2 py-0.5 rounded text-[10px] select-none pointer-events-none">
                QR
              </span>

              {/* Resize handle */}
              <div
                className="absolute -right-3 -bottom-3 w-6 h-6 bg-white border-2 border-primary rounded-full cursor-nwse-resize flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                onPointerDown={(e) => handlePointerDown(e, 'resize')}
              >
                <Maximize size={11} className="text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Info & Coordinates ── */}
        <div className="w-full md:w-64 space-y-6 shrink-0">
          <div className="bg-primary-light/10 p-4 rounded-xl border border-primary/20">
            <h4 className="font-semibold text-theme flex items-center gap-2 mb-2">
              <Info size={16} className="text-primary" /> How to map
            </h4>
            <p className="text-sm text-secondary leading-relaxed">
              Drag the blue box over the empty space on the template where the QR
              code should appear. Use the <strong>⤡</strong> handle to resize.
              The box is always a <strong>perfect square</strong> — exactly like
              the generated QR code.
            </p>
          </div>

          <div className="space-y-3 p-4 bg-surface rounded-xl border border-theme text-sm">
            <h4 className="font-medium text-theme mb-3">Live Coordinates</h4>
            <div className="flex justify-between items-center border-b border-theme pb-2">
              <span className="text-secondary">X (Left)</span>
              <span className="font-mono text-theme">{box.x.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center border-b border-theme pb-2">
              <span className="text-secondary">Y (Top)</span>
              <span className="font-mono text-theme">{box.y.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center border-b border-theme pb-2">
              <span className="text-secondary">Size</span>
              <span className="font-mono text-theme">{box.size.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Approx px</span>
              <span className="font-mono text-theme">
                {Math.round(boxWidthPx)} × {Math.round(boxWidthPx)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-theme flex flex-col gap-3">
            <Button onClick={handleSave} loading={loading} className="w-full flex justify-center gap-2">
              <Save size={16} /> Save Mapping
            </Button>
            <Button variant="secondary" onClick={closeMapModal} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
