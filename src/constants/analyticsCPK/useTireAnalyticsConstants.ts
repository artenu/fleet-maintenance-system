// src/constants/analyticsCPK/useTireAnalyticsConstants.ts
import { BRAND_PROFILES } from "@/constants/truck/tireRules";
import { calculateCpk } from "@/utils/tireManagement/tireCalculations";
import type { BrandAnalyticsItem } from "@/types/TireAnalyticsView/TireAnalyticsViewTypes";

/**
 * Data historis acuan performa durabilitas dan CPK merk ban di armada PT ALN
 */
export const INITIAL_BRAND_ANALYTICS: BrandAnalyticsItem[] = [
  {
    id: "ANL-001",
    brandName: "Super Grip / MI RFD",
    tier: "TIER_1",
    standardPrice:
      BRAND_PROFILES["Super Grip / MI RFD"]?.standardPrice ?? 3650000,
    averageKmRun: 68500,
    cpkValue: calculateCpk(3650000, 68500),
    testedSampleCount: 24,
    recommendedAxle: "Steer (H1, H2) & Drive",
    efficiencyRating: "EXCELLENT",
  },
  {
    id: "ANL-002",
    brandName: "Bridgestone",
    tier: "TIER_1",
    standardPrice: BRAND_PROFILES.Bridgestone?.standardPrice ?? 3650000,
    averageKmRun: 66000,
    cpkValue: calculateCpk(3650000, 66000),
    testedSampleCount: 18,
    recommendedAxle: "Steer (H1, H2)",
    efficiencyRating: "EXCELLENT",
  },
  {
    id: "ANL-003",
    brandName: "Michelin",
    tier: "TIER_1",
    standardPrice: BRAND_PROFILES.Michelin?.standardPrice ?? 3850000,
    averageKmRun: 71200,
    cpkValue: calculateCpk(3850000, 71200),
    testedSampleCount: 12,
    recommendedAxle: "Steer (H1, H2)",
    efficiencyRating: "EXCELLENT",
  },
  {
    id: "ANL-004",
    brandName: "PT Boxer (Karet Medan)",
    tier: "TIER_2",
    standardPrice:
      BRAND_PROFILES["PT Boxer (Karet Medan)"]?.standardPrice ?? 1700000,
    averageKmRun: 29500,
    cpkValue: calculateCpk(1700000, 29500),
    testedSampleCount: 36,
    recommendedAxle: "Trailer (C1 - C12)",
    efficiencyRating: "GOOD",
  },
  {
    id: "ANL-005",
    brandName: "Jasa Retread PT Boxer",
    tier: "TIER_2",
    standardPrice:
      BRAND_PROFILES["Jasa Retread PT Boxer"]?.standardPrice ?? 950000,
    averageKmRun: 26000,
    cpkValue: calculateCpk(950000, 26000),
    testedSampleCount: 42,
    recommendedAxle: "Drive (H3 - H6) & Trailer",
    efficiencyRating: "EXCELLENT",
  },
  {
    id: "ANL-006",
    brandName: "Gajah Tunggal",
    tier: "TIER_2",
    standardPrice: BRAND_PROFILES["Gajah Tunggal"]?.standardPrice ?? 2750000,
    averageKmRun: 49000,
    cpkValue: calculateCpk(2750000, 49000),
    testedSampleCount: 16,
    recommendedAxle: "Drive & Trailer",
    efficiencyRating: "GOOD",
  },
  {
    id: "ANL-007",
    brandName: "Giti",
    tier: "TIER_2",
    standardPrice: BRAND_PROFILES.Giti?.standardPrice ?? 2800000,
    averageKmRun: 47500,
    cpkValue: calculateCpk(2800000, 47500),
    testedSampleCount: 14,
    recommendedAxle: "Drive & Trailer",
    efficiencyRating: "AVERAGE",
  },
];

// Alias untuk backward compatibility
export const initialBrandAnalytics = INITIAL_BRAND_ANALYTICS;
