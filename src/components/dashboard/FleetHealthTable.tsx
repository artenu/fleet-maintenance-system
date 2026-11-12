// src/components/dashboard/FleetHealthTable.tsx
import { formatThousand } from "@/utils/formatters";
import type { FleetHealthTableProps } from "@/types/FleetHealthDashboardView/FleetHealthDashboardViewTypes";

// 🧱 Komponen Reusable Design System
import {
  Button,
  Badge,
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/common";
import { SearchInput } from "@/components/forms";

import {
  Link2,
  CalendarClock,
  AlertOctagon,
  CheckCircle2,
  ArrowUpRight,
  Wrench,
} from "lucide-react";

/**
 * Komponen Tabel Monitoring Kelaikan Armada (Fleet Health Table)
 * Menampilkan status kelaikan jalan truk, gandengan sasis, kondisi ban, serta jadwal audit bulanan.
 */
export default function FleetHealthTable({
  filteredAnalysis,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  stats,
  onSelectTruck,
  onNavigateCoupling,
  onNavigateUpdateTires,
}: FleetHealthTableProps) {
  const { totalTrucks, fitCount, groundedCount, attachedChassisCount } = stats;

  return (
    <Card className="space-y-4">
      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Button
            variant={statusFilter === "ALL" ? "secondary" : "outline"}
            size="sm"
            onClick={() => onStatusFilterChange("ALL")}>
            Semua Armada ({totalTrucks})
          </Button>
          <Button
            variant={statusFilter === "FIT" ? "success" : "ghost"}
            size="sm"
            onClick={() => onStatusFilterChange("FIT")}
            className={
              statusFilter !== "FIT"
                ? "text-emerald-700 hover:bg-emerald-50"
                : ""
            }>
            Fit To Dispatch ({fitCount})
          </Button>
          <Button
            variant={statusFilter === "GROUNDED" ? "danger" : "ghost"}
            size="sm"
            onClick={() => onStatusFilterChange("GROUNDED")}
            className={
              statusFilter !== "GROUNDED"
                ? "text-rose-700 hover:bg-rose-50"
                : ""
            }>
            Grounded ({groundedCount})
          </Button>
          <Button
            variant={statusFilter === "BOBTAIL" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onStatusFilterChange("BOBTAIL")}
            className={
              statusFilter !== "BOBTAIL"
                ? "text-amber-700 hover:bg-amber-50"
                : ""
            }>
            Bobtail ({totalTrucks - attachedChassisCount})
          </Button>
        </div>

        <div className="w-full md:w-72">
          <SearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Cari Plat, Unit, Sasis..."
          />
        </div>
      </div>

      {/* Tabel Data Unit */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Unit & Plat Nomor</TableHead>
            <TableHead>Rangkaian Sasis</TableHead>
            <TableHead>Supir & Odometer</TableHead>
            <TableHead>Kondisi Ban Terpasang</TableHead>
            <TableHead>Audit Bulanan</TableHead>
            <TableHead>Kelaikan Operasional</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredAnalysis.map((item) => {
            const { truck, attachedChassis, isGrounded, minPercent } = item;

            return (
              <TableRow key={truck.id}>
                {/* Unit & Plat */}
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 font-black">
                      {truck.unitCode}
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">
                        {truck.plateNumber}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {truck.brand}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Sasis */}
                <TableCell>
                  {attachedChassis ? (
                    <div>
                      <span className="font-bold text-blue-700 flex items-center gap-1">
                        <Link2 size={13} />
                        {attachedChassis.chassisCode}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-semibold">
                        {attachedChassis.lengthCategory} •{" "}
                        {attachedChassis.wheelCount} Ban (
                        {attachedChassis.type === "2_AXLE"
                          ? "2 Gandar"
                          : "3 Gandar"}
                        )
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Badge variant="warning">Bobtail</Badge>
                      <button
                        type="button"
                        onClick={onNavigateCoupling}
                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">
                        + Pasang Sasis
                      </button>
                    </div>
                  )}
                </TableCell>

                {/* Driver & Odometer */}
                <TableCell>
                  <span className="font-bold text-slate-900 block truncate max-w-[130px]">
                    {truck.driver}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {formatThousand(truck.currentOdometer)}
                  </span>
                </TableCell>

                {/* Kondisi Ban */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {item.tiresCount} Ban
                      </span>
                      {item.criticalTiresCount > 0 ? (
                        <Badge variant="danger" pulse>
                          ⚠️ {item.criticalTiresCount} Kritis (&lt;40%)
                        </Badge>
                      ) : (
                        <Badge variant="success">✓ Normal</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Tread Terendah:</span>
                      <span
                        className={`font-black ${
                          minPercent < 40
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}>
                        {minPercent}%
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Audit Bulanan */}
                <TableCell>
                  {item.isAuditOverdue ? (
                    <Badge variant="danger" icon={CalendarClock}>
                      Overdue ({truck.auditSchedule?.nextAuditSchedule})
                    </Badge>
                  ) : (
                    <Badge variant="neutral">
                      Jadwal: {truck.auditSchedule?.nextAuditSchedule || "-"}
                    </Badge>
                  )}
                </TableCell>

                {/* Kelaikan */}
                <TableCell>
                  {isGrounded ? (
                    <div className="space-y-0.5">
                      <Badge variant="danger" icon={AlertOctagon} pulse>
                        GROUNDED
                      </Badge>
                      <span className="text-[10px] text-rose-700 font-bold block">
                        Wajib Masuk Bengkel
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <Badge variant="success" icon={CheckCircle2}>
                        FIT TO DISPATCH
                      </Badge>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        Siap Jalan
                      </span>
                    </div>
                  )}
                </TableCell>

                {/* Aksi */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={ArrowUpRight}
                      iconPosition="right"
                      onClick={() => onSelectTruck(truck.id)}
                      title="Buka Denah Roda di Digital Twin">
                      Denah Roda
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={Wrench}
                      onClick={() => onNavigateUpdateTires(truck.plateNumber)}
                      title="Audit / Update Kondisi Ban Fisik"
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}

          {filteredAnalysis.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-slate-400">
                Tidak ditemukan armada yang sesuai dengan filter pencarian.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

