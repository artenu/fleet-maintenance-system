// src/types/TireInventoryView/TireInventoryViewTypes.ts
import type { TruckFleetTireItem } from "@/data/mockTires";
import type { TireAsset } from "@/types/truck/tires";

/**
 * Prop interface untuk komponen TireInventoryView
 */
export interface TireInventoryViewProps {
  truckList: TruckFleetTireItem[];
  warehouseTires: TireAsset[];
  onReceiveNewTire?: () => void;
}

/**
 * Filter status retread / casing ban gudang
 */
export type RetreadFilterType = "ALL" | "R0" | "R1" | "R2" | "R3" | "RETREAD";

/**
 * Props untuk hook useTireInventory
 */
export interface UseTireInventoryProps {
  truckList: TruckFleetTireItem[];
  warehouseTires: TireAsset[];
}

/**
 * Metrik agregat inventaris ban
 */
export interface InventoryMetrics {
  totalMountedTires: number;
  totalWarehouseTires: number;
  r0Count: number;
  retreadCount: number;
  averagePhysicalPercent: number;
}

/**
 * Prop interface untuk komponen TireInventoryTable di components/tireInventory
 */
export interface TireInventoryTableProps {
  filteredTires: TireAsset[];
  totalWarehouseTires: number;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  retreadFilter: RetreadFilterType;
  onRetreadFilterChange: (filter: RetreadFilterType) => void;
  selectedBrand: string;
  onSelectedBrandChange: (brand: string) => void;
  brandList: string[];
  canViewFinancials: boolean;
}

/**
 * Mode penerimaan ban gudang: Pembelian ban baru atau hasil vulkanisir rekanan
 */
export type ReceiveMode = "NEW_PURCHASE" | "RETREAD_RETURN";

/**
 * Prop interface untuk komponen ReceiveTireModal di components/tireInventory
 */
export interface ReceiveTireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReceive: (newTire: TireAsset) => void;
}

