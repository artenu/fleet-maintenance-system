// src/components/tireInventory/TireInventoryTable.tsx
import type {
  TireInventoryTableProps,
  RetreadFilterType,
} from "@/types/TireInventoryView/TireInventoryViewTypes";

// 🧱 Komponen Reusable Design System
import {
  Card,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/common";
import { SearchInput, Select } from "@/components/forms";

import { Filter, CheckCircle2, Warehouse, Clock, Lock } from "lucide-react";

/**
 * Komponen Tabel Master Stok & Gudang Ban Pool
 * Menampilkan daftar ban standby, siklus casing, kondisi fisik tapak, dan data finansial (RBAC).
 */
export default function TireInventoryTable({
  filteredTires,
  totalWarehouseTires,
  searchTerm,
  onSearchTermChange,
  retreadFilter,
  onRetreadFilterChange,
  selectedBrand,
  onSelectedBrandChange,
  brandList,
  canViewFinancials,
}: TireInventoryTableProps) {
  return (
    <Card className="space-y-4">
      {/* Toolbar Pencarian & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            Daftar Ban Standby di Gudang Pool
          </h3>
          <p className="text-xs text-slate-500">
            Menampilkan {filteredTires.length} dari {totalWarehouseTires} ban yang
            tersedia
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input Reusable */}
          <div className="w-56">
            <SearchInput
              placeholder="Cari serial, merk, ukuran..."
              value={searchTerm}
              onChange={onSearchTermChange}
            />
          </div>

          {/* Filter Casing Reusable Select */}
          <div className="w-48">
            <Select
              icon={Filter}
              value={retreadFilter}
              onChange={(e) =>
                onRetreadFilterChange(e.target.value as RetreadFilterType)
              }
              options={[
                { value: "ALL", label: "Semua Casing" },
                { value: "R0", label: "Hanya R0 (Baru)" },
                { value: "RETREAD", label: "Vulkanisir (R1-R3)" },
                { value: "R1", label: "Vulkanisir R1" },
                { value: "R2", label: "Vulkanisir R2" },
                { value: "R3", label: "Vulkanisir R3" },
              ]}
            />
          </div>

          {/* Filter Merk Reusable Select */}
          {brandList.length > 0 && (
            <div className="w-44">
              <Select
                value={selectedBrand}
                onChange={(e) => onSelectedBrandChange(e.target.value)}
                options={[
                  { value: "ALL", label: "Semua Merk" },
                  ...brandList.map((brand) => ({
                    value: brand,
                    label: brand,
                  })),
                ]}
              />
            </div>
          )}
        </div>
      </div>

      {/* Reusable Design System Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Nomor Seri (DOT)</TableHead>
            <TableHead>Merk & Tipe</TableHead>
            <TableHead>Ukuran</TableHead>
            <TableHead>Siklus Casing</TableHead>
            <TableHead>Kondisi Fisik</TableHead>
            <TableHead>Status Lokasi</TableHead>
            <TableHead>Tanggal Masuk</TableHead>
            {canViewFinancials && (
              <TableHead className="text-right">Harga Beli</TableHead>
            )}
          </tr>
        </TableHeader>
        <TableBody>
          {filteredTires.length > 0 ? (
            filteredTires.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-black text-slate-900 tracking-wide">
                  {t.serialNumber}
                </TableCell>
                <TableCell className="font-semibold text-slate-700">
                  {t.brand}
                </TableCell>
                <TableCell className="text-slate-600">{t.size}</TableCell>
                <TableCell>
                  {t.retreadStatus === "R0" ? (
                    <Badge variant="info">R0 (Baru)</Badge>
                  ) : t.retreadStatus === "R1" ? (
                    <Badge variant="warning">R1 (Vulkanisir 1x)</Badge>
                  ) : t.retreadStatus === "R2" ? (
                    <Badge variant="warning">R2 (Vulkanisir 2x)</Badge>
                  ) : t.retreadStatus === "R3" ? (
                    <Badge variant="danger">R3 (Batas Akhir)</Badge>
                  ) : (
                    <Badge variant="danger">Afkir</Badge>
                  )}
                </TableCell>
                <TableCell className="font-black text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>{t.lastInspectionPercent}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px]">
                    <Warehouse size={12} />
                    {t.currentPosition}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 font-medium">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock size={11} className="text-slate-400" />
                    <span>{t.lastInspectionDate || "-"}</span>
                  </div>
                </TableCell>
                {canViewFinancials && (
                  <TableCell className="text-right font-black text-slate-900">
                    {t.purchasePrice
                      ? `Rp ${t.purchasePrice.toLocaleString("id-ID")}`
                      : "-"}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={canViewFinancials ? 8 : 7}
                className="py-10 text-center text-slate-400 italic">
                Tidak ada ban gudang yang cocok dengan kriteria pencarian /
                filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Catatan Privasi RBAC untuk Non-Admin */}
      {!canViewFinancials && (
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-600">
          <Lock size={14} className="text-slate-400 shrink-0" />
          <p className="text-[11px]">
            <strong>Perlindungan Data Finansial (RBAC):</strong> Kolom harga
            beli dan biaya jasa disembunyikan untuk hak akses Surveyor/Mekanik
            sesuai SOP PT ALN.
          </p>
        </div>
      )}
    </Card>
  );
}

