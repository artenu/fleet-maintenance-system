// src/components/analyticsCPK/TruckCostAnalyticsTable.tsx
import type {
  TruckCostAnalyticsTableProps,
  TruckCostSortBy,
} from "@/types/TireAnalyticsView/TireAnalyticsViewTypes";
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from "@/components/common";
import { SearchInput, Select } from "@/components/forms";
import {
  Flame,
  History,
  Truck,
  ArrowUpDown,
  Gauge,
  Wallet,
} from "lucide-react";

const TRUCK_SORT_OPTIONS = [
  { value: "COST_DESC", label: "Biaya Ban Tertinggi (Beban Terbesar)" },
  { value: "ODO_DESC", label: "Masa Pakai / Odometer Terpanjang" },
  { value: "CPK_DESC", label: "CPK Unit Tertinggi (Biaya/KM)" },
  { value: "UNIT_ASC", label: "Kode Unit Truk (A-Z)" },
];

export default function TruckCostAnalyticsTable({
  truckRankings,
  highestCostTruck,
  longestServiceLifeTruck,
  searchTerm,
  onSearchTermChange,
  sortBy,
  onSortByChange,
}: TruckCostAnalyticsTableProps) {
  return (
    <div className="space-y-6">
      {/* 1. Spotlight Cards: Truk Biaya Tertinggi & Truk Masa Pakai Terpanjang */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card A: Truk Biaya Ban Terbesar */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/50 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700">
                <Flame size={14} className="text-rose-600 fill-rose-500" />
                Beban Biaya Operasional Tertinggi
              </div>
              <h4 className="text-xl font-black text-slate-900 pt-1">
                {highestCostTruck ? highestCostTruck.unitCode : "-"}
              </h4>
              <p className="text-xs font-medium text-slate-500">
                {highestCostTruck
                  ? `${highestCostTruck.plateNumber} • ${highestCostTruck.brand}`
                  : "Belum ada data unit"}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-500/25">
              <Wallet size={24} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-rose-100 pt-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">
                Total Biaya Ban
              </p>
              <p className="text-sm font-black text-rose-600">
                Rp{" "}
                {highestCostTruck
                  ? highestCostTruck.totalTireCost.toLocaleString("id-ID")
                  : 0}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">
                Ban Terpasang
              </p>
              <p className="text-sm font-black text-slate-800">
                {highestCostTruck ? `${highestCostTruck.totalTires} Roda` : "-"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">
                Supir Utama
              </p>
              <p className="text-sm font-black text-slate-800 truncate">
                {highestCostTruck ? highestCostTruck.driver : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Card B: Truk Masa Pakai / Jam Terbang Terpanjang */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/50 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">
                <History size={14} className="text-sky-600" />
                Masa Pakai & Jam Terbang Terpanjang
              </div>
              <h4 className="text-xl font-black text-slate-900 pt-1">
                {longestServiceLifeTruck
                  ? longestServiceLifeTruck.unitCode
                  : "-"}
              </h4>
              <p className="text-xs font-medium text-slate-500">
                {longestServiceLifeTruck
                  ? `${longestServiceLifeTruck.plateNumber} • ${longestServiceLifeTruck.brand}`
                  : "Belum ada data unit"}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-500/25">
              <Gauge size={24} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-sky-100 pt-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">
                Total Odometer
              </p>
              <p className="text-sm font-black text-sky-600">
                {longestServiceLifeTruck
                  ? `${longestServiceLifeTruck.currentOdometer.toLocaleString("id-ID")} KM`
                  : "0 KM"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">
                Rata-rata Usia Ban
              </p>
              <p className="text-sm font-black text-slate-800">
                {longestServiceLifeTruck
                  ? `${longestServiceLifeTruck.averageTireKmRun.toLocaleString("id-ID")} KM`
                  : "0 KM"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">
                Supir Utama
              </p>
              <p className="text-sm font-black text-slate-800 truncate">
                {longestServiceLifeTruck ? longestServiceLifeTruck.driver : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Comparison Table Card */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Truck size={16} className="text-slate-600" />
              Peringkat Efisiensi Biaya & Masa Pakai Antar Truk
            </h3>
            <p className="text-xs text-slate-500">
              Perbandingan total investasi ban aktif dan jarak tempuh
              operasional per unit armada
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-56">
              <SearchInput
                placeholder="Cari unit / supir / nopol..."
                value={searchTerm}
                onChange={onSearchTermChange}
              />
            </div>
            <div className="w-64">
              <Select
                icon={ArrowUpDown}
                value={sortBy}
                onChange={(e) =>
                  onSortByChange(e.target.value as TruckCostSortBy)
                }
                options={TRUCK_SORT_OPTIONS}
              />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <tr>
              <TableHead>Kode & Nopol Unit</TableHead>
              <TableHead>Tipe Sasis & Kapasitas</TableHead>
              <TableHead>Pengemudi</TableHead>
              <TableHead>Jam Terbang (Odometer)</TableHead>
              <TableHead>Total Biaya Ban Terpasang</TableHead>
              <TableHead>Rata-rata Usia Ban</TableHead>
              <TableHead className="text-right">Status Evaluasi</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {truckRankings.length > 0 ? (
              truckRankings.map((truck) => (
                <TableRow
                  key={truck.id}
                  className={
                    truck.isHighestCost
                      ? "bg-rose-50/40"
                      : truck.isLongestServiceLife
                        ? "bg-sky-50/30"
                        : undefined
                  }>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900">
                        {truck.unitCode}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {truck.plateNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold text-slate-700">
                        {truck.chassisType === "3_AXLE"
                          ? "3 Sumbu (18 Ban)"
                          : "2 Sumbu (14 Ban)"}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Trailer {truck.capacity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 text-xs">
                    {truck.driver}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-900 text-xs">
                        {truck.currentOdometer.toLocaleString("id-ID")} KM
                      </span>
                      {truck.isLongestServiceLife && (
                        <Badge
                          variant="info"
                          className="text-[10px] py-0.5 px-1.5 font-bold">
                          #1 Odometer
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-rose-600 text-xs">
                        Rp {truck.totalTireCost.toLocaleString("id-ID")}
                      </span>
                      {truck.isHighestCost && (
                        <Badge
                          variant="danger"
                          className="text-[10px] py-0.5 px-1.5 font-bold">
                          #1 Beban Biaya
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-semibold">
                    {truck.totalTires > 0 ? (
                      `${truck.averageTireKmRun.toLocaleString("id-ID")} KM (${truck.totalTires} Ban)`
                    ) : (
                      <span className="italic text-slate-400">0 Ban Aktif</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {truck.isHighestCost ? (
                      <Badge variant="danger" className="text-xs">
                        Beban Tertinggi
                      </Badge>
                    ) : truck.isLongestServiceLife ? (
                      <Badge variant="info" className="text-xs">
                        Masa Pakai Terpanjang
                      </Badge>
                    ) : truck.totalTires === 0 ? (
                      <Badge variant="warning" className="text-xs">
                        Unit Standby
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-xs">
                        Normal Efisien
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-slate-400 italic">
                  Tidak ada data truk yang cocok dengan kata kunci pencarian.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
