// src/components/digitalTwin/FleetReadinessBanner.tsx
import { AlertOctagon, CheckCircle2, Link2 } from "lucide-react";
import { Badge } from "@/components/common";
import type { FleetReadinessBannerProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

export default function FleetReadinessBanner({
  unitCode,
  plateNumber,
  isGrounded,
  criticalTiresCount,
  missingTiresCount = 0,
  readinessPercent,
  hasNoTires = false,
  attachedChassisCode,
  chassisType,
  chassisLengthCategory,
}: FleetReadinessBannerProps) {
  return (
    <div
      className={`rounded-2xl p-4 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-xs ${
        isGrounded
          ? "border-rose-300 bg-linear-to-r from-rose-50 to-red-50/70 text-rose-950"
          : "border-emerald-300 bg-linear-to-r from-emerald-50 to-teal-50/70 text-emerald-950"
      }`}>
      <div className="flex items-center gap-3.5">
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white shadow-md ${
            isGrounded
              ? "bg-rose-600 shadow-rose-500/30 animate-pulse"
              : "bg-emerald-600 shadow-emerald-500/30"
          }`}>
          {isGrounded ? <AlertOctagon size={24} /> : <CheckCircle2 size={24} />}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isGrounded ? "danger" : "success"}>
              {isGrounded
                ? "DITAHAN DI POOL (GROUNDED)"
                : "SIAP JALAN (FIT TO DISPATCH)"}
            </Badge>
            <strong className="text-sm font-black tracking-tight text-slate-900">
              Unit {unitCode} ({plateNumber})
            </strong>

            {/* Badge Sinkronisasi Sasis dari Perangkaian (Drop & Hook) */}
            {attachedChassisCode ? (
              <Badge
                variant="info"
                className="text-[10px] font-bold flex items-center gap-1">
                <Link2 size={11} />
                Sasis: {attachedChassisCode} • {chassisLengthCategory} (
                {chassisType === "3_AXLE" ? "18 Ban" : "14 Ban"})
              </Badge>
            ) : (
              <Badge variant="neutral" className="text-[10px] font-bold">
                Bobtail (Tanpa Sasis)
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {isGrounded ? (
              <span>
                <strong className="text-rose-700">PERINGATAN:</strong>{" "}
                {hasNoTires ? (
                  <span>
                    Unit ini belum memiliki ban terpasang pada gandar roda (0%).
                    Dilarang diterbitkan Surat Jalan (SJ) sebelum seluruh ban
                    dipasang!
                  </span>
                ) : (
                  <span>
                    {criticalTiresCount > 0 && (
                      <>
                        Ditemukan{" "}
                        <strong>
                          {criticalTiresCount} roda berstatus KRITIS
                        </strong>
                        .{" "}
                      </>
                    )}
                    {missingTiresCount > 0 && (
                      <>
                        Masih ada{" "}
                        <strong>{missingTiresCount} slot roda kosong</strong>{" "}
                        belum terpasang.{" "}
                      </>
                    )}
                    Unit dilarang memuat kontainer sebelum seluruh roda lengkap
                    dan layak jalan!
                  </span>
                )}
              </span>
            ) : (
              <span>
                Seluruh roda dalam batas operasional aman. Surat Jalan (SJ) siap
                diterbitkan untuk rute jarak jauh.
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white px-3.5 py-1.5 border border-slate-200 text-center shadow-2xs">
        <span className="text-[10px] text-slate-400 font-bold block uppercase">
          Kesiapan Roda
        </span>
        <strong
          className={`text-base font-black ${
            isGrounded ? "text-rose-600" : "text-emerald-600"
          }`}>
          {readinessPercent}% Layak
        </strong>
      </div>
    </div>
  );
}
