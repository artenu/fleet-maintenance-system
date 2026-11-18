// src/constants/auditSchedule/auditScheduleConstants.tsx
import { Badge } from "@/components/common";
import type { BadgeVariant } from "@/types/components/common/commonTypes";
import type { AuditStatusFilter } from "@/types/TireAuditScheduleView/TireAuditScheduleViewTypes";

export interface AuditStatusConfig {
  label: string;
  badgeVariant: BadgeVariant;
  pulse?: boolean;
}

export const AUDIT_STATUS_CONFIGS: Record<string, AuditStatusConfig> = {
  OVERDUE: {
    label: "OVERDUE",
    badgeVariant: "danger",
    pulse: true,
  },
  RESCHEDULED: {
    label: "RESCHEDULED",
    badgeVariant: "info",
  },
  PENDING: {
    label: "TERJADWAL",
    badgeVariant: "success",
  },
  COMPLETED: {
    label: "SELESAI",
    badgeVariant: "success",
  },
};

export const AUDIT_STATUS_FILTER_OPTIONS: Array<{
  value: AuditStatusFilter;
  label: string;
}> = [
  { value: "ALL", label: "Semua Status" },
  { value: "OVERDUE", label: "Kritis (Overdue)" },
  { value: "RESCHEDULED", label: "Dispensasi" },
  { value: "PENDING", label: "Menunggu Audit" },
];

/**
 * Render komponen Badge sesuai status kepatuhan jadwal audit
 */
export function getAuditStatusBadge(status: string) {
  const config = AUDIT_STATUS_CONFIGS[status] || AUDIT_STATUS_CONFIGS.PENDING;
  return (
    <Badge variant={config.badgeVariant} pulse={config.pulse}>
      {config.label}
    </Badge>
  );
}

