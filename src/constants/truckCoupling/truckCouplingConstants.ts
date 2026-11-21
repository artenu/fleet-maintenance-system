// src/constants/truckCoupling/truckCouplingConstants.ts
import type { CouplingFilterTab } from "@/types/TruckCouplingView/TruckCouplingViewTypes";

/**
 * Pilihan opsi mekanisme penguncian kingpin 5th wheel
 */
export const LOCKING_MECHANISM_OPTIONS = [
  {
    value: "STANDARD",
    label: "Mekanisme Standar (Tuas Pengunci Manual)",
  },
  {
    value: "PNEUMATIC",
    label: "Pneumatic Auto-Lock (Otomatis)",
  },
  {
    value: "MANUAL_PIN",
    label: "Pin Ganda Manual Safety",
  },
];

/**
 * Opsi tab filter perangkaian armada (Drop & Hook)
 */
export const COUPLING_FILTER_TAB_OPTIONS: Array<{
  value: CouplingFilterTab;
  label: string;
}> = [
  { value: "ALL", label: "Semua Kepala Truk" },
  { value: "COUPLED", label: "Tergandeng Sasis" },
  { value: "BOBTAIL", label: "Bobtail (Tanpa Sasis)" },
];

