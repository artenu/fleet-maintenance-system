// src/constants/tireInventory/tireInventoryConstants.tsx
import { Badge } from "@/components/common";
import type { BadgeVariant } from "@/types/components/common/commonTypes";
import type { RetreadStatus } from "@/types/truck/tires";
import type { RetreadFilterType } from "@/types/TireInventoryView/TireInventoryViewTypes";

export interface TireCasingConfig {
  label: string;
  badgeVariant: BadgeVariant;
}

export const TIRE_CASING_STATUS_CONFIGS: Record<string, TireCasingConfig> = {
  R0: {
    label: "R0 (Baru)",
    badgeVariant: "info",
  },
  R1: {
    label: "R1 (Vulkanisir 1x)",
    badgeVariant: "warning",
  },
  R2: {
    label: "R2 (Vulkanisir 2x)",
    badgeVariant: "warning",
  },
  R3: {
    label: "R3 (Batas Akhir)",
    badgeVariant: "danger",
  },
  SCRAP: {
    label: "Afkir",
    badgeVariant: "danger",
  },
};

export const TIRE_INVENTORY_FILTER_OPTIONS: Array<{
  value: RetreadFilterType;
  label: string;
}> = [
  { value: "ALL", label: "Semua Casing" },
  { value: "R0", label: "Hanya R0 (Baru)" },
  { value: "RETREAD", label: "Vulkanisir (R1-R3)" },
  { value: "R1", label: "Vulkanisir R1" },
  { value: "R2", label: "Vulkanisir R2" },
  { value: "R3", label: "Vulkanisir R3" },
];

export const TIRE_SIZE_OPTIONS = [
  { value: "10.00-20 16PR", label: "10.00-20 16PR (Standar Truk)" },
  { value: "1000 R20", label: "1000 R20 (Radial)" },
  { value: "11R22.5", label: "11R22.5 (Tubeless)" },
];

export const RETREAD_CASING_RECEIVE_OPTIONS: Array<{
  value: RetreadStatus;
  label: string;
}> = [
  { value: "R1", label: "R1 (Vulkanisir ke-1)" },
  { value: "R2", label: "R2 (Vulkanisir ke-2)" },
  { value: "R3", label: "R3 (Vulkanisir ke-3 - Batas Maksimal)" },
];

/**
 * Render komponen Badge untuk status siklus casing vulkanisir
 */
export function getTireCasingBadge(status: RetreadStatus | string) {
  const config =
    TIRE_CASING_STATUS_CONFIGS[status] || TIRE_CASING_STATUS_CONFIGS.SCRAP;
  return <Badge variant={config.badgeVariant}>{config.label}</Badge>;
}

