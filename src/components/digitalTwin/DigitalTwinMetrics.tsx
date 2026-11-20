// src/components/digitalTwin/DigitalTwinMetrics.tsx
import { Truck, CheckCircle2, CalendarClock, Link2 } from "lucide-react";
import { Grid } from "@/components/layout";
import { Badge, StatCard } from "@/components/common";
import { formatThousand } from "@/utils/formatters";
import type { DigitalTwinMetricsProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import { AUDIT_STATUS_CONFIGS } from "@/constants/auditSchedule";
import {
  getAuditStatus,
  getDaysUntilDue,
  getDueCountdownLabel,
  getEffectiveDueDate,
} from "@/utils/auditSchedule";

/**
 * Kartu ringkasan KPI & metrik armada Digital Twin (Grid 4 Kolom)
 */
export default function DigitalTwinMetrics({
  activeTruck,
}: DigitalTwinMetricsProps) {
  const auditStatus = getAuditStatus(activeTruck.auditSchedule);
  const auditConfig = AUDIT_STATUS_CONFIGS[auditStatus];
  const auditCountdown = getDueCountdownLabel(
    getDaysUntilDue(activeTruck.auditSchedule),
  );

  return (
    <Grid cols={1} smCols={2} lgCols={4} gap="md">
      <StatCard
        title="Unit Truk & Driver"
        value={activeTruck.unitCode}
        subValue={activeTruck.plateNumber}
        subtitle={`Driver: ${activeTruck.driver}`}
        icon={Truck}
        variant="default"
      />

      <StatCard
        title="Odometer IoT Terkini"
        value={`${formatThousand(activeTruck.currentOdometer)} KM`}
        subtitle={`Sync: ${activeTruck.lastIotSync}`}
        icon={CheckCircle2}
        variant="success"
      />

      <StatCard
        title="Siklus Audit Ban"
        value={getEffectiveDueDate(activeTruck.auditSchedule) ?? "-"}
        subValue={auditCountdown}
        subtitle={
          <Badge variant={auditConfig.badgeVariant} pulse={auditConfig.pulse}>
            {auditConfig.label}
          </Badge>
        }
        icon={CalendarClock}
        variant={
          auditStatus === "OVERDUE"
            ? "danger"
            : auditStatus === "DUE_SOON"
              ? "warning"
              : "default"
        }
      />

      <StatCard
        title="Konfigurasi Sasis"
        value={activeTruck.chassisType === "2_AXLE" ? "14 Roda" : "18 Roda"}
        subValue={activeTruck.capacity}
        subtitle={
          activeTruck.chassisType === "2_AXLE"
            ? "2 Gandar Sasis"
            : "3 Gandar Sasis"
        }
        icon={Link2}
        variant="info"
      />
    </Grid>
  );
}
