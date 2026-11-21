// src/components/digitalTwin/wheelLayout/TrailerChassisSection.tsx
import { Link2 } from "lucide-react";
import { WHEEL_LAYOUT_CONFIG } from "@/constants/truck/tireRules";
import type { TrailerChassisSectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import DualWheelPair from "./DualWheelPair";

/**
 * Komponen Bagian B: Sasis Trailer Kontainer & Kingpin Coupling
 * Menampilkan konektor kingpin, Sumbu 1, Sumbu 2, Sumbu 3 (opsional 18 ban), dan Bumper Pengaman
 */
export default function TrailerChassisSection({
  chassisType,
  tireMap,
  getSlot,
  selectedPosition,
  onSlotClick,
}: TrailerChassisSectionProps) {
  return (
    <>
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
              <DualWheelPair
                outerPos={WHEEL_LAYOUT_CONFIG.chassis.axle1.outerLeft}
                innerPos={WHEEL_LAYOUT_CONFIG.chassis.axle1.innerLeft}
                isRightSide={false}
                tireMap={tireMap}
                getSlot={getSlot}
                selectedPosition={selectedPosition}
                onSlotClick={onSlotClick}
              />

              <div className="flex-1 flex items-center justify-center relative">
                <div className="h-2.5 w-full bg-blue-300 rounded-full border border-blue-400 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-blue-600 border border-white" />
                </div>
                <span className="absolute -top-3.5 bg-blue-100 px-2 py-0.5 rounded text-[9px] font-black text-blue-900 border border-blue-200">
                  SUMBU 1 TRAILER
                </span>
              </div>

              <DualWheelPair
                outerPos={WHEEL_LAYOUT_CONFIG.chassis.axle1.outerRight}
                innerPos={WHEEL_LAYOUT_CONFIG.chassis.axle1.innerRight}
                isRightSide={true}
                tireMap={tireMap}
                getSlot={getSlot}
                selectedPosition={selectedPosition}
                onSlotClick={onSlotClick}
              />
            </div>
          </div>

          {/* Sumbu 2: Sasis Tengah (C7, C8 - C6, C5) */}
          <div>
            <p className="text-[10px] font-black text-center text-blue-800 uppercase mb-1.5">
              -- Sumbu 2 Trailer (Tengah C7,C8 - C6,C5) --
            </p>
            <div className="flex items-center justify-between gap-3 px-2">
              <DualWheelPair
                outerPos={WHEEL_LAYOUT_CONFIG.chassis.axle2.outerLeft}
                innerPos={WHEEL_LAYOUT_CONFIG.chassis.axle2.innerLeft}
                isRightSide={false}
                tireMap={tireMap}
                getSlot={getSlot}
                selectedPosition={selectedPosition}
                onSlotClick={onSlotClick}
              />

              <div className="flex-1 flex items-center justify-center relative">
                <div className="h-2.5 w-full bg-blue-300 rounded-full border border-blue-400 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-blue-600 border border-white" />
                </div>
                <span className="absolute -top-3.5 bg-blue-100 px-2 py-0.5 rounded text-[9px] font-black text-blue-900 border border-blue-200">
                  SUMBU 2 TRAILER
                </span>
              </div>

              <DualWheelPair
                outerPos={WHEEL_LAYOUT_CONFIG.chassis.axle2.outerRight}
                innerPos={WHEEL_LAYOUT_CONFIG.chassis.axle2.innerRight}
                isRightSide={true}
                tireMap={tireMap}
                getSlot={getSlot}
                selectedPosition={selectedPosition}
                onSlotClick={onSlotClick}
              />
            </div>
          </div>

          {/* Sumbu 3: Sasis Belakang (Khusus 18 Ban) */}
          {chassisType === "3_AXLE" && (
            <div className="animate-in fade-in duration-200">
              <p className="text-[10px] font-black text-center text-purple-800 uppercase mb-1.5">
                -- Sumbu 3 Trailer (Belakang C11,C12 - C10,C9) --
              </p>
              <div className="flex items-center justify-between gap-3 px-2">
                <DualWheelPair
                  outerPos={WHEEL_LAYOUT_CONFIG.chassis.axle3.outerLeft}
                  innerPos={WHEEL_LAYOUT_CONFIG.chassis.axle3.innerLeft}
                  isRightSide={false}
                  tireMap={tireMap}
                  getSlot={getSlot}
                  selectedPosition={selectedPosition}
                  onSlotClick={onSlotClick}
                />

                <div className="flex-1 flex items-center justify-center relative">
                  <div className="h-2.5 w-full bg-purple-300 rounded-full border border-purple-400 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-purple-600 border border-white" />
                  </div>
                  <span className="absolute -top-3.5 bg-purple-100 px-2 py-0.5 rounded text-[9px] font-black text-purple-900 border border-purple-200">
                    SUMBU 3 TRAILER
                  </span>
                </div>

                <DualWheelPair
                  outerPos={WHEEL_LAYOUT_CONFIG.chassis.axle3.outerRight}
                  innerPos={WHEEL_LAYOUT_CONFIG.chassis.axle3.innerRight}
                  isRightSide={true}
                  tireMap={tireMap}
                  getSlot={getSlot}
                  selectedPosition={selectedPosition}
                  onSlotClick={onSlotClick}
                />
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
    </>
  );
}

