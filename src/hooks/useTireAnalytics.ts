// src/hooks/useTireAnalytics.ts
import { useState, useMemo } from "react";
import type {
  AnalyticsSortBy,
  AnalyticsMetrics,
} from "@/types/TireAnalyticsView/TireAnalyticsViewTypes";
import {
  INITIAL_BRAND_ANALYTICS,
  initialBrandAnalytics,
} from "@/constants/analyticsCPK";

// Re-export untuk backward-compatibility
export { initialBrandAnalytics };

export function useTireAnalytics() {
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<AnalyticsSortBy>("CPK_ASC");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredAndSortedList = useMemo(() => {
    let result = INITIAL_BRAND_ANALYTICS.filter((item) => {
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
    const totalSample = INITIAL_BRAND_ANALYTICS.reduce(
      (acc, curr) => acc + curr.testedSampleCount,
      0,
    );
    const avgCpk =
      Math.round(
        (INITIAL_BRAND_ANALYTICS.reduce((acc, curr) => acc + curr.cpkValue, 0) /
          INITIAL_BRAND_ANALYTICS.length) *
          10,
      ) / 10;

    const bestValueBrand = [...INITIAL_BRAND_ANALYTICS].sort(
      (a, b) => a.cpkValue - b.cpkValue,
    )[0];

    const highestDurabilityBrand = [...INITIAL_BRAND_ANALYTICS].sort(
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
