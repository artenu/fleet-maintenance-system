// src/types/TruckCouplingView/TruckCouplingViewTypes.ts
import type { TruckFleetTireItem } from "@/data/mockTires";
import type { ChassisTrailerAsset, ChassisType } from "@/types/truck/tires";

/**
 * Prop interface untuk komponen TruckCouplingView (Drop & Hook)
 */
export interface TruckCouplingViewProps {
  truckList: TruckFleetTireItem[];
  chassisList: ChassisTrailerAsset[];
  onCouple: (truckId: string, chassis: ChassisTrailerAsset) => void;
  onUncouple: (truckId: string) => void;
}

/**
 * Filter tab status perangkaian armada
 */
export type CouplingFilterTab = "ALL" | "COUPLED" | "BOBTAIL";

/**
 * Statistik ringkasan coupling armada
 */
export interface CouplingSummaryStats {
  totalHeads: number;
  coupledCount: number;
  bobtailCount: number;
  totalChassis: number;
  standaloneChassisCount: number;
}

/**
 * Props untuk hook useTruckCoupling
 */
export interface UseTruckCouplingProps {
  truckList: TruckFleetTireItem[];
  chassisList: ChassisTrailerAsset[];
  onCouple: (truckId: string, chassis: ChassisTrailerAsset) => void;
  onUncouple: (truckId: string) => void;
}

/**
 * Return type untuk hook useTruckCoupling
 */
export interface UseTruckCouplingReturn {
  isHookModalOpen: boolean;
  setIsHookModalOpen: (open: boolean) => void;
  selectedTruckId: string;
  setSelectedTruckId: (id: string) => void;
  selectedChassisId: string;
  setSelectedChassisId: (id: string) => void;
  overrideWheelConfig: ChassisType;
  setOverrideWheelConfig: (config: ChassisType) => void;
  availableChassis: ChassisTrailerAsset[];
  coupledChassis: ChassisTrailerAsset[];
  repairChassis: ChassisTrailerAsset[];
  handleOpenHookModal: (truckId: string) => void;
  handleExecuteHook: () => void;
}

/**
 * Props untuk komponen HookChassisModal di components/truckCoupling
 */
export interface HookChassisModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTruckId: string;
  selectedChassisId: string;
  onSelectedChassisIdChange: (id: string) => void;
  overrideWheelConfig: ChassisType;
  onOverrideWheelConfigChange: (config: ChassisType) => void;
  availableChassis: ChassisTrailerAsset[];
  onConfirmHook: () => void;
}

/**
 * Props untuk komponen TruckCouplingList di components/truckCoupling
 */
export interface TruckCouplingListProps {
  truckList: TruckFleetTireItem[];
  chassisList: ChassisTrailerAsset[];
  availableChassisCount: number;
  onOpenHookModal: (truckId: string) => void;
  onUncouple: (truckId: string) => void;
}

/**
 * Props untuk komponen ChassisYardList di components/truckCoupling
 */
export interface ChassisYardListProps {
  chassisList: ChassisTrailerAsset[];
}

