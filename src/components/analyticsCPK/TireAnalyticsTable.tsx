// src/components/analyticsCPK/TireAnalyticsTable.tsx
import type {
  TireAnalyticsTableProps,
  AnalyticsSortBy,
} from "@/types/TireAnalyticsView/TireAnalyticsViewTypes";

// 🧱 Komponen Reusable Design System
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/common";
import { SearchInput, Select } from "@/components/forms";
import {
  CPK_TIER_FILTER_OPTIONS,
  CPK_SORT_OPTIONS,
  getCPKTierBadge,
  getCPKEfficiencyBadge,
} from "@/constants/analyticsCPK";

import { Filter, ArrowUpDown, Zap, Lightbulb } from "lucide-react";

/**
 * Komponen Tabel Analitik Performa Merk & CPK (Cost Per Kilometer)
 * Mengevaluasi kinerja durabilitas jarak tempuh terhadap biaya pengadaan ban.
 */
export default function TireAnalyticsTable({
  analyticsList,
  searchTerm,
  onSearchTermChange,
  tierFilter,
  onTierFilterChange,
  sortBy,
  onSortByChange,
}: TireAnalyticsTableProps) {
  return (
    <Card className="space-y-4">
      {/* Toolbar Header, Search, Filter Tier, and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            Peringkat Efisiensi Merk & Tipe Ban
          </h3>
          <p className="text-xs text-slate-500">
            Evaluasi kinerja jarak tempuh terhadap biaya investasi per unit ban
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="w-52">
            <SearchInput
              placeholder="Cari merk ban..."
              value={searchTerm}
              onChange={onSearchTermChange}
            />
          </div>

          {/* Filter Tier */}
          <div className="w-44">
            <Select
              icon={Filter}
              value={tierFilter}
              onChange={(e) => onTierFilterChange(e.target.value)}
              options={CPK_TIER_FILTER_OPTIONS}
            />
          </div>

          {/* Sort Options */}
          <div className="w-56">
            <Select
              icon={ArrowUpDown}
              value={sortBy}
              onChange={(e) =>
                onSortByChange(e.target.value as AnalyticsSortBy)
              }
              options={CPK_SORT_OPTIONS}
            />
          </div>
        </div>
      </div>

      {/* Reusable Design System Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Merk & Tipe Ban</TableHead>
            <TableHead>Klasifikasi Tier</TableHead>
            <TableHead>Harga Acuan Pengadaan</TableHead>
            <TableHead>Rata-rata Jarak Tempuh</TableHead>
            <TableHead>Nilai CPK (Biaya / KM)</TableHead>
            <TableHead>Rekomendasi Alokasi Gandar</TableHead>
            <TableHead className="text-right">Rating Efisiensi</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {analyticsList.length > 0 ? (
            analyticsList.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-black text-slate-900 tracking-wide">
                  {item.brandName}
                </TableCell>
                <TableCell>{getCPKTierBadge(item.tier)}</TableCell>
                <TableCell className="font-semibold text-slate-700">
                  Rp {item.standardPrice.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="font-black text-slate-900">
                  {item.averageKmRun.toLocaleString("id-ID")} KM
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 font-black text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    <Zap size={12} className="text-amber-500 fill-amber-500" />
                    Rp {item.cpkValue} / KM
                  </span>
                </TableCell>
                <TableCell className="font-medium text-slate-600 text-[11px]">
                  {item.recommendedAxle}
                </TableCell>
                <TableCell className="text-right">
                  {getCPKEfficiencyBadge(item.efficiencyRating)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center text-slate-400 italic">
                Tidak ada data merk yang cocok dengan kata kunci pencarian.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Insight Card: Panduan Alokasi Berbasis ROI */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-2">
        <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
          <Lightbulb size={16} className="text-amber-600" />
          <span>Rekomendasi Kebijakan Pengadaan & Alokasi Gandar PT ALN:</span>
        </div>
        <ul className="text-xs text-blue-900 space-y-1 list-disc pl-5">
          <li>
            <strong>Gandar Depan (Steer H1 & H2):</strong> Gunakan Ban Baru (R0)
            atau Maksimal Vulkanisir 1x (R1) dari merk Tier-1 (Super Grip /
            Bridgestone / Michelin) demi keselamatan pengendalian armada
            bermuatan berat.
          </li>
          <li>
            <strong>Gandar Penggerak & Sasis (Drive & Trailer):</strong>{" "}
            Maksimalkan penggunaan{" "}
            <strong>Jasa Retread PT Boxer (Rp 950.000)</strong> untuk casing
            yang masih sehat karena menghasilkan CPK paling rendah (Rp 36 - 38 /
            KM), menghemat hingga 42% anggaran ban tahunan.
          </li>
        </ul>
      </div>
    </Card>
  );
}
