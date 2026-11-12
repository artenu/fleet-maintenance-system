// src/views/AddNewTruckView.tsx
import type { ChassisType, RetreadStatus } from "@/types/truck/tires";
import { mockCurrentSurveyor } from "@/types/auth/auth";
import { useTireConditionForm } from "@/hooks/useTireConditionForm";
import type { AddNewTruckViewProps } from "@/types/AddNewTruckView/AddNewTruckViewTypes";

// 🧱 Design System Reusable
import { Container, PageHeader, Grid } from "@/components/layout";
import { Button, Badge, Card, Modal } from "@/components/common";
import {
  FormInput,
  NumberInput,
  DateInput,
  SearchableSelect,
  Select,
} from "@/components/forms";

import {
  Camera,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Save,
  BellRing,
  PlusCircle,
  UserCheck,
  ScanLine,
  ZoomIn,
  X,
} from "lucide-react";

export default function AddNewTruckView({
  existingTrucks = [],
  onSaveNewTruck,
}: AddNewTruckViewProps) {
  const {
    pendingNewTrucks,
    plateOptions,
    plateNumber,
    unitCode,
    chassisCode,
    truckBrand,
    chassisType,
    odometer,
    driverName,
    inspectionDate,
    setInspectionDate,
    setChassisType,
    handleSelectPlateNumber,
    wheelPositions,
    activeSlot,
    setActiveSlot,
    completedWheelsCount,
    getSlotDescription,
    currentTireForm,
    updateCurrentTire,
    handleToggleDamage,
    handlePhotoCapture,
    handleNextWheel,
    isSteer,
    isSteerViolation,
    handleRegisterTruck,
    previewImage,
    setPreviewImage,
    tiresData,
  } = useTireConditionForm({ existingTrucks, onSaveNewTruck });

  return (
    <Container className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* ================= BANNER PELACAK UNIT BARU ================= */}
      {pendingNewTrucks.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-blue-950 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
              <BellRing size={16} className="animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-900">
                Terdeteksi {pendingNewTrucks.length} Unit Truk Baru dari
                Database Pusat!
              </p>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Unit{" "}
                {pendingNewTrucks
                  .map((t) => `${t.plateNumber} (${t.brand})`)
                  .join(", ")}{" "}
                terdaftar di pengadaan. Pilih unit di bawah untuk melengkapi
                kondisi bannya.
              </p>
            </div>
          </div>
          <Badge variant="info">{pendingNewTrucks.length} Butuh Ban</Badge>
        </div>
      )}

      {/* ================= 1. HEADER & FORM DATA MASTER TRUK (GRID 3x3 SIMETRIS) ================= */}
      <Card className="space-y-5">
        <PageHeader
          icon={PlusCircle}
          iconBgColor="bg-red-600 shadow-red-500/20"
          title="Update Kondisi Ban & Cek Fisik Roda"
          subtitle="Pilih nomor polisi unit truk dari database sebelah dan input/update seluruh kondisi ban yang terpasang"
          badge="Data API Sebelah"
          badgeColor="bg-blue-100 text-blue-700"
          flush // 👈 Otomatis bersih tanpa border, shadow, dan p-6!
        />

        {/* Form Master Truk: Simetris 3 Kolom x 3 Baris */}
        <Grid cols={1} mdCols={3} gap="md">
          {/* BARIS 1: IDENTITAS TRUK */}
          <div className="w-full text-xs">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
              <span>Nomor Polisi (Plat Truk)</span>
              <Badge variant="danger">Dari API</Badge>
            </label>
            <SearchableSelect
              options={plateOptions}
              value={plateNumber}
              onChange={handleSelectPlateNumber}
              placeholder="Pilih Nomor Polisi..."
              searchPlaceholder="Ketik plat, unit, supir..."
            />
          </div>

          <FormInput
            label="Kode Unit Truk"
            value={unitCode}
            readOnly
            className="uppercase cursor-not-allowed"
          />

          <FormInput
            label="Merk / Model Truk"
            value={truckBrand}
            readOnly
            className="cursor-not-allowed"
          />

          {/* BARIS 2: GANDENGAN & SUPIR */}
          <FormInput
            label="Kode Sasis (Chassis ID)"
            value={chassisCode}
            readOnly
            className="font-bold text-blue-700 cursor-not-allowed"
          />

          <Select
            label="Konfigurasi Gandar Sasis"
            value={chassisType}
            onChange={(e) => setChassisType(e.target.value as ChassisType)}>
            <option value="2_AXLE">
              2 Sumbu • 14 Ban (Trailer 20ft / 40ft Pendek)
            </option>
            <option value="3_AXLE">
              3 Sumbu • 18 Ban (Trailer 40ft Standar)
            </option>
          </Select>

          <FormInput
            label="Nama Supir Utama"
            value={driverName}
            readOnly
            className="cursor-not-allowed"
          />

          {/* BARIS 3: TELEMATICS, TANGGAL & SURVEYOR */}
          <NumberInput
            label="Odometer Dashboard (KM)"
            subLabel={<Badge variant="info">IoT Hino</Badge>}
            value={odometer}
            onChange={() => {}}
            readOnly
            suffixText="KM"
          />

          <DateInput
            label="Tanggal Pengecekan"
            value={inspectionDate}
            onChange={(e) => setInspectionDate(e.target.value)}
            required
          />

          <div className="w-full text-xs">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
              <span>Surveyor PIC Lapangan</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                <UserCheck size={11} /> Terverifikasi
              </span>
            </label>
            <div className="w-full h-10 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 flex items-center font-semibold text-slate-800 text-xs truncate">
              {mockCurrentSurveyor.name} ({mockCurrentSurveyor.nik})
            </div>
          </div>
        </Grid>
      </Card>

      {/* ================= 2. MATRIX SELURUH RODA (WALKAROUND) ================= */}
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pilih Roda untuk Pencatatan Fisik: Unit {unitCode} ({plateNumber})
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sisi Kanan adalah{" "}
              <strong className="text-blue-700">Sisi Supir 🇮🇩</strong> • Sisi
              Kiri adalah <strong>Sisi Kernet</strong>
            </p>
          </div>

          <Badge variant="neutral">
            Kemajuan: <strong>{completedWheelsCount}</strong> dari{" "}
            {wheelPositions.length} Roda Terdata
          </Badge>
        </div>

        {/* Tombol Roda */}
        <div className="flex flex-wrap gap-2 pt-1">
          {wheelPositions.map((pos) => {
            const isSelected = activeSlot === pos;
            const data = tiresData[pos];
            const isFilled = Boolean(data && data.serialNumber.trim() !== "");

            return (
              <button
                key={pos}
                type="button"
                onClick={() => setActiveSlot(pos)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                  isSelected
                    ? "bg-red-600 text-white shadow-md shadow-red-500/30 scale-105"
                    : isFilled
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}>
                <span>{pos}</span>
                {isFilled && (
                  <CheckCircle2
                    size={13}
                    className={isSelected ? "text-white" : "text-emerald-600"}
                  />
                )}
                {pos === "H1" && (
                  <span className="text-[9px] opacity-80">(Supir)</span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* ================= 3. FORMULIR PENCATATAN 7 PARAMETER ================= */}
      <div className="rounded-2xl border-2 border-red-200 bg-white p-6 shadow-md space-y-6">
        {/* Banner Roda Aktif */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-red-50/60 p-4 rounded-xl border border-red-200">
          <div>
            <span className="text-[10px] font-bold uppercase text-red-700 tracking-wider block">
              MENCATAT RODA:
            </span>
            <h2 className="text-sm font-black text-slate-900 mt-0.5">
              Posisi {activeSlot} • {getSlotDescription(activeSlot)}
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
                gandar kemudi steer hanya diizinkan Ban Baru (R0) atau Maksimal
                1x Vulkanisir (R1) demi keselamatan manuver di jalan raya!
              </p>
            </div>
          </div>
        )}

        {/* 7 Parameter Input (Konsisten text-xs font-semibold) */}
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
              error={
                isSteerViolation
                  ? `Posisi Steer (${activeSlot}) dilarang menggunakan ${currentTireForm.retreadStatus}. Wajib R0 atau R1!`
                  : undefined
              }
              helperText={
                isSteer
                  ? "SOP Gandar Steer: Hanya diizinkan R0 atau R1 demi keselamatan"
                  : "Siklus Casing: Maksimal 3x Vulkanisir (R0 → R1 → R2 → R3 → Afkir)"
              }>
              <option value="R0">R0 • Ban Baru Asli (Casing Baru)</option>
              <option value="R1">R1 • Vulkanisir ke-1 (Diizinkan Steer)</option>
              <option value="R2" disabled={isSteer}>
                R2 • Vulkanisir ke-2 {isSteer ? "(Dilarang Gandar Steer)" : ""}
              </option>
              <option value="R3" disabled={isSteer}>
                R3 • Vulkanisir ke-3 {isSteer ? "(Dilarang Gandar Steer)" : "(Batas Maksimal)"}
              </option>
              <option value="AFKIR">AFKIR • Rusak / Afkir (Wajib Scrap)</option>
            </Select>
          </div>

          {/* 4. TEKANAN ANGIN */}
          <div className="space-y-1 rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
            <NumberInput
              label="4. Tekanan Angin (PSI)"
              subLabel={
                <span className="text-[10px] text-slate-500">
                  Ideal: 110-120
                </span>
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
            <label className="text-xs font-semibold text-slate-700 block">
              7. Bukti Foto Lapangan
            </label>
            {currentTireForm.photoUrl ? (
              <div className="relative group overflow-hidden rounded-xl border border-slate-300 bg-slate-900 h-24 cursor-pointer">
                <img
                  src={currentTireForm.photoUrl}
                  alt="Foto Bukti"
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  onClick={() => setPreviewImage(currentTireForm.photoUrl)}
                />
                <div
                  onClick={() => setPreviewImage(currentTireForm.photoUrl)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-[11px] font-bold">
                  <ZoomIn size={14} />
                  <span>Perbesar</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCurrentTire({ photoUrl: null });
                  }}
                  className="absolute top-1.5 right-1.5 bg-rose-600 text-white p-1 rounded shadow hover:bg-rose-700 z-10 cursor-pointer">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition cursor-pointer text-center p-2">
                <Camera size={18} className="text-red-600" />
                <span className="font-semibold text-slate-700 text-xs">
                  [ 📷 Upload / Kamera ]
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </Grid>

        {/* 6. INDIKASI CACAT LAPANGAN */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="font-semibold text-slate-700 text-xs block">
            6. Indikasi Cacat Fisik:
          </label>
          <Grid cols={2} smCols={3} mdCols={6} gap="sm">
            {[
              "Normal",
              "Benjol / Bulge",
              "Sobek Samping",
              "Botak Sebelah",
              "Kawat Terbuka",
              "Tertusuk Paku",
            ].map((defect) => {
              const isChecked = currentTireForm.damages.includes(defect);
              return (
                <button
                  key={defect}
                  type="button"
                  onClick={() => handleToggleDamage(defect)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left font-semibold transition text-xs cursor-pointer ${
                    isChecked
                      ? defect === "Normal"
                        ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                        : "border-rose-400 bg-rose-50 text-rose-800"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}>
                  <div
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                      isChecked
                        ? defect === "Normal"
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-rose-600 bg-rose-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}>
                    {isChecked && <CheckCircle2 size={12} />}
                  </div>
                  <span className="truncate">{defect}</span>
                </button>
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
            onClick={handleNextWheel}
            className="shadow-red-500/25">
            Simpan & Roda Berikutnya
          </Button>
        </div>
      </div>

      {/* ================= 4. TOMBOL FINAL: DAFTARKAN TRUK KE SISTEM ================= */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Selesai Memeriksa Seluruh Ban Truk {unitCode}?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Truk baru beserta seluruh data riil bannya akan resmi didaftarkan
            dan langsung aktif di Digital Twin.
          </p>
        </div>

        <Button
          variant="secondary"
          size="lg"
          icon={Save}
          onClick={handleRegisterTruck}
          className="shadow-md">
          Daftarkan Unit Truk ke Sistem Armada
        </Button>
      </Card>

      {/* Lightbox Modal Gambar Reusable */}
      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={`Bukti Foto Fisik Ban • Roda ${activeSlot}`}
        size="lg">
        {previewImage && (
          <div className="flex items-center justify-center p-2 bg-slate-900 rounded-xl">
            <img
              src={previewImage}
              alt="Ukuran Penuh"
              className="max-h-[60vh] w-auto max-w-full rounded-lg object-contain"
            />
          </div>
        )}
      </Modal>
    </Container>
  );
}
