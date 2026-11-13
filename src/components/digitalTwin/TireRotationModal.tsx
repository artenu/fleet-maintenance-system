// src/components/digitalTwin/TireRotationModal.tsx
import {
  RotateCw,
  ArrowRightLeft,
  Warehouse,
  ShieldAlert,
} from "lucide-react";
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
import {
  useTireRotationForm,
  ROTATION_REASON_OPTIONS,
  SOURCE_DESTINATION_OPTIONS,
} from "@/hooks/useTireRotationForm";

// 🧱 Komponen Reusable Design System
import { Modal, Button, Badge } from "@/components/common";
import { FormInput, Select } from "@/components/forms";

/**
 * Konten Form Rotasi & Mutasi Roda (Key-based reset)
 */
function TireRotationFormContent({
  onClose,
  sourceSlot,
  allTruckTires,
  warehouseTires,
  chassisType,
  truckUnitCode: _truckUnitCode,
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

  // Opsi posisi roda target dengan deskripsi standar
  const targetPositionOptions = availableTargetPositions.map((pos) => ({
    value: pos,
    label: `Posisi ${pos} • ${getWheelPositionDescription(pos)}`,
  }));

  // Opsi ban gudang yang tersedia
  const warehouseTireOptions = warehouseTires.map((wh) => ({
    value: wh.id,
    label: `${wh.serialNumber} • ${wh.brand} (${wh.retreadStatus}) - Fisik ${wh.lastInspectionPercent}%`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {/* Info Ban Asal */}
      <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 text-xs space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          BAN SUMBER (POSISI SAAT INI)
        </span>
        <div className="flex items-center justify-between">
          <div>
            <strong className="text-sm font-black text-slate-900">
              {sourceTire.serialNumber}
            </strong>
            <p className="text-slate-600">
              {sourceTire.brand} ({sourceTire.size}) • Fisik:{" "}
              <strong>{sourceTire.lastInspectionPercent}%</strong>
            </p>
          </div>
          <Badge
            variant={sourceTire.retreadStatus === "R0" ? "info" : "warning"}>
            {sourceTire.retreadStatus === "R0"
              ? "R0 (Baru)"
              : `${sourceTire.retreadStatus} (Vulkanisir)`}
          </Badge>
        </div>
      </div>

      {/* Pilihan Mode Rotasi */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Button
          type="button"
          variant={mode === "SWAP_POSITION" ? "primary" : "outline"}
          icon={RotateCw}
          onClick={() => setMode("SWAP_POSITION")}
          className="w-full">
          Tukar Antar Roda Truk
        </Button>
        <Button
          type="button"
          variant={mode === "REPLACE_FROM_WAREHOUSE" ? "primary" : "outline"}
          icon={Warehouse}
          onClick={() => setMode("REPLACE_FROM_WAREHOUSE")}
          className="w-full">
          Ganti dari Stok Gudang
        </Button>
      </div>

      {/* Peringatan Pelanggaran Golden Rule */}
      {violationError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900 text-xs">
          <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Pelanggaran Aturan Keselamatan!</strong>
            <p className="text-[11px] mt-0.5 leading-relaxed">{violationError}</p>
          </div>
        </div>
      )}

      {/* Form Sesuai Mode Terpilih */}
      {mode === "SWAP_POSITION" ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-3">
          <Select
            label="Pilih Posisi Target Roda di Truk Ini:"
            value={targetPosition}
            onChange={(e) => setTargetPosition(e.target.value as WheelPosition)}
            options={targetPositionOptions}
            required
          />

          {/* Preview Ban yang akan ditukar */}
          <div className="rounded-xl bg-white p-2.5 border border-slate-200 text-xs flex justify-between items-center shadow-2xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">
                BAN DI POSISI TARGET ({targetPosition})
              </span>
              {targetTire ? (
                <strong className="text-slate-800 font-bold">
                  {targetTire.serialNumber} • {targetTire.brand} (
                  {targetTire.retreadStatus})
                </strong>
              ) : (
                <span className="text-slate-400 italic">
                  (Slot kosong - tidak ada ban terpasang)
                </span>
              )}
            </div>
            <span className="text-[11px] text-blue-700 font-bold">
              Akan pindah ke {sourceSlot.position}
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-3">
          <Select
            label={`Pilih Ban dari Gudang (Untuk Dipasang ke ${sourceSlot.position}):`}
            value={warehouseTireId}
            onChange={(e) => setWarehouseTireId(e.target.value)}
            options={warehouseTireOptions}
            required
          />

          <div>
            <label className="block font-bold text-slate-800 text-xs mb-1.5">
              Tujuan Ban Lama ({sourceTire.serialNumber}):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SOURCE_DESTINATION_OPTIONS.map((item) => {
                const isSelected = sourceDestination === item.id;
                return (
                  <Button
                    key={item.id}
                    type="button"
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSourceDestination(item.id)}
                    className="w-full">
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Input Keterangan Mutasi & Mekanik PIC */}
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

      {/* Footer Tombol Aksi */}
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
