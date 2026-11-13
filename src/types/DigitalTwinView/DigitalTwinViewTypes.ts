// src/types/DigitalTwinView/DigitalTwinViewTypes.ts
import type { TruckFleetTireItem } from "@/data/mockTires";
import type {
  WheelPosition,
  WheelSlotEvaluation,
  TireAsset,
  ChassisType,
} from "@/types/truck/tires";

/**
 * Prop interface untuk komponen DigitalTwinView
 */
export interface DigitalTwinViewProps {
  activeTruck: TruckFleetTireItem;
  selectedSlot: WheelSlotEvaluation | null;
  onSelectSlot: (slot: WheelSlotEvaluation | null) => void;
  onOpenInspection: () => void;
  onOpenRotation: () => void;
  onEmergencySwapSpare: (position: WheelPosition) => void;
  onApplyMechanicOverride: (
    position: WheelPosition,
    mechanicName: string,
    reason: string,
  ) => void;
}

/**
 * Prop interface untuk komponen TireInspectionModal
 */
export interface TireInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: WheelSlotEvaluation | null;
  truckUnitCode: string;
  currentOdometer: number;
  onSaveInspection: (updatedTire: TireAsset, newOdometer: number) => void;
  onSaveAndNext?: (updatedTire: TireAsset, newOdometer: number) => void;
}

/**
 * Prop interface untuk form konten di dalam TireInspectionModal
 */
export interface TireInspectionFormContentProps {
  onClose: () => void;
  slot: WheelSlotEvaluation & { tire: TireAsset };
  truckUnitCode: string;
  currentOdometer: number;
  onSaveInspection: (updatedTire: TireAsset, newOdometer: number) => void;
  onSaveAndNext?: (updatedTire: TireAsset, newOdometer: number) => void;
}

/**
 * Props untuk hook useTireInspectionForm
 */
export interface UseTireInspectionFormProps {
  tire: TireAsset;
  axleType: "steer" | "drive" | "trailer";
  currentOdometer: number;
}

/**
 * State untuk dialog preview foto ban resolusi penuh
 */
export interface PhotoPreviewState {
  url: string;
  title: string;
  subtitle?: string;
  inspector?: string;
}

/**
 * Props untuk hook useDigitalTwin
 */
export interface UseDigitalTwinProps {
  activeTruck: TruckFleetTireItem;
  selectedSlot: WheelSlotEvaluation | null;
  onEmergencySwapSpare: (position: WheelPosition) => void;
  onApplyMechanicOverride: (
    position: WheelPosition,
    mechanicName: string,
    reason: string,
  ) => void;
}

/**
 * Mode rotasi ban
 */
export type RotationMode = "SWAP_POSITION" | "REPLACE_FROM_WAREHOUSE";

/**
 * Tujuan ban lama saat diganti dari gudang
 */
export type SourceTireDestination = "GUDANG" | "VULKANISIR" | "AFKIR";

/**
 * Payload hasil rotasi atau mutasi ban
 */
export interface RotationResultPayload {
  mode: RotationMode;
  sourcePosition: WheelPosition;
  sourceTire: TireAsset;
  // Jika Swap:
  targetPosition?: WheelPosition;
  targetTire?: TireAsset | null;
  // Jika Replace from Warehouse:
  warehouseTireToInstall?: TireAsset;
  sourceTireDestination?: SourceTireDestination;
  // Metadata:
  reason: string;
  mechanicPic: string;
  odometer: number;
}

/**
 * Prop interface untuk komponen TireRotationModal
 */
export interface TireRotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceSlot: WheelSlotEvaluation | null;
  allTruckTires: TireAsset[];
  warehouseTires: TireAsset[];
  chassisType: ChassisType;
  truckUnitCode: string;
  currentOdometer: number;
  onExecuteRotation: (payload: RotationResultPayload) => void;
}

/**
 * Prop interface untuk form konten di dalam TireRotationModal
 */
export interface TireRotationFormContentProps {
  onClose: () => void;
  sourceSlot: WheelSlotEvaluation & { tire: TireAsset };
  allTruckTires: TireAsset[];
  warehouseTires: TireAsset[];
  chassisType: ChassisType;
  truckUnitCode: string;
  currentOdometer: number;
  onExecuteRotation: (payload: RotationResultPayload) => void;
}

/**
 * Props untuk hook useTireRotationForm
 */
export interface UseTireRotationFormProps {
  sourceSlot: WheelSlotEvaluation & { tire: TireAsset };
  allTruckTires: TireAsset[];
  warehouseTires: TireAsset[];
  chassisType: ChassisType;
  currentOdometer: number;
  onExecuteRotation: (payload: RotationResultPayload) => void;
  onClose: () => void;
}

/**
 * Prop interface untuk komponen WheelLayoutVisualizer
 */
export interface WheelLayoutVisualizerProps {
  unitCode: string;
  plateNumber: string;
  currentOdometer: number;
  initialChassisType?: ChassisType;
  tires: TireAsset[];
  onSelectSlot?: (slot: WheelSlotEvaluation) => void;
}

/**
 * Prop interface untuk subkomponen WheelItem
 */
export interface WheelItemProps {
  pos: WheelPosition;
  slot: WheelSlotEvaluation;
  isSelected: boolean;
  onSlotClick: (slot: WheelSlotEvaluation) => void;
}
