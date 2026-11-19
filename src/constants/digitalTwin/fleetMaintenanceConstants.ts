// src/constants/digitalTwin/fleetMaintenanceConstants.ts
import type { WheelPosition } from "@/types/TireManagement/tires";

/**
 * Urutan standar posisi roda untuk inspeksi fisik surveyor (Rapid Inspection Flow)
 */
export const BASE_AUDIT_SEQUENCE: WheelPosition[] = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "S1",
];

export const THREE_AXLE_EXTRA_AUDIT_POSITIONS: WheelPosition[] = [
  "C9",
  "C10",
  "C11",
  "C12",
];

/**
 * Mendapatkan urutan posisi inspeksi ban berdasarkan konfigurasi sasis
 */
export function getAuditSequence(chassisType?: string): WheelPosition[] {
  if (chassisType === "3_AXLE") {
    return [
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "C1",
      "C2",
      "C3",
      "C4",
      "C5",
      "C6",
      "C7",
      "C8",
      ...THREE_AXLE_EXTRA_AUDIT_POSITIONS,
      "S1",
    ];
  }
  return BASE_AUDIT_SEQUENCE;
}

/**
 * Jumlah roda standar berdasarkan tipe unit
 */
export const EXPECTED_TIRE_COUNTS = {
  BOBTAIL: 6,
  TWO_AXLE: 14,
  THREE_AXLE: 18,
} as const;
