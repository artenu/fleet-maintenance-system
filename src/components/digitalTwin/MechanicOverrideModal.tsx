// src/components/digitalTwin/MechanicOverrideModal.tsx
import { Camera, Trash2, AlertCircle } from "lucide-react";
import { Modal, Button } from "@/components/common";
import { FormInput, TextArea, FileInput } from "@/components/forms";
import type { MechanicOverrideModalProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Modal form pemberian toleransi tambahan (+5.000 KM) oleh kepala mekanik (Wajib Bukti Foto)
 */
export default function MechanicOverrideModal({
  isOpen,
  onClose,
  mechanicName,
  onChangeMechanicName,
  overrideReason,
  onChangeOverrideReason,
  overridePhotoUrl,
  onOverridePhotoCapture,
  onDeleteOverridePhoto,
  overrideError,
  onSubmit,
}: MechanicOverrideModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispensasi Toleransi Mekanik (+5.000 KM)"
      description="SOP: Wajib menyertakan bukti foto & fisik tapak masih tebal (>50%)"
      size="md">
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <FormInput
          label="Nama Kepala Mekanik PIC"
          placeholder="Contoh: Budi Santoso (Mekanik Senior)"
          value={mechanicName}
          onChange={(e) => onChangeMechanicName(e.target.value)}
          required
        />

        <TextArea
          label="Alasan Teknis Pemberian Toleransi"
          placeholder="Jelaskan kondisi fisik tapak ban, alasan toleransi, dan tindakan pencegahan..."
          rows={3}
          value={overrideReason}
          onChange={(e) => onChangeOverrideReason(e.target.value)}
          required
        />

        {/* Bukti Foto Wajib Toleransi */}
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <label className="block font-bold text-slate-700 text-xs">
            Bukti Foto Kondisi Fisik Ban{" "}
            <span className="text-rose-600">* (Wajib)</span>
          </label>

          {overridePhotoUrl ? (
            <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-slate-900">
              <img
                src={overridePhotoUrl}
                alt="Bukti Foto Toleransi Mekanik"
                className="w-full h-36 object-cover"
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={onDeleteOverridePhoto}
                title="Hapus foto"
                className="absolute top-2 right-2 p-1.5 shadow-md">
                Hapus
              </Button>
            </div>
          ) : (
            <FileInput
              buttonText="Ambil / Upload Foto Bukti Kondisi Ban"
              icon={Camera}
              accept="image/*"
              capture="environment"
              onChange={onOverridePhotoCapture}
              helperText="Lampirkan foto tapak/dinding ban aktual sebagai bukti kelayakan toleransi +5.000 KM"
            />
          )}

          {overrideError && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600">
              <AlertCircle size={14} className="shrink-0" />
              <span>{overrideError}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={!overridePhotoUrl}
            className="bg-amber-600 hover:bg-amber-700">
            Setujui Toleransi +5.000 KM
          </Button>
        </div>
      </form>
    </Modal>
  );
}

