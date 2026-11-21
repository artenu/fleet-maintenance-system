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
  Gauge,
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
}: FleetHealthTableProps) {
  const { totalTrucks, fitCount, groundedCount, attachedChassisCount } = stats;

  return (
    <Card className="space-y-4">
      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        {/* Horizontal scrollable pills with shrink-0 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Button
            variant={statusFilter === "ALL" ? "secondary" : "outline"}
            size="sm"
            onClick={() => onStatusFilterChange("ALL")}
            className="shrink-0">
            Semua Armada ({totalTrucks})
          </Button>
          <Button
            variant={statusFilter === "FIT" ? "success" : "ghost"}
            size="sm"
            onClick={() => onStatusFilterChange("FIT")}
            className={`shrink-0 ${
              statusFilter !== "FIT"
                ? "text-emerald-700 hover:bg-emerald-50"
                : ""
            }`}>
            Fit To Dispatch ({fitCount})
          </Button>
          <Button
            variant={statusFilter === "GROUNDED" ? "danger" : "ghost"}
            size="sm"
            onClick={() => onStatusFilterChange("GROUNDED")}
            className={`shrink-0 ${
              statusFilter !== "GROUNDED"
                ? "text-rose-700 hover:bg-rose-50"
                : ""
            }`}>
            Grounded ({groundedCount})
          </Button>
          <Button
            variant={statusFilter === "BOBTAIL" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onStatusFilterChange("BOBTAIL")}
            className={`shrink-0 ${
              statusFilter !== "BOBTAIL"
                ? "text-amber-700 hover:bg-amber-50"
                : ""
            }`}>
            Bobtail ({totalTrucks - attachedChassisCount})
          </Button>
        </div>

        <div className="w-full md:w-72 shrink-0">
          <SearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Cari Plat, Unit, Sasis..."
          />
        </div>
      </div>

      {/* Petunjuk swipe di mobile */}
      <div className="text-[11px] text-slate-400 font-medium flex items-center justify-end gap-1 md:hidden">
        <span>👉 Geser tabel ke kanan untuk melihat rincian lengkap</span>
      </div>

      {/* Tabel Data Unit dengan batas lebar minimum agar tidak gepeng */}
      <Table className="min-w-[880px]">
        <TableHeader>
          <tr>
            <TableHead className="min-w-[170px]">Unit & Plat Nomor</TableHead>
            <TableHead className="min-w-[150px]">Rangkaian Sasis</TableHead>
            <TableHead className="min-w-[140px]">Supir & Odometer</TableHead>
            <TableHead className="min-w-[120px]">
              Kondisi Ban Terpasang
            </TableHead>
            <TableHead className="min-w-[130px]">Audit Bulanan</TableHead>
            <TableHead className="min-w-[140px]">
              Kelaikan Operasional
            </TableHead>
            <TableHead className="text-right min-w-[130px]">Aksi</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredAnalysis.map((item) => {
            const { truck, attachedChassis, isGrounded, minPercent } = item;

            return (
              <TableRow key={truck.id}>
                {/* 1. Unit & Plat Nomor */}
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {truck.plateNumber}
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                        {truck.unitCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-[170px] font-medium">
                      {truck.brand}
                    </p>
                  </div>
                </TableCell>

                {/* 2. Rangkaian Sasis */}
                <TableCell>
                  {attachedChassis ? (
                    <div className="space-y-0.5">
                      <Badge
                        variant="info"
                        className="font-bold text-[10px] flex items-center gap-1 w-fit">
                        <Link2 size={11} className="shrink-0" />
                        <span>{attachedChassis.chassisCode}</span>
                      </Badge>
                      <span className="text-[11px] text-slate-500 block font-medium">
                        {attachedChassis.lengthCategory} •{" "}
                        {attachedChassis.wheelCount} Roda
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="neutral"
                        className="text-[10px] font-bold">
                        Bobtail (6 Ban)
                      </Badge>
                      <button
                        type="button"
                        onClick={onNavigateCoupling}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                        + Gandeng
                      </button>
                    </div>
                  )}
                </TableCell>

                {/* 3. Supir & Odometer */}
                <TableCell>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block truncate max-w-[140px] text-xs">
                      {truck.driver}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 font-mono flex items-center gap-1">
                      <Gauge size={12} className="text-slate-400 shrink-0" />
                      <span>{formatThousand(truck.currentOdometer)} KM</span>
                    </span>
                  </div>
                </TableCell>

                {/* 4. Kondisi Ban Terpasang */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {item.criticalTiresCount > 0 ? (
                        <Badge
                          variant="danger"
                          pulse
                          className="text-[10px] font-bold">
                          {item.criticalTiresCount} Ban Kritis
                        </Badge>
                      ) : (
                        <Badge
                          variant="success"
                          className="text-[10px] font-bold">
                          {item.tiresCount} Ban Prima
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <span>Tapak min:</span>
                      <strong
                        className={`font-mono font-bold ${
                          minPercent < 40 ? "text-rose-600" : "text-emerald-700"
                        }`}>
                        {minPercent}%
                      </strong>
                    </div>
                  </div>
                </TableCell>

                {/* 5. Audit Bulanan */}
                <TableCell>
                  {item.isAuditOverdue ? (
                    <Badge
                      variant="danger"
                      icon={CalendarClock}
                      pulse
                      className="text-[10px] font-bold">
                      Overdue ({truck.auditSchedule?.nextAuditSchedule || "-"})
                    </Badge>
                  ) : (
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                      <CalendarClock
                        size={13}
                        className="text-slate-400 shrink-0"
                      />
                      <span>
                        {truck.auditSchedule?.nextAuditSchedule || "-"}
                      </span>
                    </span>
                  )}
                </TableCell>

                {/* 6. Kelaikan Operasional */}
                <TableCell>
                  {isGrounded ? (
                    <Badge
                      variant="danger"
                      icon={AlertOctagon}
                      pulse
                      className="font-extrabold text-[10px] py-1 px-2.5">
                      GROUNDED
                    </Badge>
                  ) : (
                    <Badge
                      variant="success"
                      icon={CheckCircle2}
                      className="font-extrabold text-[10px] py-1 px-2.5">
                      FIT TO DISPATCH
                    </Badge>
                  )}
                </TableCell>

                {/* 7. Tombol Aksi Langsung ke Digital Twin */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={ArrowUpRight}
                      iconPosition="right"
                      onClick={() => onSelectTruck(truck.id)}
                      className="border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition font-bold text-xs"
                      title="Buka Denah Roda & Manajemen Ban di Digital Twin">
                      View
                    </Button>
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
                Tidak ada data armada yang cocok dengan filter atau pencarian
                Anda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
