// src/views/AddNewTruckView.tsx
import { Save } from "lucide-react";
import { useTireConditionForm } from "@/hooks/useTireConditionForm";
import type { AddNewTruckViewProps } from "@/types/AddNewTruckView/AddNewTruckViewTypes";

// 🧱 Design System Reusable
import { Container } from "@/components/layout";
import { Button, Card, Modal } from "@/components/common";
import {
  PendingTrucksBanner,
  TruckMasterForm,
  WheelMatrixSelector,
  TireConditionFormCard,
} from "@/components/addNewTruck";

export default function AddNewTruckView({
  existingTrucks = [],
  chassisList = [],
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
  } = useTireConditionForm({ existingTrucks, chassisList, onSaveNewTruck });

  return (
    <Container className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Banner Pelacak Unit Baru dari Database Pusat */}
      <PendingTrucksBanner pendingNewTrucks={pendingNewTrucks} />

      {/* 2. Header & Data Master Truk (Grid 3x3 Simetris) */}
      <TruckMasterForm
        plateOptions={plateOptions}
        plateNumber={plateNumber}
        onSelectPlateNumber={handleSelectPlateNumber}
        unitCode={unitCode}
        truckBrand={truckBrand}
        chassisCode={chassisCode}
        chassisType={chassisType}
        onChangeChassisType={setChassisType}
        driverName={driverName}
        odometer={odometer}
        inspectionDate={inspectionDate}
        onChangeInspectionDate={setInspectionDate}
      />

      {/* 3. Matriks Seluruh Roda Truk (Walkaround) */}
      <WheelMatrixSelector
        unitCode={unitCode}
        plateNumber={plateNumber}
        wheelPositions={wheelPositions}
        activeSlot={activeSlot}
        onSelectSlot={setActiveSlot}
        completedWheelsCount={completedWheelsCount}
        tiresData={tiresData}
      />

      {/* 4. Formulir Pencatatan 7 Parameter Ban */}
      <TireConditionFormCard
        activeSlot={activeSlot}
        slotDescription={getSlotDescription(activeSlot)}
        currentTireForm={currentTireForm}
        updateCurrentTire={updateCurrentTire}
        onToggleDamage={handleToggleDamage}
        onPhotoCapture={handlePhotoCapture}
        onNextWheel={handleNextWheel}
        isSteer={isSteer}
        isSteerViolation={isSteerViolation}
        onPreviewPhoto={setPreviewImage}
      />

      {/* 5. Tombol Final: Daftarkan Truk ke Sistem */}
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

      {/* Lightbox Modal Gambar Bukti Foto */}
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
