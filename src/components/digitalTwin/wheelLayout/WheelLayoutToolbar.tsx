// src/components/digitalTwin/wheelLayout/WheelLayoutToolbar.tsx
import { Truck, Link2Off } from "lucide-react";
import { Badge } from "@/components/common";
import type { WheelLayoutToolbarProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

export default function WheelLayoutToolbar({
  unitCode,
  plateNumber,
  currentOdometer,
  totalTiresCount,
  chassisType,
  chassisLengthCategory,
  isBobTail = false,
}: WheelLayoutToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <div className="flex items-center gap-2">
          <Truck className="text-red-600" size={20} />
          <h2 className="text-base font-bold text-slate-900">
            Denah Interaktif Gandar Roda ({unitCode})
          </h2>
          <Badge variant="neutral">{plateNumber}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Odometer IoT:{" "}
          <strong className="text-slate-800">
            {currentOdometer.toLocaleString("id-ID")} KM
          </strong>{" "}
          • Total Ban Terpasang:{" "}
          <strong className="text-slate-800">{totalTiresCount} Roda</strong> (+1
          Serep)
        </p>
      </div>

      {/* Label Auto-Detect Panjang Sasis / Bobtail */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">
          Status Sasis:
        </span>
        {isBobTail ? (
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 border border-amber-200">
            <Link2Off size={13} className="text-amber-700" />
            <Badge variant="warning" className="text-xs font-black">
              BOBTAIL
            </Badge>
            <span className="text-xs font-bold text-amber-800">
              Tanpa Sasis (Hanya 6 Ban Kepala)
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200">
            <Badge variant="info" className="text-xs font-black">
              {chassisLengthCategory ||
                (chassisType === "3_AXLE" ? "40 FT" : "20 FT")}
            </Badge>
            <span className="text-xs font-bold text-slate-700">
              {chassisType === "3_AXLE"
                ? "3 Sumbu • 18 Ban"
                : "2 Sumbu • 14 Ban"}
            </span>
            <span className="rounded bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5">
              Auto-Detect
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
