// src/hooks/useFleetHealthDashboard.ts
import { useState, useMemo } from "react";
import type {
  UseFleetHealthDashboardProps,
  UseFleetHealthDashboardReturn,
  FleetFilterTab,
  FleetAnalysisItem,
} from "@/types/FleetHealthDashboardView/FleetHealthDashboardViewTypes";
import {
  calculateFleetAnalysis,
  filterFleetAnalysis,
  calculateFleetSummaryStats,
} from "@/utils/dashboard";

/**
 * Custom hook untuk mengelola state dan kalkulasi data Executive Fleet Health Dashboard
 */
export function useFleetHealthDashboard({
  truckList,
  chassisList,
}: UseFleetHealthDashboardProps): UseFleetHealthDashboardReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FleetFilterTab>("ALL");

  // 1. Kalkulasi analisis kelaikan seluruh armada
  const fleetAnalysis: FleetAnalysisItem[] = useMemo(() => {
    return calculateFleetAnalysis(truckList, chassisList);
  }, [truckList, chassisList]);

  // 2. Statistik Ringkasan Global Pool
  const stats = useMemo(() => {
    return calculateFleetSummaryStats(
      fleetAnalysis,
      truckList.length,
      chassisList,
    );
  }, [fleetAnalysis, truckList.length, chassisList]);

  // 3. Filter Data Tabel berdasarkan search & status tab
  const filteredAnalysis = useMemo(() => {
    return filterFleetAnalysis(fleetAnalysis, searchQuery, statusFilter);
  }, [fleetAnalysis, searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    fleetAnalysis,
    filteredAnalysis,
    stats,
  };
}

