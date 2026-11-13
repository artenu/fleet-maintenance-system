// src/types/TireAuditScheduleView/TireAuditScheduleViewTypes.ts
import type { TruckFleetTireItem } from "@/data/mockTires";

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
  rescheduledCount: number;
  healthyCount: number;
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
  rescheduleDate: string;
  onRescheduleDateChange: (date: string) => void;
  rescheduleReason: string;
  onRescheduleReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: (e: React.FormEvent) => void;
}

