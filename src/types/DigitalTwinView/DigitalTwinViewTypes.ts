// src/types/DigitalTwinView/DigitalTwinViewTypes.ts
import type { TruckFleetTireItem } from "@/data/mockTires";
import type { WheelPosition, WheelSlotEvaluation } from "@/types/truck/tires";

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
