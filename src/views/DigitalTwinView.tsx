// src/views/DigitalTwinView.tsx
import { WheelLayoutVisualizer } from "@/components/digitalTwin";
import { formatThousand } from "@/utils/formatters";
import { useDigitalTwin } from "@/hooks/useDigitalTwin";
import type { DigitalTwinViewProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

// 🧱 Komponen Reusable Design System
import { Container, Grid } from "@/components/layout";
import { Button, Badge, Card, StatCard, Modal } from "@/components/common";
import { FormInput, TextArea } from "@/components/forms";

import {
  RotateCw,
  ShieldAlert,
  Truck,
  ClipboardCheck,
  Disc3,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Camera,
  ZoomIn,
  Link2,
  CalendarClock,
} from "lucide-react";

export default function DigitalTwinView({
  activeTruck,
  selectedSlot,
  onSelectSlot,
  onOpenInspection,
  onOpenRotation,
  onEmergencySwapSpare,
  onApplyMechanicOverride,
}: DigitalTwinViewProps) {
  const {
    previewImage,
    setPreviewImage,
    isOverrideModalOpen,
    setIsOverrideModalOpen,
    mechanicName,
    setMechanicName,
    overrideReason,
    setOverrideReason,
    spareViolationMsg,
    setSpareViolationMsg,
    handleQuickSwapSpare,
    handleConfirmOverride,
    criticalTires,
    isGrounded,
    readinessPercent,
  } = useDigitalTwin({
    activeTruck,
    selectedSlot,
    onEmergencySwapSpare,
    onApplyMechanicOverride,
  });

  return (
    <Container className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* ================= 1. BANNER KELAIKAN JALAN ARMADA ================= */}
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
              <Badge variant={isGrounded ? "danger" : "success"}>
                {isGrounded
                  ? "DITAHAN DI POOL (GROUNDED)"
                  : "SIAP JALAN (FIT TO DISPATCH)"}
              </Badge>
              <strong className="text-sm font-black tracking-tight text-slate-900">
                Unit {activeTruck.unitCode} ({activeTruck.plateNumber})
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

        <div className="rounded-xl bg-white px-3.5 py-1.5 border border-slate-200 text-center shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">
            Kesiapan Roda
          </span>
          <strong
            className={`text-base font-black ${
              isGrounded ? "text-rose-600" : "text-emerald-600"
            }`}>
            {readinessPercent}% Layak
          </strong>
        </div>
      </div>

      {/* ================= 2. KPI METRICS CARDS (GRID) ================= */}
      <Grid cols={1} smCols={2} lgCols={4} gap="md">
        <StatCard
          title="Unit Truk & Driver"
          value={activeTruck.unitCode}
          subValue={activeTruck.plateNumber}
          subtitle={`Driver: ${activeTruck.driver}`}
          icon={Truck}
          variant="default"
        />

        <StatCard
          title="Odometer IoT Terkini"
          value={`${formatThousand(activeTruck.currentOdometer)} KM`}
          subtitle={`Sync: ${activeTruck.lastIotSync}`}
          icon={CheckCircle2}
          variant="success"
        />

        <StatCard
          title="Siklus Audit Bulanan"
          value={activeTruck.auditSchedule.nextAuditSchedule}
          subtitle={
            <Badge
              variant={
                activeTruck.auditSchedule.status === "OVERDUE"
                  ? "danger"
                  : activeTruck.auditSchedule.status === "COMPLETED"
                    ? "success"
                    : "warning"
              }
              pulse={activeTruck.auditSchedule.status === "OVERDUE"}>
              {activeTruck.auditSchedule.status}
            </Badge>
          }
          icon={CalendarClock}
          variant={
            activeTruck.auditSchedule.status === "OVERDUE"
              ? "danger"
              : "default"
          }
        />

        <StatCard
          title="Konfigurasi Sasis"
          value={activeTruck.chassisType === "2_AXLE" ? "14 Roda" : "18 Roda"}
          subValue={activeTruck.capacity}
          subtitle={
            activeTruck.chassisType === "2_AXLE"
              ? "2 Gandar Sasis"
              : "3 Gandar Sasis"
          }
          icon={Link2}
          variant="info"
        />
      </Grid>

      {/* ================= 3. DENAH RODA & DETAIL INSPECTOR ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Kolom Kiri: Visualizer Denah Roda */}
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

        {/* Kolom Kanan: Panel Detail Roda Terpilih */}
        <Card className="lg:sticky lg:top-20 space-y-4 max-h-[calc(100vh-6.5rem)] overflow-y-auto">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              Detail Pemeriksaan Roda
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
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
                <Badge
                  variant={
                    selectedSlot.healthStatus === "CRITICAL"
                      ? "danger"
                      : selectedSlot.healthStatus === "WARNING"
                        ? "warning"
                        : "success"
                  }>
                  {selectedSlot.healthStatus}
                </Badge>
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
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2 text-xs">
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
                          ? "R1 (Vulkanisir ke-1 - Boleh Steer)"
                          : selectedSlot.tire.retreadStatus === "R2"
                            ? "R2 (Vulkanisir ke-2)"
                            : "R3 (Vulkanisir ke-3 - Batas Maks)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Jarak Tempuh di Gandar:
                    </span>
                    <strong className="text-slate-900 font-bold">
                      {formatThousand(selectedSlot.kmElapsed)} KM
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sisa Jarak Tempuh:</span>
                    <strong
                      className={`font-bold ${
                        selectedSlot.remainingKm <= 0
                          ? "text-rose-600"
                          : "text-slate-900"
                      }`}>
                      {formatThousand(selectedSlot.remainingKm)} KM
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fisik Tapak:</span>
                    <strong className="text-slate-900 font-bold">
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
                      <strong className="text-slate-900 font-bold">
                        {selectedSlot.tire.pressurePsi} PSI
                      </strong>
                    </div>
                  )}

                  {/* Foto Bukti Fisik Lapangan */}
                  {selectedSlot.tire.photoEvidenceUrl ? (
                    <div className="pt-2 border-t border-slate-200/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Camera size={13} className="text-slate-600" />
                          Foto Bukti Lapangan:
                        </span>
                        <Badge variant="success">Terverifikasi</Badge>
                      </div>

                      <div
                        onClick={() => {
                          const tire = selectedSlot.tire;
                          if (!tire?.photoEvidenceUrl) {
                            return;
                          }
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
                          className="w-full h-32 object-cover group-hover:scale-105 transition duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                          <ZoomIn size={16} />
                          <span>Klik untuk Memperbesar</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                      <span className="text-[11px]">
                        Belum ada foto bukti fisik
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onOpenInspection}>
                        + Ambil Foto
                      </Button>
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
                <Button
                  variant="outline"
                  size="sm"
                  icon={RotateCw}
                  onClick={onOpenRotation}>
                  Rotasi Ban
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={ClipboardCheck}
                  onClick={onOpenInspection}>
                  Audit Fisik
                </Button>
              </div>

              {/* Baris 2: Tombol Emergency Roadside Swap & Toleransi Mekanik */}
              {selectedSlot.tire && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedSlot.position !== "S1" && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Disc3}
                      onClick={handleQuickSwapSpare}
                      title="Tukar cepat dengan Ban Serep S1 saat kondisi darurat"
                      className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                      Swap Serep (S1)
                    </Button>
                  )}

                  {!selectedSlot.tire.isMechanicOverridden ? (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Wrench}
                      onClick={() => setIsOverrideModalOpen(true)}
                      title="Berikan toleransi +5.000 KM jika kondisi fisik tapak masih tebal"
                      className={`border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 ${
                        selectedSlot.position === "S1" ? "col-span-2" : ""
                      }`}>
                      +5.000 KM
                    </Button>
                  ) : (
                    <Badge
                      variant="warning"
                      className="flex items-center justify-center">
                      Toleransi Aktif
                    </Badge>
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
        </Card>
      </div>

      {/* ================= MODAL TOLERANSI MEKANIK (+5.000 KM) ================= */}
      <Modal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        title="Dispensasi Toleransi Mekanik (+5.000 KM)"
        description="SOP: Hanya boleh diberikan jika fisik tapak masih tebal (>50%) & keausan merata"
        size="md">
        <form onSubmit={handleConfirmOverride} className="space-y-4 text-xs">
          <FormInput
            label="Nama Kepala Mekanik PIC"
            placeholder="Contoh: Budi Santoso (Mekanik Senior)"
            value={mechanicName}
            onChange={(e) => setMechanicName(e.target.value)}
            required
          />

          <TextArea
            label="Alasan Teknis Pemberian Toleransi"
            placeholder="Jelaskan kondisi fisik tapak ban, alasan toleransi, dan tindakan pencegahan..."
            rows={3}
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOverrideModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              className="bg-amber-600 hover:bg-amber-700">
              Setujui Toleransi +5.000 KM
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL PERINGATAN PELANGGARAN BAN SEREP ================= */}
      <Modal
        isOpen={Boolean(spareViolationMsg)}
        onClose={() => setSpareViolationMsg(null)}
        title={
          <span className="flex items-center gap-2 text-rose-600">
            <AlertTriangle size={18} />
            <span>Pelanggaran Golden Rule #1 Ditolak!</span>
          </span>
        }
        size="md"
        footer={
          <Button
            variant="danger"
            size="sm"
            onClick={() => setSpareViolationMsg(null)}>
            Saya Mengerti
          </Button>
        }>
        <p className="text-xs text-rose-900 leading-relaxed bg-rose-50 p-3.5 rounded-xl border border-rose-200">
          {spareViolationMsg}
        </p>
      </Modal>

      {/* ================= MODAL PREVIEW FOTO UKURAN PENUH ================= */}
      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.title}
        description={previewImage?.subtitle}
        size="lg">
        {previewImage && (
          <div className="flex items-center justify-center p-2 bg-slate-900 rounded-xl">
            <img
              src={previewImage.url}
              alt="Foto Ukuran Penuh"
              className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain"
            />
          </div>
        )}
      </Modal>
    </Container>
  );
}
