// src/hooks/tireManagement/useTireOperations.ts
import { useState, type Dispatch, type SetStateAction } from "react";
import type {
  TruckFleetTireItem,
  TireAsset,
  WheelPosition,
  WheelSlotEvaluation,
} from "@/types/TireManagement/tires";
import type { RotationResultPayload } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import {
  evaluateWheelSlot,
  updateTruckTireInspection,
  getNextAuditWheelSlot,
  executeTireRotation,
  installTireToSlot,
  swapTireWithSpare,
  applyMechanicOverride,
  moveTireBetweenSlots,
  transferTireFromOtherTruck,
} from "@/utils/tireManagement";
import {
  completeMonthlyAudit,
  isMonthlyAuditDone,
} from "@/utils/auditSchedule";

interface UseTireOperationsProps {
  truckList: TruckFleetTireItem[];
  setTruckList: Dispatch<SetStateAction<TruckFleetTireItem[]>>;
  activeTruck: TruckFleetTireItem;
  warehouseTires: TireAsset[];
  setWarehouseTires: Dispatch<SetStateAction<TireAsset[]>>;
  addToast: (
    type: "success" | "warning" | "info",
    title: string,
    description?: string,
  ) => void;
  onLogActivity?: (
    desc: string,
    type: "ROTASI_GANDAR" | "GANTI_BARU" | "VULKANISIR" | "AFKIR",
  ) => void;
}

