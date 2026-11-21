// src/utils/auditSchedule/auditSchedule.ts
import { AUDIT_RULES } from "@/constants/auditSchedule/auditRules";
import type { AuditStatus, AuditSchedule } from "@/types/TireAuditScheduleView";
import type { TruckFleetTireItem } from "@/types/TireManagement/tires";
import {
  ALL_WHEEL_POSITIONS,
  getInstalledActiveTires,
} from "@/utils/tireManagement/wheelLayout";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Format Date ➔ "YYYY-MM-DD" memakai zona waktu lokal (bukan UTC)
 */
export function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse "YYYY-MM-DD" ➔ Date lokal jam 00:00. Return null jika kosong / "-"
 */
export function parseDateOnly(value?: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Tambah N hari ke tanggal "YYYY-MM-DD"
 */
export function addDays(value: string, days: number): string {
  const date = parseDateOnly(value) ?? new Date();
  date.setDate(date.getDate() + days);
  return formatDateOnly(date);
}

/**
 * Jatuh tempo efektif: tanggal dispensasi (jika ada) atau jadwal asli
 */
export function getEffectiveDueDate(schedule: AuditSchedule): string | null {
  return schedule.rescheduledTo || schedule.nextAuditSchedule;
}

/**
 * Sisa hari menuju jatuh tempo (negatif = sudah lewat). Null jika tanggal tidak valid
 */
export function getDaysUntilDue(
  schedule: AuditSchedule,
  today: Date = new Date(),
): number | null {
  const dueDate = parseDateOnly(getEffectiveDueDate(schedule));
  if (!dueDate) {
    return null;
  }
  const todayStart = parseDateOnly(formatDateOnly(today)) as Date;
  return Math.round((dueDate.getTime() - todayStart.getTime()) / MS_PER_DAY);
}

/**
 * Status kepatuhan audit dihitung otomatis dari tanggal (single source of truth)
 */
export function getAuditStatus(
  schedule: AuditSchedule,
  today: Date = new Date(),
): AuditStatus {
  const daysLeft = getDaysUntilDue(schedule, today);
  if (daysLeft === null) {
    return "PENDING";
  }
  if (daysLeft < 0) {
    return "OVERDUE";
  }
  if (schedule.rescheduledTo) {
    return "RESCHEDULED";
  }
  if (daysLeft <= AUDIT_RULES.DUE_SOON_DAYS) {
    return "DUE_SOON";
  }
  if (parseDateOnly(schedule.lastAuditDate)) {
    return "COMPLETED";
  }
  return "PENDING";
}

/**
 * Label hitung mundur jatuh tempo, contoh: "H-3", "Hari ini", "Lewat 5 hari"
 */
export function getDueCountdownLabel(daysLeft: number | null): string {
  if (daysLeft === null) {
    return "-";
  }
  if (daysLeft < 0) {
    return `Lewat ${Math.abs(daysLeft)} hari`;
  }
  if (daysLeft === 0) {
    return "Hari ini";
  }
  return `H-${daysLeft}`;
}

/**
 * Tanggal jatuh tempo baru setelah diperpanjang N hari.
 * Basis = jatuh tempo efektif; jika sudah lewat / kosong, basis = hari ini
 */
export function getExtendedDueDate(
  schedule: AuditSchedule,
  extendDays: number,
  today: Date = new Date(),
): string {
  const currentDue = getEffectiveDueDate(schedule);
  const daysLeft = getDaysUntilDue(schedule, today);
  const isStillValid =
    currentDue !== null && daysLeft !== null && daysLeft >= 0;
  const baseDate = isStillValid ? currentDue : formatDateOnly(today);
  return addDays(baseDate, extendDays);
}

/**
 * Audit bulanan dianggap selesai jika SEMUA ban terpasang di gandar
 * (tanpa S1) sudah diinspeksi SETELAH tanggal audit terakhir
 */
export function isMonthlyAuditDone(truck: TruckFleetTireItem): boolean {
  const mountedTires = getInstalledActiveTires(
    truck.tires,
    ALL_WHEEL_POSITIONS,
  );
  if (mountedTires.length === 0) {
    return false;
  }

  const lastAudit = parseDateOnly(truck.auditSchedule.lastAuditDate);
  return mountedTires.every((tire) => {
    const inspectedAt = parseDateOnly(tire.lastInspectionDate);
    if (!inspectedAt) {
      return false;
    }
    if (!lastAudit) {
      return true;
    }
    return inspectedAt > lastAudit;
  });
}

/**
 * Tutup siklus audit: catat tanggal audit, jadwal berikutnya +30 hari,
 * dan hapus dispensasi (jika ada)
 */
export function completeMonthlyAudit(
  schedule: AuditSchedule,
  today: Date = new Date(),
): AuditSchedule {
  const todayStr = formatDateOnly(today);
  return {
    ...schedule,
    period: today.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    }),
    lastAuditDate: todayStr,
    nextAuditSchedule: addDays(todayStr, AUDIT_RULES.CYCLE_DAYS),
    rescheduledTo: null,
    rescheduleReason: null,
  };
}
