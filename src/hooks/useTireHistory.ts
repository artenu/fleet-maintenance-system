// src/hooks/useTireHistory.ts
import { useState, useMemo } from "react";
import type {
  HistoryLogType,
  HistoryLogItem,
  HistoryMetrics,
} from "@/types/TireHistoryView/TireHistoryViewTypes";

export const initialHistoryLogs: HistoryLogItem[] = [
  {
    id: "LOG-001",
    date: "02 Nov 2026, 09:15",
    truck: "TRK-003",
    desc: "Rotasi Ban Serial GT-900101 dari Gandar Steer H1 dipindah ke Trailer C1 akibat keausan > 60.000 KM.",
    pic: "Slamet Riyadi (Mekanik Senior)",
    type: "ROTASI_GANDAR",
  },
  {
    id: "LOG-002",
    date: "24 Okt 2026, 14:30",
    truck: "TRK-001",
    desc: "Pemasangan Ban Baru R0 Bridgestone (BS-998821) ke gandar Steer H1 dari stok gudang pool.",
    pic: "Bambang Sudiro (Surveyor)",
    type: "GANTI_BARU",
  },
  {
    id: "LOG-003",
    date: "15 Okt 2026, 11:00",
    truck: "TRK-003",
    desc: "Pengiriman Ban Bekas BX-317 ke Rekanan Vulkanisir Karet Medan Boxer (Status R1 -> R2).",
    pic: "Eko Wahyudi (Admin Pool)",
    type: "VULKANISIR",
  },
  {
    id: "LOG-004",
    date: "05 Okt 2026, 16:45",
    truck: "TRK-001",
    desc: "Afkir total ban benjol dan kawat sobek di posisi C5. Ban dipindahkan ke area scrap.",
    pic: "Slamet Riyadi (Mekanik)",
    type: "AFKIR",
  },
];

export function useTireHistory() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<HistoryLogType>("ALL");

  const filteredLogs = useMemo(() => {
    return initialHistoryLogs.filter((log) => {
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
      totalLogs: initialHistoryLogs.length,
      rotationCount: initialHistoryLogs.filter(
        (l) => l.type === "ROTASI_GANDAR",
      ).length,
      newInstallCount: initialHistoryLogs.filter((l) => l.type === "GANTI_BARU")
        .length,
      retreadCount: initialHistoryLogs.filter((l) => l.type === "VULKANISIR")
        .length,
      scrapCount: initialHistoryLogs.filter((l) => l.type === "AFKIR").length,
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

