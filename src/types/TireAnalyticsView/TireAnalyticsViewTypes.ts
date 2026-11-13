// src/types/TireAnalyticsView/TireAnalyticsViewTypes.ts
import type { BrandTier } from "@/types/truck/tires";

/**
 * Item data analitik performa dan CPK suatu merk ban
 */
export interface BrandAnalyticsItem {
  id: string;
  brandName: string;
  tier: BrandTier;
  standardPrice: number;
  averageKmRun: number;
  cpkValue: number; // Cost-Per-Kilometer (Rp / KM)
  testedSampleCount: number;
  recommendedAxle: string;
  efficiencyRating: "EXCELLENT" | "GOOD" | "AVERAGE";
}

/**
 * Pilihan pengurutan pada tabel analitik CPK
 */
export type AnalyticsSortBy = "CPK_ASC" | "KM_DESC" | "PRICE_ASC";

/**
 * Metrik agregat analitik performa dan ROI ban
 */
export interface AnalyticsMetrics {
  totalSample: number;
  avgCpk: number;
  bestValueBrandName: string;
  bestValueCpk: number;
  topMileageBrandName: string;
  topMileageKm: number;
}

/**
 * Prop interface untuk komponen TireAnalyticsTable di components/analyticsCPK
 */
export interface TireAnalyticsTableProps {
  analyticsList: BrandAnalyticsItem[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  tierFilter: string;
  onTierFilterChange: (tier: string) => void;
  sortBy: AnalyticsSortBy;
  onSortByChange: (sortBy: AnalyticsSortBy) => void;
}

