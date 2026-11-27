// src/hooks/useTireRotationForm.ts
import { useState, useMemo, type FormEvent } from "react";
import type { WheelPosition } from "@/types/TireManagement/tires";
import type {
  RotationMode,
  SourceTireDestination,
  UseTireRotationFormProps,
} from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import {
  ROTATION_REASON_OPTIONS,
  SOURCE_DESTINATION_OPTIONS,
  BASE_WHEEL_POSITIONS,
  EXTRA_3AXLE_WHEEL_POSITIONS,
  DEFAULT_ROTATION_MECHANIC_PIC,
} from "@/constants/digitalTwin";

import { TIRE_THRESHOLDS } from "@/constants/truck/tireRules";
import { getTotalPunctureCount } from "@/utils/tireManagement/tireCalculations";

// Re-export untuk backward-compatibility
export {
  ROTATION_REASON_OPTIONS,
  SOURCE_DESTINATION_OPTIONS,
  BASE_WHEEL_POSITIONS,
};

export function useTireRotationForm({
  sourceSlot,
  allTruckTires,
  warehouseTires,
  chassisType,
  currentOdometer,
  onExecuteRotation,
  onClose,
}: UseTireRotationFormProps) {
  const sourceTire = sourceSlot.tire;

  // 1. Kumpulkan daftar semua posisi roda di truk ini (kecuali posisi asal)
  const availableTargetPositions: WheelPosition[] = useMemo(() => {
    const allPositions: WheelPosition[] =
      chassisType === "3_AXLE"
        ? [...BASE_WHEEL_POSITIONS, ...EXTRA_3AXLE_WHEEL_POSITIONS]
        : BASE_WHEEL_POSITIONS;

    return allPositions.filter((p) => p !== sourceSlot.position);
  }, [chassisType, sourceSlot.position]);

  // State Form
  const [mode, setMode] = useState<RotationMode>("SWAP_POSITION");
  const [targetPosition, setTargetPosition] = useState<WheelPosition>(
    availableTargetPositions[0] || "C1",
  );
  const [warehouseTireId, setWarehouseTireId] = useState<string>(
    warehouseTires[0]?.id || "",
  );
  const [sourceDestination, setSourceDestination] =
    useState<SourceTireDestination>("GUDANG");
  const [reason, setReason] = useState<string>(
    ROTATION_REASON_OPTIONS[0].value,
  );
  const [mechanicPic, setMechanicPic] = useState<string>(
    DEFAULT_ROTATION_MECHANIC_PIC,
  );

  // Cari ban yang saat ini terpasang di posisi target (jika ada)
  const targetTire = useMemo(() => {
    return (
      allTruckTires.find((t) => t.currentPosition === targetPosition) || null
    );
  }, [allTruckTires, targetPosition]);

  // Cari ban gudang yang dipilih
  const selectedWarehouseTire = useMemo(() => {
    return (
      warehouseTires.find((w) => w.id === warehouseTireId) || warehouseTires[0]
    );
  }, [warehouseTires, warehouseTireId]);

  // ================= VALIDASI GOLDEN RULES =================
  const violationError = useMemo(() => {
    if (mode === "SWAP_POSITION") {
      const isTargetSteer = targetPosition === "H1" || targetPosition === "H2";
      if (
        isTargetSteer &&
        sourceTire.retreadStatus !== "R0" &&
        sourceTire.retreadStatus !== "R1"
      ) {
        return `PELANGGARAN: Posisi target ${targetPosition} adalah Gandar Kemudi (Steer). Hanya diizinkan Ban Baru (R0) atau 1x Vulkanisir (R1). Ban ${sourceTire.serialNumber} saat ini berstatus ${sourceTire.retreadStatus}!`;
      }
      const isSourceSteer =
        sourceSlot.position === "H1" || sourceSlot.position === "H2";
      if (
        isSourceSteer &&
        targetTire &&
        targetTire.retreadStatus !== "R0" &&
        targetTire.retreadStatus !== "R1"
      ) {
        return `PELANGGARAN: Posisi ${sourceSlot.position} adalah Gandar Kemudi (Steer). Ban ${targetTire.serialNumber} berstatus ${targetTire.retreadStatus} dilarang dipasang ke Steer (Hanya diizinkan R0 atau R1)!`;
      }
    } else {
      const isSourceSteer =
        sourceSlot.position === "H1" || sourceSlot.position === "H2";
      if (
        isSourceSteer &&
        selectedWarehouseTire &&
        selectedWarehouseTire.retreadStatus !== "R0" &&
        selectedWarehouseTire.retreadStatus !== "R1"
      ) {
        return `PELANGGARAN: Gandar Kemudi ${sourceSlot.position} hanya diizinkan Ban Baru (R0) atau 1x Vulkanisir (R1). Ban gudang ${selectedWarehouseTire.serialNumber} berstatus ${selectedWarehouseTire.retreadStatus}!`;
      }
      if (
        sourceDestination === "VULKANISIR" &&
        sourceTire.retreadStatus === "R3"
      ) {
        return `PELANGGARAN: Ban ${sourceTire.serialNumber} sudah berstatus R3 (Batas Maksimal Vulkanisir 3x). Ban tidak boleh divulkanisir lagi, wajib diafkirkan!`;
      }
      const totalPunctures = getTotalPunctureCount(sourceTire);
      if (
        sourceDestination === "VULKANISIR" &&
        totalPunctures >= TIRE_THRESHOLDS.MAX_PUNCTURE_BEFORE_AFKIR
      ) {
        return `PELANGGARAN: Ban ${sourceTire.serialNumber} sudah mengalami ${totalPunctures}x bocor/tambal (Batas maks. 3x). Ban tidak bisa di-retread dan wajib di-AFKIRKAN!`;
      }
    }
    return null;
  }, [
    mode,
    targetPosition,
    sourceTire,
    sourceSlot.position,
    targetTire,
    selectedWarehouseTire,
    sourceDestination,
  ]);

  // Peringatan khusus (non-blokir) jika ban 1x vulkanisir (R1) dipasang di gandar Steer depan (H1/H2)
  const steerWarning = useMemo(() => {
    if (violationError) {
      return null;
    }
    if (mode === "SWAP_POSITION") {
      const isTargetSteer = targetPosition === "H1" || targetPosition === "H2";
      if (isTargetSteer && sourceTire.retreadStatus === "R1") {
        return `PERINGATAN STEER (R1): Ban ${sourceTire.serialNumber} sudah vulkanisir 1x (R1) dan akan dipindahkan ke gandar kemudi depan (${targetPosition}). Pastikan karkas sangat prima atau prioritaskan Ban Baru (R0).`;
      }
      const isSourceSteer =
        sourceSlot.position === "H1" || sourceSlot.position === "H2";
      if (isSourceSteer && targetTire && targetTire.retreadStatus === "R1") {
        return `PERINGATAN STEER (R1): Ban ${targetTire.serialNumber} sudah vulkanisir 1x (R1) dan akan dipindahkan ke gandar kemudi depan (${sourceSlot.position}). Pastikan kondisi karkas aman atau prioritaskan Ban Baru (R0).`;
      }
    } else {
      const isSourceSteer =
        sourceSlot.position === "H1" || sourceSlot.position === "H2";
      if (
        isSourceSteer &&
        selectedWarehouseTire &&
        selectedWarehouseTire.retreadStatus === "R1"
      ) {
        return `PERINGATAN STEER (R1): Ban gudang ${selectedWarehouseTire.serialNumber} berstatus 1x vulkanisir (R1) dan akan dipasang di gandar kemudi depan (${sourceSlot.position}). Disarankan memakai Ban Baru (R0) untuk posisi Steer.`;
      }
    }
    return null;
  }, [
    violationError,
    mode,
    targetPosition,
    sourceTire,
    sourceSlot.position,
    targetTire,
    selectedWarehouseTire,
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (violationError) {
      return;
    }

    onExecuteRotation({
      mode,
      sourcePosition: sourceSlot.position,
      sourceTire,
      targetPosition: mode === "SWAP_POSITION" ? targetPosition : undefined,
      targetTire: mode === "SWAP_POSITION" ? targetTire : undefined,
      warehouseTireToInstall:
        mode === "REPLACE_FROM_WAREHOUSE" ? selectedWarehouseTire : undefined,
      sourceTireDestination:
        mode === "REPLACE_FROM_WAREHOUSE" ? sourceDestination : undefined,
      reason,
      mechanicPic,
      odometer: currentOdometer,
    });

    onClose();
  };

  return {
    sourceTire,
    mode,
    setMode,
    targetPosition,
    setTargetPosition,
    availableTargetPositions,
    targetTire,
    warehouseTireId,
    setWarehouseTireId,
    selectedWarehouseTire,
    sourceDestination,
    setSourceDestination,
    reason,
    setReason,
    mechanicPic,
    setMechanicPic,
    violationError,
    steerWarning,
    handleSubmit,
  };
}
