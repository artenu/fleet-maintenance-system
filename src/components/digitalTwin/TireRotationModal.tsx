// src/components/digitalTwin/TireRotationModal.tsx
import { ArrowRightLeft, ShieldAlert } from "lucide-react";
import type {
  WheelSlotEvaluation,
  TireAsset,
  WheelPosition,
} from "@/types/truck/tires";
import type {
  TireRotationModalProps,
  TireRotationFormContentProps,
} from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import { getWheelPositionDescription } from "@/constants/truck";
import { ROTATION_REASON_OPTIONS } from "@/constants/digitalTwin";
import { useTireRotationForm } from "@/hooks/useTireRotationForm";
import { Modal, Button } from "@/components/common";
import { FormInput, Select } from "@/components/forms";
import {
  SourceTireInfoCard,
  RotationModeToggle,
  SwapPositionSection,
  WarehouseReplaceSection,
} from "./rotation";

/**
 * Konten Form Rotasi & Mutasi Roda (Key-based reset)
 */
function TireRotationFormContent({
  onClose,
  sourceSlot,
  allTruckTires,
  warehouseTires,
  chassisType,
  currentOdometer,
  onExecuteRotation,
}: TireRotationFormContentProps) {
  const {
    sourceTire,
    mode,
    setMode,
    targetPosition,
    setTargetPosition,
    availableTargetPositions,
    targetTire,
    warehouseTireId,
    setWarehouseTireId,
    sourceDestination,
    setSourceDestination,
    reason,
    setReason,
    mechanicPic,
    setMechanicPic,
    violationError,
    handleSubmit,
  } = useTireRotationForm({
    sourceSlot,
    allTruckTires,
    warehouseTires,
    chassisType,
    currentOdometer,
    onExecuteRotation,
    onClose,
  });

  const targetPositionOptions = availableTargetPositions.map((pos) => ({
    value: pos,
    label: `Posisi ${pos} • ${getWheelPositionDescription(pos)}`,
  }));

  const warehouseTireOptions = warehouseTires.map((wh) => ({
    value: wh.id,
    label: `${wh.serialNumber} • ${wh.brand} (${wh.retreadStatus}) - Fisik ${wh.lastInspectionPercent}%`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {/* 1. Info Ban Asal */}
      <SourceTireInfoCard sourceTire={sourceTire} />

      {/* 2. Pilihan Mode Rotasi */}
      <RotationModeToggle mode={mode} onChangeMode={setMode} />

      {/* 3. Peringatan Pelanggaran Golden Rule */}
      {violationError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 text-xs">
          <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Pelanggaran Aturan Keselamatan!</strong>
            <p className="text-[11px] mt-0.5 leading-relaxed">{violationError}</p>
          </div>
        </div>
      )}

      {/* 4. Form Sesuai Mode Terpilih */}
      {mode === "SWAP_POSITION" ? (
        <SwapPositionSection
          targetPosition={targetPosition}
          onChangeTargetPosition={(pos: WheelPosition) => setTargetPosition(pos)}
          targetPositionOptions={targetPositionOptions}
          targetTire={targetTire}
          sourcePosition={sourceSlot.position}
        />
      ) : (
        <WarehouseReplaceSection
          sourcePosition={sourceSlot.position}
          sourceTireSerialNumber={sourceTire.serialNumber}
          warehouseTireId={warehouseTireId}
          onChangeWarehouseTireId={setWarehouseTireId}
          warehouseTireOptions={warehouseTireOptions}
          sourceDestination={sourceDestination}
          onChangeSourceDestination={setSourceDestination}
        />
      )}

      {/* 5. Input Keterangan Mutasi & Mekanik PIC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Alasan Rotasi / Mutasi"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={ROTATION_REASON_OPTIONS}
          required
        />

        <FormInput
          label="Nama Mekanik PIC"
          value={mechanicPic}
          onChange={(e) => setMechanicPic(e.target.value)}
          required
        />
      </div>

      {/* 6. Footer Tombol Aksi */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onClose}>
          Batal
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={Boolean(violationError)}>
          Eksekusi Rotasi Ban
        </Button>
      </div>
    </form>
  );
}

/**
 * Modal Dialog Rotasi & Mutasi Ban Mekanik (Key-based reset)
 */
export default function TireRotationModal({
  isOpen,
  onClose,
  sourceSlot,
  allTruckTires,
  warehouseTires,
  chassisType,
  truckUnitCode,
  currentOdometer,
  onExecuteRotation,
}: TireRotationModalProps) {
  if (!isOpen || !sourceSlot || !sourceSlot.tire) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <ArrowRightLeft size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Rotasi & Mutasi Posisi Ban
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Unit <strong className="text-slate-800">{truckUnitCode}</strong> •
              Posisi Asal{" "}
              <strong className="text-blue-700">{sourceSlot.position}</strong> (
              {sourceSlot.axleType} axle)
            </p>
          </div>
        </div>
      }
      size="lg">
      <TireRotationFormContent
        key={`${sourceSlot.position}-${sourceSlot.tire.id}`}
        onClose={onClose}
        sourceSlot={sourceSlot as WheelSlotEvaluation & { tire: TireAsset }}
        allTruckTires={allTruckTires}
        warehouseTires={warehouseTires}
        chassisType={chassisType}
        truckUnitCode={truckUnitCode}
        currentOdometer={currentOdometer}
        onExecuteRotation={onExecuteRotation}
      />
    </Modal>
  );
}
