import React, { useState } from "react";
import {
  PlusCircle,
  Camera,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Save,
  ScanLine,
  ZoomIn,
  X,
} from "lucide-react";
import { TruckFleetTireItem } from "../data/mockTires";
import {
  ChassisType,
  RetreadStatus,
  TireAsset,
  WheelPosition,
} from "../types/tires";

interface AddNewTruckViewProps {
  onSaveNewTruck: (newTruck: TruckFleetTireItem) => void;
}

// Data input per roda
interface TireInputData {
  serialNumber: string;
  brand: string;
  pattern: string;
  retreadStatus: RetreadStatus;
  pressurePsi: number;
  treadDepthMm: number;
  physicalPercent: number;
  damages: string[];
  photoUrl: string | null;
}

export default function AddNewTruckView({
  onSaveNewTruck,
}: AddNewTruckViewProps) {
  // ================= 1. DATA IDENTITAS MASTER TRUK BARU =================
  const [unitCode, setUnitCode] = useState<string>("TRK-005");
  const [plateNumber, setPlateNumber] = useState<string>("B 9123 UEK");
  const [truckBrand, setTruckBrand] = useState<string>("Hino Ranger FG 235 JJ");
  const [chassisType, setChassisType] = useState<ChassisType>("2_AXLE");
  const [odometer, setOdometer] = useState<number>(128450);
  const [driverName, setDriverName] = useState<string>("Samsul Arifin");
  const [surveyorName, setSurveyorName] = useState<string>("Bambang Sudiro");

  // Daftar Posisi Roda Sesuai Sasis (14 atau 18 Roda)
  const wheelPositions: WheelPosition[] = [
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
    "C7",
    "C8",
    ...(chassisType === "3_AXLE"
      ? (["C9", "C10", "C11", "C12"] as WheelPosition[])
      : []),
    "S1",
  ];

  // Roda yang sedang aktif dicatat surveyor
  const [activeSlot, setActiveSlot] = useState<WheelPosition>("H1");

  // ================= 2. DATA FISIK KESELURUHAN BAN TRUK =================
  const [tiresData, setTiresData] = useState<Record<string, TireInputData>>({
    H1: {
      serialNumber: "BS-2024-9988",
      brand: "Bridgestone",
      pattern: "R168",
      retreadStatus: "R0",
      pressurePsi: 110,
      treadDepthMm: 8.5,
      physicalPercent: 65,
      damages: ["Normal"],
      photoUrl:
        "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80",
    },
  });

  // State Lightbox Modal Gambar Ukuran Penuh
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Data ban pada posisi aktif
  const currentTireForm: TireInputData = tiresData[activeSlot] || {
    serialNumber: "",
    brand: "Bridgestone",
    pattern: "R168",
    retreadStatus: activeSlot === "H1" || activeSlot === "H2" ? "R0" : "R1",
    pressurePsi: 110,
    treadDepthMm: 14.0,
    physicalPercent: 90,
    damages: ["Normal"],
    photoUrl: null,
  };

  // Helper update form ban aktif
  const updateCurrentTire = (patch: Partial<TireInputData>) => {
    setTiresData((prev) => ({
      ...prev,
      [activeSlot]: {
        ...currentTireForm,
        ...patch,
      },
    }));
  };

  // Toggle Cacat Kerusakan
  const handleToggleDamage = (label: string) => {
    let currentDamages = [...currentTireForm.damages];
    if (label === "Normal") {
      updateCurrentTire({ damages: ["Normal"] });
      return;
    }

    currentDamages = currentDamages.filter((d) => d !== "Normal");
    if (currentDamages.includes(label)) {
      currentDamages = currentDamages.filter((d) => d !== label);
      if (currentDamages.length === 0) currentDamages = ["Normal"];
    } else {
      currentDamages.push(label);
    }
    updateCurrentTire({ damages: currentDamages });
  };

  // Upload/Kamera Foto
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCurrentTire({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Navigasi ke Roda Berikutnya
  const handleNextWheel = () => {
    const currentIndex = wheelPositions.indexOf(activeSlot);
    const nextIndex = (currentIndex + 1) % wheelPositions.length;
    setActiveSlot(wheelPositions[nextIndex]);
  };

  // Hitung berapa roda yang sudah selesai diisi nomor serinya
  const completedWheelsCount = wheelPositions.filter(
    (pos) => tiresData[pos] && tiresData[pos].serialNumber.trim() !== "",
  ).length;

  // Label Deskripsi Roda Sesuai Standar Indonesia
  const getSlotDescription = (pos: WheelPosition) => {
    if (pos === "H1") return "Gandar 1 Depan • SISI KANAN (SUPIR 🇮🇩)";
    if (pos === "H2") return "Gandar 1 Depan • SISI KIRI (KERNET / PENUMPANG)";
    if (pos === "H3" || pos === "H4")
      return `Gandar 2 Drive • SISI KANAN (SUPIR 🇮🇩)`;
    if (pos === "H5" || pos === "H6")
      return `Gandar 2 Drive • SISI KIRI (KERNET)`;
    if (pos === "S1") return "Keranjang Cadangan • BAN SEREP (SPARE)";
    return `Sasis Gandengan Trailer • Posisi ${pos}`;
  };

  // Validasi Golden Rule #1: Kemudi Steer Wajib R0
  const isSteer = activeSlot === "H1" || activeSlot === "H2";
  const isSteerViolation = isSteer && currentTireForm.retreadStatus !== "R0";

  // Simpan Truk Baru ke Database Master
  const handleRegisterTruck = () => {
    const compiledTires: TireAsset[] = wheelPositions.map((pos, idx) => {
      const data = tiresData[pos] || {
        serialNumber: `SN-${unitCode}-${pos}`,
        brand: "Super Grip / MI RFD",
        pattern: "Standar",
        retreadStatus: pos === "H1" || pos === "H2" ? "R0" : "R1",
        pressurePsi: 115,
        treadDepthMm: 12.0,
        physicalPercent: 80,
        damages: ["Normal"],
        photoUrl: null,
      };

      return {
        id: `TIRE-${unitCode}-${pos}-${idx}`,
        serialNumber: data.serialNumber || `SN-${unitCode}-${pos}`,
        brand:
          `${data.brand} ${data.pattern ? `/ ${data.pattern}` : ""}`.trim(),
        size: "10.00-20 16PR",
        retreadStatus: data.retreadStatus,
        currentVehicleId: unitCode,
        currentPosition: pos,
        installOdometer: odometer,
        lastInspectionPercent: data.physicalPercent,
        lastInspectionDate: new Date().toISOString().split("T")[0],
        treadDepthMm: data.treadDepthMm,
        pressurePsi: data.pressurePsi,
        visualDamages: data.damages,
        inspectorName: surveyorName,
        photoEvidenceUrl: data.photoUrl || undefined,
        actionRecommendation:
          data.physicalPercent < 40 ? "REPLACE_SERVICE" : "KEEP",
      };
    });

    const newTruckRecord: TruckFleetTireItem = {
      id: unitCode,
      unitCode,
      plateNumber,
      brand: truckBrand,
      driver: driverName,
      capacity: chassisType === "2_AXLE" ? "20FT" : "40FT",
      chassisType,
      currentOdometer: odometer,
      lastIotSync: "Baru saja terdaftar di pool",
      auditSchedule: {
        period: "November 2026",
        lastAuditDate: new Date().toISOString().split("T")[0],
        nextAuditSchedule: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "COMPLETED",
        surveyorName,
        rescheduledTo: null,
        rescheduleReason: null,
      },
      tires: compiledTires,
    };

    onSaveNewTruck(newTruckRecord);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* ================= 1. HEADER & FORM DATA MASTER TRUK ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-600 text-white shadow-md shadow-red-500/20">
              <PlusCircle size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  Pendaftaran Unit Truk Baru & Cek Fisik Ban
                </h1>
                <span className="rounded-md bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-black uppercase">
                  Data Master Baru
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftarkan identitas unit truk baru di pool dan catat kondisi
                riil seluruh ban yang terpasang
              </p>
            </div>
          </div>
        </div>

        {/* Input Form Master Truk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Kode Unit Truk Baru
            </label>
            <input
              type="text"
              value={unitCode}
              onChange={(e) => setUnitCode(e.target.value.toUpperCase())}
              placeholder="Contoh: TRK-005"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-slate-900 focus:border-red-500 focus:outline-none uppercase"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nomor Polisi (Plat Truk)
            </label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              placeholder="Contoh: B 9123 UEK"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-slate-900 focus:border-red-500 focus:outline-none uppercase"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Konfigurasi Gandar Sasis
            </label>
            <select
              value={chassisType}
              onChange={(e) => setChassisType(e.target.value as ChassisType)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-slate-900 bg-white focus:border-red-500 focus:outline-none">
              <option value="2_AXLE">2 Sumbu • 14 Ban (Trailer 20ft)</option>
              <option value="3_AXLE">3 Sumbu • 18 Ban (Trailer 40ft)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Odometer Fisik Dashboard (KM)
            </label>
            <input
              type="number"
              value={odometer}
              onChange={(e) => setOdometer(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-slate-900 focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Merk / Model Truk
            </label>
            <input
              type="text"
              value={truckBrand}
              onChange={(e) => setTruckBrand(e.target.value)}
              placeholder="Contoh: Hino Ranger FG 235 JJ"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nama Supir Utama
            </label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="Contoh: Samsul Arifin"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">
              Nama Surveyor PIC (Pemeriksa)
            </label>
            <input
              type="text"
              value={surveyorName}
              onChange={(e) => setSurveyorName(e.target.value)}
              placeholder="Contoh: Bambang Sudiro"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ================= 2. MATRIX SELURUH RODA (WALKAROUND PROGRESS) ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Pilih Roda untuk Pencatatan Fisik: Unit {unitCode} ({plateNumber})
            </h3>
            <p className="text-[11px] text-slate-500">
              Sisi Kanan adalah{" "}
              <strong className="text-blue-700">Sisi Supir 🇮🇩</strong> • Sisi
              Kiri adalah <strong>Sisi Kernet</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Kemajuan: <strong>{completedWheelsCount}</strong> dari{" "}
              {wheelPositions.length} Roda Terdata
            </span>
          </div>
        </div>

        {/* Deretan Tombol Roda */}
        <div className="flex flex-wrap gap-2 pt-1">
          {wheelPositions.map((pos) => {
            const isSelected = activeSlot === pos;
            const data = tiresData[pos];
            const isFilled = data && data.serialNumber.trim() !== "";

            return (
              <button
                key={pos}
                type="button"
                onClick={() => setActiveSlot(pos)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition shadow-2xs ${
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
      </div>

      {/* ================= 3. FORMULIR PENCATATAN 7 PARAMETER SPESIFIK ================= */}
      <div className="rounded-2xl border-2 border-red-200 bg-white p-6 shadow-md space-y-6">
        {/* Banner Roda Aktif */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-red-50/60 p-4 rounded-xl border border-red-200">
          <div>
            <span className="text-[10px] font-black uppercase text-red-700 tracking-wider block">
              MENCATAT RODA:
            </span>
            <h2 className="text-base font-black text-slate-900 mt-0.5">
              Posisi {activeSlot} • {getSlotDescription(activeSlot)}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-white text-slate-800 px-3 py-1 rounded-lg border border-red-200 shadow-2xs">
              {currentTireForm.retreadStatus} (
              {currentTireForm.retreadStatus === "R0" ? "Baru" : "Vulkanisir"})
            </span>
            <span className="text-xs font-black bg-red-600 text-white px-3 py-1 rounded-lg shadow-xs">
              {currentTireForm.physicalPercent}% Alur Fisik
            </span>
          </div>
        </div>

        {/* Peringatan Golden Rule Kemudi Steer */}
        {isSteerViolation && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-rose-950 text-xs">
            <ShieldAlert size={20} className="text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">
                Pelanggaran Golden Rule #1 (Gandar Kemudi Steer)!
              </strong>
              <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                Posisi Steer {activeSlot} dilarang menggunakan ban vulkanisir (
                {currentTireForm.retreadStatus}). Wajib pasang ban baru R0 demi
                keselamatan manuver setir di jalan raya!
              </p>
            </div>
          </div>
        )}

        {/* 7 PARAMETER INPUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* 1. NO. SERI BAN */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 p-3.5 bg-slate-50/30">
            <label className="font-extrabold text-slate-800 flex items-center justify-between">
              <span>1. No. Seri Ban (DOT / Serial)</span>
              <button
                type="button"
                onClick={() =>
                  updateCurrentTire({
                    serialNumber: `BS-2024-${Math.floor(1000 + Math.random() * 9000)}`,
                  })
                }
                className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold">
                <ScanLine size={12} /> Scan Barcode
              </button>
            </label>
            <input
              type="text"
              placeholder="[ BS-2024-9988 ]"
              value={currentTireForm.serialNumber}
              onChange={(e) =>
                updateCurrentTire({
                  serialNumber: e.target.value.toUpperCase(),
                })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 font-black text-slate-900 focus:border-red-500 focus:outline-none uppercase text-sm"
              required
            />
            <span className="text-[10px] text-slate-400 block">
              Nomor tertera pada dinding samping ban
            </span>
          </div>

          {/* 2. MERK & POLA */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 p-3.5 bg-slate-50/30">
            <label className="font-extrabold text-slate-800 block">
              2. Merk & Pola Tapak (Pattern)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Bridgestone"
                value={currentTireForm.brand}
                onChange={(e) => updateCurrentTire({ brand: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-slate-900 focus:border-red-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="R168 / Karet Medan"
                value={currentTireForm.pattern}
                onChange={(e) => updateCurrentTire({ pattern: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-slate-900 focus:border-red-500 focus:outline-none"
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              Contoh: Bridgestone / R168 atau PT Boxer / Karet Medan
            </span>
          </div>

          {/* 3. STATUS CASING */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 p-3.5 bg-slate-50/30">
            <label className="font-extrabold text-slate-800 block">
              3. Status Casing / Vulkanisir
            </label>
            <select
              value={currentTireForm.retreadStatus}
              onChange={(e) =>
                updateCurrentTire({
                  retreadStatus: e.target.value as RetreadStatus,
                })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-black text-slate-900 bg-white focus:border-red-500 focus:outline-none">
              <option value="R0">R0 • Ban Baru Asli (Casing Baru)</option>
              <option value="R1">R1 • Vulkanisir ke-1</option>
              <option value="R2">R2 • Vulkanisir ke-2 (Batas Maksimal)</option>
              <option value="AFKIR">AFKIR • Rusak / Afkir</option>
            </select>
            <span className="text-[10px] text-slate-400 block">
              {isSteer
                ? "Wajib R0 untuk Posisi Steer"
                : "Maksimal 2x Vulkanisir"}
            </span>
          </div>

          {/* 4. TEKANAN ANGIN */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 p-3.5 bg-slate-50/30">
            <label className="font-extrabold text-slate-800 flex items-center justify-between">
              <span>4. Tekanan Angin (PSI)</span>
              <span className="text-[10px] font-bold text-slate-500">
                Ideal: 110 - 120 PSI
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="110"
                value={currentTireForm.pressurePsi}
                onChange={(e) =>
                  updateCurrentTire({ pressurePsi: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-black text-slate-900 focus:border-red-500 focus:outline-none text-sm"
              />
              <span className="absolute right-3 top-2.5 text-xs font-black text-slate-400">
                PSI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Ukur menggunakan tire pressure gauge
            </span>
          </div>

          {/* 5. KEDALAMAN ALUR & AUTO-HITUNG PERSEN */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 p-3.5 bg-slate-50/30">
            <label className="font-extrabold text-slate-800 flex items-center justify-between">
              <span>5. Kedalaman Alur (mm)</span>
              <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Auto-Hitung: {currentTireForm.physicalPercent}% Prima
              </span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="25"
              placeholder="8.5"
              value={currentTireForm.treadDepthMm}
              onChange={(e) => {
                const val = Number(e.target.value);
                const computedPercent = Math.min(
                  100,
                  Math.round((val / 15) * 100),
                );
                updateCurrentTire({
                  treadDepthMm: val,
                  physicalPercent: computedPercent,
                });
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-black text-slate-900 focus:border-red-500 focus:outline-none text-sm"
            />
            <span className="text-[10px] text-slate-400 block">
              Batas Kritis Penggantian: &lt; 4.0 mm
            </span>
          </div>

          {/* 7. BUKTI FOTO LAPANGAN */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 p-3.5 bg-slate-50/30">
            <label className="font-extrabold text-slate-800 block">
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
                  className="absolute top-1.5 right-1.5 bg-rose-600 text-white p-1 rounded shadow hover:bg-rose-700 z-10">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition cursor-pointer text-center p-2">
                <Camera size={18} className="text-red-600" />
                <span className="font-bold text-slate-700 text-xs">
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
        </div>

        {/* 6. INDIKASI CACAT LAPANGAN */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="font-extrabold text-slate-800 text-xs block">
            6. Indikasi Cacat Fisik:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
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
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left font-bold transition ${
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
          </div>
        </div>

        {/* Footer Tombol Navigasi Walkaround */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <span className="text-xs text-slate-500">
            Roda {activeSlot} siap disimpan. Tekan tombol merah untuk lanjut
            keliling ke roda berikutnya.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNextWheel}
              className="flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black text-white hover:bg-red-700 shadow-md shadow-red-500/25 transition">
              <span>Simpan & Roda Berikutnya</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= 4. TOMBOL FINAL: DAFTARKAN TRUK KE SISTEM ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-slate-900">
            Selesai Memeriksa Seluruh Ban Truk {unitCode}?
          </h4>
          <p className="text-xs text-slate-500">
            Truk baru beserta seluruh data riil bannya akan resmi didaftarkan
            dan langsung aktif di Digital Twin.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRegisterTruck}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-black text-white hover:bg-slate-800 shadow-md transition">
          <Save size={16} className="text-emerald-400" />
          <span>Daftarkan Unit Truk ke Sistem Armada</span>
        </button>
      </div>

      {/* Lightbox Modal Gambar Ukuran Penuh */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 cursor-default">
            <div className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-white">
              <span className="font-extrabold text-xs text-slate-200 flex items-center gap-2">
                <Camera size={16} className="text-red-500" />
                Bukti Foto Fisik Ban • Roda {activeSlot}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-black/50 w-full flex items-center justify-center">
              <img
                src={previewImage}
                alt="Ukuran Penuh"
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
