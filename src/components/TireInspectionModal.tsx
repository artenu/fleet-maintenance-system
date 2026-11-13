import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  ClipboardCheck,
  ArrowRight,
  Camera,
  Trash2,
  Sparkles,
  UserCheck,
  ZoomIn,
} from "lucide-react";
import {
  type WheelSlotEvaluation,
  type TireAsset,
  type RetreadStatus,
  type ActionRecommendation,
} from "../types/truck/tires";
import { mockCurrentSurveyor } from "../types/auth/auth";

interface TireInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: WheelSlotEvaluation | null;
  truckUnitCode: string;
  currentOdometer: number;
  onSaveInspection: (updatedTire: TireAsset, newOdometer: number) => void;
  onSaveAndNext?: (updatedTire: TireAsset, newOdometer: number) => void;
}

interface FormContentProps {
  onClose: () => void;
  slot: WheelSlotEvaluation & { tire: TireAsset };
  truckUnitCode: string;
  currentOdometer: number;
  onSaveInspection: (updatedTire: TireAsset, newOdometer: number) => void;
  onSaveAndNext?: (updatedTire: TireAsset, newOdometer: number) => void;
}

const STANDARD_BRANDS = [
  "Super Grip / MI RFD",
  "PT Boxer (Karet Medan)",
  "Bridgestone",
  "Michelin",
  "Giti",
  "Gajah Tunggal",
  "Dunlop",
  "Lainnya",
];

