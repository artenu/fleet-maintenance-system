// src/types/vehicleInspection/vehicleInspectionTypes.ts
import type { ChassisType } from "@/types/TireManagement/tires";
import type { PhysicalCheckItem } from "./physicalCheckTypes";

/**
 * Status kondisi kelengkapan alat & dokumen (Seksi 1)
 * (B) Baik, (R) Rusak, (H) Hilang, (T) Tidak Ada
 */
export type ToolDocStatus = "B" | "R" | "H" | "T";

/**
 * Status kondisi fisik komponen body, kabin, lampu & sasis (Seksi 2 & 3)
 * (B) Baik, (RM) Rusak Minor, (RB) Rusak Berat, (H) Hilang
 */
export type ComponentConditionStatus = "B" | "RM" | "RB" | "H";

/**
 * Item perlengkapan tools atau dokumen legalitas
 */
export interface ToolDocItem {
  id: string;
  name: string;
  hasExpiryDate?: boolean;
  expiryDate?: string;
  status: ToolDocStatus;
  notes?: string;
}

/**
 * Data pemeriksaan aki unit
 */
export interface BatteryCheckData {
  battery1: {
    brand: string;
    serialNumber: string;
    condition: ComponentConditionStatus;
    notes: string;
  };
  battery2: {
    brand: string;
    serialNumber: string;
    condition: ComponentConditionStatus;
    notes: string;
  };
  caseLockedWithChain: boolean;
  notes: string;
}

/**
 * Header data identitas unit truk yang diinspeksi
 */
export interface VehicleInspectionHeader {
  unitCode: string;
  plateNumber: string;
  chassisCode: string;
  chassisLengthCategory: "20FT" | "40FT";
  chassisType: ChassisType;
  odometer: number;
  driverName: string;
  mechanicName: string;
  inspectorName: string;
  inspectorNik: string;
  inspectionDate: string;
  inspectionTime: string;
  location: string;
}

/**
 * Dokumen lengkap hasil inspeksi fisik unit truk (BAP Digital)
 */
export interface VehicleInspectionRecord {
  id: string;
  header: VehicleInspectionHeader;
  toolDocs: ToolDocItem[];
  physicalChecks: PhysicalCheckItem[];
  battery: BatteryCheckData;
  driverPhotoUrl: string | null;
  overallNotes: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED";
  submittedAt?: string;
}

/**
 * Tab navigasi form inspeksi fisik
 */
export type InspectionTab =
  | "HEADER"
  | "TOOLS"
  | "PHYSICAL"
  | "BATTERY"
  | "CONFIRMATION";

/**
 * Filter seksi fisik body
 */
export type PhysicalSectionFilter =
  | "ALL"
  | "FRONT"
  | "RIGHT_SIDE"
  | "LEFT_SIDE"
  | "CABIN"
  | "LIGHTS"
  | "CHASSIS";

/**
 * Props untuk hook useVehicleInspection
 */
export interface UseVehicleInspectionProps {
  initialUnitCode?: string;
  onSaveRecord?: (record: VehicleInspectionRecord) => void;
}
