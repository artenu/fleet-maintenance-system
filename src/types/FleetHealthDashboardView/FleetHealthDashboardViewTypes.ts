// src/types/FleetHealthDashboardView/FleetHealthDashboardViewTypes.ts
import type { TruckFleetTireItem } from "@/data/mockTires";
import type { ChassisTrailerAsset, TireAsset } from "@/types/truck/tires";

/**
 * Prop interface untuk komponen FleetHealthDashboardView
 */
export interface FleetHealthDashboardViewProps {
  truckList: TruckFleetTireItem[];
  chassisList: ChassisTrailerAsset[];
  warehouseTires: TireAsset[];
  onSelectTruck: (truckId: string) => void;
  onNavigateCoupling: () => void;
  onNavigateUpdateTires: (plateNumber: string) => void;
}

/**
 * Tab filter status kelaikan armada pada dashboard
 */
export type FleetFilterTab = "ALL" | "FIT" | "GROUNDED" | "BOBTAIL";

/**
 * Hasil analisis kelaikan satu rangkaian armada truk & sasis
 */
export interface FleetAnalysisItem {
  truck: TruckFleetTireItem;
  attachedChassis: ChassisTrailerAsset | undefined;
  tiresCount: number;
  criticalTiresCount: number;
  minPercent: number;
  isAuditOverdue: boolean;
  isGrounded: boolean;
}

/**
 * Statistik agregat ringkasan kesehatan armada global
 */
export interface FleetHealthSummaryStats {
  totalTrucks: number;
  fitCount: number;
  groundedCount: number;
  overdueAuditsCount: number;
  totalChassis: number;
  attachedChassisCount: number;
  standbyChassisCount: number;
}

/**
 * Parameter input untuk hook useFleetHealthDashboard
 */
export interface UseFleetHealthDashboardProps {
  truckList: TruckFleetTireItem[];
  chassisList: ChassisTrailerAsset[];
}

/**
 * Return type untuk hook useFleetHealthDashboard
 */
export interface UseFleetHealthDashboardReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: FleetFilterTab;
  setStatusFilter: (filter: FleetFilterTab) => void;
  fleetAnalysis: FleetAnalysisItem[];
  filteredAnalysis: FleetAnalysisItem[];
  stats: FleetHealthSummaryStats;
}

/**
 * Prop interface untuk komponen FleetHealthTable
 */
export interface FleetHealthTableProps {
  filteredAnalysis: FleetAnalysisItem[];
  statusFilter: FleetFilterTab;
  onStatusFilterChange: (status: FleetFilterTab) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  stats: FleetHealthSummaryStats;
  onSelectTruck: (truckId: string) => void;
  onNavigateCoupling: () => void;
  onNavigateUpdateTires: (plateNumber: string) => void;
}