export function useTireOperations({
  truckList,
  setTruckList,
  activeTruck,
  warehouseTires,
  setWarehouseTires,
  addToast,
  onLogActivity,
}: UseTireOperationsProps) {
  const [selectedSlot, setSelectedSlot] = useState<WheelSlotEvaluation | null>(
    null,
  );

  const handleSaveInspection = (
    updatedTire: TireAsset,
    newOdometer: number,
  ) => {
    // 1. Terapkan hasil inspeksi ban ke truk aktif
    const [inspectedTruck] = updateTruckTireInspection(
      [activeTruck],
      activeTruck.id,
      updatedTire,
      newOdometer,
    );

    // 2. Jika semua ban sudah diinspeksi ➔ audit bulanan otomatis selesai
    const isAuditCompleted = isMonthlyAuditDone(inspectedTruck);
    const finalTruck: TruckFleetTireItem = isAuditCompleted
      ? {
          ...inspectedTruck,
          auditSchedule: completeMonthlyAudit(inspectedTruck.auditSchedule),
        }
      : inspectedTruck;

    setTruckList((prev) => {
      return prev.map((t) => {
        if (t.id === finalTruck.id) {
          return finalTruck;
        }
        return t;
      });
    });
    setSelectedSlot(
      evaluateWheelSlot(updatedTire.currentPosition, updatedTire, newOdometer),
    );

    if (isAuditCompleted) {
      addToast(
        "success",
        `Audit Bulanan ${activeTruck.unitCode} Selesai!`,
        `Seluruh ban sudah diinspeksi. Jadwal audit berikutnya: ${finalTruck.auditSchedule.nextAuditSchedule}`,
      );
    }
  };

  const handleExecuteRotation = (payload: RotationResultPayload) => {
    const result = executeTireRotation(
      truckList,
      warehouseTires,
      activeTruck.id,
      payload,
    );
    setTruckList(result.updatedTruckList);
    setWarehouseTires(result.updatedWarehouseTires);
    setSelectedSlot(null);

    if (onLogActivity) {
      const targetText = payload.targetPosition
        ? ` ➔ ${payload.targetPosition}`
        : "";
      onLogActivity(
        `Rotasi Gandar pada unit ${activeTruck.unitCode}: ${payload.reason || "Rotasi tapak ban rutin"} (${payload.sourcePosition}${targetText}).`,
        "ROTASI_GANDAR",
      );
    }
  };

  const handleInstallTire = (position: WheelPosition, newTire: TireAsset) => {
    const result = installTireToSlot(
      truckList,
      warehouseTires,
      activeTruck.id,
      position,
      newTire,
    );
    setTruckList(result.updatedTruckList);
    setWarehouseTires(result.updatedWarehouseTires);

    setSelectedSlot(
      evaluateWheelSlot(position, newTire, activeTruck.currentOdometer),
    );

    addToast(
      "success",
      `Ban ${newTire.serialNumber} Berhasil Dipasang di Slot ${position}!`,
      `Status: ${newTire.retreadStatus}, Merk: ${newTire.brand}, Odo Pasang: ${activeTruck.currentOdometer.toLocaleString("id-ID")} KM`,
    );

    if (onLogActivity) {
      const isNew = newTire.retreadStatus === "R0";
      onLogActivity(
        `Pemasangan ban ${newTire.serialNumber} (${newTire.brand} ${newTire.retreadStatus}) ke slot ${position} unit ${activeTruck.unitCode} dari stok gudang pool.`,
        isNew ? "GANTI_BARU" : "ROTASI_GANDAR",
      );
    }
  };

  const handleSaveAndNext = (updatedTire: TireAsset, newOdometer: number) => {
    handleSaveInspection(updatedTire, newOdometer);
    addToast(
      "success",
      `Audit Posisi ${updatedTire.currentPosition} Tersimpan`,
      `Kondisi fisik: ${updatedTire.lastInspectionPercent}%, Odo: ${newOdometer.toLocaleString("id-ID")} KM`,
    );

    const nextSlot = getNextAuditWheelSlot(
      updatedTire.currentPosition,
      activeTruck.chassisType,
      activeTruck.tires,
      Math.max(activeTruck.currentOdometer, newOdometer),
    );
    setSelectedSlot(nextSlot);
  };

  const handleEmergencySwapSpare = (position: WheelPosition) => {
    setTruckList((prev) => {
      return swapTireWithSpare(prev, activeTruck.id, position);
    });
    setSelectedSlot(null);

    if (onLogActivity) {
      onLogActivity(
        `Tukar darurat ban serep: Roda di posisi ${position} ditukar dengan Ban Serep (Spare) pada unit ${activeTruck.unitCode}.`,
        "ROTASI_GANDAR",
      );
    }
  };

  const handleApplyMechanicOverride = (
    position: WheelPosition,
    mechanicName: string,
    reason: string,
  ) => {
    const result = applyMechanicOverride(
      truckList,
      activeTruck.id,
      position,
      mechanicName,
      reason,
    );
    setTruckList(result.updatedTruckList);

    if (result.updatedTire) {
      setSelectedSlot(
        evaluateWheelSlot(
          position,
          result.updatedTire,
          activeTruck.currentOdometer,
        ),
      );
    }
  };

  const handleMoveTireBetweenSlots = (
    fromPosition: WheelPosition,
    toPosition: WheelPosition,
  ) => {
    const updatedList = moveTireBetweenSlots(
      truckList,
      activeTruck.id,
      fromPosition,
      toPosition,
    );
    setTruckList(updatedList);

    const movedTire = activeTruck.tires.find((t) => {
      return t.currentPosition === fromPosition;
    });

    if (movedTire) {
      setSelectedSlot(
        evaluateWheelSlot(
          toPosition,
          { ...movedTire, currentPosition: toPosition },
          activeTruck.currentOdometer,
        ),
      );
    } else {
      setSelectedSlot(null);
    }

    addToast(
      "success",
      `Ban Berhasil Dipindahkan ke Slot ${toPosition}!`,
      `Dipindahkan dari posisi ${fromPosition} pada unit ${activeTruck.unitCode}.`,
    );

    if (onLogActivity) {
      onLogActivity(
        `Rotasi internal: Ban ${movedTire?.serialNumber || ""} dipindahkan dari slot ${fromPosition} ke slot ${toPosition} pada unit ${activeTruck.unitCode}.`,
        "ROTASI_GANDAR",
      );
    }
  };

  const handleTransferTireFromOtherTruck = (
    sourceTruckId: string,
    sourceTireId: string,
    targetPosition: WheelPosition,
  ) => {
    const sourceTruck = truckList.find((t) => {
      return t.id === sourceTruckId;
    });
    const sourceTire = sourceTruck?.tires.find((t) => {
      return t.id === sourceTireId;
    });

    const updatedList = transferTireFromOtherTruck(
      truckList,
      sourceTruckId,
      sourceTireId,
      activeTruck.id,
      targetPosition,
      activeTruck.currentOdometer,
    );
    setTruckList(updatedList);

    if (sourceTire) {
      setSelectedSlot(
        evaluateWheelSlot(
          targetPosition,
          {
            ...sourceTire,
            currentVehicleId: activeTruck.id,
            currentPosition: targetPosition,
            installOdometer: activeTruck.currentOdometer,
          },
          activeTruck.currentOdometer,
        ),
      );
    } else {
      setSelectedSlot(null);
    }

    addToast(
      "success",
      `Mutasi Ban Lintas Armada Berhasil!`,
      `Ban ${sourceTire?.serialNumber || ""} dipindahkan dari unit ${sourceTruck?.unitCode || sourceTruckId} ke slot ${targetPosition} unit ${activeTruck.unitCode}.`,
    );

    if (onLogActivity) {
      onLogActivity(
        `Mutasi kanibalisasi: Ban ${sourceTire?.serialNumber || ""} dipindahkan dari unit ${sourceTruck?.unitCode || sourceTruckId} ke slot ${targetPosition} unit ${activeTruck.unitCode}.`,
        "ROTASI_GANDAR",
      );
    }
  };

  return {
    selectedSlot,
    setSelectedSlot,
    handleSaveInspection,
    handleExecuteRotation,
    handleInstallTire,
    handleMoveTireBetweenSlots,
    handleTransferTireFromOtherTruck,
    handleSaveAndNext,
    handleEmergencySwapSpare,
    handleApplyMechanicOverride,
  };
}
