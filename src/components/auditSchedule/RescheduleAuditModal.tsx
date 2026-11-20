// src/components/auditSchedule/RescheduleAuditModal.tsx
import type { RescheduleAuditModalProps } from "@/types/TireAuditScheduleView/TireAuditScheduleViewTypes";

// 🧱 Komponen Reusable Design System
import { Modal, Button } from "@/components/common";
import { AlertTriangle } from "lucide-react";
import { NumberInput, TextArea } from "@/components/forms";
import { getEffectiveDueDate, getExtendedDueDate } from "@/utils/auditSchedule";

/**
 * Modal Formulir Persetujuan Dispensasi Penundaan Audit (Reschedule)
 * Memberikan izin penundaan audit bagi unit truk yang sedang dalam trayek muatan luar kota.
 */
export default function RescheduleAuditModal({
  targetTruck,
  extendDays,
  onExtendDaysChange,
  rescheduleReason,
  onRescheduleReasonChange,
  onClose,
  onConfirm,
}: RescheduleAuditModalProps) {
  if (!targetTruck) {
    return null;
  }

  const isInvalidDays = extendDays < 1;
  const currentDueDate = getEffectiveDueDate(targetTruck.auditSchedule);
  const newDueDate = getExtendedDueDate(targetTruck.auditSchedule, extendDays);

  return (
    <Modal
      isOpen={Boolean(targetTruck)}
      onClose={onClose}
      title="Dispensasi Penundaan Audit (Reschedule)"
      description={`Unit ${targetTruck.unitCode} (${targetTruck.plateNumber}) - Pengemudi: ${targetTruck.driver}`}
      size="md">
      <form onSubmit={onConfirm} className="space-y-4">
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 leading-relaxed">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <span>
            Pemberian izin penundaan audit untuk unit{" "}
            <strong>{targetTruck.unitCode}</strong>. Unit diperbolehkan
            menyelesaikan trayek muatan sebelum wajib masuk ke pool.
          </span>
        </div>

        <NumberInput
          label="Perpanjang Berapa Hari?"
          value={extendDays}
          onChange={onExtendDaysChange}
          suffixText="Hari"
          error={isInvalidDays ? "Minimal perpanjangan 1 hari" : undefined}
          required
        />

        <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-900 space-y-1">
          <p>
            Jatuh tempo saat ini: <strong>{currentDueDate ?? "-"}</strong>
          </p>
          <p>
            Jadwal audit baru:{" "}
            <strong>{isInvalidDays ? "-" : newDueDate}</strong>
          </p>
        </div>

        <TextArea
          label="Alasan Penundaan (Catatan Kepala Pool)"
          rows={3}
          value={rescheduleReason}
          onChange={(e) => onRescheduleReasonChange(e.target.value)}
          placeholder="Contoh: Unit sedang ekspedisi muatan kontainer ke Belawan..."
          required
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="danger"
            disabled={isInvalidDays}
            type="submit"
            className="bg-blue-600 hover:bg-blue-700">
            Setujui Reschedule
          </Button>
        </div>
      </form>
    </Modal>
  );
}
