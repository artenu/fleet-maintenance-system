// src/components/digitalTwin/wheelDetail/WheelPhotoEvidence.tsx
import { Camera, ZoomIn } from "lucide-react";
import { Badge, Button } from "@/components/common";
import { getTirePhotos } from "@/utils/tireManagement/tireCalculations";
import type { WheelPhotoEvidenceProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Tampilan galeri thumbnail bukti foto fisik lapangan (multi-foto) atau trigger ambil foto
 */
export default function WheelPhotoEvidence({
  slot,
  tire,
  onPreviewPhoto,
  onOpenInspection,
}: WheelPhotoEvidenceProps) {
  const photos = getTirePhotos(tire);

  if (photos.length > 0) {
    return (
      <div className="pt-2 border-t border-slate-200/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Camera size={13} className="text-slate-600" />
            Foto Bukti Lapangan:
          </span>
          <Badge variant="success">{photos.length} Foto Terverifikasi</Badge>
        </div>

        <div
          className={`grid gap-1.5 ${
            photos.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}>
          {photos.map((url, idx) => (
            <div
              key={`${idx}-${url.slice(0, 24)}`}
              onClick={() => {
                onPreviewPhoto({
                  url,
                  title: `Ban ${tire.serialNumber} (${tire.brand}) • Foto #${idx + 1}`,
                  subtitle: `Posisi ${slot.position} • Diinspeksi ${tire.lastInspectionDate} oleh ${tire.inspectorName || "Surveyor Lapangan"}`,
                });
              }}
              className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-2xs bg-slate-900 cursor-pointer">
              <img
                src={url}
                alt={`Foto Bukti Tapak Ban ${idx + 1}`}
                className={`w-full object-cover group-hover:scale-105 transition duration-200 ${
                  photos.length === 1 ? "h-32" : "h-24"
                }`}
              />
              {photos.length > 1 && (
                <span className="absolute top-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  #{idx + 1}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-[11px] font-bold">
                <ZoomIn size={15} />
                <span>Perbesar</span>
              </div>
            </div>
          ))}
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

