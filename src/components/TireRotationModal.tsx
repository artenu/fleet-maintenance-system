import React, { useState } from "react";
import {
  X,
  RotateCw,
  ArrowRightLeft,
  Warehouse,
  ShieldAlert,
} from "lucide-react";
import {
  type WheelSlotEvaluation,
  type TireAsset,
  type WheelPosition,
  type ChassisType,
} from "../types/truck/tires";

export type RotationMode = "SWAP_POSITION" | "REPLACE_FROM_WAREHOUSE";

export interface RotationResultPayload {
  mode: RotationMode;
  sourcePosition: WheelPosition;
  sourceTire: TireAsset;
  // Jika Swap:
  targetPosition?: WheelPosition;
  targetTire?: TireAsset | null;
  // Jika Replace from Warehouse:
  warehouseTireToInstall?: TireAsset;
  sourceTireDestination?: "GUDANG" | "VULKANISIR" | "AFKIR";
  // Metadata:
  reason: string;
  mechanicPic: string;
  odometer: number;
}

interface TireRotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceSlot: WheelSlotEvaluation | null;
  allTruckTires: TireAsset[];
  warehouseTires: TireAsset[];
  chassisType: ChassisType;
  truckUnitCode: string;
  currentOdometer: number;
  onExecuteRotation: (payload: RotationResultPayload) => void;
}

interface FormContentProps {
  onClose: () => void;
  sourceSlot: WheelSlotEvaluation & { tire: TireAsset };
  allTruckTires: TireAsset[];
  warehouseTires: TireAsset[];
  chassisType: ChassisType;
  truckUnitCode: string;
  currentOdometer: number;
  onExecuteRotation: (payload: RotationResultPayload) => void;
}

