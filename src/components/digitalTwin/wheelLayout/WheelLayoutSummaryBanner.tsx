// src/components/digitalTwin/wheelLayout/WheelLayoutSummaryBanner.tsx
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/common";
import type { WheelLayoutSummaryBannerProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Banner ringkasan status kesehatan seluruh roda armada
 */
export default function WheelLayoutSummaryBanner({
  criticalCount,
}: WheelLayoutSummaryBannerProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Prima
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Perhatian
            (&ge;80% KM)
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />{" "}
            Kritis (&ge;100% / &lt;40% Fisik)
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
  );
}

