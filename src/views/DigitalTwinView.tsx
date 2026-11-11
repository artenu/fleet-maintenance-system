import { useState } from "react";
import WheelLayoutVisualizer from "../components/WheelLayoutVisualizer";
import { type TruckFleetTireItem } from "../data/mockTires";
import { type WheelPosition, type WheelSlotEvaluation } from "../types/truck/tires";
import {
  RotateCw,
  ShieldAlert,
  Truck,
  ClipboardCheck,
  Disc3,
  ShieldCheck,
  Wrench,
  X,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Camera,
  ZoomIn,
} from "lucide-react";

interface DigitalTwinViewProps {
  activeTruck: TruckFleetTireItem;
  selectedSlot: WheelSlotEvaluation | null;
  onSelectSlot: (slot: WheelSlotEvaluation | null) => void;
  onOpenInspection: () => void;
  onOpenRotation: () => void;
  onEmergencySwapSpare: (position: WheelPosition) => void;
  onApplyMechanicOverride: (
    position: WheelPosition,
    mechanicName: string,
    reason: string,
  ) => void;
}

export default function DigitalTwinView({
  activeTruck,
  selectedSlot,
  onSelectSlot,
  onOpenInspection,
  onOpenRotation,
  onEmergencySwapSpare,
  onApplyMechanicOverride,
}: DigitalTwinViewProps) {
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    title: string;
    subtitle?: string;
  } | null>(null);
  // State Modal Toleransi Mekanik (+5.000 KM Override)
  const [isOverrideModalOpen, setIsOverrideModalOpen] =
    useState<boolean>(false);
  const [mechanicName, setMechanicName] = useState<string>(
    "Slamet Riyadi (Kepala Mekanik)",
  );
  const [overrideReason, setOverrideReason] = useState<string>(
    "Fisik kembangan masih tebal (>60%) & merata, rute operasional jalan tol datar",
  );

  // State Modal Peringatan Pelanggaran Swap Serep
  const [spareViolationMsg, setSpareViolationMsg] = useState<string | null>(
    null,
  );

  // Cari data ban serep S1
  const spareTire = activeTruck.tires.find((t) => t.currentPosition === "S1");

  // Handler Aksi Tukar Ban Serep
  const handleQuickSwapSpare = () => {
    if (!selectedSlot || !selectedSlot.tire) {return;}

    // Validasi Golden Rule #1: Jika target adalah Steer H1/H2, ban serep S1 HARUS R0!
    const isSteer =
      selectedSlot.position === "H1" || selectedSlot.position === "H2";
    if (isSteer && spareTire && spareTire.retreadStatus !== "R0") {
      setSpareViolationMsg(
        `DILARANG KERAS (Golden Rule #1): Ban serep S1 berstatus vulkanisir (${spareTire.retreadStatus}). Gandar Kemudi (Steer ${selectedSlot.position}) hanya boleh menggunakan ban baru R0 demi keselamatan manuver kemudi!`,
      );
      return;
    }

    if (
      window.confirm(
        `Konfirmasi Emergency Roadside Swap:\nTukar posisi ban ${selectedSlot.position} (${selectedSlot.tire.serialNumber}) dengan Ban Serep S1 (${spareTire ? spareTire.serialNumber : "Kosong"})?`,
      )
    ) {
      onEmergencySwapSpare(selectedSlot.position);
    }
  };

  const handleConfirmOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {return;}

    onApplyMechanicOverride(
      selectedSlot.position,
      mechanicName,
      overrideReason,
    );
    setIsOverrideModalOpen(false);
  };

  // Evaluasi Kelayakan Jalan Armada (Dispatch Readiness)
  const criticalTires = activeTruck.tires.filter((t) => {
    const isSteer = t.currentPosition === "H1" || t.currentPosition === "H2";
    const isSteerViolation = isSteer && t.retreadStatus !== "R0";
    const isPhysicalCritical = t.lastInspectionPercent < 40;
    return isSteerViolation || isPhysicalCritical;
  });

  const isGrounded = criticalTires.length > 0;

  return (
    <div className="space-y-6">
      <div
        className={`rounded-2xl p-4 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-xs ${
          isGrounded
            ? "border-rose-300 bg-linear-to-r from-rose-50 to-red-50/70 text-rose-950"
            : "border-emerald-300 bg-linear-to-r from-emerald-50 to-teal-50/70 text-emerald-950"
        }`}>
        <div className="flex items-center gap-3.5">
          <div
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white shadow-md ${
              isGrounded
                ? "bg-rose-600 shadow-rose-500/30 animate-pulse"
                : "bg-emerald-600 shadow-emerald-500/30"
            }`}>
            {isGrounded ? (
              <AlertOctagon size={24} />
            ) : (
              <CheckCircle2 size={24} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  isGrounded
                    ? "bg-rose-200/80 text-rose-900"
                    : "bg-emerald-200/80 text-emerald-900"
                }`}>
                {isGrounded
                  ? "DITAHAN DI POOL (GROUNDED)"
                  : "SIAP BERANGKAT (FIT TO DISPATCH)"}
              </span>
              <strong className="text-sm font-black tracking-tight">
                Status Kelayakan Jalan: Unit {activeTruck.unitCode}
              </strong>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {isGrounded ? (
                <span>
                  <strong className="text-rose-700">PERINGATAN:</strong>{" "}
                  Ditemukan{" "}
                  <strong>{criticalTires.length} roda berstatus KRITIS</strong>.
                  Unit dilarang memuat kontainer sebelum ban diperbaiki atau
                  dirotasi!
                </span>
              ) : (
                <span>
                  Seluruh roda dalam batas operasional aman. Surat Jalan (SJ)
                  siap diterbitkan untuk rute jarak jauh.
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="rounded-xl bg-white px-3 py-1.5 border border-slate-200 text-center shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">
              Kesiapan Roda
            </span>
            <strong
              className={`text-sm font-black ${
                isGrounded ? "text-rose-600" : "text-emerald-600"
              }`}>
              {Math.round(
                ((activeTruck.tires.length - criticalTires.length) /
                  activeTruck.tires.length) *
                  100,
              )}
              % Layak
            </strong>
          </div>
        </div>
      </div>
      {/* 1. Banner Info Unit Terpilih */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Unit Truk & Driver
          </span>
          <strong className="text-base font-extrabold text-slate-900 mt-1 block">
            {activeTruck.unitCode} • {activeTruck.plateNumber}
          </strong>
          <p className="text-xs text-slate-500 mt-0.5">
            Driver: <strong>{activeTruck.driver}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Odometer IoT Terkini
          </span>
          <strong className="text-base font-extrabold text-slate-900 mt-1 block">
            {activeTruck.currentOdometer.toLocaleString("id-ID")} KM
          </strong>
          <p className="text-xs text-emerald-600 mt-0.5 font-medium">
            Sync: {activeTruck.lastIotSync}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Siklus Audit Bulanan
          </span>
          <strong className="text-base font-extrabold text-slate-900 mt-1 block">
            {activeTruck.auditSchedule.nextAuditSchedule}
          </strong>
          <span
            className={`inline-block text-[10px] font-bold mt-0.5 rounded px-1.5 py-0.2 ${
              activeTruck.auditSchedule.status === "OVERDUE"
                ? "bg-rose-100 text-rose-700 animate-pulse"
                : activeTruck.auditSchedule.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
            }`}>
            {activeTruck.auditSchedule.status}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Tipe Konfigurasi Sasis
          </span>
          <strong className="text-base font-extrabold text-slate-900 mt-1 block">
            {activeTruck.chassisType === "2_AXLE"
              ? "14 Roda (2 Sumbu)"
              : "18 Roda (3 Sumbu)"}
          </strong>
          <p className="text-xs text-slate-500 mt-0.5">
            Kapasitas: {activeTruck.capacity}
          </p>
        </div>
      </div>

      {/* 2. Denah Interaktif Gandar Roda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <WheelLayoutVisualizer
            unitCode={activeTruck.unitCode}
            plateNumber={activeTruck.plateNumber}
            currentOdometer={activeTruck.currentOdometer}
            initialChassisType={activeTruck.chassisType}
            tires={activeTruck.tires}
            onSelectSlot={(slot) => onSelectSlot(slot)}
          />
        </div>

        {/* 3. Panel Detail Roda yang Dipilih */}
        <div className="lg:sticky lg:top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 max-h-[calc(100vh-6.5rem)] overflow-y-auto">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              Detail Pemeriksaan Roda
            </h3>
            <p className="text-xs text-slate-500">
              Klik salah satu kotak ban pada denah untuk melihat riwayatnya.
            </p>
          </div>

          {selectedSlot ? (
            <div className="space-y-4 text-xs">
              {/* Posisi & Health Status */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900">
                    Posisi {selectedSlot.position}
                  </span>
                  <p className="text-[11px] font-semibold text-slate-500 capitalize">
                    {selectedSlot.axleType} Axle
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                    selectedSlot.healthStatus === "CRITICAL"
                      ? "bg-rose-100 text-rose-700"
                      : selectedSlot.healthStatus === "WARNING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}>
                  {selectedSlot.healthStatus}
                </span>
              </div>

              {/* Badge Toleransi Mekanik Jika Aktif */}
              {selectedSlot.tire?.isMechanicOverridden && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-amber-900">
                  <ShieldCheck
                    size={16}
                    className="text-amber-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="font-bold block">
                      Toleransi Mekanik +5.000 KM Aktif
                    </strong>
                    <p className="text-[10px] text-amber-800 mt-0.5">
                      Disetujui oleh:{" "}
                      <strong>{selectedSlot.tire.overrideApprovedBy}</strong>.
                      Alasan: {selectedSlot.tire.overrideReason}
                    </p>
                  </div>
                </div>
              )}

              {/* Alarm Pelanggaran Golden Rule */}
              {selectedSlot.ruleViolations.length > 0 && (
                <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert size={16} className="text-rose-600" />
                    <span>Pelanggaran Aturan Mutlak!</span>
                  </div>
                  {selectedSlot.ruleViolations.map((v, i) => (
                    <p key={i} className="text-[11px] leading-relaxed">
                      • {v}
                    </p>
                  ))}
                </div>
              )}

              {/* Data Fisik Ban */}
              {selectedSlot.tire ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nomor Seri:</span>
                    <strong className="text-slate-900 font-bold">
                      {selectedSlot.tire.serialNumber}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Merk & Ukuran:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedSlot.tire.brand} ({selectedSlot.tire.size})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Siklus Casing:</span>
                    <span className="font-bold text-blue-700">
                      {selectedSlot.tire.retreadStatus === "R0"
                        ? "R0 (Ban Baru Asli)"
                        : selectedSlot.tire.retreadStatus === "R1"
                          ? "R1 (Vulkanisir ke-1)"
                          : "R2 (Vulkanisir ke-2 - Batas Maksimal)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Jarak Tempuh di Gandar:
                    </span>
                    <strong className="text-slate-900">
                      {selectedSlot.kmElapsed.toLocaleString("id-ID")} KM
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Batas Maksimal Gandar:
                    </span>
                    <span className="font-semibold text-slate-700">
                      {selectedSlot.maxAllowedKm.toLocaleString("id-ID")} KM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sisa Jarak Tempuh:</span>
                    <strong
                      className={`font-bold ${
                        selectedSlot.remainingKm <= 0
                          ? "text-rose-600"
                          : "text-slate-900"
                      }`}>
                      {selectedSlot.remainingKm.toLocaleString("id-ID")} KM
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fisik Tapak:</span>
                    <strong className="text-slate-900">
                      {selectedSlot.tire.lastInspectionPercent}%
                      {selectedSlot.tire.treadDepthMm && (
                        <span className="text-slate-400 font-normal ml-1">
                          ({selectedSlot.tire.treadDepthMm} mm)
                        </span>
                      )}
                    </strong>
                  </div>

                  {selectedSlot.tire.pressurePsi && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tekanan Angin:</span>
                      <strong className="text-slate-900">
                        {selectedSlot.tire.pressurePsi} PSI
                      </strong>
                    </div>
                  )}

                  {selectedSlot.tire.inspectorName && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Surveyor Terakhir:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedSlot.tire.inspectorName}
                      </span>
                    </div>
                  )}

                  {selectedSlot.tire.visualDamages &&
                    selectedSlot.tire.visualDamages.length > 0 && (
                      <div className="pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold text-rose-700 block mb-1">
                          Catatan Cacat Fisik:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedSlot.tire.visualDamages.map((d, i) => (
                            <span
                              key={i}
                              className="bg-rose-50 text-rose-700 border border-rose-200 rounded px-1.5 py-0.5 text-[9px] font-semibold">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Foto Bukti Fisik Lapangan */}
                  {selectedSlot.tire.photoEvidenceUrl ? (
                    <div className="pt-2 border-t border-slate-200/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Camera size={13} className="text-slate-600" />
                          Foto Bukti Lapangan:
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Terverifikasi
                        </span>
                      </div>
                      <div
                        onClick={() => {
                          const tire = selectedSlot.tire;
                          if (!tire || !tire.photoEvidenceUrl) {return;}
                          setPreviewImage({
                            url: tire.photoEvidenceUrl,
                            title: `Ban ${tire.serialNumber} (${tire.brand})`,
                            subtitle: `Posisi ${selectedSlot.position} • Diinspeksi ${tire.lastInspectionDate} oleh ${tire.inspectorName || "Surveyor Lapangan"}`,
                          });
                        }}
                        className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-2xs bg-slate-900 cursor-pointer">
                        <img
                          src={selectedSlot.tire.photoEvidenceUrl}
                          alt="Foto Bukti Tapak Ban"
                          className="w-full h-36 object-cover group-hover:scale-105 transition duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                          <ZoomIn size={18} />
                          <span>Klik untuk Memperbesar</span>
                        </div>
                        <div className="absolute bottom-1.5 left-2 bg-slate-950/80 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {selectedSlot.tire.serialNumber} •{" "}
                          {selectedSlot.tire.lastInspectionDate}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Camera size={14} className="text-slate-400" />
                        <span className="text-[11px]">
                          Belum ada foto bukti fisik
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={onOpenInspection}
                        className="text-[10px] font-bold text-red-600 hover:text-red-700">
                        + Ambil Foto
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-400 italic">
                  Slot roda ini saat ini belum terpasang ban.
                </p>
              )}

              {/* Baris 1: Tombol Aksi Lapangan Reguler */}
              <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onOpenRotation}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs">
                  <RotateCw size={13} /> Rotasi Ban
                </button>
                <button
                  type="button"
                  onClick={onOpenInspection}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-sm shadow-red-500/20 transition">
                  <ClipboardCheck size={13} /> Audit Fisik
                </button>
              </div>

              {/* Baris 2: Tombol Khusus Edge Case #3 (Swap Serep) & Edge Case #4 (Toleransi Mekanik) */}
              {selectedSlot.tire && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedSlot.position !== "S1" && (
                    <button
                      type="button"
                      onClick={handleQuickSwapSpare}
                      title="Tukar cepat dengan Ban Serep S1 saat kondisi darurat di jalan"
                      className="flex items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50/70 py-2 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition">
                      <Disc3 size={13} /> Swap Serep (S1)
                    </button>
                  )}

                  {!selectedSlot.tire.isMechanicOverridden ? (
                    <button
                      type="button"
                      onClick={() => setIsOverrideModalOpen(true)}
                      title="Berikan toleransi +5.000 KM jika kondisi fisik tapak masih tebal"
                      className={`flex items-center justify-center gap-1 rounded-xl border border-amber-300 bg-amber-50/70 py-2 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition ${
                        selectedSlot.position === "S1" ? "col-span-2" : ""
                      }`}>
                      <Wrench size={13} /> +5.000 KM Mekanik
                    </button>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-bold flex items-center justify-center bg-amber-50 rounded-xl border border-amber-200">
                      Toleransi Aktif
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Truck size={32} className="mx-auto text-slate-300" />
              <p className="text-xs font-medium">
                Pilih salah satu kotak ban untuk melihat data
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup Toleransi Mekanik (+5.000 KM Override) */}
      {isOverrideModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wrench size={18} className="text-amber-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Dispensasi Toleransi Mekanik (+5.000 KM)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOverrideModalOpen(false)}
                className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="block font-bold">
                SOP Perpanjangan Usia Ban (Edge Case #4):
              </strong>
              <p className="text-[11px] leading-relaxed">
                Toleransi +5.000 KM hanya boleh diberikan apabila kondisi fisik
                tapak ban masih layak (&gt;50%) dan keausan kompon merata.
              </p>
            </div>

            <form
              onSubmit={handleConfirmOverride}
              className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Kepala Mekanik PIC
                </label>
                <input
                  type="text"
                  value={mechanicName}
                  onChange={(e) => setMechanicName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alasan Teknis Pemberian Toleransi
                </label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 shadow-xs">
                  Setujui Toleransi +5.000 KM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog Peringatan Pelanggaran Swap Ban Serep */}
      {spareViolationMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-rose-600 font-extrabold text-sm">
              <AlertTriangle size={20} />
              <span>Pelanggaran Golden Rule #1 Ditolak!</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200">
              {spareViolationMsg}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSpareViolationMsg(null)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700">
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal Preview Ukuran Penuh */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm animate-in fade-in duration-200 cursor-zoom-out">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 cursor-default animate-in zoom-in-95 duration-150">
            {/* Header Preview */}
            <div className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 text-white">
              <div>
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                  <Camera size={16} className="text-red-500" />
                  {previewImage.title}
                </h4>
                {previewImage.subtitle && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {previewImage.subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition">
                <X size={20} />
              </button>
            </div>

            {/* Gambar Ukuran Penuh */}
            <div className="p-3 w-full flex items-center justify-center overflow-auto max-h-[72vh] bg-black/50">
              <img
                src={previewImage.url}
                alt="Foto Bukti Ukuran Penuh"
                className="max-h-[68vh] w-auto max-w-full rounded-xl object-contain shadow-lg"
              />
            </div>

            {/* Footer Modal Info */}
            <div className="w-full px-5 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Klik di luar gambar atau tekan tombol silang untuk menutup
              </span>
              <a
                href={previewImage.url}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1">
                Buka di Tab Baru ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
