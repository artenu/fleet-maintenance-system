// src/components/digitalTwin/rotation/SourceTireInfoCard.tsx
import { Badge } from "@/components/common";
import type { SourceTireInfoCardProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Kartu informasi ban asal / sumber yang akan dirotasi
 */
export default function SourceTireInfoCard({
  sourceTire,
}: SourceTireInfoCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 text-xs space-y-1.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
        BAN SUMBER (POSISI SAAT INI)
      </span>
      <div className="flex items-center justify-between">
        <div>
          <strong className="text-sm font-black text-slate-900">
            {sourceTire.serialNumber}
          </strong>
          <p className="text-slate-600">
            {sourceTire.brand} ({sourceTire.size}) • Fisik:{" "}
            <strong>{sourceTire.lastInspectionPercent}%</strong>
          </p>
        </div>
        <Badge variant={sourceTire.retreadStatus === "R0" ? "info" : "warning"}>
          {sourceTire.retreadStatus === "R0"
            ? "R0 (Baru)"
            : `${sourceTire.retreadStatus} (Vulkanisir)`}
        </Badge>
      </div>
    </div>
  );
}

