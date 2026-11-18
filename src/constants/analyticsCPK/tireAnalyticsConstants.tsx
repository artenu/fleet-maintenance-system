// src/constants/analyticsCPK/tireAnalyticsConstants.tsx
import { Award, ShieldCheck, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/common";
import type { BadgeVariant } from "@/types/components/common/commonTypes";
import type { BrandTier } from "@/types/truck/tires";
import type { AnalyticsSortBy } from "@/types/TireAnalyticsView/TireAnalyticsViewTypes";

/**
 * Konfigurasi badge tingkatan kualitas brand (Tier)
 */
export interface CpkTierConfig {
  label: string;
  badgeVariant: BadgeVariant;
}

export const CPK_TIER_CONFIGS: Record<BrandTier | string, CpkTierConfig> = {
  TIER_1: {
    label: "Tier 1 (Premium)",
    badgeVariant: "info",
  },
  TIER_2: {
    label: "Tier 2 (Standard)",
    badgeVariant: "neutral",
  },
  TIER_3: {
    label: "Tier 3 (Budget)",
    badgeVariant: "warning",
  },
};

/**
 * Konfigurasi peringkat efisiensi CPK ban
 */
export interface CpkEfficiencyConfig {
  label: string;
  badgeVariant: BadgeVariant;
  icon?: LucideIcon;
}

export const CPK_EFFICIENCY_CONFIGS: Record<string, CpkEfficiencyConfig> = {
  EXCELLENT: {
    label: "Sangat Efisien",
    badgeVariant: "success",
    icon: Award,
  },
  GOOD: {
    label: "Optimal",
    badgeVariant: "info",
    icon: ShieldCheck,
  },
  AVERAGE: {
    label: "Standar",
    badgeVariant: "neutral",
  },
};

/**
 * Opsi dropdown filter tier ban
 */
export const CPK_TIER_FILTER_OPTIONS = [
  { value: "ALL", label: "Semua Tier" },
  { value: "TIER_1", label: "Tier 1 (Premium)" },
  { value: "TIER_2", label: "Tier 2 (Standard)" },
];

/**
 * Opsi dropdown pengurutan analitik CPK
 */
export const CPK_SORT_OPTIONS: Array<{
  value: AnalyticsSortBy;
  label: string;
}> = [
  { value: "CPK_ASC", label: "CPK Terendah (Paling Efisien)" },
  { value: "KM_DESC", label: "Jarak Tempuh Tertinggi" },
  { value: "PRICE_ASC", label: "Harga Pembelian Termurah" },
];

/**
 * Render komponen Badge untuk Tier ban
 */
export function getCPKTierBadge(tier: string) {
  const config = CPK_TIER_CONFIGS[tier] || CPK_TIER_CONFIGS.TIER_3;
  return <Badge variant={config.badgeVariant}>{config.label}</Badge>;
}

/**
 * Render komponen Badge untuk Peringkat Efisiensi CPK ban
 */
export function getCPKEfficiencyBadge(rating: string) {
  const config = CPK_EFFICIENCY_CONFIGS[rating] || CPK_EFFICIENCY_CONFIGS.AVERAGE;
  return (
    <Badge variant={config.badgeVariant} icon={config.icon}>
      {config.label}
    </Badge>
  );
}
