// src/hooks/useTireHistory.ts
import { useState, useMemo } from "react";
import type {
  HistoryLogItem,
  HistoryLogType,
  HistoryMetrics,
} from "@/types/TireHistoryView/TireHistoryViewTypes";
import {
  INITIAL_HISTORY_LOGS,
  initialHistoryLogs,
} from "@/constants/tireHistory";

// Re-export untuk backward-compatibility
export { initialHistoryLogs };

export function useTireHistory(externalLogs?: HistoryLogItem[]) {
  // 1. State internal (jika hook digunakan secara mandiri tanpa props external)
  const [internalLogs, setInternalLogs] =
    useState<HistoryLogItem[]>(INITIAL_HISTORY_LOGS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<HistoryLogType>("ALL");

  // Jika parent meneruskan logs external, prioritaskan data tersebut
  const logs = externalLogs !== undefined ? externalLogs : internalLogs;

  // 2. Fungsi menambahkan catatan riwayat audit trail baru
  const appendHistoryLog = (
    truck: string,
    desc: string,
    type: "ROTASI_GANDAR" | "GANTI_BARU" | "VULKANISIR" | "AFKIR",
    pic: string = "Budi Santoso (Surveyor)",
  ) => {
    const formattedDate = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

    const newLog: HistoryLogItem = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      date: formattedDate,
      truck,
      desc,
      pic,
      type,
    };

    setInternalLogs((prev) => {
      return [newLog, ...prev];
    });
  };

  // 3. Filter riwayat berdasarkan pencarian teks dan dropdown kategori aksi
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        log.truck.toLowerCase().includes(query) ||
        log.desc.toLowerCase().includes(query) ||
        log.pic.toLowerCase().includes(query);

      const matchesFilter =
        typeFilter === "ALL" ? true : log.type === typeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [logs, searchTerm, typeFilter]);

  // 4. Metrik agregat KPI riwayat mutasi
  const metrics: HistoryMetrics = useMemo(() => {
    return {
      totalLogs: logs.length,
      rotationCount: logs.filter((l) => {
        return l.type === "ROTASI_GANDAR";
      }).length,
      newInstallCount: logs.filter((l) => {
        return l.type === "GANTI_BARU";
      }).length,
      retreadCount: logs.filter((l) => {
        return l.type === "VULKANISIR";
      }).length,
      scrapCount: logs.filter((l) => {
        return l.type === "AFKIR";
      }).length,
    };
  }, [logs]);

  return {
    historyLogs: logs,
    setHistoryLogs: setInternalLogs,
    appendHistoryLog,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    filteredLogs,
    metrics,
  };
}
