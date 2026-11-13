// src/components/auditSchedule/TireAuditScheduleTable.tsx
import type {
  TireAuditScheduleTableProps,
  AuditStatusFilter,
} from "@/types/TireAuditScheduleView/TireAuditScheduleViewTypes";

// 🧱 Komponen Reusable Design System
import {
  Card,
  Badge,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/common";
import { SearchInput, Select } from "@/components/forms";

import { Filter, User, Clock, CheckCircle2 } from "lucide-react";

/**
 * Komponen Tabel Jadwal Audit Fisik Rutin Truk
 * Menampilkan jadwal berkala 30 hari, status jatuh tempo (overdue), dan opsi dispensasi penundaan
 */
export default function TireAuditScheduleTable({
  filteredTrucks,
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  onOpenReschedule,
}: TireAuditScheduleTableProps) {
  return (
    <Card className="space-y-4">
      {/* Toolbar Header & Pencarian */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            Daftar Jadwal Audit Fisik Unit Truk
          </h3>
          <p className="text-xs text-slate-500">
            Siklus Audit Berjalan: <strong>Oktober / November 2026</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="w-56">
            <SearchInput
              placeholder="Cari plat, supir, PIC..."
              value={searchTerm}
              onChange={onSearchTermChange}
            />
          </div>

          {/* Filter Status */}
          <div className="w-48">
            <Select
              icon={Filter}
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as AuditStatusFilter)
              }
              options={[
                { value: "ALL", label: "Semua Status" },
                { value: "OVERDUE", label: "Kritis (Overdue)" },
                { value: "RESCHEDULED", label: "Dispensasi" },
                { value: "PENDING", label: "Menunggu Audit" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Tabel Data Jadwal */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Kode Truk & Plat</TableHead>
            <TableHead>Pengemudi (Driver)</TableHead>
            <TableHead>Audit Terakhir</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            <TableHead>Status Kepatuhan</TableHead>
            <TableHead>Surveyor PIC</TableHead>
            <TableHead className="text-right">Aksi Kepala Pool</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredTrucks.length > 0 ? (
            filteredTrucks.map((truck) => (
              <TableRow key={truck.id}>
                <TableCell>
                  <strong className="text-slate-900 font-black block">
                    {truck.unitCode}
                  </strong>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {truck.plateNumber}
                  </span>
                </TableCell>
                <TableCell className="text-slate-700 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-slate-400" />
                    <span>{truck.driver}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 font-medium">
                  {truck.auditSchedule.lastAuditDate}
                </TableCell>
                <TableCell className="font-black text-slate-900">
                  {truck.auditSchedule.nextAuditSchedule}
                </TableCell>
                <TableCell>
                  {truck.auditSchedule.status === "OVERDUE" ? (
                    <Badge variant="danger" className="animate-pulse">
                      OVERDUE
                    </Badge>
                  ) : truck.auditSchedule.status === "RESCHEDULED" ? (
                    <Badge variant="info">RESCHEDULED</Badge>
                  ) : (
                    <Badge variant="success">TERJADWAL</Badge>
                  )}
                </TableCell>
                <TableCell className="text-slate-600 font-medium">
                  {truck.auditSchedule.surveyorName}
                </TableCell>
                <TableCell className="text-right">
                  {truck.auditSchedule.status === "OVERDUE" ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onOpenReschedule(truck)}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                      Beri Izin Reschedule
                    </Button>
                  ) : truck.auditSchedule.status === "RESCHEDULED" ? (
                    <span className="inline-flex items-center justify-end gap-1 font-bold text-blue-700 text-[11px]">
                      <Clock size={12} /> Diundur s/d{" "}
                      {truck.auditSchedule.nextAuditSchedule}
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-end gap-1 font-bold text-emerald-700 text-[11px]">
                      <CheckCircle2 size={12} /> Terjadwal Aman
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center text-slate-400 italic">
                Tidak ada unit yang cocok dengan kriteria filter audit.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

