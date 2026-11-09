import { useState } from "react";
import { TruckFleetTireItem } from "../data/mockTires";
import { TireAsset } from "../types/tires";
import { Warehouse, Search, Filter } from "lucide-react";

interface TireInventoryViewProps {
  truckList: TruckFleetTireItem[];
  warehouseTires: TireAsset[];
  onReceiveNewTire?: () => void;
}

export default function TireInventoryView({
  truckList,
  warehouseTires,
  onReceiveNewTire,
}: TireInventoryViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [retreadFilter, setRetreadFilter] = useState<string>("ALL");

  // Filter Data Ban Gudang
  const filteredTires = warehouseTires.filter((t) => {
    const matchesSearch =
      t.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      retreadFilter === "ALL"
        ? true
        : retreadFilter === "R0"
          ? t.retreadStatus === "R0"
          : t.retreadStatus !== "R0";

    return matchesSearch && matchesFilter;
  });

  const totalMountedTires = truckList.reduce(
    (acc, t) => acc + t.tires.length,
    0,
  );
  const r0Count = warehouseTires.filter((w) => w.retreadStatus === "R0").length;
  const retreadCount = warehouseTires.filter(
    (w) => w.retreadStatus !== "R0",
  ).length;

  return (
    <div className="space-y-5">
      {/* 1. Ringkasan KPI Inventaris */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Ban Terpasang
          </span>
          <strong className="text-xl font-extrabold text-slate-900 mt-1 block">
            {totalMountedTires} Unit
          </strong>
          <p className="text-xs text-slate-500 mt-0.5">
            Di {truckList.length} Unit Truk Armada
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Stok Gudang (Standby)
          </span>
          <strong className="text-xl font-extrabold text-blue-600 mt-1 block">
            {warehouseTires.length} Unit
          </strong>
          <p className="text-xs text-slate-500 mt-0.5">Siap pasang / rotasi</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Ban Baru (R0)
          </span>
          <strong className="text-xl font-extrabold text-emerald-600 mt-1 block">
            {r0Count} Unit
          </strong>
          <p className="text-xs text-slate-500 mt-0.5">
            Khusus gandar Steer & Baru
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Vulkanisir (R1/R2)
          </span>
          <strong className="text-xl font-extrabold text-amber-600 mt-1 block">
            {retreadCount} Unit
          </strong>
          <p className="text-xs text-slate-500 mt-0.5">
            Khusus gandar Drive/Trailer
          </p>
        </div>
      </div>

      {/* 2. Tabel Stok Gudang dengan Filter & Search */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {/* Header Bar Tabel */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Daftar Ban Standby di Gudang Pool
            </h3>
            <p className="text-xs text-slate-500">
              Inventaris ban siap pakai untuk rotasi dan penggantian cepat
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari serial / merk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs font-semibold focus:bg-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 w-44"
              />
              <Search
                size={14}
                className="absolute left-2.5 top-2.5 text-slate-400"
              />
            </div>

            {/* Filter Retread */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <Filter size={13} className="text-slate-400" />
              <select
                value={retreadFilter}
                onChange={(e) => setRetreadFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer">
                <option value="ALL">Semua Casing</option>
                <option value="R0">Hanya R0 (Baru)</option>
                <option value="RETREAD">Vulkanisir (R1/R2)</option>
              </select>
            </div>

            {/* Tombol Terima Ban Baru */}
            <button
              type="button"
              onClick={
                onReceiveNewTire ||
                (() => alert("Fitur Registrasi Penerimaan Ban Baru Gudang"))
              }
              className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs transition">
              <Warehouse size={14} /> + Terima Ban Baru
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[10px] font-extrabold">
              <tr>
                <th className="py-3 px-4">Nomor Seri</th>
                <th className="py-3 px-4">Merk & Tipe</th>
                <th className="py-3 px-4">Ukuran</th>
                <th className="py-3 px-4">Siklus Casing</th>
                <th className="py-3 px-4">Kondisi Fisik</th>
                <th className="py-3 px-4">Status Lokasi</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTires.length > 0 ? (
                filteredTires.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {t.serialNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {t.brand}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{t.size}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                          t.retreadStatus === "R0"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                        {t.retreadStatus === "R0"
                          ? "R0 (Baru)"
                          : `${t.retreadStatus} (Vulkanisir)`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {t.lastInspectionPercent}%
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {t.currentPosition}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {t.lastInspectionDate || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-slate-400 italic">
                    Tidak ada ban yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
