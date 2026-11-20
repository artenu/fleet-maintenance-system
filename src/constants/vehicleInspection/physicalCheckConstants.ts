// src/constants/vehicleInspection/physicalCheckConstants.ts
import type { PhysicalSectionFilter } from "@/types/VehicleInspection";

export interface PhysicalSectionTabItem {
  id: PhysicalSectionFilter;
  label: string;
}

/**
 * Tab navigasi filter 50 komponen fisik unit truk & sasis
 */
export const PHYSICAL_SECTION_TABS: PhysicalSectionTabItem[] = [
  { id: "ALL", label: "Semua Komponen" },
  { id: "FRONT", label: "Wajah Depan" },
  { id: "RIGHT_SIDE", label: "Sisi Kanan Supir 🇮🇩" },
  { id: "LEFT_SIDE", label: "Sisi Kiri Kenek" },
  { id: "CABIN", label: "Kabin & Interior" },
  { id: "LIGHTS", label: "Lampu & Kelistrikan" },
  { id: "CHASSIS", label: "Sasis & Gandar" },
];

// Alias untuk backward compatibility
export const SECTION_TABS = PHYSICAL_SECTION_TABS;
