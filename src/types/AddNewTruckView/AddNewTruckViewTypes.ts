// src/types/AddNewTruckView/AddNewTruckViewTypes.ts
import type { TruckFleetTireItem } from "@/data/mockTires";
import type {
  ChassisType,
  RetreadStatus,
  WheelPosition,
  ChassisTrailerAsset,
} from "@/types/truck/tires";
import type { SearchableOption } from "@/types/components/forms/formsTypes";
import type { CentralTruckApiResponseItem } from "@/data/MockCentralTruckApi";
import type { ChangeEvent } from "react";

/**
 * Prop interface untuk komponen AddNewTruckView (Update Kondisi Ban)
 */
export interface AddNewTruckViewProps {
  existingTrucks?: TruckFleetTireItem[];
  chassisList?: ChassisTrailerAsset[];
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
  chassisList?: ChassisTrailerAsset[];
  onSaveNewTruck: (newTruck: TruckFleetTireItem) => void;
}

/**
 * Props untuk komponen PendingTrucksBanner
 */
export interface PendingTrucksBannerProps {
  pendingNewTrucks: CentralTruckApiResponseItem[];
}

/**
 * Props untuk komponen TruckMasterForm (Grid 3x3)
 */
export interface TruckMasterFormProps {
  plateOptions: SearchableOption[];
  plateNumber: string;
  onSelectPlateNumber: (plate: string) => void;
  unitCode: string;
  truckBrand: string;
  chassisCode: string;
  chassisType: ChassisType;
  onChangeChassisType: (type: ChassisType) => void;
  driverName: string;
  odometer: number;
  inspectionDate: string;
  onChangeInspectionDate: (date: string) => void;
}

/**
 * Props untuk komponen WheelMatrixSelector
 */
export interface WheelMatrixSelectorProps {
  unitCode: string;
  plateNumber: string;
  wheelPositions: WheelPosition[];
  activeSlot: WheelPosition;
  onSelectSlot: (slot: WheelPosition) => void;
  completedWheelsCount: number;
  tiresData: Record<string, TireInputData>;
}

/**
 * Props untuk komponen TireConditionFormCard (Formulir 7 Parameter)
 */
export interface TireConditionFormCardProps {
  activeSlot: WheelPosition;
  slotDescription: string;
  currentTireForm: TireInputData;
  updateCurrentTire: (data: Partial<TireInputData>) => void;
  onToggleDamage: (damage: string) => void;
  onPhotoCapture: (e: ChangeEvent<HTMLInputElement>) => void;
  onNextWheel: () => void;
  isSteer: boolean;
  isSteerViolation: boolean;
  onPreviewPhoto: (url: string) => void;
}
