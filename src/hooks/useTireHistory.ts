// src/hooks/useTireHistory.ts
import { useState, useMemo } from "react";
import type {
  HistoryLogType,
  HistoryMetrics,
} from "@/types/TireHistoryView/TireHistoryViewTypes";
import {
  INITIAL_HISTORY_LOGS,
  initialHistoryLogs,
} from "@/constants/tireHistory";

// Re-export untuk backward-compatibility
export { initialHistoryLogs };

export function useTireHistory() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<HistoryLogType>("ALL");

  const filteredLogs = useMemo(() => {
    return INITIAL_HISTORY_LOGS.filter((log) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        log.truck.toLowerCase().includes(query) ||
        log.desc.toLowerCase().includes(query) ||
        log.pic.toLowerCase().includes(query);

      const matchesFilter =
        typeFilter === "ALL" ? true : log.type === typeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, typeFilter]);

  const metrics: HistoryMetrics = useMemo(() => {
    return {
      totalLogs: INITIAL_HISTORY_LOGS.length,
      rotationCount: INITIAL_HISTORY_LOGS.filter(
        (l) => l.type === "ROTASI_GANDAR",
      ).length,
      newInstallCount: INITIAL_HISTORY_LOGS.filter(
        (l) => l.type === "GANTI_BARU",
      ).length,
      retreadCount: INITIAL_HISTORY_LOGS.filter((l) => l.type === "VULKANISIR")
        .length,
      scrapCount: INITIAL_HISTORY_LOGS.filter((l) => l.type === "AFKIR").length,
    };
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    filteredLogs,
    metrics,
  };
}
