// src/components/digitalTwin/wheelLayout/TractorHeadSection.tsx
import { WHEEL_LAYOUT_CONFIG } from "@/constants/truck/tireRules";
import type { TractorHeadSectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import WheelItem from "../WheelItem";
import DualWheelPair from "./DualWheelPair";

/**
 * Komponen Bagian A: Kepala Truk / Tractor Head
 * Mencakup Gandar 1 (Kemudi Steer Depan H2 - H1), Gandar 2 (Penggerak Drive Ganda H5,H6 - H4,H3), dan Keranjang Ban Serep (S1)
 */
export default function TractorHeadSection({
  tireMap,
  getSlot,
  selectedPosition,
  onSlotClick,
}: TractorHeadSectionProps) {
  return (
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
            <WheelItem
              pos={WHEEL_LAYOUT_CONFIG.head.steerAxle.left}
              slot={getSlot(WHEEL_LAYOUT_CONFIG.head.steerAxle.left)}
              isSelected={
                selectedPosition === WHEEL_LAYOUT_CONFIG.head.steerAxle.left
              }
              onSlotClick={onSlotClick}
            />

            {/* Visual Batang Gandar Steer Mekanikal */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="h-2.5 w-full bg-slate-300 rounded-full border border-slate-400 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-slate-500 border-2 border-white shadow-xs" />
              </div>
              <span className="absolute -top-3.5 bg-slate-100 px-2 py-0.5 rounded text-[9px] font-black text-slate-600 border border-slate-300">
                AS GANDAR KEMUDI
              </span>
            </div>

            <WheelItem
              pos={WHEEL_LAYOUT_CONFIG.head.steerAxle.right}
              slot={getSlot(WHEEL_LAYOUT_CONFIG.head.steerAxle.right)}
              isSelected={
                selectedPosition === WHEEL_LAYOUT_CONFIG.head.steerAxle.right
              }
              onSlotClick={onSlotClick}
            />
          </div>
        </div>

        {/* Gandar 2: Drive Penggerak Belakang (H5, H6 - H4, H3) */}
        <div>
          <p className="text-[10px] font-black text-center text-slate-600 uppercase mb-1.5 tracking-wide">
            -- Gandar 2: Penggerak Kepala (Drive Ganda H5,H6 - H4,H3) --
          </p>
          <div className="flex items-center justify-between gap-3 px-2">
            <DualWheelPair
              outerPos={WHEEL_LAYOUT_CONFIG.head.driveAxle.outerLeft}
              innerPos={WHEEL_LAYOUT_CONFIG.head.driveAxle.innerLeft}
              isRightSide={false}
              tireMap={tireMap}
              getSlot={getSlot}
              selectedPosition={selectedPosition}
              onSlotClick={onSlotClick}
            />

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

            <DualWheelPair
              outerPos={WHEEL_LAYOUT_CONFIG.head.driveAxle.outerRight}
              innerPos={WHEEL_LAYOUT_CONFIG.head.driveAxle.innerRight}
              isRightSide={true}
              tireMap={tireMap}
              getSlot={getSlot}
              selectedPosition={selectedPosition}
              onSlotClick={onSlotClick}
            />
          </div>
        </div>

        {/* Ban Serep (S1) */}
        <div className="pt-2 flex justify-center">
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-extrabold text-slate-600">
              Keranjang Ban Serep:
            </span>
            <WheelItem
              pos={WHEEL_LAYOUT_CONFIG.head.spare}
              slot={getSlot(WHEEL_LAYOUT_CONFIG.head.spare)}
              isSelected={selectedPosition === WHEEL_LAYOUT_CONFIG.head.spare}
              onSlotClick={onSlotClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

