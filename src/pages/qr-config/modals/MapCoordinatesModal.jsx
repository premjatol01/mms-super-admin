import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  Maximize, 
  Save, 
  Info, 
  Move, 
  AlignCenter, 
  ArrowUp, 
  ArrowDown, 
  Sliders, 
  Check, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { useQRTemplateStore } from "../../../store/qrTemplateStore";

export default function MapCoordinatesModal() {
  const { showMapModal, closeMapModal, selectedTemplate, updateTemplate, loading } = useQRTemplateStore();

  // box.x, box.y = position as % of image width / height (0 to 100)
  // box.size     = size as % of image width (0 to 100) -> width and height in px are identical
  const [box, setBox] = useState({ x: 40, y: 40, size: 25 });
  const [activeAction, setActiveAction] = useState(null); // 'move' | 'se' | 'sw' | 'ne' | 'nw'

  // Image dimensions
  const [imgDims, setImgDims] = useState({ w: 1, h: 1, naturalW: 0, naturalH: 0 });

  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // Pointer drag tracker ref
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    startBoxX: 0,
    startBoxY: 0,
    startSize: 0,
    handle: null,
    imgRect: null,
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    if (selectedTemplate) {
      setBox({
        x: Number(selectedTemplate.qrX ?? 40),
        y: Number(selectedTemplate.qrY ?? 40),
        size: Number(selectedTemplate.qrSize || 25),
      });
    }
  }, [selectedTemplate]);

  // Capture rendered and natural image dimensions
  const handleImgLoad = (e) => {
    const el = e.target;
    setImgDims({
      w: el.offsetWidth || el.clientWidth || 1,
      h: el.offsetHeight || el.clientHeight || 1,
      naturalW: el.naturalWidth || 0,
      naturalH: el.naturalHeight || 0,
    });
  };

  // Recalculate dimensions on window resize
  useEffect(() => {
    if (!showMapModal) return;
    const updateSize = () => {
      if (imgRef.current) {
        setImgDims(prev => ({
          ...prev,
          w: imgRef.current.offsetWidth || 1,
          h: imgRef.current.offsetHeight || 1,
        }));
      }
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [showMapModal]);

  // Height as percentage of image height (keeps it a true 1:1 square in pixels)
  const heightPct = imgDims.h > 0 ? (box.size * imgDims.w) / imgDims.h : box.size;

  // Maximum allowed size on this template image
  const maxAllowedSize = imgDims.h > 0 && imgDims.w > 0 
    ? Math.min(100, (imgDims.h / imgDims.w) * 100) 
    : 100;

  // Pixel dimensions for display
  const effectiveW = imgDims.naturalW || imgDims.w;
  const boxWidthPx = Math.round(effectiveW * (box.size / 100));

  /**
   * Clamps and auto-adjusts coordinates:
   * If growing the size pushes the box past the right or bottom edges,
   * we smoothly slide x or y inward instead of blocking expansion!
   */
  const clampAndAdjust = useCallback((newX, newY, newSize, targetW = imgDims.w, targetH = imgDims.h) => {
    const maxPoss = targetW > 0 && targetH > 0 ? Math.min(100, (targetH / targetW) * 100) : 100;
    const clampedSize = Math.max(4, Math.min(maxPoss, newSize));
    const hPct = targetH > 0 ? (clampedSize * targetW) / targetH : clampedSize;

    let clampedX = newX;
    if (clampedX + clampedSize > 100) {
      clampedX = Math.max(0, 100 - clampedSize);
    }
    clampedX = Math.max(0, clampedX);

    let clampedY = newY;
    if (clampedY + hPct > 100) {
      clampedY = Math.max(0, 100 - hPct);
    }
    clampedY = Math.max(0, clampedY);

    return { x: clampedX, y: clampedY, size: clampedSize };
  }, [imgDims.w, imgDims.h]);

  // Pointer drag start
  const handlePointerDown = (e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startBoxX: box.x,
      startBoxY: box.y,
      startSize: box.size,
      handle,
      imgRect: rect,
    };
    setActiveAction(handle);

    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Pointer drag move
  const handlePointerMove = (e) => {
    if (!activeAction || !dragRef.current.imgRect) return;
    const { startX, startY, startBoxX, startBoxY, startSize, handle, imgRect } = dragRef.current;

    const dxPct = ((e.clientX - startX) / imgRect.width) * 100;
    const dyPct = ((e.clientY - startY) / imgRect.height) * 100;

    if (handle === 'move') {
      const hPct = imgRect.height > 0 ? (box.size * imgRect.width) / imgRect.height : box.size;
      const newX = Math.max(0, Math.min(100 - box.size, startBoxX + dxPct));
      const newY = Math.max(0, Math.min(100 - hPct, startBoxY + dyPct));
      setBox(prev => ({ ...prev, x: newX, y: newY }));
    } else if (handle === 'se') {
      // Bottom-Right corner resize
      const delta = Math.abs(dxPct) > Math.abs(dyPct * imgRect.height / imgRect.width)
        ? dxPct
        : (dyPct * imgRect.height / imgRect.width);
      const targetSize = startSize + delta;
      setBox(clampAndAdjust(startBoxX, startBoxY, targetSize, imgRect.width, imgRect.height));
    } else if (handle === 'sw') {
      // Bottom-Left corner resize
      const delta = Math.abs(-dxPct) > Math.abs(dyPct * imgRect.height / imgRect.width)
        ? -dxPct
        : (dyPct * imgRect.height / imgRect.width);
      const targetSize = startSize + delta;
      const newX = startBoxX - (targetSize - startSize);
      setBox(clampAndAdjust(newX, startBoxY, targetSize, imgRect.width, imgRect.height));
    } else if (handle === 'ne') {
      // Top-Right corner resize
      const delta = Math.abs(dxPct) > Math.abs(-dyPct * imgRect.height / imgRect.width)
        ? dxPct
        : (-dyPct * imgRect.height / imgRect.width);
      const targetSize = startSize + delta;
      const hDiff = ((targetSize - startSize) * imgRect.width) / imgRect.height;
      const newY = startBoxY - hDiff;
      setBox(clampAndAdjust(startBoxX, newY, targetSize, imgRect.width, imgRect.height));
    } else if (handle === 'nw') {
      // Top-Left corner resize
      const delta = Math.abs(-dxPct) > Math.abs(-dyPct * imgRect.height / imgRect.width)
        ? -dxPct
        : (-dyPct * imgRect.height / imgRect.width);
      const targetSize = startSize + delta;
      const newX = startBoxX - (targetSize - startSize);
      const hDiff = ((targetSize - startSize) * imgRect.width) / imgRect.height;
      const newY = startBoxY - hDiff;
      setBox(clampAndAdjust(newX, newY, targetSize, imgRect.width, imgRect.height));
    }
  };

  // Pointer release
  const handlePointerUp = (e) => {
    if (activeAction) {
      try {
        e.target?.releasePointerCapture?.(e.pointerId);
      } catch (_) {}
      setActiveAction(null);
    }
  };

  // Keyboard navigation for pixel-level fine tuning
  useEffect(() => {
    if (!showMapModal) return;
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const step = e.shiftKey ? 1 : 0.5;
      const hPct = imgDims.h > 0 ? (box.size * imgDims.w) / imgDims.h : box.size;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setBox(p => ({ ...p, x: Math.max(0, p.x - step) }));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setBox(p => ({ ...p, x: Math.min(100 - p.size, p.x + step) }));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setBox(p => ({ ...p, y: Math.max(0, p.y - step) }));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setBox(p => ({ ...p, y: Math.min(100 - hPct, p.y + step) }));
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setBox(p => clampAndAdjust(p.x, p.y, p.size + step));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setBox(p => clampAndAdjust(p.x, p.y, p.size - step));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMapModal, box, imgDims, clampAndAdjust]);

  // Alignment helpers
  const alignFullCenter = () => {
    const hPct = imgDims.h > 0 ? (box.size * imgDims.w) / imgDims.h : box.size;
    setBox(prev => ({
      ...prev,
      x: Math.max(0, parseFloat(((100 - prev.size) / 2).toFixed(1))),
      y: Math.max(0, parseFloat(((100 - hPct) / 2).toFixed(1))),
    }));
  };

  const alignHorizontalCenter = () => {
    setBox(prev => ({
      ...prev,
      x: Math.max(0, parseFloat(((100 - prev.size) / 2).toFixed(1))),
    }));
  };

  const alignVerticalCenter = () => {
    const hPct = imgDims.h > 0 ? (box.size * imgDims.w) / imgDims.h : box.size;
    setBox(prev => ({
      ...prev,
      y: Math.max(0, parseFloat(((100 - hPct) / 2).toFixed(1))),
    }));
  };

  const alignTop = () => {
    setBox(prev => ({ ...prev, y: 5 }));
  };

  const alignBottom = () => {
    const hPct = imgDims.h > 0 ? (box.size * imgDims.w) / imgDims.h : box.size;
    setBox(prev => ({ ...prev, y: Math.max(0, parseFloat((95 - hPct).toFixed(1))) }));
  };

  const resetDefaults = () => {
    setBox(clampAndAdjust(37.5, 37.5, 25));
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

  if (!showMapModal || !selectedTemplate) return null;

  return (
    <Modal 
      isOpen={showMapModal} 
      onClose={closeMapModal} 
      title={`Map QR Zone — ${selectedTemplate.name}`} 
      size="5xl"
    >
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left: Interactive Canvas ── */}
        <div 
          ref={containerRef}
          className="flex-1 bg-gray-100 dark:bg-gray-900/60 rounded-xl border border-theme overflow-hidden flex items-center justify-center p-4 min-h-[480px] lg:min-h-[580px] select-none relative"
        >
          <div
            className="relative shadow-lg inline-block"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ touchAction: 'none' }}
          >
            {/* Template Image with high-quality rendering */}
            <img
              ref={imgRef}
              src={`${API_BASE}${selectedTemplate.imagePath}`}
              alt="Template"
              className="max-h-[62vh] max-w-full w-auto h-auto pointer-events-none select-none block rounded-sm"
              style={{ imageRendering: "auto" }}
              onLoad={handleImgLoad}
            />

            {/* QR Zone — Guaranteed 100% True Square via aspect-ratio: 1/1 */}
            <div
              className={`absolute border-2 border-primary flex items-center justify-center cursor-move transition-shadow z-20
                ${activeAction === 'move'
                  ? 'bg-primary/40 shadow-2xl shadow-primary/50'
                  : 'bg-primary/25 shadow-lg hover:bg-primary/35'}`}
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.size}%`,
                aspectRatio: '1 / 1',
              }}
              onPointerDown={(e) => handlePointerDown(e, 'move')}
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />

              {/* Center Badge */}
              <div className="flex flex-col items-center pointer-events-none select-none">
                <span className="text-white font-bold bg-black/60 px-2 py-0.5 rounded text-[10px] tracking-wider">
                  QR CODE
                </span>
                <span className="text-[9px] text-white/80 font-mono mt-0.5 bg-black/40 px-1 rounded">
                  {boxWidthPx}×{boxWidthPx}px
                </span>
              </div>

              {/* 4 Corner Resize Handles */}
              {/* Bottom-Right */}
              <div
                className="absolute -right-2.5 -bottom-2.5 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-nwse-resize flex items-center justify-center shadow-md hover:scale-125 transition-transform z-30"
                onPointerDown={(e) => handlePointerDown(e, 'se')}
                title="Resize Square"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>

              {/* Top-Right */}
              <div
                className="absolute -right-2.5 -top-2.5 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-nesw-resize flex items-center justify-center shadow-md hover:scale-125 transition-transform z-30"
                onPointerDown={(e) => handlePointerDown(e, 'ne')}
                title="Resize Square"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>

              {/* Bottom-Left */}
              <div
                className="absolute -left-2.5 -bottom-2.5 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-nesw-resize flex items-center justify-center shadow-md hover:scale-125 transition-transform z-30"
                onPointerDown={(e) => handlePointerDown(e, 'sw')}
                title="Resize Square"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>

              {/* Top-Left */}
              <div
                className="absolute -left-2.5 -top-2.5 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-nwse-resize flex items-center justify-center shadow-md hover:scale-125 transition-transform z-30"
                onPointerDown={(e) => handlePointerDown(e, 'nw')}
                title="Resize Square"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Controls & Fine-Tuning ── */}
        <div className="w-full lg:w-72 space-y-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Size Slider & Input */}
            <div className="p-4 bg-surface rounded-xl border border-theme space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-theme flex items-center gap-1.5">
                  <Sliders size={15} className="text-primary" /> QR Zone Size
                </span>
                <span className="font-mono text-sm font-bold text-primary bg-primary-light/30 px-2 py-0.5 rounded">
                  {box.size.toFixed(1)}%
                </span>
              </div>

              <input
                type="range"
                min="4"
                max={maxAllowedSize.toFixed(1)}
                step="0.5"
                value={box.size}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBox(clampAndAdjust(box.x, box.y, val));
                }}
                className="w-full accent-primary h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs text-secondary font-mono">
                <span>Min: 4%</span>
                <span className="text-theme font-medium">True 1:1 Square</span>
                <span>Max: {maxAllowedSize.toFixed(0)}%</span>
              </div>
            </div>

            {/* Position Sliders */}
            <div className="p-4 bg-surface rounded-xl border border-theme space-y-3 text-xs">
              <span className="text-sm font-semibold text-theme block mb-1">Position Coordinates</span>
              
              {/* X Axis */}
              <div className="space-y-1">
                <div className="flex justify-between text-secondary">
                  <span>Horizontal (X)</span>
                  <span className="font-mono text-theme font-semibold">{box.x.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, 100 - box.size).toFixed(1)}
                  step="0.5"
                  value={box.x}
                  onChange={(e) => setBox(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                  className="w-full accent-primary h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Y Axis */}
              <div className="space-y-1">
                <div className="flex justify-between text-secondary">
                  <span>Vertical (Y)</span>
                  <span className="font-mono text-theme font-semibold">{box.y.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, 100 - heightPct).toFixed(1)}
                  step="0.5"
                  value={box.y}
                  onChange={(e) => setBox(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                  className="w-full accent-primary h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Pixel Readout */}
              <div className="pt-2 border-t border-theme flex items-center justify-between text-secondary">
                <span>Output Resolution</span>
                <span className="font-mono font-semibold text-theme">
                  {boxWidthPx} × {boxWidthPx} px
                </span>
              </div>
            </div>

            {/* Quick Alignment Tools */}
            <div className="p-3 bg-surface rounded-xl border border-theme space-y-2">
              <span className="text-xs font-semibold text-theme block">Quick Align</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={alignHorizontalCenter}
                  className="px-2 py-1.5 rounded bg-primary-light/20 hover:bg-primary-light/40 text-theme text-xs font-medium transition-colors cursor-pointer"
                  title="Center Horizontally"
                >
                  Center X
                </button>
                <button
                  type="button"
                  onClick={alignVerticalCenter}
                  className="px-2 py-1.5 rounded bg-primary-light/20 hover:bg-primary-light/40 text-theme text-xs font-medium transition-colors cursor-pointer"
                  title="Center Vertically"
                >
                  Center Y
                </button>
                <button
                  type="button"
                  onClick={alignFullCenter}
                  className="px-2 py-1.5 rounded bg-primary text-white text-xs font-medium transition-colors cursor-pointer"
                  title="Full Center"
                >
                  Center All
                </button>
                <button
                  type="button"
                  onClick={alignTop}
                  className="px-2 py-1.5 rounded bg-primary-light/20 hover:bg-primary-light/40 text-theme text-xs font-medium transition-colors cursor-pointer"
                  title="Align to Top"
                >
                  Top
                </button>
                <button
                  type="button"
                  onClick={alignBottom}
                  className="px-2 py-1.5 rounded bg-primary-light/20 hover:bg-primary-light/40 text-theme text-xs font-medium transition-colors cursor-pointer"
                  title="Align to Bottom"
                >
                  Bottom
                </button>
                <button
                  type="button"
                  onClick={resetDefaults}
                  className="px-2 py-1.5 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-theme text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
                  title="Reset to 25% Center"
                >
                  <RotateCcw size={11} /> Reset
                </button>
              </div>
            </div>

            {/* Instructions */}
            <p className="text-[11px] text-secondary leading-relaxed px-1">
              Tip: Drag from any corner to smoothly grow the square. Use keyboard <strong>Arrow keys</strong> for 0.5% nudge, and <strong>+</strong> / <strong>-</strong> to resize.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-theme flex flex-col gap-2">
            <Button onClick={handleSave} loading={loading} className="w-full flex items-center justify-center gap-2">
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
