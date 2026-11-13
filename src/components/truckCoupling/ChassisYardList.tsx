// src/components/truckCoupling/ChassisYardList.tsx
import type { ChassisYardListProps } from "@/types/TruckCouplingView/TruckCouplingViewTypes";
import { Card, Badge } from "@/components/common";
import { Grid } from "@/components/layout";
import { Container as ContainerIcon } from "lucide-react";

/**
 * Komponen Inventaris Sasis di Pool (Chassis Yard)
 * Menampilkan status sasis mandiri: Tergandeng, Di Bengkel, atau Standby Siap Gandeng.
 */
export default function ChassisYardList({ chassisList }: ChassisYardListProps) {
  return (
    <Card className="space-y-4">
      <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
        <ContainerIcon size={18} className="text-blue-600" />
        <span>Daftar Sasis Mandiri di Pool (Chassis Yard)</span>
      </h2>

      <Grid cols={1} smCols={2} mdCols={3} gap="sm">
        {chassisList.map((chassis) => {
          const isAttached = chassis.status === "ATTACHED";
          const isRepair = chassis.status === "UNDER_REPAIR";

          return (
            <div
              key={chassis.id}
              className="rounded-xl border border-slate-200 p-3.5 space-y-2 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-slate-900">
                  {chassis.chassisCode}
                </span>
                <Badge
                  variant={
                    isAttached ? "success" : isRepair ? "warning" : "info"
                  }>
                  {isAttached
                    ? "Tergandeng"
                    : isRepair
                      ? "Di Bengkel"
                      : "Standby di Pool"}
                </Badge>
              </div>

              <div className="text-[11px] text-slate-600 space-y-0.5">
                <p>
                  Panjang Fisik: <strong>{chassis.lengthCategory}</strong>
                </p>
                <p>
                  Konfigurasi Gandar:{" "}
                  <strong>
                    {chassis.type === "2_AXLE"
                      ? "2 Sumbu (14 Ban)"
                      : "3 Sumbu (18 Ban)"}
                  </strong>
                </p>
              </div>
            </div>
          );
        })}
      </Grid>
    </Card>
  );
}