// Komponen Form terisolasi (React 19 Zero-useEffect Keyed Reset)
function TireRotationFormContent({
  onClose,
  sourceSlot,
  allTruckTires,
  warehouseTires,
  chassisType,
  truckUnitCode,
  currentOdometer,
  onExecuteRotation,
}: FormContentProps) {
  const sourceTire = sourceSlot.tire;

  // 1. Kumpulkan daftar semua posisi roda di truk ini (kecuali posisi asal)
  // 1. Kumpulkan daftar semua posisi roda di truk ini (kecuali posisi asal)
  const basePositions: WheelPosition[] = [
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "S1",
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
    "C7",
    "C8",
  ];
  const allPositions: WheelPosition[] =
    chassisType === "3_AXLE"
      ? [...basePositions, "C9", "C10", "C11", "C12"]
      : basePositions;

  const availableTargetPositions: WheelPosition[] = allPositions.filter(
    (p) => p !== sourceSlot.position,
  );

  // State Form
  const [mode, setMode] = useState<RotationMode>("SWAP_POSITION");
  const [targetPosition, setTargetPosition] = useState<WheelPosition>(
    availableTargetPositions[0] || "C1",
  );
  const [warehouseTireId, setWarehouseTireId] = useState<string>(
    warehouseTires[0]?.id || "",
  );
  const [sourceDestination, setSourceDestination] = useState<
    "GUDANG" | "VULKANISIR" | "AFKIR"
  >("GUDANG");
  const [reason, setReason] = useState<string>("Rotasi Rutin Keausan Gandar");
  const [mechanicPic, setMechanicPic] = useState<string>(
    "Slamet Riyadi (Mekanik)",
  );

  // Cari ban yang saat ini terpasang di posisi target (jika ada)
  const targetTire =
    allTruckTires.find((t) => t.currentPosition === targetPosition) || null;

  // Cari ban gudang yang dipilih
  const selectedWarehouseTire =
    warehouseTires.find((w) => w.id === warehouseTireId) || warehouseTires[0];

  // ================= VALIDASI GOLDEN RULES =================
  let violationError: string | null = null;

  if (mode === "SWAP_POSITION") {
    const isTargetSteer = targetPosition === "H1" || targetPosition === "H2";
    if (
      isTargetSteer &&
      sourceTire.retreadStatus !== "R0" &&
      sourceTire.retreadStatus !== "R1"
    ) {
      violationError = `PELANGGARAN: Posisi target ${targetPosition} adalah Gandar Kemudi (Steer). Hanya diizinkan Ban Baru (R0) atau 1x Vulkanisir (R1). Ban ${sourceTire.serialNumber} saat ini berstatus ${sourceTire.retreadStatus}!`;
    }
    const isSourceSteer =
      sourceSlot.position === "H1" || sourceSlot.position === "H2";
    if (
      isSourceSteer &&
      targetTire &&
      targetTire.retreadStatus !== "R0" &&
      targetTire.retreadStatus !== "R1"
    ) {
      violationError = `PELANGGARAN: Posisi ${sourceSlot.position} adalah Gandar Kemudi (Steer). Ban ${targetTire.serialNumber} berstatus ${targetTire.retreadStatus} dilarang dipasang ke Steer (Hanya diizinkan R0 atau R1)!`;
    }
  } else {
    const isSourceSteer =
      sourceSlot.position === "H1" || sourceSlot.position === "H2";
    if (
      isSourceSteer &&
      selectedWarehouseTire &&
      selectedWarehouseTire.retreadStatus !== "R0" &&
      selectedWarehouseTire.retreadStatus !== "R1"
    ) {
      violationError = `PELANGGARAN: Gandar Kemudi ${sourceSlot.position} hanya diizinkan Ban Baru (R0) atau 1x Vulkanisir (R1). Ban gudang ${selectedWarehouseTire.serialNumber} berstatus ${selectedWarehouseTire.retreadStatus}!`;
    }
    if (
      sourceDestination === "VULKANISIR" &&
      sourceTire.retreadStatus === "R3"
    ) {
      violationError = `PELANGGARAN: Ban ${sourceTire.serialNumber} sudah berstatus R3 (Batas Maksimal Vulkanisir 3x). Ban tidak boleh divulkanisir lagi, wajib diafkirkan!`;
    }
  }

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (violationError) {return;}

    onExecuteRotation({
      mode,
      sourcePosition: sourceSlot.position,
      sourceTire,
      targetPosition: mode === "SWAP_POSITION" ? targetPosition : undefined,
      targetTire: mode === "SWAP_POSITION" ? targetTire : undefined,
      warehouseTireToInstall:
        mode === "REPLACE_FROM_WAREHOUSE" ? selectedWarehouseTire : undefined,
      sourceTireDestination:
        mode === "REPLACE_FROM_WAREHOUSE" ? sourceDestination : undefined,
      reason,
      mechanicPic,
      odometer: currentOdometer,
    });

    onClose();
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
      {/* Header Modal */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <ArrowRightLeft size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Rotasi & Mutasi Posisi Ban
            </h2>
            <p className="text-xs text-slate-500">
              Unit {truckUnitCode} • Posisi Asal{" "}
              <strong className="text-slate-800">{sourceSlot.position}</strong>{" "}
              ({sourceSlot.axleType} axle)
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
          <X size={18} />
        </button>
      </div>

      {/* Info Ban Asal */}
      <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 text-xs space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          BAN SUMBER (POSISI SAAT INI)
        </span>
        <div className="flex items-center justify-between">
          <div>
            <strong className="text-sm font-black text-slate-900">
              {sourceTire.serialNumber}
            </strong>
            <p className="text-slate-600">
              {sourceTire.brand} ({sourceTire.size}) • Fisik:{" "}
              <strong>{sourceTire.lastInspectionPercent}%</strong>
            </p>
          </div>
          <span
            className={`font-extrabold px-2.5 py-1 rounded text-xs ${
              sourceTire.retreadStatus === "R0"
                ? "bg-blue-100 text-blue-800"
                : "bg-amber-100 text-amber-800"
            }`}>
            {sourceTire.retreadStatus === "R0"
              ? "R0 (Baru)"
              : `${sourceTire.retreadStatus} (Vulkanisir)`}
          </span>
        </div>
      </div>

      {/* Pilihan Mode Rotasi */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode("SWAP_POSITION")}
          className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 font-bold transition ${
            mode === "SWAP_POSITION"
              ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}>
          <RotateCw size={14} /> Tukar Antar Roda Truk
        </button>
        <button
          type="button"
          onClick={() => setMode("REPLACE_FROM_WAREHOUSE")}
          className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 font-bold transition ${
            mode === "REPLACE_FROM_WAREHOUSE"
              ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}>
          <Warehouse size={14} /> Ganti dari Stok Gudang
        </button>
      </div>

      {/* Peringatan Pelanggaran Golden Rule */}
      {violationError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 text-xs">
          <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              Pelanggaran Aturan Keselamatan!
            </strong>
            <p className="text-[11px] mt-0.5 leading-relaxed">
              {violationError}
            </p>
          </div>
        </div>
      )}

      {/* Form Sesuai Mode */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {mode === "SWAP_POSITION" ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Pilih Posisi Target Roda di Truk Ini:
              </label>
              <select
                value={targetPosition}
                onChange={(e) =>
                  setTargetPosition(e.target.value as WheelPosition)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                {availableTargetPositions.map((pos) => (
                  <option key={pos} value={pos}>
                    Posisi {pos}{" "}
                    {pos === "H1" || pos === "H2"
                      ? "(Steer Axle - Wajib R0)"
                      : pos === "S1"
                        ? "(Ban Serep)"
                        : "(Trailer/Drive Axle)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview Ban yang akan ditukar */}
            <div className="rounded-lg bg-white p-2.5 border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">
                  BAN DI POSISI TARGET ({targetPosition})
                </span>
                {targetTire ? (
                  <strong className="text-slate-800 font-bold">
                    {targetTire.serialNumber} • {targetTire.brand} (
                    {targetTire.retreadStatus})
                  </strong>
                ) : (
                  <span className="text-slate-400 italic">
                    (Slot kosong - tidak ada ban terpasang)
                  </span>
                )}
              </div>
              <span className="text-[11px] text-blue-700 font-bold">
                Akan pindah ke {sourceSlot.position}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Pilih Ban dari Gudang (Untuk Dipasang ke {sourceSlot.position}):
              </label>
              <select
                value={warehouseTireId}
                onChange={(e) => setWarehouseTireId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                {warehouseTires.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.serialNumber} • {wh.brand} ({wh.retreadStatus}) - Fisik{" "}
                    {wh.lastInspectionPercent}%
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Tujuan Ban Lama ({sourceTire.serialNumber}):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "GUDANG", label: "Simpan di Gudang" },
                  { id: "VULKANISIR", label: "Vendor Vulkanisir" },
                  { id: "AFKIR", label: "Afkirkan (Scrap)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSourceDestination(
                        item.id as "GUDANG" | "VULKANISIR" | "AFKIR",
                      )
                    }
                    className={`rounded-xl border p-2 text-center text-[11px] font-bold transition ${
                      sourceDestination === item.id
                        ? "border-blue-600 bg-blue-600 text-white shadow-2xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Keterangan Mutasi */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Alasan Rotasi / Mutasi
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="Rotasi Rutin Keausan Gandar">
                Rotasi Rutin Keausan Gandar
              </option>
              <option value="Aus Steer Dipindah ke Trailer">
                Aus Steer Dipindah ke Trailer
              </option>
              <option value="Ban Bocor / Rusak Fisik">
                Ban Bocor / Rusak Fisik
              </option>
              <option value="Kirim ke Rekanan Vulkanisir">
                Kirim ke Rekanan Vulkanisir
              </option>
              <option value="Afkir & Pasang Ban Baru Gudang">
                Afkir & Pasang Ban Baru Gudang
              </option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nama Mekanik PIC
            </label>
            <input
              type="text"
              value={mechanicPic}
              onChange={(e) => setMechanicPic(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
            Batal
          </button>
          <button
            type="submit"
            disabled={Boolean(violationError)}
            className={`rounded-xl px-5 py-2 text-xs font-bold text-white transition shadow-md ${
              violationError
                ? "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
            }`}>
            Eksekusi Rotasi Ban
          </button>
        </div>
      </form>
    </div>
  );
}

// Dialog Wrapper Utama
export default function TireRotationModal({
  isOpen,
  onClose,
  sourceSlot,
  allTruckTires,
  warehouseTires,
  chassisType,
  truckUnitCode,
  currentOdometer,
  onExecuteRotation,
}: TireRotationModalProps) {
  if (!isOpen || !sourceSlot || !sourceSlot.tire) {return null;}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <TireRotationFormContent
        key={`${sourceSlot.position}-${sourceSlot.tire.id}`}
        onClose={onClose}
        sourceSlot={sourceSlot as WheelSlotEvaluation & { tire: TireAsset }}
        allTruckTires={allTruckTires}
        warehouseTires={warehouseTires}
        chassisType={chassisType}
        truckUnitCode={truckUnitCode}
        currentOdometer={currentOdometer}
        onExecuteRotation={onExecuteRotation}
      />
    </div>
  );
}
