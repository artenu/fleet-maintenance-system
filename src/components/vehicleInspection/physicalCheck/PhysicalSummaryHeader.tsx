// src/components/vehicleInspection/physicalCheck/PhysicalSummaryHeader.tsx
import {
  SlidersHorizontal,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Badge, Button } from "@/components/common";
import type { PhysicalSummaryHeaderProps } from "@/types/VehicleInspection";

/**
 * Sub-komponen header Seksi 2: Judul seksi, tombol "Setel Semua Baik", dan ringkasan badge status
 */
export default function PhysicalSummaryHeader({
  goodCount,
  defectCount,
  onSetAllGood,
}: PhysicalSummaryHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Title & Quick Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Seksi 2: Checklist 50 Komponen Fisik Unit
            </h3>
            <p className="text-[11px] text-slate-500">
              Cukup centang status kondisi komponen fisik truk & sasis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSetAllGood}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold">
            <CheckCheck size={14} className="mr-1.5 text-emerald-600" />
            Setel Semua Baik (Ceklis Semua)
          </Button>
        </div>
      </div>

      {/* Ringkasan Status Cepat (Badges) */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge variant="success" className="py-1 px-2.5 font-bold">
          <CheckCircle2 size={12} className="mr-1" /> Kondisi Baik: {goodCount}
        </Badge>
        {defectCount > 0 && (
          <Badge variant="danger" className="py-1 px-2.5 font-bold">
            <AlertTriangle size={12} className="mr-1" /> Ada Temuan/Cacat:{" "}
            {defectCount} Item
          </Badge>
        )}
      </div>
    </div>
  );
}
