// src/types/AddNewTruckView/AddNewTruckViewTypes.ts
import type { TruckFleetTireItem } from "@/data/mockTires";
import type { RetreadStatus } from "@/types/truck/tires";

/**
 * Prop interface untuk komponen AddNewTruckView (Update Kondisi Ban)
 */
export interface AddNewTruckViewProps {
  existingTrucks?: TruckFleetTireItem[];
  onSaveNewTruck: (newTruck: TruckFleetTireItem) => void;
}

/**
 * Struktur data input 7-parameter walkaround ban per slot roda
 */
export interface TireInputData {
  serialNumber: string;
  brand: string;
  pattern: string;
  retreadStatus: RetreadStatus;
  pressurePsi: number;
  treadDepthMm: number;
  physicalPercent: number;
  damages: string[];
  photoUrl: string | null;
}

/**
 * Props untuk hook useTireConditionForm
 */
export interface UseTireConditionFormProps {
  existingTrucks?: TruckFleetTireItem[];
  onSaveNewTruck: (newTruck: TruckFleetTireItem) => void;
}

