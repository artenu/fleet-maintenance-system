// src/types/VehicleInspection/physicalCheckTypes.ts
import type {
  PhysicalSectionFilter,
  ComponentConditionStatus,
} from "./vehicleInspectionTypes";

/**
 * Props untuk sub-komponen header ringkasan seksi fisik
 */
export interface PhysicalSummaryHeaderProps {
  goodCount: number;
  defectCount: number;
  onSetAllGood: () => void;
}

/**
 * Props untuk sub-komponen tab navigasi filter seksi fisik
 */
export interface PhysicalSectionTabsProps {
  currentSection: PhysicalSectionFilter;
  allItems: PhysicalCheckItem[];
  onChangeSection: (section: PhysicalSectionFilter) => void;
}

/**
 * Props untuk baris checklist komponen fisik tunggal
 */
export interface PhysicalCheckItemRowProps {
  item: PhysicalCheckItem;
  index: number;
  onUpdateStatus: (id: string, status: ComponentConditionStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

/**
 * Props utama untuk komponen PhysicalComponentsSection
 */
export interface PhysicalComponentsSectionProps {
  items: PhysicalCheckItem[];
  allItems: PhysicalCheckItem[];
  currentSection: PhysicalSectionFilter;
  searchQuery: string;
  onChangeSection: (section: PhysicalSectionFilter) => void;
  onChangeSearch: (query: string) => void;
  onUpdateStatus: (id: string, status: ComponentConditionStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onSetAllGood: () => void;
}

export interface PhysicalCheckItem {
  id: string;
  name: string;
  section:
    | "FRONT"
    | "RIGHT_SIDE"
    | "LEFT_SIDE"
    | "CABIN"
    | "LIGHTS"
    | "CHASSIS";
  status: ComponentConditionStatus;
  notes?: string;
}
