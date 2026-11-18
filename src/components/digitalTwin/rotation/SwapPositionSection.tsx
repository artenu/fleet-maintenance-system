// src/components/digitalTwin/rotation/SwapPositionSection.tsx
import { Select } from "@/components/forms";
import type { WheelPosition } from "@/types/truck/tires";
import type { SwapPositionSectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Seksi form untuk Mode 1: Tukar Antar Roda Truk (Swap Position)
 */
export default function SwapPositionSection({
  targetPosition,
  onChangeTargetPosition,
  targetPositionOptions,
  targetTire,
  sourcePosition,
}: SwapPositionSectionProps) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-3">
      <Select
        label="Pilih Posisi Target Roda di Truk Ini:"
        value={targetPosition}
        onChange={(e) => onChangeTargetPosition(e.target.value as WheelPosition)}
        options={targetPositionOptions}
        required
      />

      {/* Preview Ban yang akan ditukar */}
      <div className="rounded-xl bg-white p-2.5 border border-slate-200 text-xs flex justify-between items-center shadow-2xs">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block">
            BAN DI POSISI TARGET ({targetPosition})
          </span>
          {targetTire ? (
            <strong className="text-slate-800 font-bold">
              {targetTire.serialNumber} • {targetTire.brand} (
              {targetTire.retreadStatus})
            </strong>
          ) : (
            <span className="text-slate-400 italic">
              (Slot kosong - tidak ada ban terpasang)
            </span>
          )}
        </div>
        <span className="text-[11px] text-blue-700 font-bold">
          Akan pindah ke {sourcePosition}
        </span>
      </div>
    </div>
  );
}

