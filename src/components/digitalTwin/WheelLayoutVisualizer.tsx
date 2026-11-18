// src/components/digitalTwin/WheelLayoutVisualizer.tsx
import { useState, useMemo } from "react";
import { evaluateWheelSlot } from "@/utils/tireCalculations";
import type {
  ChassisType,
  TireAsset,
  WheelPosition,
  WheelSlotEvaluation,
} from "@/types/truck/tires";
import type { WheelLayoutVisualizerProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import { Card } from "@/components/common";
import {
  WheelLayoutToolbar,
  WheelLayoutSummaryBanner,
  TruckCabinIndicator,
  TractorHeadSection,
  TrailerChassisSection,
} from "./wheelLayout";
import { Link2Off } from "lucide-react";

/**
 * Komponen Visualisasi Tata Letak Roda & Denah Gandar Truk (Digital Twin)
 * Mengorkestrasi toolbar gandar, ringkasan kesehatan ban, orientasi kabin, tractor head, dan sasis trailer
 */
export default function WheelLayoutVisualizer({
  unitCode,
  plateNumber,
  currentOdometer,
  initialChassisType = "2_AXLE",
  chassisLengthCategory,
  isBobTail = false,
  tires,
  onSelectSlot,
}: WheelLayoutVisualizerProps) {
  const [chassisType, setChassisType] =
    useState<ChassisType>(initialChassisType);
  const [selectedPosition, setSelectedPosition] =
    useState<WheelPosition | null>(null);

  // Map posisi ke ban terpasang (Memoized)
  const tireMap = useMemo(() => {
    const map = new Map<WheelPosition, TireAsset>();
    tires.forEach((t) => map.set(t.currentPosition, t));
    return map;
  }, [tires]);

  const getSlot = (pos: WheelPosition): WheelSlotEvaluation => {
    const tire = tireMap.get(pos) || null;
    return evaluateWheelSlot(pos, tire, currentOdometer);
  };

  const handleSlotClick = (slot: WheelSlotEvaluation) => {
    setSelectedPosition(slot.position);
    if (onSelectSlot) {
      onSelectSlot(slot);
    }
  };

  const totalTiresCount = isBobTail ? 6 : chassisType === "2_AXLE" ? 14 : 18;

  // Hitung jumlah roda kritis (Memoized)
  const criticalCount = useMemo(() => {
    return Array.from(tireMap.values()).filter((t) => {
      const evalSlot = evaluateWheelSlot(t.currentPosition, t, currentOdometer);
      return (
        evalSlot.healthStatus === "CRITICAL" ||
        evalSlot.ruleViolations.length > 0
      );
    }).length;
  }, [tireMap, currentOdometer]);

  return (
    <Card className="space-y-6">
      {/* 1. Header Toolbar & Sakelar Sasis */}
      <WheelLayoutToolbar
        unitCode={unitCode}
        plateNumber={plateNumber}
        currentOdometer={currentOdometer}
        totalTiresCount={totalTiresCount}
        chassisType={chassisType}
        chassisLengthCategory={chassisLengthCategory}
        isBobTail={isBobTail}
        onChangeChassisType={setChassisType}
      />

      {/* 2. Banner Indikator Ringkasan Kesehatan */}
      <WheelLayoutSummaryBanner criticalCount={criticalCount} />

      {/* 3. Denah Tata Letak Visual Fisik Roda */}
      <div className="space-y-4 py-2">
        <TruckCabinIndicator />

        {/* Bagian A: Tractor Head (Kepala Penarik) */}
        <TractorHeadSection
          tireMap={tireMap}
          getSlot={getSlot}
          selectedPosition={selectedPosition}
          onSlotClick={handleSlotClick}
        />

        {/* Bagian B: Sasis Trailer Kontainer ATAU Bobtail Placeholder */}
        {isBobTail ? (
          <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/40 p-6 text-center animate-in fade-in duration-200">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-700 shadow-2xs">
                <Link2Off size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-amber-900">
                  Sasis Trailer Tidak Terpasang (Status Bobtail)
                </p>
                <p className="text-[11px] text-amber-700 max-w-md mt-0.5">
                  Truk sedang beroperasi tanpa gandengan sasis (hanya 6 roda
                  kepala penarik: H1–H6). Silakan pasangkan sasis di menu{" "}
                  <strong>Perangkaian Sasis (Coupling)</strong> untuk
                  menambahkan roda trailer.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <TrailerChassisSection
            chassisType={chassisType}
            tireMap={tireMap}
            getSlot={getSlot}
            selectedPosition={selectedPosition}
            onSlotClick={handleSlotClick}
          />
        )}
      </div>
    </Card>
  );
}
