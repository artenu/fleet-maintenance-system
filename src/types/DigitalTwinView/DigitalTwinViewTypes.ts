// src/types/DigitalTwinView/DigitalTwinViewTypes.ts
import type {
  TruckFleetTireItem,
  WheelPosition,
  WheelSlotEvaluation,
  TireAsset,
  ChassisType,
  RetreadStatus,
  ActionRecommendation,
  ChassisTrailerAsset,
} from "@/types/TireManagement/tires";
import type { ChangeEvent } from "react";

/**
 * Prop interface untuk komponen DigitalTwinView
 */
export interface DigitalTwinViewProps {
  activeTruck: TruckFleetTireItem;
  chassisList?: ChassisTrailerAsset[];
  truckList?: TruckFleetTireItem[];
  warehouseTires?: TireAsset[];
  selectedSlot: WheelSlotEvaluation | null;
  onSelectTruck?: (truckId: string) => void;
  onSelectSlot: (slot: WheelSlotEvaluation | null) => void;
  onOpenInspection: () => void;
  onOpenRotation: () => void;
  onEmergencySwapSpare: (position: WheelPosition) => void;
  onApplyMechanicOverride: (
    position: WheelPosition,
    mechanicName: string,
    reason: string,
  ) => void;
  onSaveTruckTires?: (updatedTruck: TruckFleetTireItem) => void;
  onInstallTire?: (position: WheelPosition, newTire: TireAsset) => void;
  onMoveTireBetweenSlots?: (
    fromPosition: WheelPosition,
    toPosition: WheelPosition,
  ) => void;
  onTransferTireFromOtherTruck?: (
    sourceTruckId: string,
    sourceTireId: string,
    targetPosition: WheelPosition,
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

export interface DigitalTwinViewProps {
  activeTruck: TruckFleetTireItem;
  chassisList?: ChassisTrailerAsset[];
  warehouseTires?: TireAsset[]; // 👈 Tambahkan ini
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
  onInstallTire?: (position: WheelPosition, newTire: TireAsset) => void; // 👈 Tambahkan ini
}

/**
 * Props untuk hook useDigitalTwin
 */
export interface UseDigitalTwinProps {
  activeTruck: TruckFleetTireItem;
  selectedSlot: WheelSlotEvaluation | null;
  isBobTail: boolean;
  chassisType: ChassisType;
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
  brand?: string;
  driver?: string;
  currentOdometer: number;
  initialChassisType?: ChassisType;
  attachedChassisCode?: string;
  chassisLengthCategory?: "20FT" | "40FT";
  isBobTail?: boolean;
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

/**
 * Props untuk subkomponen WheelLayoutToolbar
 */
export interface WheelLayoutToolbarProps {
  unitCode: string;
  plateNumber: string;
  currentOdometer: number;
  totalTiresCount: number;
  chassisType: ChassisType;
  chassisLengthCategory?: "20FT" | "40FT";
  isBobTail?: boolean;
  onChangeChassisType: (type: ChassisType) => void;
}

/**
 * Props untuk subkomponen WheelLayoutSummaryBanner
 */
export interface WheelLayoutSummaryBannerProps {
  criticalCount: number;
  unitCode?: string;
  plateNumber?: string;
  brand?: string;
  driver?: string;
  currentOdometer?: number;
  attachedChassisCode?: string;
  chassisType?: ChassisType;
  chassisLengthCategory?: "20FT" | "40FT";
  isBobTail?: boolean;
}

/**
 * Props untuk subkomponen DualWheelPair
 */
export interface DualWheelPairProps {
  outerPos: WheelPosition;
  innerPos: WheelPosition;
  isRightSide?: boolean;
  tireMap: Map<WheelPosition, TireAsset>;
  getSlot: (pos: WheelPosition) => WheelSlotEvaluation;
  selectedPosition: WheelPosition | null;
  onSlotClick: (slot: WheelSlotEvaluation) => void;
}

/**
 * Props untuk subkomponen TractorHeadSection
 */
export interface TractorHeadSectionProps {
  tireMap: Map<WheelPosition, TireAsset>;
  getSlot: (pos: WheelPosition) => WheelSlotEvaluation;
  selectedPosition: WheelPosition | null;
  onSlotClick: (slot: WheelSlotEvaluation) => void;
}

/**
 * Props untuk subkomponen TrailerChassisSection
 */
export interface TrailerChassisSectionProps {
  chassisType: ChassisType;
  tireMap: Map<WheelPosition, TireAsset>;
  getSlot: (pos: WheelPosition) => WheelSlotEvaluation;
  selectedPosition: WheelPosition | null;
  onSlotClick: (slot: WheelSlotEvaluation) => void;
}

/**
 * Props untuk komponen FleetReadinessBanner
 */
export interface FleetReadinessBannerProps {
  unitCode: string;
  plateNumber: string;
  isGrounded: boolean;
  criticalTiresCount: number;
  readinessPercent: number;
  missingTiresCount?: number;
  attachedChassisCode?: string;
  chassisType?: ChassisType;
  hasNoTires?: boolean;
  isBobTail?: boolean;
  chassisLengthCategory?: "20FT" | "40FT";
}

/**
 * Props untuk komponen DigitalTwinMetrics
 */
export interface DigitalTwinMetricsProps {
  activeTruck: TruckFleetTireItem;
}

/**
 * Props untuk komponen SelectedWheelDetailCard
 */
export interface SelectedWheelDetailCardProps {
  selectedSlot: WheelSlotEvaluation | null;
  hasNoTires?: boolean;
  onOpenInspection: () => void;
  onOpenRotation: () => void;
  onQuickSwapSpare: () => void;
  onOpenOverrideModal: () => void;
  onPreviewPhoto: (state: PhotoPreviewState) => void;
  onOpenInstallTire?: () => void;
}

/**
 * Props untuk modal toleransi mekanik (+5.000 KM)
 */
export interface MechanicOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  mechanicName: string;
  onChangeMechanicName: (name: string) => void;
  overrideReason: string;
  onChangeOverrideReason: (reason: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Props untuk subkomponen InspectionStatusHeader
 */
export interface InspectionStatusHeaderProps {
  liveStatus: "CRITICAL" | "WARNING" | "GOOD";
  axleType: string;
  kmElapsed: number;
  pressurePsi: number;
  isSteerViolation: boolean;
  isPhysicalCritical: boolean;
  position: WheelPosition;
  retreadStatus: RetreadStatus;
}

/**
 * Props untuk subkomponen InspectionIdentitySection
 */
export interface InspectionIdentitySectionProps {
  serialNumber: string;
  onChangeSerialNumber: (val: string) => void;
  brand: string;
  onChangeBrand: (val: string) => void;
  customBrand: string;
  onChangeCustomBrand: (val: string) => void;
  retreadStatus: RetreadStatus;
  onChangeRetreadStatus: (val: RetreadStatus) => void;
  isSteer: boolean;
}

/**
 * Props untuk subkomponen InspectionMeasurementsSection
 */
export interface InspectionMeasurementsSectionProps {
  odometer: number;
  onChangeOdometer: (val: number) => void;
  pressurePsi: number;
  onChangePressurePsi: (val: number) => void;
  treadDepthMm: number;
  onChangeTreadDepthMm: (val: number) => void;
  physicalPercent: number;
  onChangePhysicalPercent: (val: number) => void;
}

/**
 * Props untuk subkomponen InspectionDamageSection
 */
export interface InspectionDamageSectionProps {
  visualDamages: string[];
  onToggleDamage: (damage: string) => void;
}

/**
 * Props untuk subkomponen InspectionPhotoSection
 */
export interface InspectionPhotoSectionProps {
  photoPreview: string | null;
  onPhotoCapture: (e: ChangeEvent<HTMLInputElement>) => void;
  onDeletePhoto: () => void;
  onOpenFullPreview: () => void;
  isFullPreviewOpen: boolean;
  onCloseFullPreview: () => void;
  serialNumber: string;
}

/**
 * Props untuk subkomponen InspectionRecommendationSection
 */
export interface InspectionRecommendationSectionProps {
  actionRecommendation: ActionRecommendation;
  onChangeActionRecommendation: (val: ActionRecommendation) => void;
  notes: string;
  onChangeNotes: (val: string) => void;
}

/**
 * Props untuk subkomponen SourceTireInfoCard
 */
export interface SourceTireInfoCardProps {
  sourceTire: TireAsset;
}

/**
 * Props untuk subkomponen RotationModeToggle
 */
export interface RotationModeToggleProps {
  mode: RotationMode;
  onChangeMode: (mode: RotationMode) => void;
}

/**
 * Props untuk subkomponen SwapPositionSection
 */
export interface SwapPositionSectionProps {
  targetPosition: WheelPosition;
  onChangeTargetPosition: (pos: WheelPosition) => void;
  targetPositionOptions: { value: string; label: string }[];
  targetTire: TireAsset | null;
  sourcePosition: WheelPosition;
}

/**
 * Props untuk subkomponen WarehouseReplaceSection
 */
export interface WarehouseReplaceSectionProps {
  sourcePosition: WheelPosition;
  sourceTireSerialNumber: string;
  warehouseTireId: string;
  onChangeWarehouseTireId: (id: string) => void;
  warehouseTireOptions: { value: string; label: string }[];
  sourceDestination: SourceTireDestination;
  onChangeSourceDestination: (dest: SourceTireDestination) => void;
}

/**
 * Props untuk subkomponen WheelSlotHeader
 */
export interface WheelSlotHeaderProps {
  slot: WheelSlotEvaluation;
}

/**
 * Props untuk subkomponen WheelTireSpecsList
 */
export interface WheelTireSpecsListProps {
  slot: WheelSlotEvaluation;
  tire: TireAsset;
}

/**
 * Props untuk subkomponen WheelPhotoEvidence
 */
export interface WheelPhotoEvidenceProps {
  slot: WheelSlotEvaluation;
  tire: TireAsset;
  onPreviewPhoto: (state: PhotoPreviewState) => void;
  onOpenInspection: () => void;
}

/**
 * Props untuk subkomponen WheelActionButtons
 */
export interface WheelActionButtonsProps {
  slot: WheelSlotEvaluation;
  onOpenInspection: () => void;
  onOpenRotation: () => void;
  onQuickSwapSpare: () => void;
  onOpenOverrideModal: () => void;
  onOpenInstallTire?: () => void;
}
