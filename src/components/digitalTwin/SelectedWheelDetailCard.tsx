// src/components/digitalTwin/SelectedWheelDetailCard.tsx
import type { SelectedWheelDetailCardProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import {
  WheelSlotHeader,
  WheelTireSpecsList,
  WheelPhotoEvidence,
  WheelActionButtons,
  WheelDetailEmptyState,
} from "./wheelDetail";
import { Warehouse, Disc } from "lucide-react";
import { Card, Button } from "@/components/common";

/**
 * Kartu panel samping untuk melihat detail inspeksi dan aksi pada roda terpilih
 */
export default function SelectedWheelDetailCard({
  selectedSlot,
  onOpenInspection,
  onOpenRotation,
  onQuickSwapSpare,
  onOpenOverrideModal,
  onPreviewPhoto,
  onOpenInstallTire, // 👈 1. Tambahkan ini di sini
}: SelectedWheelDetailCardProps) {
  return (
    <Card className="lg:sticky lg:top-20 space-y-4 max-h-[calc(100vh-6.5rem)] overflow-y-auto">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-sm text-slate-900">
          Detail Pemeriksaan Roda
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Klik salah satu kotak ban pada denah untuk melihat riwayatnya.
        </p>
      </div>

      {selectedSlot ? (
        <div className="space-y-4 text-xs">
          {/* Header slot roda & peringatan toleransi/aturan */}
          <WheelSlotHeader slot={selectedSlot} />

          {/* Data fisik & foto bukti ban terpasang ATAU Banner Pasang Ban di Slot Kosong */}
          {selectedSlot.tire ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2 text-xs">
              <WheelTireSpecsList
                slot={selectedSlot}
                tire={selectedSlot.tire}
              />
              <WheelPhotoEvidence
                slot={selectedSlot}
                tire={selectedSlot.tire}
                onPreviewPhoto={onPreviewPhoto}
                onOpenInspection={onOpenInspection}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-center space-y-2.5 animate-in fade-in duration-150">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-700 mx-auto shadow-2xs">
                <Disc size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-amber-900">
                  Slot Roda {selectedSlot.position} Belum Terpasang Ban
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Slot gandar ini kosong. Pasangkan ban dari stok gudang pool
                  yang tersedia.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={Warehouse}
                onClick={onOpenInstallTire}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                + Pasang Ban dari Stok Gudang Pool
              </Button>
            </div>
          )}

          {/* Baris tombol aksi: Rotasi, Audit, Swap Serep & Toleransi Mekanik */}
          <WheelActionButtons
            slot={selectedSlot}
            onOpenInspection={onOpenInspection}
            onOpenRotation={onOpenRotation}
            onQuickSwapSpare={onQuickSwapSpare}
            onOpenOverrideModal={onOpenOverrideModal}
          />
        </div>
      ) : (
        <WheelDetailEmptyState />
      )}
    </Card>
  );
}
