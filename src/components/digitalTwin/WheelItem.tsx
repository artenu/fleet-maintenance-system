// src/components/digitalTwin/WheelItem.tsx
import { HelpCircle, ShieldAlert } from "lucide-react";
import type { WheelItemProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import { Badge } from "@/components/common";

/**
 * Komponen Kartu Slot Roda Individual
 * Menampilkan status kesehatan, sisa KM, status vulkanisir, dan peringatan pelanggaran Golden Rule
 */
export default function WheelItem({
  pos,
  slot,
  isSelected,
  onSlotClick,
}: WheelItemProps) {
  const hasViolation = slot.ruleViolations.length > 0;
  const isSteer = pos === "H1" || pos === "H2";

  let bgStyle = "bg-emerald-50 border-emerald-300 text-emerald-950";
  let progressBg = "bg-emerald-500";

  if (slot.healthStatus === "CRITICAL" || hasViolation) {
    bgStyle =
      "bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/40 animate-pulse";
    progressBg = "bg-rose-600";
  } else if (slot.healthStatus === "WARNING") {
    bgStyle = "bg-amber-50 border-amber-300 text-amber-950";
    progressBg = "bg-amber-500";
  }

  if (!slot.tire) {
    bgStyle = "bg-slate-100 border-dashed border-slate-300 text-slate-400";
  }

  return (
    <div
      onClick={() => onSlotClick(slot)}
      className={`group relative flex flex-col justify-between p-2 rounded-xl border transition-all cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] ${bgStyle} ${
        isSelected ? "ring-2 ring-blue-600 border-blue-500 shadow-md" : ""
      } min-w-[100px] sm:min-w-[115px] h-[105px]`}>
      {/* Header Slot: Posisi & Badge Casing */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-xs tracking-wider text-slate-800">
            {pos}
          </span>
          {isSteer && (
            <Badge variant="info" className="px-1 py-0 text-[8px]">
              STEER
            </Badge>
          )}
        </div>

        {slot.tire ? (
          <Badge
            variant={
              slot.tire.retreadStatus === "R0"
                ? "info"
                : slot.tire.retreadStatus === "R1"
                  ? "warning"
                  : "danger"
            }
            className="px-1.5 py-0 text-[8px]">
            {slot.tire.retreadStatus}
          </Badge>
        ) : (
          <Badge variant="neutral" className="px-1.5 py-0 text-[8px]">
            KOSONG
          </Badge>
        )}
      </div>

      {/* Informasi Ban */}
      {slot.tire ? (
        <div className="my-1">
          <p className="font-bold text-[11px] truncate text-slate-900 leading-tight">
            {slot.tire.serialNumber}
          </p>
          <p className="text-[9px] text-slate-500 truncate">{slot.tire.brand}</p>
          <div className="flex items-center justify-between text-[9px] mt-1 font-medium text-slate-600">
            <span>Sisa: {slot.remainingKm.toLocaleString("id-ID")} KM</span>
            <span className="font-bold">{slot.tire.lastInspectionPercent}%</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center my-auto text-slate-400">
          <HelpCircle size={16} />
          <span className="text-[9px]">Belum Pasang</span>
        </div>
      )}

      {/* Progress Bar & Alarm Pelanggaran */}
      {slot.tire && (
        <div>
          {hasViolation ? (
            <div className="flex items-center gap-1 text-[9px] font-bold text-rose-700">
              <ShieldAlert size={11} />
              <span>Pelanggaran R0!</span>
            </div>
          ) : (
            <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressBg}`}
                style={{ width: `${slot.wearPercentage}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

