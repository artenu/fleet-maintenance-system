// src/components/tireHistory/TireHistoryList.tsx
import type {
  TireHistoryListProps,
  HistoryLogType,
} from "@/types/TireHistoryView/TireHistoryViewTypes";

// 🧱 Komponen Reusable Design System
import { Card, Badge } from "@/components/common";
import { SearchInput, Select } from "@/components/forms";
import {
  HISTORY_TYPE_FILTER_OPTIONS,
  getHistoryActionBadge,
  getHistoryActionIcon,
} from "@/constants/tireHistory";

import { Filter, User, Calendar } from "lucide-react";

/**
 * Komponen List Riwayat Mutasi & Rotasi Roda (Audit Trail)
 * Menampilkan catatan transaksi perpindahan ban, pemasangan baru, vulkanisir, dan afkir.
 */
export default function TireHistoryList({
  filteredLogs,
  totalLogsCount,
  searchTerm,
  onSearchTermChange,
  typeFilter,
  onTypeFilterChange,
}: TireHistoryListProps) {
  return (
    <Card className="space-y-4">
      {/* Toolbar Header & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            Riwayat Mutasi & Perubahan Roda Terdaftar
          </h3>
          <p className="text-xs text-slate-500">
            Menampilkan {filteredLogs.length} dari {totalLogsCount} log
            transaksi mutasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="w-56">
            <SearchInput
              placeholder="Cari truk, deskripsi, PIC..."
              value={searchTerm}
              onChange={onSearchTermChange}
            />
          </div>

          {/* Filter Jenis Aksi Reusable Select */}
          <div className="w-56">
            <Select
              icon={Filter}
              value={typeFilter}
              onChange={(e) =>
                onTypeFilterChange(e.target.value as HistoryLogType)
              }
              options={HISTORY_TYPE_FILTER_OPTIONS}
            />
          </div>
        </div>
      </div>

      {/* List Kartu Mutasi */}
      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 hover:bg-white hover:border-blue-200 hover:shadow-xs transition duration-150">
              <div className="flex items-start gap-3.5 max-w-3xl">
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                  {getHistoryActionIcon(item.type)}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-slate-900 text-sm tracking-wide">
                      {item.truck}
                    </span>
                    {getHistoryActionBadge(item.type)}
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar size={11} />
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <User size={12} className="text-slate-400" />
                    <span>Petugas PIC:</span>
                    <strong className="text-slate-800 font-bold">
                      {item.pic}
                    </strong>
                  </div>
                </div>
              </div>

              <Badge
                variant="neutral"
                className="text-[10px] shrink-0 font-mono">
                {item.id}
              </Badge>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 italic text-xs">
            Tidak ada riwayat mutasi ban yang cocok dengan kata kunci pencarian.
          </div>
        )}
      </div>
    </Card>
  );
}
