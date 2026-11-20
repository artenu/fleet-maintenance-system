// src/components/tireInventory/ReceiveTireModal.tsx
import React, { useState } from "react";
import {
  Sparkles,
  RefreshCw,
  ShieldAlert,
  Lock,
  CheckCircle2,
} from "lucide-react";
import type { RetreadStatus, TireAsset } from "@/types/TireManagement/tires";
import type {
  ReceiveMode,
  ReceiveTireModalProps,
} from "@/types/TireInventoryView/TireInventoryViewTypes";
import { BRAND_PROFILES } from "@/constants/truck/tireRules";
import {
  TIRE_SIZE_OPTIONS,
  RETREAD_CASING_RECEIVE_OPTIONS,
} from "@/constants/tireInventory";
import { mockCurrentSurveyor } from "@/types/auth/auth";

// 🧱 Komponen Reusable Design System
import { Modal, Button } from "@/components/common";
import { FormInput, NumberInput, Select } from "@/components/forms";

/**
 * Modal Penerimaan Ban Masuk Gudang Pool
 * Registrasi ban baru (R0) atau penerimaan kembali hasil vulkanisir rekanan (R1-R3).
 */
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

  // Validasi Golden Rule #2: Vulkanisir wajib berstatus R1, R2, atau R3
  let validationError: string | null = null;
  if (mode === "RETREAD_RETURN" && retreadStatus === "R0") {
    validationError =
      "Penerimaan hasil vulkanisir wajib berstatus R1, R2, atau R3. Status R0 hanya untuk ban baru!";
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!serialNumber.trim() || validationError) {
      return;
    }

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

  const isFinancialAuthorized =
    mockCurrentSurveyor.role === "ADMIN" ||
    mockCurrentSurveyor.role === "FINANCE";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Penerimaan Ban Masuk Gudang Pool"
      description="Registrasi aset ban baru atau penerimaan kembali hasil vulkanisir"
      size="xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs h-100">
        {/* Tab Pilihan Mode Penerimaan */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Button
            type="button"
            variant={mode === "NEW_PURCHASE" ? "primary" : "outline"}
            icon={Sparkles}
            onClick={() => {
              setMode("NEW_PURCHASE");
              setRetreadStatus("R0");
              setPhysicalPercent(100);
              setVendorName("Toko Sumber Ban Jaya");
            }}
            className="w-full justify-center">
            Beli Ban Baru (R0)
          </Button>

          <Button
            type="button"
            variant={mode === "RETREAD_RETURN" ? "secondary" : "outline"}
            icon={RefreshCw}
            onClick={() => {
              setMode("RETREAD_RETURN");
              setRetreadStatus("R1");
              setPhysicalPercent(90);
              setVendorName("CV Karet Medan Boxer");
            }}
            className="w-full justify-center">
            Selesai Vulkanisir
          </Button>
        </div>

        {/* Peringatan Validasi */}
        {validationError && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 text-xs">
            <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-semibold">{validationError}</p>
          </div>
        )}

        {/* Baris 1: Serial Number & Merk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormInput
            label="Nomor Seri Ban (DOT / Serial)"
            placeholder="Contoh: BS-202611"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
            required
          />

          <Select
            label="Merk Ban"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              const profile = BRAND_PROFILES[e.target.value];
              if (profile) {
                setPrice(profile.standardPrice);
              }
            }}
            options={Object.keys(BRAND_PROFILES).map((b) => ({
              value: b,
              label: b,
            }))}
            required
          />
        </div>

        {/* Baris 2: Ukuran & Status Casing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select
            label="Ukuran & Spesifikasi"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            options={TIRE_SIZE_OPTIONS}
            required
          />

          {mode === "NEW_PURCHASE" ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Casing Ban
              </label>
              <div className="h-10 flex items-center rounded-xl border border-blue-200 bg-blue-50 px-3 font-black text-blue-700 text-xs">
                R0 (Ban Baru Asli)
              </div>
            </div>
          ) : (
            <Select
              label="Status Casing Ban"
              value={retreadStatus}
              onChange={(e) =>
                setRetreadStatus(e.target.value as RetreadStatus)
              }
              options={RETREAD_CASING_RECEIVE_OPTIONS}
              required
            />
          )}
        </div>

        {/* Baris 3: Nama Vendor & Harga */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormInput
            label={
              mode === "NEW_PURCHASE"
                ? "Nama Toko / Supplier"
                : "Nama Pabrik Rekanan"
            }
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            required
          />

          {isFinancialAuthorized ? (
            <NumberInput
              label={
                mode === "NEW_PURCHASE"
                  ? "Harga Beli (Rp)"
                  : "Biaya Vulkanisir (Rp)"
              }
              prefixText="Rp"
              value={price}
              onChange={setPrice}
              required
            />
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mode === "NEW_PURCHASE"
                  ? "Harga Beli (Rp)"
                  : "Biaya Vulkanisir (Rp)"}
              </label>
              <div className="h-10 flex items-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/80 px-3 text-xs text-amber-900">
                <Lock size={15} className="text-amber-600 shrink-0" />
                <span className="font-bold block text-[11px] text-amber-800">
                  Informasi Harga Terproteksi
                </span>
              </div>
            </div>
          )}
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

        {/* Footer Actions */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="danger"
            type="submit"
            disabled={Boolean(validationError)}>
            Simpan ke Stok Gudang
          </Button>
        </div>
      </form>
    </Modal>
  );
}
