// src/components/digitalTwin/wheelLayout/WheelLayoutSummaryBanner.tsx
import {
  AlertTriangle,
  CheckCircle2,
  Truck,
  User,
  Gauge,
  Link2,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/common";
import type { WheelLayoutSummaryBannerProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Banner ringkasan identitas unit armada (Data Master/API) & status kesehatan roda
 */
export default function WheelLayoutSummaryBanner({
  criticalCount,
  unitCode,
  plateNumber,
  brand,
  driver,
  currentOdometer,
  attachedChassisCode,
  chassisType,
  chassisLengthCategory,
  isBobTail = false,
}: WheelLayoutSummaryBannerProps) {
  return (
    <div className="space-y-3">
      {/* 1. Panel Identifikasi Unit Truk & Gandengan Sasis (Data API Sebelah) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Truck size={20} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                  {plateNumber || "-"}
                </span>
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/70">
                  Unit {unitCode || "-"}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {brand || "Unit Armada ALN"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                <span className="inline-flex items-center gap-1 font-medium">
                  <User size={13} className="text-slate-400" />
                  Supir: <strong>{driver || "Belum Ditugaskan"}</strong>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-medium font-mono">
                  <Gauge size={13} className="text-slate-400" />
                  Odo:{" "}
                  <strong>
                    {currentOdometer !== undefined
                      ? `${currentOdometer.toLocaleString("id-ID")} KM`
                      : "-"}
                  </strong>
                </span>
              </p>
            </div>
          </div>

          {/* Keterangan Sasis Terpasang (Poin 8) */}
          <div className="flex items-center gap-2">
            {!isBobTail && attachedChassisCode ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-right shadow-2xs">
                <div className="flex items-center gap-1.5 justify-end text-blue-900 font-black text-xs">
                  <Link2 size={13} className="text-blue-600" />
                  <span>Sasis {attachedChassisCode}</span>
                </div>
                <span className="text-[10px] text-blue-700 font-medium block">
                  {chassisLengthCategory || "Trailer"}{" "}
                  {chassisType === "3_AXLE" ? "(18 Roda)" : "(14 Roda)"}
                </span>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-right shadow-2xs">
                <div className="flex items-center gap-1.5 justify-end text-slate-700 font-bold text-xs">
                  <Layers size={13} className="text-slate-500" />
                  <span>Bobtail (Tanpa Sasis)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium block">
                  6 Roda Terpasang di Kepala
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Legenda Status & Alert Roda Kritis */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-0.5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Prima
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />{" "}
              Perhatian (≥80% KM)
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />{" "}
              Kritis (≥100% / &lt;40% Fisik)
            </span>
          </div>

          {criticalCount > 0 ? (
            <Badge variant="danger" pulse icon={AlertTriangle}>
              {criticalCount} Roda Butuh Tindakan Servis Segera!
            </Badge>
          ) : (
            <Badge variant="success" icon={CheckCircle2}>
              Seluruh roda dalam batas operasional aman
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

