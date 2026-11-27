// src/components/digitalTwin/TireInspectionModal.tsx
import type { FormEvent } from "react";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import type {
  WheelSlotEvaluation,
  TireAsset,
} from "@/types/TireManagement/tires";
import type {
  TireInspectionModalProps,
  TireInspectionFormContentProps,
} from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import { getWheelPositionDescription } from "@/constants/truck";
import { useTireInspectionForm } from "@/hooks/useTireInspectionForm";
import { Modal, Button, Badge } from "@/components/common";
import {
  InspectionStatusHeader,
  InspectionIdentitySection,
  InspectionMeasurementsSection,
  InspectionDamageSection,
  InspectionPhotoSection,
  InspectionRecommendationSection,
} from "./inspection";

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
    previewPhotoIndex,
    setPreviewPhotoIndex,
    serialNumber,
    setSerialNumber,
    brand,
    setBrand,
    customBrand,
    setCustomBrand,
    retreadStatus,
    setRetreadStatus,
    inspectionDate,
    setInspectionDate,
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
    punctureByCycle,
    handleChangePunctureForCycle,
    totalPunctures,
    isAfkirMandatory,
    actionRecommendation,
    setActionRecommendation,
    notes,
    setNotes,
    photoPreviews,
    handlePhotoCapture,
    handleDeletePhoto,
    isPhysicalCritical,
    isSteerViolation,
    isSteerRetreadWarning,
    liveStatus,
    buildUpdatedTire,
    isSteer,
  } = useTireInspectionForm({
    tire,
    axleType: slot.axleType,
    currentOdometer,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaveInspection(buildUpdatedTire(), odometer);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {/* 1. Status Kesehatan Roda & Peringatan Golden Rules */}
      <InspectionStatusHeader
        liveStatus={liveStatus}
        axleType={slot.axleType}
        kmElapsed={slot.kmElapsed}
        pressurePsi={pressurePsi}
        isSteerViolation={isSteerViolation}
        isSteerRetreadWarning={isSteerRetreadWarning}
        isPhysicalCritical={isPhysicalCritical}
        isAfkirMandatory={isAfkirMandatory}
        totalPunctures={totalPunctures}
        position={slot.position}
        retreadStatus={retreadStatus}
      />

      {/* 2. Identitas Ban & Casing */}
      <InspectionIdentitySection
        serialNumber={serialNumber}
        onChangeSerialNumber={setSerialNumber}
        brand={brand}
        onChangeBrand={setBrand}
        customBrand={customBrand}
        onChangeCustomBrand={setCustomBrand}
        retreadStatus={retreadStatus}
        onChangeRetreadStatus={setRetreadStatus}
        inspectionDate={inspectionDate}
        onChangeInspectionDate={setInspectionDate}
        isSteer={isSteer}
        isAfkirMandatory={isAfkirMandatory}
        totalPunctures={totalPunctures}
      />

      {/* 3. Pengukuran Teknis (KM, PSI, Tapak mm, Slider %) */}
      <InspectionMeasurementsSection
        odometer={odometer}
        onChangeOdometer={setOdometer}
        pressurePsi={pressurePsi}
        onChangePressurePsi={setPressurePsi}
        treadDepthMm={treadDepthMm}
        onChangeTreadDepthMm={setTreadDepthMm}
        physicalPercent={physicalPercent}
        onChangePhysicalPercent={setPhysicalPercent}
      />

      {/* 4. Checklist Kerusakan Fisik & Riwayat Tambal/Bocor */}
      <InspectionDamageSection
        visualDamages={visualDamages}
        onToggleDamage={toggleDamage}
        punctureByCycle={punctureByCycle}
        currentRetreadStatus={retreadStatus}
        onChangePunctureForCycle={handleChangePunctureForCycle}
        totalPunctures={totalPunctures}
      />

      {/* 5. Foto Bukti Lapangan (Multi-Foto) & Lightbox Preview */}
      <InspectionPhotoSection
        photoPreviews={photoPreviews}
        onPhotoCapture={handlePhotoCapture}
        onDeletePhoto={handleDeletePhoto}
        previewPhotoIndex={previewPhotoIndex}
        onOpenFullPreview={(idx) => setPreviewPhotoIndex(idx)}
        onCloseFullPreview={() => setPreviewPhotoIndex(null)}
        serialNumber={serialNumber}
      />

      {/* 6. Rekomendasi Tindakan Lapangan & Surveyor PIC */}
      <InspectionRecommendationSection
        actionRecommendation={actionRecommendation}
        onChangeActionRecommendation={setActionRecommendation}
        notes={notes}
        onChangeNotes={setNotes}
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
      size="full"
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
      }>
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
