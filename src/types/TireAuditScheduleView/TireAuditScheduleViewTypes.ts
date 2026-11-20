// src/types/TireAuditScheduleView/TireAuditScheduleViewTypes.ts
import type { TruckFleetTireItem } from "@/types/TireManagement/tires";

/**
 * Prop interface untuk komponen TireAuditScheduleView
 */
export interface TireAuditScheduleViewProps {
  truckList: TruckFleetTireItem[];
  onRescheduleTruck: (truckId: string, reason: string, newDate: string) => void;
}

/**
 * Filter opsi status jadwal audit
 */
export type AuditStatusFilter =
  | "ALL"
  | "OVERDUE"
  | "RESCHEDULED"
  | "PENDING"
  | "DUE_SOON"
  | "COMPLETED";

/**
 * Props untuk hook useAuditSchedule
 */
export interface UseAuditScheduleProps {
  truckList: TruckFleetTireItem[];
  onRescheduleTruck: (truckId: string, reason: string, newDate: string) => void;
}

/**
 * Metrik agregat status jadwal audit
 */
export interface AuditScheduleMetrics {
  totalTrucks: number;
  overdueCount: number;
  dueSoonCount: number;
  rescheduledCount: number;
  completedCount: number;
}

/**
 * Prop interface untuk komponen TireAuditScheduleTable di components/auditSchedule
 */
export interface TireAuditScheduleTableProps {
  filteredTrucks: TruckFleetTireItem[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  statusFilter: AuditStatusFilter;
  onStatusFilterChange: (filter: AuditStatusFilter) => void;
  onOpenReschedule: (truck: TruckFleetTireItem) => void;
}

/**
 * Prop interface untuk komponen RescheduleAuditModal di components/auditSchedule
 */
export interface RescheduleAuditModalProps {
  targetTruck: TruckFleetTireItem | null;
  rescheduleReason?: string;
  onRescheduleReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: (e: React.SubmitEvent<HTMLFormElement>) => void;
  extendDays: number;
  onExtendDaysChange: (days: number) => void;
}

/**
 * Status kepatuhan audit — TIDAK disimpan di data,
 * selalu dihitung dari tanggal via getAuditStatus()
 */
export type AuditStatus =
  | "PENDING"
  | "COMPLETED"
  | "DUE_SOON"
  | "RESCHEDULED"
  | "OVERDUE";

export interface AuditSchedule {
  period: string;
  lastAuditDate: string | null; // null jika belum pernah diaudit
  nextAuditSchedule: string | null; // null jika belum pernah diaudit
  surveyorName: string;
  rescheduledTo?: string | null; // Jatuh tempo baru (jika ada dispensasi)
  rescheduleReason?: string | null;
  // Tidak ada field auditStatus (selalu dihitung dari tanggal)
}
