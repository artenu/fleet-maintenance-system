// src/components/digitalTwin/wheelDetail/WheelSlotHeader.tsx
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/common";
import type { WheelSlotHeaderProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Header posisi roda, tipe gandar, badge status kesehatan, dan peringatan aturan / toleransi
 */
export default function WheelSlotHeader({ slot }: WheelSlotHeaderProps) {
  const healthVariant =
    slot.healthStatus === "CRITICAL"
      ? "danger"
      : slot.healthStatus === "WARNING"
        ? "warning"
        : "success";

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

      {/* Badge Toleransi Mekanik Jika Aktif */}
      {slot.tire?.isMechanicOverridden && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-amber-900">
          <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">
              Toleransi Mekanik +5.000 KM Aktif
            </strong>
            <p className="text-[10px] text-amber-800 mt-0.5">
              Disetujui oleh: <strong>{slot.tire.overrideApprovedBy}</strong>.
              Alasan: {slot.tire.overrideReason}
            </p>
          </div>
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
    </div>
  );
}
