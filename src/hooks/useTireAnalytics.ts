// src/hooks/useTireAnalytics.ts
import { useState, useMemo } from "react";
import { BRAND_PROFILES } from "@/constants/truck/tireRules";
import { calculateCpk } from "@/utils/tireCalculations";
import type {
  BrandAnalyticsItem,
  AnalyticsSortBy,
  AnalyticsMetrics,
} from "@/types/TireAnalyticsView/TireAnalyticsViewTypes";

// Data historis performa merk di operasional PT ALN
const initialBrandAnalytics: BrandAnalyticsItem[] = [
  {
    id: "ANL-001",
    brandName: "Super Grip / MI RFD",
    tier: "TIER_1",
    standardPrice: BRAND_PROFILES["Super Grip / MI RFD"]?.standardPrice ?? 3650000,
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
    standardPrice: BRAND_PROFILES["PT Boxer (Karet Medan)"]?.standardPrice ?? 1700000,
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
    standardPrice: BRAND_PROFILES["Jasa Retread PT Boxer"]?.standardPrice ?? 950000,
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

export function useTireAnalytics() {
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<AnalyticsSortBy>("CPK_ASC");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredAndSortedList = useMemo(() => {
    let result = initialBrandAnalytics.filter((item) => {
      const matchesSearch = item.brandName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTier =
        tierFilter === "ALL" ? true : item.tier === tierFilter;
      return matchesSearch && matchesTier;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "CPK_ASC") {
        return a.cpkValue - b.cpkValue;
      }
      if (sortBy === "KM_DESC") {
        return b.averageKmRun - a.averageKmRun;
      }
      if (sortBy === "PRICE_ASC") {
        return a.standardPrice - b.standardPrice;
      }
      return 0;
    });

    return result;
  }, [searchTerm, tierFilter, sortBy]);

  // Metrik Agregat CPK
  const metrics: AnalyticsMetrics = useMemo(() => {
    const totalSample = initialBrandAnalytics.reduce(
      (acc, curr) => acc + curr.testedSampleCount,
      0,
    );
    const avgCpk =
      Math.round(
        (initialBrandAnalytics.reduce((acc, curr) => acc + curr.cpkValue, 0) /
          initialBrandAnalytics.length) *
          10,
      ) / 10;

    const bestValueBrand = [...initialBrandAnalytics].sort(
      (a, b) => a.cpkValue - b.cpkValue,
    )[0];

    const highestDurabilityBrand = [...initialBrandAnalytics].sort(
      (a, b) => b.averageKmRun - a.averageKmRun,
    )[0];

    return {
      totalSample,
      avgCpk,
      bestValueBrandName: bestValueBrand.brandName,
      bestValueCpk: bestValueBrand.cpkValue,
      topMileageBrandName: highestDurabilityBrand.brandName,
      topMileageKm: highestDurabilityBrand.averageKmRun,
    };
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    tierFilter,
    setTierFilter,
    sortBy,
    setSortBy,
    analyticsList: filteredAndSortedList,
    metrics,
  };
}

