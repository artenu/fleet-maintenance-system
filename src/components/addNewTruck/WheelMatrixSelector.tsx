// src/components/addNewTruck/WheelMatrixSelector.tsx
import { CheckCircle2 } from "lucide-react";
import { Badge, Card, Button } from "@/components/common";
import type { WheelMatrixSelectorProps } from "@/types/AddNewTruckView/AddNewTruckViewTypes";

/**
 * Matriks pemilihan posisi roda (walkaround) dengan indikator pengisian
 */
export default function WheelMatrixSelector({
  unitCode,
  plateNumber,
  wheelPositions,
  activeSlot,
  onSelectSlot,
  completedWheelsCount,
  tiresData,
}: WheelMatrixSelectorProps) {
  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Pilih Roda untuk Pencatatan Fisik: Unit {unitCode} ({plateNumber})
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Sisi Kanan adalah{" "}
            <strong className="text-blue-700">Sisi Supir 🇮🇩</strong> • Sisi
            Kiri adalah <strong>Sisi Kernet</strong>
          </p>
        </div>

        <Badge variant="neutral">
          Kemajuan: <strong>{completedWheelsCount}</strong> dari{" "}
          {wheelPositions.length} Roda Terdata
        </Badge>
      </div>

      {/* Tombol Matriks Roda */}
      <div className="flex flex-wrap gap-2 pt-1">
        {wheelPositions.map((pos) => {
          const isSelected = activeSlot === pos;
          const data = tiresData[pos];
          const isFilled = Boolean(data && data.serialNumber.trim() !== "");

          return (
            <Button
              key={pos}
              type="button"
              size="sm"
              variant={isSelected ? "primary" : isFilled ? "outline" : "ghost"}
              icon={isFilled ? CheckCircle2 : undefined}
              iconPosition="right"
              onClick={() => onSelectSlot(pos)}
              className={`relative transition ${
                isSelected
                  ? "scale-105 shadow-md shadow-red-500/30 font-extrabold"
                  : isFilled
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}>
              <span>{pos}</span>
              {pos === "H1" && (
                <span className="text-[9px] opacity-80">(Supir)</span>
              )}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}

