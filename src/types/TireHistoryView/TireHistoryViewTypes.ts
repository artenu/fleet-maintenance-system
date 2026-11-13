// src/types/TireHistoryView/TireHistoryViewTypes.ts

/**
 * Tipe aksi transaksi mutasi roda
 */
export type HistoryLogType =
  | "ALL"
  | "ROTASI_GANDAR"
  | "GANTI_BARU"
  | "VULKANISIR"
  | "AFKIR";

/**
 * Item catatan riwayat mutasi / rotasi ban
 */
export interface HistoryLogItem {
  id: string;
  date: string;
  truck: string;
  desc: string;
  pic: string;
  type: "ROTASI_GANDAR" | "GANTI_BARU" | "VULKANISIR" | "AFKIR";
}

/**
 * Metrik agregat riwayat mutasi roda
 */
export interface HistoryMetrics {
  totalLogs: number;
  rotationCount: number;
  newInstallCount: number;
  retreadCount: number;
  scrapCount: number;
}

/**
 * Prop interface untuk komponen TireHistoryList di components/tireHistory
 */
export interface TireHistoryListProps {
  filteredLogs: HistoryLogItem[];
  totalLogsCount: number;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  typeFilter: HistoryLogType;
  onTypeFilterChange: (type: HistoryLogType) => void;
}

