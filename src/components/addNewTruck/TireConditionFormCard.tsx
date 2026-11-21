// src/components/addNewTruck/TireConditionFormCard.tsx
import {
  ShieldAlert,
  ArrowRight,
  ScanLine,
  ZoomIn,
  Camera,
  X,
} from "lucide-react";
import { Grid } from "@/components/layout";
import { Button, Badge } from "@/components/common";
import {
  FormInput,
  NumberInput,
  Select,
  Checkbox,
  FileInput,
} from "@/components/forms";
import {
  TIRE_DEFECT_OPTIONS,
  getRetreadOptionsForSteer,
} from "@/constants/addNewTruck";
import type { RetreadStatus } from "@/types/TireManagement/tires";
import type { TireConditionFormCardProps } from "@/types/AddNewTruckView/AddNewTruckViewTypes";

/**
 * Kartu formulir inspeksi 7-parameter walkaround ban per slot roda
 */
export default function TireConditionFormCard({
  activeSlot,
  slotDescription,
  currentTireForm,
  updateCurrentTire,
  onToggleDamage,
  onPhotoCapture,
  onNextWheel,
  isSteer,
  isSteerViolation,
  onPreviewPhoto,
}: TireConditionFormCardProps) {
  const retreadOptions = getRetreadOptionsForSteer(isSteer);

  return (
    <div className="rounded-2xl border-2 border-red-200 bg-white p-6 shadow-md space-y-6">
      {/* Banner Roda Aktif */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-red-50/60 p-4 rounded-xl border border-red-200">
        <div>
          <span className="text-[10px] font-bold uppercase text-red-700 tracking-wider block">
            MENCATAT RODA:
          </span>
          <h2 className="text-sm font-black text-slate-900 mt-0.5">
            Posisi {activeSlot} • {slotDescription}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neutral">
            {currentTireForm.retreadStatus} (
            {currentTireForm.retreadStatus === "R0" ? "Baru" : "Vulkanisir"})
          </Badge>
          <span className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-lg shadow-xs">
            {currentTireForm.physicalPercent}% Alur Fisik
          </span>
        </div>
      </div>

      {/* Peringatan Golden Rule Kemudi Steer */}
      {isSteerViolation && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-rose-950 text-xs">
          <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">
              Pelanggaran Golden Rule #1 (Gandar Kemudi Steer)!
            </strong>
            <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
              Posisi Steer {activeSlot} dilarang menggunakan ban vulkanisir
              lanjut ({currentTireForm.retreadStatus}). Sesuai SOP PT ALN,
              gandar kemudi steer hanya diizinkan Ban Baru (R0) atau Maksimal 1x
              Vulkanisir (R1) demi keselamatan manuver di jalan raya!
            </p>
          </div>
        </div>
      )}

      {/* 7 Parameter Input */}
      <Grid cols={1} mdCols={2} lgCols={3} gap="md">
        {/* 1. NO. SERI BAN */}
        <div className="space-y-1 rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
          <FormInput
            label="1. No. Seri Ban (DOT / Serial)"
            subLabel={
              <button
                type="button"
                onClick={() =>
                  updateCurrentTire({
                    serialNumber: `BS-2024-${Math.floor(1000 + Math.random() * 9000)}`,
                  })
                }
                className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold cursor-pointer">
                <ScanLine size={12} /> Scan Barcode
              </button>
            }
            placeholder="[ BS-2024-9988 ]"
            value={currentTireForm.serialNumber}
            onChange={(e) =>
              updateCurrentTire({
                serialNumber: e.target.value.toUpperCase(),
              })
            }
            className="uppercase font-bold"
            helperText="Nomor tertera pada dinding samping ban"
            required
          />
        </div>

        {/* 2. MERK & POLA */}
        <div className="space-y-1 rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            2. Merk & Pola Tapak (Pattern)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FormInput
              placeholder="Bridgestone"
              value={currentTireForm.brand}
              onChange={(e) => updateCurrentTire({ brand: e.target.value })}
            />
            <FormInput
              placeholder="R168"
              value={currentTireForm.pattern}
              onChange={(e) => updateCurrentTire({ pattern: e.target.value })}
            />
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Contoh: Bridgestone / R168
          </span>
        </div>

        {/* 3. STATUS CASING */}
        <div className="space-y-1 rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
          <Select
            label="3. Status Casing / Vulkanisir"
            subLabel={
              currentTireForm.retreadStatus === "R0" ? (
                <Badge variant="info">R0 Baru</Badge>
              ) : currentTireForm.retreadStatus === "R1" ? (
                <Badge variant="warning">R1 Vulkanisir</Badge>
              ) : currentTireForm.retreadStatus === "R2" ? (
                <Badge variant="warning">R2 Vulkanisir</Badge>
              ) : currentTireForm.retreadStatus === "R3" ? (
                <Badge variant="danger">R3 Maksimal</Badge>
              ) : (
                <Badge variant="danger">Afkir</Badge>
              )
            }
            value={currentTireForm.retreadStatus}
            onChange={(e) =>
              updateCurrentTire({
                retreadStatus: e.target.value as RetreadStatus,
              })
            }
            options={retreadOptions}
            error={
              isSteerViolation
                ? `Posisi Steer (${activeSlot}) dilarang menggunakan ${currentTireForm.retreadStatus}. Wajib R0 atau R1!`
                : undefined
            }
            helperText={
              isSteer
                ? "SOP Gandar Steer: Hanya diizinkan R0 atau R1 demi keselamatan"
                : "Siklus Casing: Maksimal 3x Vulkanisir (R0 → R1 → R2 → R3 → Afkir)"
            }
          />
        </div>

        {/* 4. TEKANAN ANGIN */}
        <div className="space-y-1 rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
          <NumberInput
            label="4. Tekanan Angin (PSI)"
            subLabel={
              <span className="text-[10px] text-slate-500">Ideal: 110-120</span>
            }
            value={currentTireForm.pressurePsi}
            onChange={(val) => updateCurrentTire({ pressurePsi: val })}
            suffixText="PSI"
          />
          <span className="text-[10px] text-slate-400 block">
            Ukur menggunakan tire pressure gauge
          </span>
        </div>

        {/* 5. KEDALAMAN ALUR */}
        <div className="space-y-1 rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
          <NumberInput
            label="5. Kedalaman Alur (mm)"
            subLabel={
              <Badge variant="danger">
                Auto: {currentTireForm.physicalPercent}% Prima
              </Badge>
            }
            value={currentTireForm.treadDepthMm}
            allowDecimals
            onChange={(val) => {
              const computedPercent = Math.min(
                100,
                Math.round((val / 15) * 100),
              );
              updateCurrentTire({
                treadDepthMm: val,
                physicalPercent: computedPercent,
              });
            }}
            suffixText="mm"
          />
          <span className="text-[10px] text-slate-400 block">
            Batas Kritis Penggantian: &lt; 4.0 mm
          </span>
        </div>

        {/* 7. BUKTI FOTO LAPANGAN */}
        <div className="space-y-1 rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            7. Bukti Foto Lapangan
          </label>
          {currentTireForm.photoUrl ? (
            <div className="relative group overflow-hidden rounded-xl border border-slate-300 bg-slate-900 h-24 cursor-pointer">
              <img
                src={currentTireForm.photoUrl}
                alt="Foto Bukti"
                className="w-full h-full object-cover group-hover:scale-105 transition"
                onClick={() =>
                  onPreviewPhoto(currentTireForm.photoUrl as string)
                }
              />
              <div
                onClick={() =>
                  onPreviewPhoto(currentTireForm.photoUrl as string)
                }
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-[11px] font-bold">
                <ZoomIn size={14} />
                <span>Perbesar</span>
              </div>
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon={X}
                onClick={(e) => {
                  e.stopPropagation();
                  updateCurrentTire({ photoUrl: null });
                }}
                className="absolute top-1.5 right-1.5 p-1 shadow-md z-10"
                title="Hapus foto"
              />
            </div>
          ) : (
            <FileInput
              buttonText="Ambil / Upload Foto"
              icon={Camera}
              accept="image/*"
              capture="environment"
              onChange={onPhotoCapture}
              className="pt-1"
            />
          )}
        </div>
      </Grid>

      {/* 6. INDIKASI CACAT LAPANGAN */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="font-semibold text-slate-700 text-xs block">
          6. Indikasi Cacat Fisik:
        </label>
        <Grid cols={2} smCols={3} mdCols={6} gap="sm">
          {TIRE_DEFECT_OPTIONS.map((defect) => {
            const isChecked = currentTireForm.damages.includes(defect);
            return (
              <div
                key={defect}
                className={`rounded-xl border px-3 py-2 transition ${
                  isChecked
                    ? defect === "Normal"
                      ? "border-emerald-400 bg-emerald-50/70 shadow-2xs"
                      : "border-rose-400 bg-rose-50/70 shadow-2xs"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}>
                <Checkbox
                  checked={isChecked}
                  onChange={() => onToggleDamage(defect)}
                  label={
                    <span
                      className={`text-[11px] truncate block ${
                        isChecked
                          ? defect === "Normal"
                            ? "font-bold text-emerald-900"
                            : "font-bold text-rose-900"
                          : "font-semibold text-slate-700"
                      }`}>
                      {defect}
                    </span>
                  }
                />
              </div>
            );
          })}
        </Grid>
      </div>

      {/* Footer Tombol Navigasi Walkaround */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <span className="text-xs text-slate-500">
          Roda {activeSlot} siap disimpan. Tekan tombol merah untuk lanjut
          keliling ke roda berikutnya.
        </span>

        <Button
          variant="primary"
          size="md"
          icon={ArrowRight}
          iconPosition="right"
          onClick={onNextWheel}
          className="shadow-red-500/25">
          Simpan & Roda Berikutnya
        </Button>
      </div>
    </div>
  );
}
