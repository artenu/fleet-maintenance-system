// src/constants/vehicleInspection/batteryConstants.ts
import type { ComponentConditionStatus } from "@/types/VehicleInspection";

export interface BatterySlotConfig {
  key: "battery1" | "battery2";
  title: string;
  slotLabel: "Aki 1" | "Aki 2";
  serialPlaceholder: string;
  notesPlaceholder: string;
}

/**
 * Konfigurasi slot 2 unit aki seri 24V (Aki 1 & Aki 2)
 */
export const BATTERY_SLOT_CONFIGS: BatterySlotConfig[] = [
  {
    key: "battery1",
    title: "Aki 1 (Kutub Positif Utama / Depan)",
    slotLabel: "Aki 1",
    serialPlaceholder: "cth: GS-2024-08991 (Anti-Tukar)",
    notesPlaceholder: "cth: Kepala kutub bersih, air aki pas",
  },
  {
    key: "battery2",
    title: "Aki 2 (Kutub Seri / Belakang)",
    slotLabel: "Aki 2",
    serialPlaceholder: "cth: GS-2024-08992 (Anti-Tukar)",
    notesPlaceholder: "cth: Baut klem kencang, tidak berkerak",
  },
];

/**
 * Helper class warna tombol status kondisi fisik aki
 */
export function getBatteryConditionColor(
  val: ComponentConditionStatus,
): string {
  if (val === "B") {
    return "bg-emerald-600 text-white shadow-xs";
  }
  if (val === "RM") {
    return "bg-amber-600 text-white shadow-xs";
  }
  return "bg-rose-600 text-white shadow-xs";
}
