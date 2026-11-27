// src/components/digitalTwin/wheelDetail/WheelSlotHeader.tsx
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Camera,
} from "lucide-react";
import { Badge } from "@/components/common";
import type { WheelSlotHeaderProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Header posisi roda, tipe gandar, badge status kesehatan, dan peringatan aturan / toleransi
 */
export default function WheelSlotHeader({
  slot,
  onPreviewPhoto,
}: WheelSlotHeaderProps) {
  const healthVariant =
    slot.healthStatus === "CRITICAL"
      ? "danger"
      : slot.healthStatus === "WARNING"
        ? "warning"
        : "success";

  const warnings = slot.ruleWarnings || [];

  return (
    <div className="space-y-3">
      {/* Posisi & Health Status */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-black text-slate-900">
            Posisi {slot.position}
          </span>
          <p className="text-[11px] font-semibold text-slate-500 capitalize">
            {slot.axleType} Axle
          </p>
        </div>
        <Badge variant={healthVariant}>{slot.healthStatus}</Badge>
      </div>

      {/* Badge Toleransi Mekanik Jika Aktif (Beserta Bukti Foto) */}
      {slot.tire?.isMechanicOverridden && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-amber-900 space-y-2">
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <strong className="font-bold block">
                Toleransi Mekanik +5.000 KM Aktif
              </strong>
              <p className="text-[10px] text-amber-800 mt-0.5">
                Disetujui oleh: <strong>{slot.tire.overrideApprovedBy}</strong>.
                Alasan: {slot.tire.overrideReason}
              </p>
            </div>
          </div>

          {slot.tire.overridePhotoUrl && (
            <button
              type="button"
              onClick={() => {
                if (!slot.tire?.overridePhotoUrl || !onPreviewPhoto) {
                  return;
                }
                onPreviewPhoto({
                  url: slot.tire.overridePhotoUrl,
                  title: `Bukti Foto Toleransi +5.000 KM • ${slot.tire.serialNumber}`,
                  subtitle: `Disetujui oleh ${slot.tire.overrideApprovedBy} • Posisi ${slot.position}`,
                });
              }}
              className="flex items-center gap-2 w-full rounded-lg border border-amber-200 bg-white/80 p-1.5 hover:bg-white transition text-left cursor-pointer">
              <img
                src={slot.tire.overridePhotoUrl}
                alt="Bukti Foto Toleransi"
                className="h-10 w-14 rounded object-cover shrink-0 border border-amber-200"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                  <Camera size={11} /> Bukti Foto Toleransi Terlampir
                </span>
                <span className="text-[9px] text-amber-700 block">
                  Klik untuk memperbesar gambar
                </span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Alarm Pelanggaran Golden Rule & Penyebab Kritis */}
      {slot.ruleViolations.length > 0 && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert size={16} className="text-rose-600 shrink-0" />
            <span>Penyebab Status Kritis / Pelanggaran:</span>
          </div>
          {slot.ruleViolations.map((v, i) => (
            <p key={i} className="text-[11px] leading-relaxed">
              • {v}
            </p>
          ))}
        </div>
      )}

      {/* Peringatan Non-Blokir (cth: Ban R1 di Steer depan, 2x Bocor, Mendekati Expired) */}
      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>Peringatan Validasi Operasional:</span>
          </div>
          {warnings.map((w, i) => (
            <p key={i} className="text-[11px] leading-relaxed">
              • {w}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
