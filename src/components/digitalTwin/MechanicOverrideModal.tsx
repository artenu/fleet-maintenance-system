// src/components/digitalTwin/MechanicOverrideModal.tsx
import { Modal, Button } from "@/components/common";
import { FormInput, TextArea } from "@/components/forms";
import type { MechanicOverrideModalProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Modal form pemberian toleransi tambahan (+5.000 KM) oleh kepala mekanik
 */
export default function MechanicOverrideModal({
  isOpen,
  onClose,
  mechanicName,
  onChangeMechanicName,
  overrideReason,
  onChangeOverrideReason,
  onSubmit,
}: MechanicOverrideModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispensasi Toleransi Mekanik (+5.000 KM)"
      description="SOP: Hanya boleh diberikan jika fisik tapak masih tebal (>50%) & keausan merata"
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

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            className="bg-amber-600 hover:bg-amber-700">
            Setujui Toleransi +5.000 KM
          </Button>
        </div>
      </form>
    </Modal>
  );
}

