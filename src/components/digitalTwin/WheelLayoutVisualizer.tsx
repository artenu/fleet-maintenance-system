// src/components/digitalTwin/WheelLayoutVisualizer.tsx
import { useState, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Truck,
  ArrowUp,
  Link2,
} from "lucide-react";
import { WHEEL_LAYOUT_CONFIG } from "@/constants/truck/tireRules";
import {
  evaluateWheelSlot,
  checkDualWheelMating,
  type DualWheelMatingCheck,
} from "@/utils/tireCalculations";
import type {
  ChassisType,
  TireAsset,
  WheelPosition,
  WheelSlotEvaluation,
} from "@/types/truck/tires";
import type { WheelLayoutVisualizerProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import WheelItem from "./WheelItem";
import { Button, Badge } from "@/components/common";

/**
 * Komponen Visualisasi Tata Letak Roda & Denah Gandar Truk (Digital Twin)
 */
export default function WheelLayoutVisualizer({
  unitCode,
  plateNumber,
  currentOdometer,
  initialChassisType = "2_AXLE",
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

  const renderWheelItem = (pos: WheelPosition) => (
    <WheelItem
      key={pos}
      pos={pos}
      slot={getSlot(pos)}
      isSelected={selectedPosition === pos}
      onSlotClick={handleSlotClick}
    />
  );

  // Helper Pasangan Roda Ganda (Dual-Wheel Mating)
  const renderDualPair = (
    outerPos: WheelPosition,
    innerPos: WheelPosition,
    isRightSide: boolean = false,
  ) => {
    const outerTire = tireMap.get(outerPos) || null;
    const innerTire = tireMap.get(innerPos) || null;
    const matingCheck: DualWheelMatingCheck = checkDualWheelMating(
      outerTire,
      innerTire,
      outerPos,
      innerPos,
    );

    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-1.5">
          {isRightSide ? (
            <>
              {renderWheelItem(innerPos)}
              {renderWheelItem(outerPos)}
            </>
          ) : (
            <>
              {renderWheelItem(outerPos)}
              {renderWheelItem(innerPos)}
            </>
          )}
        </div>

        {/* Indikator Peringatan Selisih Ketebalan Roda Ganda */}
        {matingCheck.isImbalanced && (
          <span
            title={matingCheck.warningMessage}
            className="rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 text-[9px] font-black text-amber-900 flex items-center gap-1 shadow-2xs animate-pulse">
            <AlertTriangle size={11} className="text-amber-600 shrink-0" />
            Ketimpangan {outerPos}-{innerPos}: Selisih {matingCheck.diffPercent}%
          </span>
        )}
      </div>
    );
  };

  const totalTiresCount = chassisType === "2_AXLE" ? 14 : 18;

  // Hitung jumlah roda kritis (Memoized)
  const criticalCount = useMemo(() => {
    return Array.from(tireMap.values()).filter((t) => {
      const evalSlot = evaluateWheelSlot(t.currentPosition, t, currentOdometer);
      return (
        evalSlot.healthStatus === "CRITICAL" || evalSlot.ruleViolations.length > 0
      );
    }).length;
  }, [tireMap, currentOdometer]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-6">
      {/* 1. Header Toolbar & Sakelar 14 Ban vs 18 Ban */}
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
            • Total Ban:{" "}
            <strong className="text-slate-800">{totalTiresCount} Roda</strong>{" "}
            (+1 Serep)
          </p>
        </div>

        {/* Toggle Sasis 2 Sumbu vs 3 Sumbu */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">
            Pilihan Sasis:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold gap-1">
            <Button
              type="button"
              size="sm"
              variant={chassisType === "2_AXLE" ? "secondary" : "ghost"}
              onClick={() => setChassisType("2_AXLE")}>
              2 Sumbu (14 Ban)
            </Button>
            <Button
              type="button"
              size="sm"
              variant={chassisType === "3_AXLE" ? "secondary" : "ghost"}
              onClick={() => setChassisType("3_AXLE")}>
              3 Sumbu (18 Ban)
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Banner Indikator Ringkasan */}
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

      {/* 3. Denah Tata Letak Visual Fisik Roda (Wheel Layout) */}
      <div className="space-y-4 py-2">
        {/* ================= HEADER VISUAL MONCONG DEPAN TRUK ================= */}
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 text-[10px] font-black uppercase border-b border-slate-200 pb-2">
          <span className="text-slate-500 flex items-center gap-1 font-bold">
            ◀ SISI KIRI (PENUMPANG / KERNET)
          </span>
          <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shadow-2xs font-bold text-[10px]">
            <ArrowUp size={12} className="text-red-600 animate-bounce" />
            <span>ARAH DEPAN KABIN TRUK (FRONT)</span>
          </div>
          <span className="text-blue-700 flex items-center gap-1 font-black bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            SISI KANAN (SUPIR 🇮🇩) ▶
          </span>
        </div>

        {/* ================= BAGIAN A: KEPALA TRUK / HEAD ================= */}
        <div className="rounded-2xl border-2 border-slate-300 bg-slate-50/70 p-4 relative shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-1.5 rounded-full bg-red-600" />
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-800">
                A. Tractor Head (Kepala Penarik)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              Gandar 1 Steer (60.000 KM) • Gandar 2 Drive (25.000 KM)
            </span>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Gandar 1: Steer Depan (H2 - H1) */}
            <div>
              <p className="text-[10px] font-black text-center text-blue-700 uppercase mb-1.5 tracking-wide">
                -- Gandar 1: Kemudi Depan (Steer H2 - H1) --
              </p>
              <div className="flex items-center justify-between gap-4 px-2">
                {renderWheelItem(WHEEL_LAYOUT_CONFIG.head.steerAxle.left)}

                {/* Visual Batang Gandar Steer Mekanikal */}
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="h-2.5 w-full bg-slate-300 rounded-full border border-slate-400 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-slate-500 border-2 border-white shadow-xs" />
                  </div>
                  <span className="absolute -top-3.5 bg-slate-100 px-2 py-0.5 rounded text-[9px] font-black text-slate-600 border border-slate-300">
                    AS GANDAR KEMUDI
                  </span>
                </div>

                {renderWheelItem(WHEEL_LAYOUT_CONFIG.head.steerAxle.right)}
              </div>
            </div>

            {/* Gandar 2: Drive Penggerak Belakang (H5, H6 - H4, H3) */}
            <div>
              <p className="text-[10px] font-black text-center text-slate-600 uppercase mb-1.5 tracking-wide">
                -- Gandar 2: Penggerak Kepala (Drive Ganda H5,H6 - H4,H3) --
              </p>
              <div className="flex items-center justify-between gap-3 px-2">
                {renderDualPair(
                  WHEEL_LAYOUT_CONFIG.head.driveAxle.outerLeft,
                  WHEEL_LAYOUT_CONFIG.head.driveAxle.innerLeft,
                  false,
                )}

                {/* Visual Gardar / Differential Housing */}
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="h-3 w-full bg-slate-400 rounded-full border border-slate-500 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-slate-700 border-2 border-slate-300 flex items-center justify-center shadow-xs">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  </div>
                  <span className="absolute -top-3.5 bg-slate-100 px-2 py-0.5 rounded text-[9px] font-black text-slate-700 border border-slate-300">
                    GARDAR DIFFERENTIAL
                  </span>
                </div>

                {renderDualPair(
                  WHEEL_LAYOUT_CONFIG.head.driveAxle.outerRight,
                  WHEEL_LAYOUT_CONFIG.head.driveAxle.innerRight,
                  true,
                )}
              </div>
            </div>

            {/* Ban Serep (S1) */}
            <div className="pt-2 flex justify-center">
              <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-extrabold text-slate-600">
                  Keranjang Ban Serep:
                </span>
                {renderWheelItem(WHEEL_LAYOUT_CONFIG.head.spare)}
              </div>
            </div>
          </div>
        </div>

        {/* ================= PENGHUBUNG KINGPIN 5TH WHEEL COUPLING ================= */}
        <div className="max-w-2xl mx-auto flex items-center justify-center py-1">
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-blue-400 bg-blue-50/80 px-4 py-1.5 text-blue-900 font-extrabold text-xs shadow-2xs">
            <Link2 size={16} className="text-blue-600" />
            <span>COUPLING 5TH WHEEL & KINGPIN KONTENSIAL</span>
          </div>
        </div>

        {/* ================= BAGIAN B: SASIS TRAILER ================= */}
        <div className="rounded-2xl border-2 border-blue-300 bg-blue-50/25 p-4 relative shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-blue-200 pb-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-1.5 rounded-full bg-blue-600" />
              <h3 className="font-black text-xs uppercase tracking-wider text-blue-950">
                B. Sasis Trailer Kontainer (
                {chassisType === "2_AXLE"
                  ? "2 Sumbu / 8 Roda"
                  : "3 Sumbu / 12 Roda"}
                )
              </h3>
            </div>
            <span className="text-[11px] font-bold text-blue-700">
              Interval Standar: 25.000 KM per Gandar Trailer
            </span>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Sumbu 1: Sasis Depan (C3, C4 - C2, C1) */}
            <div>
              <p className="text-[10px] font-black text-center text-blue-800 uppercase mb-1.5">
                -- Sumbu 1 Trailer (Depan C3,C4 - C2,C1) --
              </p>
              <div className="flex items-center justify-between gap-3 px-2">
                {renderDualPair(
                  WHEEL_LAYOUT_CONFIG.chassis.axle1.outerLeft,
                  WHEEL_LAYOUT_CONFIG.chassis.axle1.innerLeft,
                  false,
                )}

                <div className="flex-1 flex items-center justify-center relative">
                  <div className="h-2.5 w-full bg-blue-300 rounded-full border border-blue-400 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-blue-600 border border-white" />
                  </div>
                  <span className="absolute -top-3.5 bg-blue-100 px-2 py-0.5 rounded text-[9px] font-black text-blue-900 border border-blue-200">
                    SUMBU 1 TRAILER
                  </span>
                </div>

                {renderDualPair(
                  WHEEL_LAYOUT_CONFIG.chassis.axle1.outerRight,
                  WHEEL_LAYOUT_CONFIG.chassis.axle1.innerRight,
                  true,
                )}
              </div>
            </div>

            {/* Sumbu 2: Sasis Tengah (C7, C8 - C6, C5) */}
            <div>
              <p className="text-[10px] font-black text-center text-blue-800 uppercase mb-1.5">
                -- Sumbu 2 Trailer (Tengah C7,C8 - C6,C5) --
              </p>
              <div className="flex items-center justify-between gap-3 px-2">
                {renderDualPair(
                  WHEEL_LAYOUT_CONFIG.chassis.axle2.outerLeft,
                  WHEEL_LAYOUT_CONFIG.chassis.axle2.innerLeft,
                  false,
                )}

                <div className="flex-1 flex items-center justify-center relative">
                  <div className="h-2.5 w-full bg-blue-300 rounded-full border border-blue-400 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-blue-600 border border-white" />
                  </div>
                  <span className="absolute -top-3.5 bg-blue-100 px-2 py-0.5 rounded text-[9px] font-black text-blue-900 border border-blue-200">
                    SUMBU 2 TRAILER
                  </span>
                </div>

                {renderDualPair(
                  WHEEL_LAYOUT_CONFIG.chassis.axle2.outerRight,
                  WHEEL_LAYOUT_CONFIG.chassis.axle2.innerRight,
                  true,
                )}
              </div>
            </div>

            {/* Sumbu 3: Sasis Belakang (Khusus 18 Ban) */}
            {chassisType === "3_AXLE" && (
              <div className="animate-in fade-in duration-200">
                <p className="text-[10px] font-black text-center text-purple-800 uppercase mb-1.5">
                  -- Sumbu 3 Trailer (Belakang C11,C12 - C10,C9) --
                </p>
                <div className="flex items-center justify-between gap-3 px-2">
                  {renderDualPair(
                    WHEEL_LAYOUT_CONFIG.chassis.axle3.outerLeft,
                    WHEEL_LAYOUT_CONFIG.chassis.axle3.innerLeft,
                    false,
                  )}

                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="h-2.5 w-full bg-purple-300 rounded-full border border-purple-400 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-purple-600 border border-white" />
                    </div>
                    <span className="absolute -top-3.5 bg-purple-100 px-2 py-0.5 rounded text-[9px] font-black text-purple-900 border border-purple-200">
                      SUMBU 3 TRAILER
                    </span>
                  </div>

                  {renderDualPair(
                    WHEEL_LAYOUT_CONFIG.chassis.axle3.outerRight,
                    WHEEL_LAYOUT_CONFIG.chassis.axle3.innerRight,
                    true,
                  )}
                </div>
              </div>
            )}

            {/* Bumper Pengaman Belakang Trailer (Safety Reflector Bar) */}
            <div className="pt-2 flex justify-center">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-1.5 text-white text-[10px] font-black tracking-widest shadow-xs">
                <span>🟨⬛🟨</span>
                <span>BUMPER PENGAMAN BELAKANG TRAILER</span>
                <span>🟨⬛🟨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

