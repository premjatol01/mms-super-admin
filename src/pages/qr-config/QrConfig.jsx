import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import { useQrConfigStore } from "./data/qrConfigStore";
import QrCodeList from "./components/QrCodeList";
import QrFormModal from "./modals/QrFormModal";
import ConfirmToggleModal from "./modals/ConfirmToggleModal";

export default function QrConfig() {
  const {
    qrCodes,
    restaurants,
    isLoading,
    fetchQrCodes,
    fetchRestaurants,
    addQrCode,
    updateQrCode,
    toggleStatus,
  } = useQrConfigStore();

  const [formModalState, setFormModalState] = useState({
    open: false,
    qrCode: null,
  });
  const [toggleTarget, setToggleTarget] = useState(null);

  useEffect(() => {
    fetchQrCodes();
    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => setFormModalState({ open: true, qrCode: null });
  const openEditModal = (qrCode) => setFormModalState({ open: true, qrCode });
  const closeFormModal = () => setFormModalState({ open: false, qrCode: null });

  const handleFormSubmit = async (values, existingQrCode) => {
    if (existingQrCode) {
      await updateQrCode(existingQrCode.id, values);
    } else {
      await addQrCode(values);
    }
  };

  const handleToggleConfirm = async (qrCode) => {
    await toggleStatus(qrCode.id);
    setToggleTarget(null);
  };

  return (
    <div className="p-4 sm:p-6">
      <Toaster position="top-right" richColors />

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-theme">QR Configuration</h1>
          <p className="text-sm text-secondary">
            Manage QR codes and control who they're visible to.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-theme hover:bg-primary-light"
        >
          <Plus size={16} />
          Add QR Code
        </button>
      </div>

      <QrCodeList
        qrCodes={qrCodes}
        restaurants={restaurants}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onToggleStatus={setToggleTarget}
      />

      {formModalState.open && (
        <QrFormModal
          qrCode={formModalState.qrCode}
          restaurants={restaurants}
          onClose={closeFormModal}
          onSubmit={handleFormSubmit}
        />
      )}

      {toggleTarget && (
        <ConfirmToggleModal
          qrCode={toggleTarget}
          onCancel={() => setToggleTarget(null)}
          onConfirm={handleToggleConfirm}
        />
      )}
    </div>
  );
}
