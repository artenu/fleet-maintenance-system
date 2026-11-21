// src/hooks/useTireAnalytics.ts
import { useState, useMemo } from "react";
import type {
  AnalyticsSortBy,
  AnalyticsMetrics,
  BrandAnalyticsItem,
  UseTireAnalyticsProps,
  TruckCostAnalyticsItem,
  TruckCostSortBy,
} from "@/types/TireAnalyticsView/TireAnalyticsViewTypes";
import {
  INITIAL_BRAND_ANALYTICS,
  initialBrandAnalytics,
} from "@/constants/analyticsCPK";
import { BRAND_PROFILES, getBrandProfile } from "@/constants/truck/tireRules";
import { calculateCpk } from "@/utils/tireManagement/tireCalculations";

// Re-export untuk backward-compatibility
export { initialBrandAnalytics };

export function useTireAnalytics({
  truckList = [],
  warehouseTires = [],
}: UseTireAnalyticsProps = {}) {
  // Tab View State: Analisis Merk (CPK) vs Analisis Antar Truk
  const [activeTab, setActiveTab] = useState<"brand" | "truck">("brand");

  // Filter & Sort State untuk Merk
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<AnalyticsSortBy>("CPK_ASC");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter & Sort State untuk Truk
  const [truckSearchTerm, setTruckSearchTerm] = useState<string>("");
  const [truckSortBy, setTruckSortBy] = useState<TruckCostSortBy>("COST_DESC");

  // 1. Ekstraksi data ban aktif armada & hitung akumulasi KM riil per merk
  const dynamicBrandAnalytics: BrandAnalyticsItem[] = useMemo(() => {
    if (truckList.length === 0 && warehouseTires.length === 0) {
      return INITIAL_BRAND_ANALYTICS;
    }

    const activeTiresWithKm: Array<{ brand: string; kmRun: number }> = [];

    truckList.forEach((truck) => {
      truck.tires.forEach((tire) => {
        const kmRun = Math.max(0, truck.currentOdometer - tire.installOdometer);
        activeTiresWithKm.push({ brand: tire.brand, kmRun });
      });
    });

    return INITIAL_BRAND_ANALYTICS.map((brandItem) => {
      const matchingActiveTires = activeTiresWithKm.filter((t) => {
        return (
          t.brand.toLowerCase().includes(brandItem.brandName.toLowerCase()) ||
          brandItem.brandName.toLowerCase().includes(t.brand.toLowerCase())
        );
      });

      const activeSampleCount = matchingActiveTires.length;
      const activeTotalKm = matchingActiveTires.reduce((sum, item) => {
        return sum + item.kmRun;
      }, 0);

      const totalSamples = brandItem.testedSampleCount + activeSampleCount;
      const combinedTotalKm =
        brandItem.averageKmRun * brandItem.testedSampleCount + activeTotalKm;
      const averageKmRun =
        totalSamples > 0
          ? Math.round(combinedTotalKm / totalSamples)
          : brandItem.averageKmRun;

      const cpkValue = calculateCpk(brandItem.standardPrice, averageKmRun);

      let efficiencyRating: "EXCELLENT" | "GOOD" | "AVERAGE" = "GOOD";
      if (cpkValue <= 60) {
        efficiencyRating = "EXCELLENT";
      } else if (cpkValue > 80) {
        efficiencyRating = "AVERAGE";
      }

      return {
        ...brandItem,
        averageKmRun,
        cpkValue,
        testedSampleCount: totalSamples,
        efficiencyRating,
      };
    });
  }, [truckList, warehouseTires]);

  // 2. Filter & Sort tabel merk
  const filteredAndSortedList = useMemo(() => {
    let result = dynamicBrandAnalytics.filter((item) => {
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
  }, [dynamicBrandAnalytics, searchTerm, tierFilter, sortBy]);

  // 3. Analisis Biaya Operasional & Jam Terbang Per Unit Truk
  const { allTruckAnalytics, highestCostTruck, longestServiceLifeTruck } =
    useMemo(() => {
      if (truckList.length === 0) {
        return {
          allTruckAnalytics: [],
          highestCostTruck: null,
          longestServiceLifeTruck: null,
        };
      }

      const calculatedTrucks: TruckCostAnalyticsItem[] = truckList.map(
        (truck) => {
          let totalTireCost = 0;
          let totalTireKm = 0;

          truck.tires.forEach((tire) => {
            let price = tire.purchasePrice;
            if (!price) {
              if (tire.retreadStatus === "R2" || tire.retreadStatus === "R3") {
                price =
                  BRAND_PROFILES["Jasa Retread PT Boxer"]?.standardPrice ??
                  950000;
              } else if (tire.retreadStatus === "R1") {
                price =
                  BRAND_PROFILES["PT Boxer (Karet Medan)"]?.standardPrice ??
                  1700000;
              } else {
                price = getBrandProfile(tire.brand).standardPrice;
              }
            }
            totalTireCost += price;
            totalTireKm += Math.max(
              0,
              truck.currentOdometer - (tire.installOdometer || 0),
            );
          });

          const averageTireKmRun =
            truck.tires.length > 0
              ? Math.round(totalTireKm / truck.tires.length)
              : 0;
          const truckCpk =
            truck.currentOdometer > 0
              ? Math.round((totalTireCost / truck.currentOdometer) * 100) / 100
              : 0;

          return {
            id: truck.id,
            unitCode: truck.unitCode,
            plateNumber: truck.plateNumber,
            brand: truck.brand,
            driver: truck.driver,
            chassisType: truck.chassisType,
            capacity: truck.capacity,
            currentOdometer: truck.currentOdometer,
            totalTires: truck.tires.length,
            totalTireCost,
            averageTireKmRun,
            truckCpk,
          };
        },
      );

      // Cari unit dengan biaya tertinggi (hanya yang memiliki ban aktif)
      const sortedByCost = [...calculatedTrucks].sort((a, b) => {
        return b.totalTireCost - a.totalTireCost;
      });
      const topCost = sortedByCost[0] ?? null;

      // Cari unit dengan masa pakai / odometer terpanjang
      const sortedByOdo = [...calculatedTrucks].sort((a, b) => {
        return b.currentOdometer - a.currentOdometer;
      });
      const topOdo = sortedByOdo[0] ?? null;

      // Tandai flag isHighestCost & isLongestServiceLife
      const taggedTrucks = calculatedTrucks.map((t) => {
        return {
          ...t,
          isHighestCost: topCost ? t.id === topCost.id : false,
          isLongestServiceLife: topOdo ? t.id === topOdo.id : false,
        };
      });

      return {
        allTruckAnalytics: taggedTrucks,
        highestCostTruck: topCost,
        longestServiceLifeTruck: topOdo,
      };
    }, [truckList]);

  // Filter & Sort tabel truk
  const filteredAndSortedTrucks = useMemo(() => {
    let result = allTruckAnalytics.filter((truck) => {
      const q = truckSearchTerm.toLowerCase();
      return (
        truck.unitCode.toLowerCase().includes(q) ||
        truck.plateNumber.toLowerCase().includes(q) ||
        truck.driver.toLowerCase().includes(q) ||
        truck.brand.toLowerCase().includes(q)
      );
    });

    result = [...result].sort((a, b) => {
      if (truckSortBy === "COST_DESC") {
        return b.totalTireCost - a.totalTireCost;
      }
      if (truckSortBy === "ODO_DESC") {
        return b.currentOdometer - a.currentOdometer;
      }
      if (truckSortBy === "CPK_DESC") {
        return b.truckCpk - a.truckCpk;
      }
      if (truckSortBy === "UNIT_ASC") {
        return a.unitCode.localeCompare(b.unitCode);
      }
      return 0;
    });

    return result;
  }, [allTruckAnalytics, truckSearchTerm, truckSortBy]);

  // 4. Metrik Agregat KPI
  const metrics: AnalyticsMetrics = useMemo(() => {
    const totalSample = dynamicBrandAnalytics.reduce((acc, curr) => {
      return acc + curr.testedSampleCount;
    }, 0);

    const avgCpk =
      dynamicBrandAnalytics.length > 0
        ? Math.round(
            (dynamicBrandAnalytics.reduce((acc, curr) => {
              return acc + curr.cpkValue;
            }, 0) /
              dynamicBrandAnalytics.length) *
              10,
          ) / 10
        : 0;

    const sortedByCpk = [...dynamicBrandAnalytics].sort((a, b) => {
      return a.cpkValue - b.cpkValue;
    });
    const bestValueBrand = sortedByCpk[0] || {
      brandName: "-",
      cpkValue: 0,
    };

    const sortedByKm = [...dynamicBrandAnalytics].sort((a, b) => {
      return b.averageKmRun - a.averageKmRun;
    });
    const highestDurabilityBrand = sortedByKm[0] || {
      brandName: "-",
      averageKmRun: 0,
    };

    return {
      totalSample,
      avgCpk,
      bestValueBrandName: bestValueBrand.brandName,
      bestValueCpk: bestValueBrand.cpkValue,
      topMileageBrandName: highestDurabilityBrand.brandName,
      topMileageKm: highestDurabilityBrand.averageKmRun,
      highestCostTruck,
      longestServiceLifeTruck,
    };
  }, [dynamicBrandAnalytics, highestCostTruck, longestServiceLifeTruck]);

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    tierFilter,
    setTierFilter,
    sortBy,
    setSortBy,
    analyticsList: filteredAndSortedList,
    truckSearchTerm,
    setTruckSearchTerm,
    truckSortBy,
    setTruckSortBy,
    truckRankings: filteredAndSortedTrucks,
    highestCostTruck,
    longestServiceLifeTruck,
    metrics,
  };
}
