// src/types/TireAnalyticsView/TireAnalyticsViewTypes.ts
import type {
  BrandTier,
  TruckFleetTireItem,
  TireAsset,
} from "@/types/TireManagement/tires";

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
  highestCostTruck: TruckCostAnalyticsItem | null;
  longestServiceLifeTruck: TruckCostAnalyticsItem | null;
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

/**
 * Props untuk hook useTireAnalytics
 */
export interface UseTireAnalyticsProps {
  truckList?: TruckFleetTireItem[];
  warehouseTires?: TireAsset[];
}

/**
 * Props utama untuk tampilan TireAnalyticsView
 */
export interface TireAnalyticsViewProps {
  truckList?: TruckFleetTireItem[];
  warehouseTires?: TireAsset[];
}

/**
 * Data analitik biaya dan jam terbang untuk masing-masing unit truk
 */
export interface TruckCostAnalyticsItem {
  id: string;
  unitCode: string;
  plateNumber: string;
  brand: string;
  driver: string;
  chassisType: string;
  capacity: string;
  currentOdometer: number;
  totalTires: number;
  totalTireCost: number; // Total nilai aset ban aktif terpasang (Rp)
  averageTireKmRun: number; // Rata-rata KM pemakaian ban aktif
  truckCpk: number; // Estimasi biaya ban per KM tempuh (Rp/KM)
  isHighestCost?: boolean;
  isLongestServiceLife?: boolean;
}

/**
 * Pilihan pengurutan pada tabel analitik truk
 */
export type TruckCostSortBy =
  | "COST_DESC"
  | "ODO_DESC"
  | "CPK_DESC"
  | "UNIT_ASC";

/**
 * Prop interface untuk komponen TruckCostAnalyticsTable
 */
export interface TruckCostAnalyticsTableProps {
  truckRankings: TruckCostAnalyticsItem[];
  highestCostTruck: TruckCostAnalyticsItem | null;
  longestServiceLifeTruck: TruckCostAnalyticsItem | null;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  sortBy: TruckCostSortBy;
  onSortByChange: (sortBy: TruckCostSortBy) => void;
}
