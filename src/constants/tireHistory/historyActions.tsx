// src/constants/tireHistory/historyActions.tsx
import {
  RotateCw,
  PlusCircle,
  RefreshCw,
  Trash2,
  History,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/common";
import type { BadgeVariant } from "@/types/components/common/commonTypes";
import type { HistoryLogType } from "@/types/TireHistoryView/TireHistoryViewTypes";

/**
 * Metadata konfigurasi aksi riwayat mutasi ban
 */
export interface HistoryActionConfig {
  label: string;
  badgeVariant: BadgeVariant;
  icon: LucideIcon;
  iconColor: string;
}

/**
 * Kamus konfigurasi aksi riwayat mutasi ban
 */
export const HISTORY_ACTION_CONFIGS: Record<
  Exclude<HistoryLogType, "ALL">,
  HistoryActionConfig
> = {
  ROTASI_GANDAR: {
    label: "Rotasi Gandar",
    badgeVariant: "info",
    icon: RotateCw,
    iconColor: "text-blue-600",
  },
  GANTI_BARU: {
    label: "Pasang Baru (R0)",
    badgeVariant: "success",
    icon: PlusCircle,
    iconColor: "text-emerald-600",
  },
  VULKANISIR: {
    label: "Kirim Vulkanisir",
    badgeVariant: "warning",
    icon: RefreshCw,
    iconColor: "text-amber-600",
  },
  AFKIR: {
    label: "Afkir (Scrap)",
    badgeVariant: "danger",
    icon: Trash2,
    iconColor: "text-rose-600",
  },
};

/**
 * Konfigurasi fallback untuk aksi yang tidak dikenal
 */
export const DEFAULT_HISTORY_ACTION_CONFIG: HistoryActionConfig = {
  label: "Aksi Lainnya",
  badgeVariant: "neutral",
  icon: History,
  iconColor: "text-slate-600",
};

/**
 * Opsi dropdown filter jenis aksi riwayat mutasi ban
 */
export const HISTORY_TYPE_FILTER_OPTIONS: Array<{
  value: HistoryLogType;
  label: string;
}> = [
  { value: "ALL", label: "Semua Jenis Aksi" },
  { value: "ROTASI_GANDAR", label: "Rotasi Gandar" },
  { value: "GANTI_BARU", label: "Pasang Baru (R0)" },
  { value: "VULKANISIR", label: "Pengiriman Vulkanisir" },
  { value: "AFKIR", label: "Afkir Total (Scrap)" },
];

/**
 * Mengambil metadata konfigurasi aksi mutasi ban
 */
export function getHistoryActionConfig(
  type: HistoryLogType | string,
): HistoryActionConfig {
  if (type in HISTORY_ACTION_CONFIGS) {
    return HISTORY_ACTION_CONFIGS[type as Exclude<HistoryLogType, "ALL">];
  }
  return {
    ...DEFAULT_HISTORY_ACTION_CONFIG,
    label: type,
  };
}

/**
 * Render komponen Badge sesuai jenis aksi riwayat mutasi ban
 */
export function getHistoryActionBadge(type: HistoryLogType | string) {
  const config = getHistoryActionConfig(type);
  return <Badge variant={config.badgeVariant}>{config.label}</Badge>;
}

/**
 * Render ikon Lucide sesuai jenis aksi riwayat mutasi ban
 */
export function getHistoryActionIcon(
  type: HistoryLogType | string,
  size: number = 16,
) {
  const config = getHistoryActionConfig(type);
  const IconComponent = config.icon;
  return <IconComponent size={size} className={config.iconColor} />;
}

