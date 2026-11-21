// src/components/truckCoupling/HookChassisModal.tsx
import { useState, useMemo } from "react";
import type { HookChassisModalProps } from "@/types/TruckCouplingView/TruckCouplingViewTypes";
import { Modal, Button, Badge } from "@/components/common";
import { Select } from "@/components/forms";
import { Link2, Container as ContainerIcon, CheckCircle2 } from "lucide-react";

/**
 * Modal Formulir Pemasangan Sasis (Hook) ke Kepala Truk
 * Dibuat simpel: mekanik cukup pilih kategori (20FT / 40FT) dan unit sasis yang diinginkan.
 */
export default function HookChassisModal({
  isOpen,
  onClose,
  selectedTruckId,
  selectedChassisId,
  onSelectedChassisIdChange,
  availableChassis,
  onConfirmHook,
}: HookChassisModalProps) {
  // Filter Cepat Kategori Panjang Sasis: ALL | 20FT | 40FT
  const [lengthFilter, setLengthFilter] = useState<"ALL" | "20FT" | "40FT">(
    "ALL",
  );

  // Sasis standby yang disaring sesuai tab kategori
  const filteredChassis = useMemo(() => {
    if (lengthFilter === "ALL") {
      return availableChassis;
    }
    return availableChassis.filter((c) => c.lengthCategory === lengthFilter);
  }, [availableChassis, lengthFilter]);

  // Sasis yang sedang aktif terpilih
  const currentSelectedChassis = availableChassis.find(
    (c) => c.id === selectedChassisId,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pasang Sasis ke Truk ${selectedTruckId}`}
      description="Pilih panjang sasis dan unit sasis standby di pool untuk dikaitkan"
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Link2}
            disabled={!selectedChassisId || availableChassis.length === 0}
            onClick={onConfirmHook}
            className="bg-blue-600 hover:bg-blue-700 font-bold">
            Pasang Sasis Sekarang
          </Button>
        </div>
      }>
      <div className="space-y-4 text-xs">
        {/* 1. Tab Pilihan Kategori Panjang Sasis */}
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
            Pilih Kategori Panjang Sasis:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setLengthFilter("ALL")}
              className={`py-2 px-3 rounded-xl border text-xs font-black transition ${
                lengthFilter === "ALL"
                  ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}>
              Semua ({availableChassis.length})
            </button>
            <button
              type="button"
              onClick={() => setLengthFilter("20FT")}
              className={`py-2 px-3 rounded-xl border text-xs font-black transition ${
                lengthFilter === "20FT"
                  ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}>
              20 FT (14 Ban)
            </button>
            <button
              type="button"
              onClick={() => setLengthFilter("40FT")}
              className={`py-2 px-3 rounded-xl border text-xs font-black transition ${
                lengthFilter === "40FT"
                  ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}>
              40 FT (18 Ban)
            </button>
          </div>
        </div>

        {/* 2. Dropdown Pilihan Unit Sasis Standby */}
        <Select
          label="Pilih Unit Sasis Standby di Pool"
          value={selectedChassisId}
          onChange={(e) => onSelectedChassisIdChange(e.target.value)}
          options={filteredChassis.map((c) => ({
            value: c.id,
            label: `${c.chassisCode} • Sasis ${c.lengthCategory} (${
              c.type === "2_AXLE" ? "2 Sumbu • 14 Ban" : "3 Sumbu • 18 Ban"
            })`,
          }))}
          helperText={
            filteredChassis.length === 0
              ? "Tidak ada sasis standby untuk kategori ini di pool."
              : `Tersedia ${filteredChassis.length} unit sasis standby.`
          }
        />

        {/* 3. Kartu Preview Spesifikasi Sasis Terpilih */}
        {currentSelectedChassis && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-blue-950 flex items-center gap-1.5">
                <ContainerIcon size={16} className="text-blue-600" />
                <span>Unit Sasis: {currentSelectedChassis.chassisCode}</span>
              </span>
              <Badge variant="info" className="font-extrabold text-xs">
                {currentSelectedChassis.lengthCategory}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-900 pt-1">
              <div>
                Panjang Fisik:{" "}
                <strong className="block text-slate-900">
                  {currentSelectedChassis.lengthCategory === "20FT"
                    ? "20 Feet (Kontainer Pendek)"
                    : "40 Feet (Kontainer Panjang)"}
                </strong>
              </div>
              <div>
                Konfigurasi Gandar:{" "}
                <strong className="block text-slate-900">
                  {currentSelectedChassis.type === "2_AXLE"
                    ? "2 Sumbu (14 Roda Total)"
                    : "3 Sumbu (18 Roda Total)"}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg font-bold">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              <span>
                Denah Digital Twin akan otomatis menampilkan denah roda{" "}
                {currentSelectedChassis.lengthCategory} (
                {currentSelectedChassis.type === "2_AXLE" ? "14 Ban" : "18 Ban"}
                ).
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
