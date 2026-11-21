// src/constants/sidebar/sidebarConstants.ts
import {
  Disc,
  Warehouse,
  History,
  TrendingDown,
  CalendarClock,
} from "lucide-react";
import type { TireMaintenanceView } from "@/types/components/layout/layoutTypes";

export interface TireSubMenuItemConfig {
  id: TireMaintenanceView;
  label: string;
  icon: typeof Disc;
  badge?: string;
  badgeVariant?: "success" | "warning" | "danger" | "info";
  pulse?: boolean;
  hasPing?: boolean;
}

/**
 * Generator konfigurasi submenu Manajemen Ban (ATMS)
 * Menghitung badge dan status alert secara dinamis
 */
export const getTireSubMenus = (
  incompleteTiresTruckCount: number = 0,
  overdueCount: number = 0,
): TireSubMenuItemConfig[] => [
  {
    id: "digital-twin",
    label: "Digital Twin Armada",
    icon: Disc,
    badge:
      incompleteTiresTruckCount > 0 ? `${incompleteTiresTruckCount}` : "Live",
    badgeVariant: incompleteTiresTruckCount > 0 ? "warning" : "success",
    pulse: incompleteTiresTruckCount > 0,
    hasPing: incompleteTiresTruckCount > 0,
  },
  {
    id: "inventory",
    label: "Stok & Gudang Ban",
    icon: Warehouse,
    badge: "4 Unit",
    badgeVariant: "info",
  },
  {
    id: "history",
    label: "Riwayat Mutasi & Rotasi",
    icon: History,
  },
  {
    id: "cpk-analytics",
    label: "Analitik CPK & Merk",
    icon: TrendingDown,
  },
  {
    id: "audit-schedule",
    label: "Jadwal Audit Bulanan",
    icon: CalendarClock,
    badge: overdueCount > 0 ? `${overdueCount} Overdue` : undefined,
    badgeVariant: "danger",
    pulse: overdueCount > 0,
  },
];

/**
 * Pemetaan judul halaman navbar berdasarkan view aktif
 */
export const VIEW_TITLES: Record<TireMaintenanceView, string> = {
  "fleet-health": "Executive Fleet Health Dashboard",
  "digital-twin": "Digital Twin & Visualizer Roda",
  "add-truck": "Update Kondisi Ban & Cek Fisik Roda",
  coupling: "Manajemen Perangkaian Armada (Drop & Hook)",
  inventory: "Master Stok & Gudang Ban",
  history: "Log Mutasi & Rotasi Ban",
  "cpk-analytics": "Analitik Biaya & Durabilitas Merk (CPK)",
  "audit-schedule": "Jadwal Audit Fisik & Penundaan Izin",
  "vehicle-inspection": "Pemeriksaan Fisik Unit & Sasis (Pre-Trip Walkaround)",
};
