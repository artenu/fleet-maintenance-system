// src/hooks/truckCoupling/useChassisOperations.ts
import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import { mockChassisPoolList } from "@/data/mockChassisPool";
import type { ChassisTrailerAsset } from "@/types/TireManagement/tires";
import type { TruckFleetTireItem } from "@/types/TireManagement/tires";
import {
  countIncompleteTiresTrucks,
  coupleChassisToHead,
  uncoupleChassisFromHead,
} from "@/utils/truckCoupling/chassisOperations";

interface UseChassisOperationsProps {
  truckList: TruckFleetTireItem[];
  setTruckList: Dispatch<SetStateAction<TruckFleetTireItem[]>>;
  addToast: (
    type: "success" | "warning" | "info",
    title: string,
    description?: string,
  ) => void;
}

export function useChassisOperations({
  truckList,
  setTruckList,
  addToast,
}: UseChassisOperationsProps) {
  const [chassisList, setChassisList] =
    useState<ChassisTrailerAsset[]>(mockChassisPoolList);

  const incompleteTiresTruckCount = useMemo(() => {
    return countIncompleteTiresTrucks(truckList, chassisList);
  }, [truckList, chassisList]);

  const handleCoupleChassis = (
    truckId: string,
    newChassis: ChassisTrailerAsset,
  ) => {
    const result = coupleChassisToHead(
      truckList,
      chassisList,
      truckId,
      newChassis,
    );
    setChassisList(result.updatedChassisList);
    setTruckList(result.updatedTruckList);
    addToast(
      "success",
      `Sasis ${newChassis.chassisCode} Berhasil Dikaitkan!`,
      `Truk sekarang berkonfigurasi ${newChassis.lengthCategory} (${newChassis.type === "2_AXLE" ? "14 Ban" : "18 Ban"}).`,
    );
  };

  const handleUncoupleChassis = (truckId: string) => {
    setChassisList((prev) => {
      return uncoupleChassisFromHead(prev, truckId);
    });
    addToast(
      "info",
      "Sasis Berhasil Dilepas ke Pool",
      "Kepala truk kini berstatus Bobtail (tanpa sasis).",
    );
  };

  return {
    chassisList,
    setChassisList,
    incompleteTiresTruckCount,
    handleCoupleChassis,
    handleUncoupleChassis,
  };
}
