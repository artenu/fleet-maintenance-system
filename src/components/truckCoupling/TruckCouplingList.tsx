// src/components/truckCoupling/TruckCouplingList.tsx
import type { TruckCouplingListProps } from "@/types/TruckCouplingView/TruckCouplingViewTypes";
import { Card, Badge, Button } from "@/components/common";
import { Grid } from "@/components/layout";
import {
  Truck,
  Container as ContainerIcon,
  CheckCircle2,
  AlertCircle,
  Unlink,
  Link2,
} from "lucide-react";

/**
 * Komponen Daftar Kepala Truk & Status Perangkaian
 * Menampilkan kartu status gandengan untuk setiap unit tractor head dan tombol aksi Drop & Hook.
 */
export default function TruckCouplingList({
  truckList,
  chassisList,
  availableChassisCount,
  onOpenHookModal,
  onUncouple,
}: TruckCouplingListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
        <Truck size={18} className="text-slate-700" />
        <span>Status Rangkaian Kepala Truk di Pool</span>
      </h2>

      <Grid cols={1} mdCols={2} gap="md">
        {truckList.map((truck) => {
          const currentChassis = chassisList.find(
            (c) => c.attachedHeadId === truck.id,
          );
          const isCoupled = Boolean(currentChassis);

          return (
            <Card
              key={truck.id}
              className={`space-y-4 transition ${
                isCoupled
                  ? "border-slate-200"
                  : "border-amber-300 ring-1 ring-amber-500/20"
              }`}>
              {/* Header Truk */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">
                      {truck.unitCode}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      ({truck.plateNumber})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {truck.brand} • Supir:{" "}
                    <strong className="text-slate-700">{truck.driver}</strong>
                  </p>
                </div>

                {isCoupled ? (
                  <Badge variant="success" icon={CheckCircle2}>
                    Tergandeng
                  </Badge>
                ) : (
                  <Badge variant="warning" icon={AlertCircle}>
                    Bobtail (Tanpa Sasis)
                  </Badge>
                )}
              </div>

              {/* Sasis Info Card */}
              {isCoupled && currentChassis ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ContainerIcon size={16} className="text-blue-600" />
                      <span className="font-black text-slate-900 text-xs">
                        {currentChassis.chassisCode}
                      </span>
                      <Badge variant="info">
                        {currentChassis.lengthCategory}
                      </Badge>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">
                      {currentChassis.type === "2_AXLE"
                        ? "2 Sumbu • 14 Ban"
                        : "3 Sumbu • 18 Ban"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Sasis terkunci kuat pada kingpin kepala truk. Siap membawa
                    muatan kontainer.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-3.5 text-xs text-amber-800">
                  <span className="font-bold block">
                    Truk Belum Membawa Sasis
                  </span>
                  <span className="text-[10px] text-amber-700">
                    Kepala truk siap dipasangkan dengan sasis standby di pool.
                  </span>
                </div>
              )}

              {/* Tombol Aksi Drop & Hook */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {isCoupled ? (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Unlink}
                    onClick={() => onUncouple(truck.id)}
                    className="border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100">
                    Lepas Sasis (Drop to Pool)
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Link2}
                    disabled={availableChassisCount === 0}
                    onClick={() => onOpenHookModal(truck.id)}
                    className="bg-blue-600 hover:bg-blue-700 shadow-blue-500/20">
                    Kaitkan Sasis (Hook)
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </Grid>
    </div>
  );
}

