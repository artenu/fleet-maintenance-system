// src/constants/auditSchedule/auditScheduleConstants.tsx
import { Badge } from "@/components/common";
import type { BadgeVariant } from "@/types/components/common/commonTypes";
import type { AuditStatusFilter } from "@/types/TireAuditScheduleView/TireAuditScheduleViewTypes";
import type { AuditStatus } from "@/types/TireAuditScheduleView/TireAuditScheduleViewTypes";

export interface AuditStatusConfig {
  label: string;
  badgeVariant: BadgeVariant;
  pulse?: boolean;
}

export const AUDIT_STATUS_CONFIGS: Record<AuditStatus, AuditStatusConfig> = {
  OVERDUE: {
    label: "OVERDUE",
    badgeVariant: "danger",
    pulse: true,
  },
  DUE_SOON: {
    label: "SEGERA JATUH TEMPO",
    badgeVariant: "warning",
    pulse: true,
  },
  RESCHEDULED: {
    label: "DISPENSASI",
    badgeVariant: "info",
  },
  PENDING: {
    label: "BELUM DIAUDIT",
    badgeVariant: "neutral",
  },
  COMPLETED: {
    label: "SUDAH DIAUDIT",
    badgeVariant: "success",
  },
};

export const AUDIT_STATUS_FILTER_OPTIONS: Array<{
  value: AuditStatusFilter;
  label: string;
}> = [
  { value: "ALL", label: "Semua Status" },
  { value: "OVERDUE", label: "Kritis (Overdue)" },
  { value: "DUE_SOON", label: "Segera Jatuh Tempo" },
  { value: "RESCHEDULED", label: "Dispensasi" },
  { value: "COMPLETED", label: "Sudah Diaudit" },
  { value: "PENDING", label: "Belum Pernah Diaudit" },
];

/**
 * Render komponen Badge sesuai status kepatuhan jadwal audit
 */
export function getAuditStatusBadge(status: AuditStatus) {
  const config = AUDIT_STATUS_CONFIGS[status];
  return (
    <Badge variant={config.badgeVariant} pulse={config.pulse}>
      {config.label}
    </Badge>
  );
}
