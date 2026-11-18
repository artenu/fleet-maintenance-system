// src/components/digitalTwin/DigitalTwinMetrics.tsx
import { Truck, CheckCircle2, CalendarClock, Link2 } from "lucide-react";
import { Grid } from "@/components/layout";
import { Badge, StatCard } from "@/components/common";
import { formatThousand } from "@/utils/formatters";
import type { DigitalTwinMetricsProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Kartu ringkasan KPI & metrik armada Digital Twin (Grid 4 Kolom)
 */
export default function DigitalTwinMetrics({
  activeTruck,
}: DigitalTwinMetricsProps) {
  const auditStatusVariant =
    activeTruck.auditSchedule.status === "OVERDUE"
      ? "danger"
      : activeTruck.auditSchedule.status === "COMPLETED"
        ? "success"
        : "warning";

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
        title="Siklus Audit Bulanan"
        value={activeTruck.auditSchedule.nextAuditSchedule}
        subtitle={
          <Badge
            variant={auditStatusVariant}
            pulse={activeTruck.auditSchedule.status === "OVERDUE"}>
            {activeTruck.auditSchedule.status}
          </Badge>
        }
        icon={CalendarClock}
        variant={
          activeTruck.auditSchedule.status === "OVERDUE" ? "danger" : "default"
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

