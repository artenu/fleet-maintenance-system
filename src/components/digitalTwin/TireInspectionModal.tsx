// src/components/digitalTwin/TireInspectionModal.tsx
import React from "react";
import {
  ClipboardCheck,
  Gauge,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  Camera,
  ZoomIn,
  Trash2,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import type {
  WheelSlotEvaluation,
  TireAsset,
  RetreadStatus,
  ActionRecommendation,
} from "@/types/truck/tires";
import type {
  TireInspectionModalProps,
  TireInspectionFormContentProps,
} from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import { mockCurrentSurveyor } from "@/types/auth/auth";
import { getWheelPositionDescription } from "@/constants/truck";
import {
  useTireInspectionForm,
  STANDARD_BRANDS,
  VISUAL_DAMAGE_OPTIONS,
} from "@/hooks/useTireInspectionForm";

// 🧱 Komponen Reusable Design System
import { Modal, Button, Badge } from "@/components/common";
import {
  FormInput,
  NumberInput,
  Select,
  TextArea,
  Checkbox,
  RangeInput,
  FileInput,
} from "@/components/forms";

/**
 * Konten Form Inspeksi Roda Lapangan (Key-based reset)
 */
function TireInspectionFormContent({
  onClose,
  slot,
  currentOdometer,
  onSaveInspection,
  onSaveAndNext,
}: TireInspectionFormContentProps) {
  const tire = slot.tire;
  const {
    isFullPreviewOpen,
    setIsFullPreviewOpen,
    serialNumber,
    setSerialNumber,
    brand,
    setBrand,
    customBrand,
    setCustomBrand,
    retreadStatus,
    setRetreadStatus,
    odometer,
    setOdometer,
    pressurePsi,
    setPressurePsi,
    treadDepthMm,
    setTreadDepthMm,
    physicalPercent,
    setPhysicalPercent,
    visualDamages,
    toggleDamage,
    actionRecommendation,
    setActionRecommendation,
    notes,
    setNotes,
    photoPreview,
    setPhotoPreview,
    handlePhotoCapture,
    isPhysicalCritical,
    isSteerViolation,
    liveStatus,
    buildUpdatedTire,
    isSteer,
  } = useTireInspectionForm({
    tire,
    axleType: slot.axleType,
    currentOdometer,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInspection(buildUpdatedTire(), odometer);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {/* Ringkasan Status Roda Saat Ini */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold">
            STATUS KESEHATAN
          </span>
          <Badge
            variant={
              liveStatus === "CRITICAL"
                ? "danger"
                : liveStatus === "WARNING"
                  ? "warning"
                  : "success"
            }
            className="mt-0.5">
            {liveStatus}
          </Badge>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold">
            GANDAR
          </span>
          <strong className="text-slate-800 uppercase text-xs">
            {slot.axleType} AXLE
          </strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold">
            JARAK TEMPUH
          </span>
          <strong className="text-slate-900 font-bold">
            {slot.kmElapsed.toLocaleString("id-ID")} KM
          </strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold">
            STATUS TEKANAN
          </span>
          <span
            className={`font-bold text-[11px] ${
              pressurePsi >= 105 && pressurePsi <= 125
                ? "text-emerald-700"
                : "text-amber-700"
            }`}>
            {pressurePsi} PSI (
            {pressurePsi < 100
              ? "Kurang Angin"
              : pressurePsi > 125
                ? "Kelebihan"
                : "Ideal"}
            )
          </span>
        </div>
      </div>

      {/* Peringatan Pelanggaran Golden Rule #1 (Gandar Steer) */}
      {isSteerViolation && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 text-xs">
          <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              Pelanggaran Aturan Gandar Steer!
            </strong>
            <p className="text-[11px] mt-0.5 leading-relaxed">
              Posisi Kemudi {slot.position} dilarang menggunakan ban vulkanisir
              lanjut ({retreadStatus}). Gandar steer hanya diizinkan menggunakan
              Ban Baru (R0) atau maksimal 1x Vulkanisir (R1)!
            </p>
          </div>
        </div>
      )}

      {/* Peringatan Pelanggaran Golden Rule #5 (Fisik Kritis < 40%) */}
      {isPhysicalCritical && !isSteerViolation && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 text-xs">
          <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              Golden Rule #5 Aktif: Kondisi Fisik Kritis (&lt; 40% / Cacat
              Karkas)!
            </strong>
            <p className="text-[11px] mt-0.5 leading-relaxed">
              Toleransi Odometer KM diabaikan. Kondisi tapak atau kerusakan
              struktural mewajibkan ban segera dibongkar demi keselamatan
              armada.
            </p>
          </div>
        </div>
      )}

      {/* BAGIAN 1: IDENTITAS BAN & CASING */}
      <div className="rounded-xl border border-slate-200 p-3.5 space-y-3 bg-slate-50/40">
        <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={14} className="text-red-600" />
          1. Verifikasi Identitas Aset Ban (Cegah Penukaran Liar)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormInput
            label="Nomor Seri Ban (DOT / Serial)"
            placeholder="Contoh: BS-991204"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
            helperText="Cek fisik nomor pada dinding ban"
            required
          />

          <div>
            <Select
              label="Merk Ban"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              options={STANDARD_BRANDS.map((b) => ({ value: b, label: b }))}
              required
            />
            {brand === "Lainnya" && (
              <FormInput
                placeholder="Ketik merk ban..."
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                className="mt-1"
              />
            )}
          </div>

          <Select
            label="Status Casing (Vulkanisir)"
            value={retreadStatus}
            onChange={(e) => setRetreadStatus(e.target.value as RetreadStatus)}
            options={[
              { value: "R0", label: "R0 • Ban Baru Asli" },
              { value: "R1", label: "R1 • Vulkanisir ke-1 (Boleh Steer)" },
              { value: "R2", label: "R2 • Vulkanisir ke-2" },
              { value: "R3", label: "R3 • Vulkanisir ke-3 (Maksimal)" },
              { value: "AFKIR", label: "AFKIR • Rusak / Afkir" },
            ]}
            helperText={
              isSteer
                ? "Steer diizinkan R0 atau R1"
                : "Maksimal 3x Vulkanisir (R3)"
            }
            required
          />
        </div>
      </div>

      {/* BAGIAN 2: PENGUKURAN TEKNIS (KM, ANGIN, TAPAK) */}
      <div className="rounded-xl border border-slate-200 p-3.5 space-y-3 bg-slate-50/40">
        <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Gauge size={14} className="text-red-600" />
          2. Parameter Pengukuran Fisik Roda
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <NumberInput
            label="Odometer Truk (KM)"
            value={odometer}
            onChange={setOdometer}
            helperText="KM Aktual di Speedometer"
            required
          />

          <NumberInput
            label="Tekanan Angin (PSI)"
            value={pressurePsi}
            onChange={setPressurePsi}
            helperText="Standar Ban Truk: 110 - 120 PSI"
            required
          />

          <NumberInput
            label="Kedalaman Alur (mm)"
            value={treadDepthMm}
            onChange={(val) => {
              setTreadDepthMm(val);
              setPhysicalPercent(Math.min(100, Math.round((val / 15) * 100)));
            }}
            allowDecimals
            helperText="Gauge: <4.0 mm butuh penggantian"
            required
          />
        </div>

        {/* Slider Persentase Kondisi Fisik */}
        <RangeInput
          label="Kondisi Fisik Tapak:"
          min={10}
          max={100}
          value={physicalPercent}
          valueDisplay={
            <strong className="text-red-600 font-extrabold text-sm">
              {physicalPercent}% (
              {physicalPercent >= 70
                ? "Prima"
                : physicalPercent >= 40
                  ? "Perhatian"
                  : "Kritis"}
              )
            </strong>
          }
          onChange={(val) => {
            setPhysicalPercent(val);
            setTreadDepthMm(Number(((val / 15) * 10).toFixed(1)));
          }}
          className="pt-1"
        />
      </div>

      {/* BAGIAN 3: CHECKLIST KERUSAKAN FISIK LAPANGAN */}
      <div>
        <label className="block font-bold text-slate-700 text-xs mb-1.5">
          Checklist Temuan Kerusakan & Kelainan Fisik (Surveyor):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {VISUAL_DAMAGE_OPTIONS.map((damage) => {
            const isChecked = visualDamages.includes(damage);
            return (
              <div
                key={damage}
                className={`rounded-xl border px-3 py-2 transition ${
                  isChecked
                    ? "border-rose-400 bg-rose-50/70 shadow-2xs"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}>
                <Checkbox
                  checked={isChecked}
                  onChange={() => toggleDamage(damage)}
                  label={
                    <span
                      className={`text-[11px] truncate block ${
                        isChecked
                          ? "font-bold text-rose-900"
                          : "font-semibold text-slate-700"
                      }`}>
                      {damage}
                    </span>
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* BAGIAN 4: UPLOAD / FOTO BUKTI LAPANGAN */}
      <div className="rounded-xl border border-slate-200 p-3 space-y-2">
        <label className="block font-bold text-slate-700 text-xs">
          Foto Bukti Fisik Lapangan (Tapak / Dinding Ban):
        </label>
        <div className="flex items-center gap-3">
          <FileInput
            buttonText="Ambil / Upload Foto"
            icon={Camera}
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
          />

          {photoPreview ? (
            <div className="space-y-2">
              <div
                onClick={() => setIsFullPreviewOpen(true)}
                className="relative group overflow-hidden rounded-xl border border-slate-300 bg-slate-900 shadow-xs max-h-48 cursor-pointer">
                <img
                  src={photoPreview}
                  alt="Preview Bukti Lapangan"
                  className="w-full h-40 object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                  <ZoomIn size={18} />
                  <span>Klik untuk Memperbesar</span>
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoPreview(null);
                  }}
                  title="Hapus foto"
                  className="absolute top-2 right-2 p-1.5 shadow-md z-10"
                />
              </div>
              <p className="text-[10px] text-slate-500 italic">
                Klik foto untuk melihat ukuran penuh. Klik ikon tempat sampah
                jika ingin mengganti.
              </p>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 italic">
              Belum ada foto terlampir
            </span>
          )}
        </div>
      </div>

      {/* BAGIAN 5: REKOMENDASI TINDAKAN & SURVEYOR PIC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Rekomendasi Tindakan Lapangan:"
          value={actionRecommendation}
          onChange={(e) =>
            setActionRecommendation(e.target.value as ActionRecommendation)
          }
          options={[
            { value: "KEEP", label: "🟢 Lanjut Operasi (Kondisi Aman)" },
            {
              value: "INFLATE",
              label: "🟡 Perlu Tambah Angin (Tekanan Rendah)",
            },
            { value: "ROTATE", label: "🔄 Jadwalkan Rotasi Gandar" },
            {
              value: "REPLACE_SERVICE",
              label: "🔴 Wajib Servis / Bongkar (Kritis)",
            },
          ]}
          required
        />

        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>Surveyor PIC Lapangan:</span>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <UserCheck size={12} /> Terverifikasi Otomatis
            </span>
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-red-600 text-white font-black text-[11px] shrink-0">
              {mockCurrentSurveyor.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 truncate">
                {mockCurrentSurveyor.name}
              </p>
              <p className="text-[10px] text-slate-500">
                NIK: {mockCurrentSurveyor.nik} •{" "}
                {mockCurrentSurveyor.poolLocation}
              </p>
            </div>
          </div>
        </div>
      </div>

      <TextArea
        label="Catatan Tambahan Temuan Lapangan"
        placeholder="Contoh: Keausan alur lebih berat di sisi luar, cek spooring"
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {/* Footer Tombol Aksi */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onClose}>
          Tutup
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" type="submit">
            Simpan Roda Ini
          </Button>
          {onSaveAndNext && (
            <Button
              variant="primary"
              type="button"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => {
                onSaveAndNext(buildUpdatedTire(), odometer);
              }}>
              Simpan & Roda Berikutnya
            </Button>
          )}
        </div>
      </div>

      {/* Lightbox Modal Gambar Resolusi Penuh */}
      <Modal
        isOpen={isFullPreviewOpen && Boolean(photoPreview)}
        onClose={() => setIsFullPreviewOpen(false)}
        title={`Foto Bukti Fisik Lapangan • ${serialNumber}`}
        size="lg">
        {photoPreview && (
          <div className="flex items-center justify-center p-2 bg-slate-900 rounded-xl">
            <img
              src={photoPreview}
              alt="Ukuran Penuh"
              className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-lg"
            />
          </div>
        )}
      </Modal>
    </form>
  );
}

/**
 * Modal Dialog Inspeksi Ban Fisik Lapangan (Key-based reset)
 */
export default function TireInspectionModal({
  isOpen,
  onClose,
  slot,
  truckUnitCode,
  currentOdometer,
  onSaveInspection,
  onSaveAndNext,
}: TireInspectionModalProps) {
  if (!isOpen || !slot || !slot.tire) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600 shrink-0">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-slate-900">
                Audit & Cek Fisik Lapangan Surveyor
              </span>
              <Badge variant="danger">REAL-TIME POOL</Badge>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Unit Truk:{" "}
              <strong className="text-slate-800">{truckUnitCode}</strong> •
              Posisi:{" "}
              <strong className="text-blue-700 font-black">
                {slot.position}
              </strong>{" "}
              ({getWheelPositionDescription(slot.position)})
            </p>
          </div>
        </div>
      }
      size="xl">
      <TireInspectionFormContent
        key={`${slot.position}-${slot.tire.id}`}
        onClose={onClose}
        slot={slot as WheelSlotEvaluation & { tire: TireAsset }}
        truckUnitCode={truckUnitCode}
        currentOdometer={currentOdometer}
        onSaveInspection={onSaveInspection}
        onSaveAndNext={onSaveAndNext}
      />
    </Modal>
  );
}
