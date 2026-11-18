// src/components/digitalTwin/wheelLayout/DualWheelPair.tsx
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/common";
import {
  checkDualWheelMating,
  type DualWheelMatingCheck,
} from "@/utils/tireCalculations";
import type { DualWheelPairProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import WheelItem from "../WheelItem";

/**
 * Komponen Pasangan Roda Ganda (Dual-Wheel Mating)
 * Menampilkan roda luar dan roda dalam beserta indikator selisih ketebalan jika ada ketimpangan
 */
export default function DualWheelPair({
  outerPos,
  innerPos,
  isRightSide = false,
  tireMap,
  getSlot,
  selectedPosition,
  onSlotClick,
}: DualWheelPairProps) {
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
            <WheelItem
              pos={innerPos}
              slot={getSlot(innerPos)}
              isSelected={selectedPosition === innerPos}
              onSlotClick={onSlotClick}
            />
            <WheelItem
              pos={outerPos}
              slot={getSlot(outerPos)}
              isSelected={selectedPosition === outerPos}
              onSlotClick={onSlotClick}
            />
          </>
        ) : (
          <>
            <WheelItem
              pos={outerPos}
              slot={getSlot(outerPos)}
              isSelected={selectedPosition === outerPos}
              onSlotClick={onSlotClick}
            />
            <WheelItem
              pos={innerPos}
              slot={getSlot(innerPos)}
              isSelected={selectedPosition === innerPos}
              onSlotClick={onSlotClick}
            />
          </>
        )}
      </div>

      {/* Indikator Peringatan Selisih Ketebalan Roda Ganda */}
      {matingCheck.isImbalanced && (
        <Badge
          variant="warning"
          pulse
          icon={AlertTriangle}
          title={matingCheck.warningMessage}
          className="text-[9px] font-black normal-case bg-amber-100 border-amber-300 text-amber-900 shadow-2xs">
          Ketimpangan {outerPos}-{innerPos}: Selisih {matingCheck.diffPercent}%
        </Badge>
      )}
    </div>
  );
}

