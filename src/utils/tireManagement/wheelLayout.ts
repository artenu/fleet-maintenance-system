// src/utils/tireManagement/wheelLayout.ts
import { evaluateWheelSlot } from "./tireCalculations";
import type {
  ChassisType,
  TireAsset,
  WheelPosition,
  WheelSlotEvaluation,
} from "@/types/TireManagement/tires";

const HEAD_POSITIONS: WheelPosition[] = ["H1", "H2", "H3", "H4", "H5", "H6"];
const TRAILER_2_AXLE: WheelPosition[] = [
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
];
const TRAILER_3_AXLE: WheelPosition[] = [
  ...TRAILER_2_AXLE,
  "C9",
  "C10",
  "C11",
  "C12",
];

/**
 * Seluruh posisi roda gandar (tanpa ban serep S1)
 */
export const ALL_WHEEL_POSITIONS: WheelPosition[] = [
  ...HEAD_POSITIONS,
  ...TRAILER_3_AXLE,
];

/**
 * Daftar posisi roda aktif sesuai konfigurasi (Bobtail / 2 Sumbu / 3 Sumbu).
 * Ban serep (S1) sengaja tidak termasuk.
 */
export function getActiveWheelPositions(
  isBobTail: boolean,
  chassisType: ChassisType,
): WheelPosition[] {
  if (isBobTail) {
    return HEAD_POSITIONS;
  }
  if (chassisType === "3_AXLE") {
    return [...HEAD_POSITIONS, ...TRAILER_3_AXLE];
  }
  return [...HEAD_POSITIONS, ...TRAILER_2_AXLE];
}

/**
 * Ambil ban yang terpasang di posisi roda aktif saja
 */
export function getInstalledActiveTires(
  tires: TireAsset[],
  activePositions: WheelPosition[],
): TireAsset[] {
  const activeSet = new Set(activePositions);
  return tires.filter((t) => activeSet.has(t.currentPosition));
}

/**
 * Evaluasi slot roda aktif dan ambil yang berstatus KRITIS
 */
export function getCriticalSlots(
  tires: TireAsset[],
  activePositions: WheelPosition[],
  currentOdometer: number,
): WheelSlotEvaluation[] {
  return getInstalledActiveTires(tires, activePositions)
    .map((t) => evaluateWheelSlot(t.currentPosition, t, currentOdometer))
    .filter((slot) => slot.healthStatus === "CRITICAL");
}
