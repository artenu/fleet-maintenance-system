// src/components/digitalTwin/wheelDetail/WheelPhotoEvidence.tsx
import { Camera, ZoomIn } from "lucide-react";
import { Badge, Button } from "@/components/common";
import type { WheelPhotoEvidenceProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Tampilan thumbnail bukti foto fisik lapangan atau trigger ambil foto
 */
export default function WheelPhotoEvidence({
  slot,
  tire,
  onPreviewPhoto,
  onOpenInspection,
}: WheelPhotoEvidenceProps) {
  if (tire.photoEvidenceUrl) {
    return (
      <div className="pt-2 border-t border-slate-200/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Camera size={13} className="text-slate-600" />
            Foto Bukti Lapangan:
          </span>
          <Badge variant="success">Terverifikasi</Badge>
        </div>

        <div
          onClick={() => {
            if (!tire.photoEvidenceUrl) {
              return;
            }
            onPreviewPhoto({
              url: tire.photoEvidenceUrl,
              title: `Ban ${tire.serialNumber} (${tire.brand})`,
              subtitle: `Posisi ${slot.position} • Diinspeksi ${tire.lastInspectionDate} oleh ${tire.inspectorName || "Surveyor Lapangan"}`,
            });
          }}
          className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-2xs bg-slate-900 cursor-pointer">
          <img
            src={tire.photoEvidenceUrl}
            alt="Foto Bukti Tapak Ban"
            className="w-full h-32 object-cover group-hover:scale-105 transition duration-200"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold">
            <ZoomIn size={16} />
            <span>Klik untuk Memperbesar</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
      <span className="text-[11px]">Belum ada foto bukti fisik</span>
      <Button variant="ghost" size="sm" onClick={onOpenInspection}>
        + Ambil Foto
      </Button>
    </div>
  );
}

