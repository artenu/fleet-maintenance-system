// src/components/digitalTwin/inspection/InspectionStatusHeader.tsx
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/common";
import type { InspectionStatusHeaderProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Header ringkasan status kesehatan dan peringatan Golden Rules inspeksi
 */
export default function InspectionStatusHeader({
  liveStatus,
  axleType,
  kmElapsed,
  pressurePsi,
  isSteerViolation,
  isSteerRetreadWarning = false,
  isPhysicalCritical,
  isAfkirMandatory = false,
  totalPunctures = 0,
  position,
  retreadStatus,
}: InspectionStatusHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Ringkasan Status Roda Saat Ini */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold">
            STATUS KESEHATAN
          </span>
          <Badge
            variant={
              liveStatus === "CRITICAL"
                ? "danger"
                : liveStatus === "WARNING"
                  ? "warning"
                  : "success"
            }
            className="mt-0.5">
            {liveStatus}
          </Badge>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold">
            GANDAR
          </span>
          <strong className="text-slate-800 uppercase text-xs">
            {axleType} AXLE
          </strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold">
            JARAK TEMPUH
          </span>
          <strong className="text-slate-900 font-bold">
            {kmElapsed.toLocaleString("id-ID")} KM
          </strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold">
            STATUS TEKANAN
          </span>
          <span
            className={`font-bold text-[11px] ${
              pressurePsi >= 105 && pressurePsi <= 125
                ? "text-emerald-700"
                : "text-amber-700"
            }`}>
            {pressurePsi} PSI (
            {pressurePsi < 100
              ? "Kurang Angin"
              : pressurePsi > 125
                ? "Kelebihan"
                : "Ideal"}
            )
          </span>
        </div>
      </div>

      {/* Peringatan Pelanggaran Golden Rule #1 (Gandar Steer R2/R3/AFKIR) */}
      {isSteerViolation && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 text-xs">
          <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              Pelanggaran Aturan Gandar Steer!
            </strong>
            <p className="text-[11px] mt-0.5 leading-relaxed">
              Posisi Kemudi {position} dilarang menggunakan ban vulkanisir lanjut
              ({retreadStatus}). Gandar steer hanya diizinkan menggunakan Ban
              Baru (R0) atau maksimal 1x Vulkanisir (R1)!
            </p>
          </div>
        </div>
      )}

      {/* Peringatan Validasi Steer R1 (1x Vulkanisir dipasang di Steer depan head truck) */}
      {isSteerRetreadWarning && !isSteerViolation && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900 text-xs">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              Peringatan Validasi Steer Depan (Ban Vulkanisir 1x / R1)
            </strong>
            <p className="text-[11px] mt-0.5 leading-relaxed">
              Posisi kemudi depan ({position}) terpasang ban 1x vulkanisir
              (R1). Pastikan kondisi karkas &amp; tekanan angin aman terkendali,
              atau jadwalkan penggantian dengan Ban Baru (R0).
            </p>
          </div>
        </div>
      )}

      {/* Peringatan Batas Tambalan >= 3x Bocor (Tidak Bisa Retread / Wajib Afkir) */}
      {isAfkirMandatory && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 text-xs">
          <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              Batas Tambalan Terlampaui ({totalPunctures}x Bocor) • Wajib AFKIR!
            </strong>
            <p className="text-[11px] mt-0.5 leading-relaxed">
              Ban ini telah mengalami {totalPunctures}x bocor/tambal selama masa
              penggunaan (R0-R3). Sesuai SOP keselamatan, ban tidak boleh
              divulkanisir/retread ulang dan harus segera di-AFKIRKAN.
            </p>
          </div>
        </div>
      )}

      {/* Peringatan Tambalan 2x Bocor */}
      {!isAfkirMandatory && totalPunctures === 2 && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900 text-xs">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              Peringatan Riwayat Tambalan (2x Bocor)
            </strong>
            <p className="text-[11px] mt-0.5 leading-relaxed">
              Ban sudah ditambal 2 kali. Jika terjadi 1x kebocoran lagi (3x),
              ban tidak bisa di-retread dan wajib di-AFKIRKAN.
            </p>
          </div>
        </div>
      )}

      {/* Peringatan Pelanggaran Golden Rule #5 (Fisik Kritis < 40%) */}
      {isPhysicalCritical && !isSteerViolation && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 text-xs">
          <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              Golden Rule #5 Aktif: Kondisi Fisik Kritis (&lt; 40% / Cacat Karkas)!
            </strong>
            <p className="text-[11px] mt-0.5 leading-relaxed">
              Toleransi Odometer KM diabaikan. Kondisi tapak atau kerusakan
              struktural mewajibkan ban segera dibongkar demi keselamatan armada.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

