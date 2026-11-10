// src/views/TruckCouplingView.tsx
import { useState } from "react";
import {
  Link2,
  Unlink,
  Truck,
  Container,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import { type TruckFleetTireItem } from "../data/mockTires";
import { type ChassisTrailerAsset, type ChassisType } from "../types/truck/tires";

interface TruckCouplingViewProps {
  truckList: TruckFleetTireItem[];
  chassisList: ChassisTrailerAsset[];
  onCouple: (truckId: string, chassis: ChassisTrailerAsset) => void;
  onUncouple: (truckId: string) => void;
}

export default function TruckCouplingView({
  truckList,
  chassisList,
  onCouple,
  onUncouple,
}: TruckCouplingViewProps) {
  // Modal Pasang Gandengan (Hook Modal)
  const [isHookModalOpen, setIsHookModalOpen] = useState<boolean>(false);
  const [selectedTruckId, setSelectedTruckId] = useState<string>("");
  const [selectedChassisId, setSelectedChassisId] = useState<string>("");
  const [overrideWheelConfig, setOverrideWheelConfig] =
    useState<ChassisType>("2_AXLE");

  // Filter Sasis yang siap gandeng (STANDALONE_POOL)
  const availableChassis = chassisList.filter(
    (c) => c.status === "STANDALONE_POOL",
  );
  const coupledChassis = chassisList.filter((c) => c.status === "ATTACHED");
  const repairChassis = chassisList.filter((c) => c.status === "UNDER_REPAIR");

  // Handler Buka Modal Hook
  const handleOpenHookModal = (truckId: string) => {
    setSelectedTruckId(truckId);
    if (availableChassis.length > 0) {
      setSelectedChassisId(availableChassis[0].id);
      setOverrideWheelConfig(availableChassis[0].type);
    }
    setIsHookModalOpen(true);
  };

  // Eksekusi Pemasangan Sasis (Hook)
  const handleExecuteHook = () => {
    const targetChassis = chassisList.find((c) => c.id === selectedChassisId);
    if (!targetChassis || !selectedTruckId) {return;}

    // Terapkan konfigurasi sasis (termasuk edge case sasis 40ft 14 ban)
    const configuredChassis: ChassisTrailerAsset = {
      ...targetChassis,
      type: overrideWheelConfig,
      wheelCount: overrideWheelConfig === "2_AXLE" ? 14 : 18,
      status: "ATTACHED",
      attachedHeadId: selectedTruckId,
    };

    onCouple(selectedTruckId, configuredChassis);
    setIsHookModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* ================= 1. HEADER & KPI STATUS SASIS ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Link2 size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  Perangkaian Armada (Coupling Drop & Hook)
                </h1>
                <span className="rounded-md bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-black uppercase">
                  DROP & HOOK LIFECYCLE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manajemen pelepasan dan pengaitan kepala truk (Tractor Head)
                dengan sasis gandengan (Chassis Trailer)
              </p>
            </div>
          </div>
        </div>

        {/* Ringkasan Status Sasis di Pool */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Total Sasis di Pool
            </span>
            <span className="text-xl font-black text-slate-900">
              {chassisList.length} Unit
            </span>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-emerald-900">
            <span className="text-[10px] font-bold text-emerald-600 uppercase block">
              Tergandeng (Aktif)
            </span>
            <span className="text-xl font-black text-emerald-700">
              {coupledChassis.length} Rangkaian
            </span>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-blue-900">
            <span className="text-[10px] font-bold text-blue-600 uppercase block">
              Standby Siap Gandeng
            </span>
            <span className="text-xl font-black text-blue-700">
              {availableChassis.length} Sasis
            </span>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-amber-900">
            <span className="text-[10px] font-bold text-amber-600 uppercase block">
              Perbaikan di Bengkel
            </span>
            <span className="text-xl font-black text-amber-700">
              {repairChassis.length} Sasis
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. DAFTAR KEPALA TRUK & STATUS PERANGKAIAN ================= */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Truck size={18} className="text-slate-700" />
          <span>Status Rangkaian Kepala Truk di Pool</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {truckList.map((truck) => {
            const currentChassis = chassisList.find(
              (c) => c.attachedHeadId === truck.id,
            );
            const isCoupled = Boolean(currentChassis);

            return (
              <div
                key={truck.id}
                className={`rounded-2xl border bg-white p-5 shadow-2xs space-y-4 transition ${
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
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1 text-[10px] font-black uppercase flex items-center gap-1">
                      <CheckCircle2 size={12} /> Tergandeng
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 text-[10px] font-black uppercase flex items-center gap-1">
                      <AlertCircle size={12} /> Bobtail (Tanpa Sasis)
                    </span>
                  )}
                </div>

                {/* Sasis Info Card */}
                {isCoupled && currentChassis ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Container size={16} className="text-blue-600" />
                        <span className="font-black text-slate-900 text-xs">
                          {currentChassis.chassisCode}
                        </span>
                        <span className="rounded bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5">
                          {currentChassis.lengthCategory}
                        </span>
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
                    <button
                      type="button"
                      onClick={() => onUncouple(truck.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition">
                      <Unlink size={14} />
                      <span>Lepas Sasis (Drop to Pool)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={availableChassis.length === 0}
                      onClick={() => handleOpenHookModal(truck.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:bg-slate-300 shadow-md shadow-blue-500/20 transition">
                      <Link2 size={14} />
                      <span>Kaitkan Sasis (Hook)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 3. INVENTARIS SASIS STANDBY DI POOL ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Container size={18} className="text-blue-600" />
          <span>Daftar Sasis Mandiri di Pool (Chassis Yard)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      isAttached
                        ? "bg-emerald-100 text-emerald-800"
                        : isRepair
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                    }`}>
                    {isAttached
                      ? "Tergandeng"
                      : isRepair
                        ? "Di Bengkel"
                        : "Standby di Pool"}
                  </span>
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
        </div>
      </div>

      {/* ================= MODAL PASANG GANDENGAN (HOOK MODAL) ================= */}
      {isHookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Link2 size={20} className="text-blue-600" />
                <h3 className="font-black text-sm text-slate-900">
                  Kaitkan Sasis ke Truk {selectedTruckId}
                </h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Pilihan Sasis */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Sasis Standby di Pool:
                </label>
                <select
                  value={selectedChassisId}
                  onChange={(e) => {
                    setSelectedChassisId(e.target.value);
                    const target = chassisList.find(
                      (c) => c.id === e.target.value,
                    );
                    if (target) {setOverrideWheelConfig(target.type);}
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900 focus:border-blue-500 focus:outline-none">
                  {availableChassis.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.chassisCode} • {c.lengthCategory} (
                      {c.type === "2_AXLE" ? "14 Ban" : "18 Ban"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Edge Case Pilihan Konfigurasi Roda */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 space-y-2">
                <label className="block font-bold text-blue-950 flex items-center gap-1.5">
                  <SlidersHorizontal size={14} className="text-blue-600" />
                  Konfigurasi Gandar Roda (Edge Case Sasis):
                </label>
                <select
                  value={overrideWheelConfig}
                  onChange={(e) =>
                    setOverrideWheelConfig(e.target.value as ChassisType)
                  }
                  className="w-full rounded-xl border border-blue-300 bg-white px-3 py-2 font-bold text-slate-900 focus:border-blue-500 focus:outline-none">
                  <option value="2_AXLE">
                    2 Sumbu • 14 Ban (Trailer 20ft / Sasis 40ft Ban Pendek)
                  </option>
                  <option value="3_AXLE">
                    3 Sumbu • 18 Ban (Trailer 40ft Standar 3 Gandar)
                  </option>
                </select>
                <span className="text-[10px] text-blue-800 block">
                  💡 Aturan PT ALN: Sasis 40ft diperbolehkan memakai ban sasis
                  pendek (14 ban).
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsHookModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 text-xs">
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteHook}
                className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 text-xs">
                Kaitkan Sasis Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
