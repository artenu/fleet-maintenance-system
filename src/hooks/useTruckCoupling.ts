// src/hooks/useTruckCoupling.ts
import { useState, useMemo } from "react";
import type { ChassisTrailerAsset, ChassisType } from "@/types/truck/tires";
import type {
  UseTruckCouplingProps,
  UseTruckCouplingReturn,
} from "@/types/TruckCouplingView/TruckCouplingViewTypes";

/**
 * Custom hook untuk mengelola state dan alur perangkaian armada (Drop & Hook)
 */
export function useTruckCoupling({
  chassisList,
  onCouple,
}: UseTruckCouplingProps): UseTruckCouplingReturn {
  // Modal Pasang Gandengan (Hook Modal)
  const [isHookModalOpen, setIsHookModalOpen] = useState<boolean>(false);
  const [selectedTruckId, setSelectedTruckId] = useState<string>("");
  const [selectedChassisId, setSelectedChassisId] = useState<string>("");
  const [overrideWheelConfig, setOverrideWheelConfig] =
    useState<ChassisType>("2_AXLE");

  // Filter Sasis berdasarkan status pool
  const availableChassis = useMemo(
    () => chassisList.filter((c) => c.status === "STANDALONE_POOL"),
    [chassisList],
  );

  const coupledChassis = useMemo(
    () => chassisList.filter((c) => c.status === "ATTACHED"),
    [chassisList],
  );

  const repairChassis = useMemo(
    () => chassisList.filter((c) => c.status === "UNDER_REPAIR"),
    [chassisList],
  );

  // Handler Buka Modal Hook
  const handleOpenHookModal = (truckId: string) => {
    setSelectedTruckId(truckId);
    if (availableChassis.length > 0) {
      setSelectedChassisId(availableChassis[0].id);
      setOverrideWheelConfig(availableChassis[0].type);
    }
    setIsHookModalOpen(true);
  };

  // Eksekusi Pemasangan Sasis (Hook)
  const handleExecuteHook = () => {
    const targetChassis = chassisList.find((c) => c.id === selectedChassisId);
    if (!targetChassis || !selectedTruckId) {
      return;
    }

    // Terapkan konfigurasi sasis (termasuk edge case sasis 40ft 14 ban vs 18 ban)
    const configuredChassis: ChassisTrailerAsset = {
      ...targetChassis,
      type: overrideWheelConfig,
      wheelCount: overrideWheelConfig === "2_AXLE" ? 14 : 18,
      status: "ATTACHED",
      attachedHeadId: selectedTruckId,
    };

    onCouple(selectedTruckId, configuredChassis);
    setIsHookModalOpen(false);
  };

  return {
    isHookModalOpen,
    setIsHookModalOpen,
    selectedTruckId,
    setSelectedTruckId,
    selectedChassisId,
    setSelectedChassisId,
    overrideWheelConfig,
    setOverrideWheelConfig,
    availableChassis,
    coupledChassis,
    repairChassis,
    handleOpenHookModal,
    handleExecuteHook,
  };
}