// 1. Form dideklarasikan di level modul dan menerima nilai awal langsung (Zero useEffect / React 19 pattern)
function TireInspectionFormContent({
  onClose,
  slot,
  truckUnitCode,
  currentOdometer,
  onSaveInspection,
  onSaveAndNext,
}: FormContentProps) {
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState<boolean>(false);
  const tire = slot.tire;
  const isSteer = slot.axleType === "steer";
  const initialPercent = tire.lastInspectionPercent || 75;

  // State Formulir Inspeksi Lapangan
  const [serialNumber, setSerialNumber] = useState<string>(tire.serialNumber);
  const [brand, setBrand] = useState<string>(tire.brand);
  const [customBrand, setCustomBrand] = useState<string>("");
  const [retreadStatus, setRetreadStatus] = useState<RetreadStatus>(
    tire.retreadStatus,
  );
  const [odometer, setOdometer] = useState<number>(currentOdometer);
  const [pressurePsi, setPressurePsi] = useState<number>(
    tire.pressurePsi || 115,
  );
  const [treadDepthMm, setTreadDepthMm] = useState<number>(
    tire.treadDepthMm || Math.max(2, Math.round((initialPercent / 100) * 15)),
  );
  const [physicalPercent, setPhysicalPercent] =
    useState<number>(initialPercent);
  const [visualDamages, setVisualDamages] = useState<string[]>(
    tire.visualDamages || [],
  );
  const [actionRecommendation, setActionRecommendation] =
    useState<ActionRecommendation>(
      tire.actionRecommendation ||
        (initialPercent < 40 ? "REPLACE_SERVICE" : "KEEP"),
    );
  const [notes, setNotes] = useState<string>(tire.inspectionNotes || "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    tire.photoEvidenceUrl || null,
  );

  const surveyorBadge = `${mockCurrentSurveyor.name} (${mockCurrentSurveyor.nik})`;

  // Helper toggle kerusakan
  const toggleDamage = (label: string) => {
    setVisualDamages((prev) =>
      prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label],
    );
  };

  // Upload / Jepret Foto Bukti Lapangan
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasSevereDamage =
    visualDamages.includes("Benjol / Bulge (Dinding Ban)") ||
    visualDamages.includes("Sobek Dinding Samping") ||
    visualDamages.includes("Kawat Baja Terbuka");

  // Golden Rule #5: Fisik < 40% langsung CRITICAL
  const isPhysicalCritical = physicalPercent < 40 || hasSevereDamage;

  // Golden Rule #1: Steer wajib R0
  const isSteerViolation =
    isSteer && retreadStatus !== "R0" && retreadStatus !== "R1";

  const liveStatus =
    isSteerViolation || isPhysicalCritical
      ? "CRITICAL"
      : physicalPercent < 70 || pressurePsi < 95 || pressurePsi > 130
        ? "WARNING"
        : "GOOD";

  const activeBrandName = brand === "Lainnya" ? customBrand || "Custom" : brand;

  // Susun payload hasil audit
  const buildUpdatedTire = (): TireAsset => ({
    ...tire,
    serialNumber: serialNumber.trim() || tire.serialNumber,
    brand: activeBrandName,
    retreadStatus,
    lastInspectionPercent: physicalPercent,
    lastInspectionDate: new Date().toISOString().split("T")[0],
    treadDepthMm,
    pressurePsi,
    visualDamages,
    inspectorName: surveyorBadge,
    inspectionNotes: notes,
    photoEvidenceUrl: photoPreview || undefined,
    actionRecommendation,
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    onSaveInspection(buildUpdatedTire(), odometer);
    onClose();
  };

  // Label Deskriptif Posisi Gandar (Sisi Supir 🇮🇩 vs Kernet)
  const getPositionDescription = (pos: string) => {
    if (pos === "H1") {return "Gandar 1 Depan • SISI KANAN (SUPIR 🇮🇩)";}
    if (pos === "H2") {return "Gandar 1 Depan • SISI KIRI (KERNET / PENUMPANG)";}
    if (pos === "H3" || pos === "H4")
      {return "Gandar 2 Drive • SISI KANAN (SUPIR 🇮🇩)";}
    if (pos === "H5" || pos === "H6")
      {return "Gandar 2 Drive • SISI KIRI (KERNET)";}
    if (pos === "S1") {return "Keranjang Cadangan • BAN SEREP";}
    return `Sasis Trailer • Posisi ${pos}`;
  };

  return (
    <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
      {/* Header Modal */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">
                Audit & Cek Fisik Lapangan Surveyor
              </h2>
              <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                REAL-TIME POOL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Unit Truk:{" "}
              <strong className="text-slate-800">{truckUnitCode}</strong> •
              Posisi:{" "}
              <strong className="text-blue-700 font-black">
                {slot.position}
              </strong>{" "}
              ({getPositionDescription(slot.position)})
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

      {/* Ringkasan Status Roda Saat Ini */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold">
            STATUS KESEHATAN
          </span>
          <span
            className={`font-black px-2 py-0.5 rounded text-[11px] inline-block mt-0.5 ${
              liveStatus === "CRITICAL"
                ? "bg-rose-100 text-rose-700"
                : liveStatus === "WARNING"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
            }`}>
            {liveStatus}
          </span>
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

      {/* Peringatan Pelanggaran Golden Rule */}
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

      {/* Form Input Surveyor */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* BAGIAN 1: IDENTITAS BAN & CASING */}
        <div className="rounded-xl border border-slate-200 p-3.5 space-y-3 bg-slate-50/40">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-red-600" />
            1. Verifikasi Identitas Aset Ban (Cegah Penukaran Liar)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nomor Seri Ban (DOT / Serial)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                placeholder="Contoh: BS-991204"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Cek fisik nomor pada dinding ban
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Merk Ban
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white">
                {STANDARD_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {brand === "Lainnya" && (
                <input
                  type="text"
                  placeholder="Ketik merk ban..."
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1 text-xs"
                />
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Status Casing (Vulkanisir)
              </label>
              <select
                value={retreadStatus}
                onChange={(e) =>
                  setRetreadStatus(e.target.value as RetreadStatus)
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white">
                <option value="R0">R0 • Ban Baru Asli</option>
                <option value="R1">R1 • Vulkanisir ke-1 (Boleh Steer)</option>
                <option value="R2">R2 • Vulkanisir ke-2</option>
                <option value="R3">R3 • Vulkanisir ke-3 (Maksimal)</option>
                <option value="AFKIR">AFKIR • Rusak / Afkir</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {isSteer
                  ? "Steer diizinkan R0 atau R1"
                  : "Maksimal 3x Vulkanisir (R3)"}
              </span>
            </div>
          </div>
        </div>

        {/* BAGIAN 2: PENGUKURAN TEKNIS (KM, ANGIN, TAPAK) */}
        <div className="rounded-xl border border-slate-200 p-3.5 space-y-3 bg-slate-50/40">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Gauge size={14} className="text-red-600" />
            2. Parameter Pengukuran Fisik Roda
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Odometer Dashboard Truk (KM)
              </label>
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                KM Aktual di Speedometer
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tekanan Angin (PSI)
              </label>
              <input
                type="number"
                value={pressurePsi}
                onChange={(e) => setPressurePsi(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Standar Ban Truk: 110 - 120 PSI
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kedalaman Alur (mm)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                value={treadDepthMm}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTreadDepthMm(val);
                  setPhysicalPercent(
                    Math.min(100, Math.round((val / 15) * 100)),
                  );
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Gauge: &lt;4.0 mm butuh penggantian
              </span>
            </div>
          </div>

          {/* Slider Persentase Kondisi Fisik */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-700 text-xs">
                Kondisi Fisik Tapak:
              </span>
              <strong className="text-red-600 font-extrabold text-sm">
                {physicalPercent}% (
                {physicalPercent >= 70
                  ? "Prima"
                  : physicalPercent >= 40
                    ? "Perhatian"
                    : "Kritis"}
                )
              </strong>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={physicalPercent}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPhysicalPercent(val);
                setTreadDepthMm(Number(((val / 15) * 10).toFixed(1)));
              }}
              className="w-full accent-red-600"
            />
          </div>
        </div>

        {/* BAGIAN 3: CHECKLIST KERUSAKAN FISIK LAPANGAN */}
        <div>
          <label className="block font-bold text-slate-700 mb-1.5">
            Checklist Temuan Kerusakan & Kelainan Fisik (Surveyor):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Benjol / Bulge (Dinding Ban)",
              "Sobek Dinding Samping",
              "Kawat Baja Terbuka",
              "Aus Tidak Rata (Camber/Toe)",
              "Tertusuk Paku / Bocor Halus",
              "Retak Rambut (Ozone / Cuaca)",
            ].map((damage) => {
              const isChecked = visualDamages.includes(damage);
              return (
                <button
                  key={damage}
                  type="button"
                  onClick={() => toggleDamage(damage)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-[11px] font-semibold transition ${
                    isChecked
                      ? "border-rose-400 bg-rose-50 text-rose-800 font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}>
                  <div
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                      isChecked
                        ? "border-rose-600 bg-rose-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}>
                    {isChecked && <CheckCircle2 size={12} />}
                  </div>
                  <span className="truncate">{damage}</span>
                </button>
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
            <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
              <Camera size={16} className="text-slate-500" />
              <span>Ambil / Upload Foto</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </label>

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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoPreview(null);
                    }}
                    title="Hapus foto"
                    className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-lg shadow-md hover:bg-rose-700 transition z-10">
                    <Trash2 size={14} />
                  </button>
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Rekomendasi Tindakan Lapangan:
            </label>
            <select
              value={actionRecommendation}
              onChange={(e) =>
                setActionRecommendation(e.target.value as ActionRecommendation)
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white">
              <option value="KEEP">🟢 Lanjut Operasi (Kondisi Aman)</option>
              <option value="INFLATE">
                🟡 Perlu Tambah Angin (Tekanan Rendah)
              </option>
              <option value="ROTATE">🔄 Jadwalkan Rotasi Gandar</option>
              <option value="REPLACE_SERVICE">
                🔴 Wajib Servis / Bongkar (Kritis)
              </option>
            </select>
          </div>

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

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Catatan Tambahan Temuan Lapangan:
          </label>
          <input
            type="text"
            placeholder="Contoh: Keausan alur lebih berat di sisi luar, cek spooring"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        {/* Footer Tombol Aksi */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
            Tutup
          </button>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900 transition">
              Simpan Roda Ini
            </button>
            {onSaveAndNext && (
              <button
                type="button"
                onClick={() => {
                  onSaveAndNext(buildUpdatedTire(), odometer);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md shadow-red-500/20 transition">
                <span>Simpan & Roda Berikutnya</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
        {/* Lightbox Modal Gambar Ukuran Penuh di Modal Inspeksi */}
        {isFullPreviewOpen && photoPreview && (
          <div
            onClick={() => setIsFullPreviewOpen(false)}
            className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-150">
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl max-h-[85vh] w-full flex flex-col items-center bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 cursor-default">
              <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-white">
                <span className="font-bold text-xs text-slate-200">
                  Foto Bukti Fisik Lapangan • {serialNumber}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFullPreviewOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="p-3 bg-black/50 w-full flex items-center justify-center">
                <img
                  src={photoPreview}
                  alt="Ukuran Penuh"
                  className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-lg"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// 2. Dialog Wrapper dengan Key-based reset (Sesuai panduan React 19)
export default function TireInspectionModal({
  isOpen,
  onClose,
  slot,
  truckUnitCode,
  currentOdometer,
  onSaveInspection,
  onSaveAndNext,
}: TireInspectionModalProps) {
  if (!isOpen || !slot || !slot.tire) {return null;}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <TireInspectionFormContent
        key={`${slot.position}-${slot.tire.id}`}
        onClose={onClose}
        slot={slot as WheelSlotEvaluation & { tire: TireAsset }}
        truckUnitCode={truckUnitCode}
        currentOdometer={currentOdometer}
        onSaveInspection={onSaveInspection}
        onSaveAndNext={onSaveAndNext}
      />
    </div>
  );
}
