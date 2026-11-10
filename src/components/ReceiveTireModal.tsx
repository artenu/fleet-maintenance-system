import React, { useState } from "react";
import {
  X,
  Warehouse,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { type RetreadStatus, type TireAsset } from "../types/truck/tires";
import { BRAND_PROFILES } from "../constants/truck/tireRules";
import { mockCurrentSurveyor } from "../types/auth/auth";

export type ReceiveMode = "NEW_PURCHASE" | "RETREAD_RETURN";

interface ReceiveTireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReceive: (newTire: TireAsset) => void;
}

export default function ReceiveTireModal({
  isOpen,
  onClose,
  onConfirmReceive,
}: ReceiveTireModalProps) {
  // State Form
  const [mode, setMode] = useState<ReceiveMode>("NEW_PURCHASE");
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [brand, setBrand] = useState<string>("Bridgestone");
  const [size, setSize] = useState<string>("10.00-20 16PR");
  const [retreadStatus, setRetreadStatus] = useState<RetreadStatus>("R0");
  const [price, setPrice] = useState<number>(3650000);
  const [vendorName, setVendorName] = useState<string>("Toko Sumber Ban Jaya");
  const [physicalPercent, setPhysicalPercent] = useState<number>(100);

  if (!isOpen) {return null;}

  // Validasi Golden Rule #2: Vulkanisir maks 2x
  let validationError: string | null = null;
  if (mode === "RETREAD_RETURN" && retreadStatus === "R0") {
    validationError =
      "Penerimaan hasil vulkanisir wajib berstatus R1, R2, atau R3. Status R0 hanya untuk ban baru!";
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!serialNumber.trim() || validationError) {return;}

    const newTire: TireAsset = {
      id: `WH-${Date.now().toString().slice(-4)}`,
      serialNumber: serialNumber.trim().toUpperCase(),
      brand,
      size,
      retreadStatus: mode === "NEW_PURCHASE" ? "R0" : retreadStatus,
      currentVehicleId: null,
      currentPosition: "GUDANG",
      installOdometer: 0,
      lastInspectionPercent: physicalPercent,
      lastInspectionDate: new Date().toISOString().split("T")[0],
    };

    onConfirmReceive(newTire);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600">
              <Warehouse size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Penerimaan Ban Masuk Gudang Pool
              </h2>
              <p className="text-xs text-slate-500">
                Registrasi aset ban baru atau penerimaan kembali hasil
                vulkanisir
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        {/* Tab Pilihan Mode Penerimaan */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("NEW_PURCHASE");
              setRetreadStatus("R0");
              setPhysicalPercent(100);
              setVendorName("Toko Sumber Ban Jaya");
            }}
            className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 font-bold transition ${
              mode === "NEW_PURCHASE"
                ? "border-red-600 bg-red-50 text-red-700 shadow-2xs"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}>
            <Sparkles size={14} /> Beli Ban Baru (R0)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("RETREAD_RETURN");
              setRetreadStatus("R1");
              setPhysicalPercent(90);
              setVendorName("CV Karet Medan Boxer");
            }}
            className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 font-bold transition ${
              mode === "RETREAD_RETURN"
                ? "border-amber-600 bg-amber-50 text-amber-700 shadow-2xs"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}>
            <RefreshCw size={14} /> Selesai Vulkanisir
          </button>
        </div>

        {/* Peringatan Validasi */}
        {validationError && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 text-xs">
            <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{validationError}</p>
          </div>
        )}

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nomor Seri Ban (DOT / Serial)
              </label>
              <input
                type="text"
                placeholder="Contoh: BS-202611"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Merk Ban
              </label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  const profile = BRAND_PROFILES[e.target.value];
                  if (profile) {setPrice(profile.standardPrice);}
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                {Object.keys(BRAND_PROFILES).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ukuran & Spesifikasi
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                <option value="10.00-20 16PR">
                  10.00-20 16PR (Standar Truk)
                </option>
                <option value="1000 R20">1000 R20 (Radial)</option>
                <option value="11R22.5">11R22.5 (Tubeless)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Status Casing Ban
              </label>
              {mode === "NEW_PURCHASE" ? (
                <div className="w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 font-black text-blue-700">
                  R0 (Ban Baru Asli)
                </div>
              ) : (
                <select
                  value={retreadStatus}
                  onChange={(e) =>
                    setRetreadStatus(e.target.value as RetreadStatus)
                  }
                  className="w-full rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                  <option value="R1">R1 (Vulkanisir ke-1)</option>
                  <option value="R2">R2 (Vulkanisir ke-2)</option>
                  <option value="R3">
                    R3 (Vulkanisir ke-3 - Batas Maksimal)
                  </option>
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {mode === "NEW_PURCHASE"
                  ? "Nama Toko / Supplier"
                  : "Nama Pabrik Rekanan"}
              </label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {mode === "NEW_PURCHASE"
                  ? "Harga Beli (Rp)"
                  : "Biaya Vulkanisir (Rp)"}
              </label>
              {mockCurrentSurveyor.role === "ADMIN" ||
              mockCurrentSurveyor.role === "FINANCE" ? (
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  required
                />
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
                  <Lock size={15} className="text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-[11px] text-amber-800">
                      Informasi Harga Terproteksi
                    </span>
                    <span className="text-[10px] text-amber-600">
                      Hanya dapat diakses oleh Finance & Admin
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status QC Fisik Otomatis */}
          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs text-emerald-900">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <div>
              <span className="font-extrabold block">
                Hasil QC Gudang: 100% (Prima & Siap Pakai)
              </span>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {mode === "NEW_PURCHASE"
                  ? "Ban baru terverifikasi mulus dan siap masuk ke rak inventaris."
                  : "Hasil cetakan vulkanisir rekanan terverifikasi tebal dan siap pasang."}
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-600 hover:bg-slate-50">
              Batal
            </button>
            <button
              type="submit"
              disabled={Boolean(validationError)}
              className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-700 shadow-md shadow-red-500/20">
              Simpan ke Stok Gudang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
