// src/components/digitalTwin/wheelDetail/WheelActionButtons.tsx
import { RotateCw, ClipboardCheck, Disc3, Wrench } from "lucide-react";
import { Button, Badge } from "@/components/common";
import type { WheelActionButtonsProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Baris tombol aksi lapangan: Rotasi, Audit Fisik, Swap Serep Darurat, dan Toleransi Mekanik
 */
export default function WheelActionButtons({
  slot,
  onOpenInspection,
  onOpenRotation,
  onQuickSwapSpare,
  onOpenOverrideModal,
}: WheelActionButtonsProps) {
  const isSpareSlot = slot.position === "S1";
  const hasTire = Boolean(slot.tire);

  // Jika slot belum memiliki ban, sembunyikan seluruh tombol aksi operasional ban
  if (!hasTire) {
    return null;
  }

  return (
    <div className="space-y-2 pt-2 border-t border-slate-100">
      {/* Baris 1: Tombol Aksi Lapangan Reguler */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={RotateCw}
          onClick={onOpenRotation}>
          Rotasi Ban
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={ClipboardCheck}
          onClick={onOpenInspection}>
          Audit Fisik
        </Button>
      </div>

      {/* Baris 2: Tombol Emergency Roadside Swap & Toleransi Mekanik */}
      {slot.tire && (
        <div className="grid grid-cols-2 gap-2">
          {!isSpareSlot && (
            <Button
              variant="outline"
              size="sm"
              icon={Disc3}
              onClick={onQuickSwapSpare}
              title="Tukar cepat dengan Ban Serep S1 saat kondisi darurat"
              className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
              Swap Serep (S1)
            </Button>
          )}

          {!slot.tire.isMechanicOverridden ? (
            <Button
              variant="outline"
              size="sm"
              icon={Wrench}
              onClick={onOpenOverrideModal}
              title="Berikan toleransi +5.000 KM jika kondisi fisik tapak masih tebal"
              className={`border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 ${
                isSpareSlot ? "col-span-2" : ""
              }`}>
              +5.000 KM
            </Button>
          ) : (
            <Badge
              variant="warning"
              className="flex items-center justify-center">
              Toleransi Aktif
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
