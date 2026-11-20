// src/utils/tireOperations.ts
import type {
  TireAsset,
  WheelPosition,
  TruckFleetTireItem,
} from "@/types/TireManagement/tires";
import type { RotationResultPayload } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import { getAuditSequence } from "@/constants/digitalTwin";
import { evaluateWheelSlot } from "@/utils/tireManagement/tireCalculations";

/**
 * Mengupdate data inspeksi ban dan odometer pada armada aktif
 */
export function updateTruckTireInspection(
  truckList: TruckFleetTireItem[],
  activeTruckId: string,
  updatedTire: TireAsset,
  newOdometer: number,
): TruckFleetTireItem[] {
  return truckList.map((truck) => {
    if (truck.id !== activeTruckId) {
      return truck;
    }
    const updatedTires = truck.tires.map((t) => {
      if (t.id === updatedTire.id) {
        return updatedTire;
      }
      return t;
    });
    return {
      ...truck,
      currentOdometer: Math.max(truck.currentOdometer, newOdometer),
      tires: updatedTires,
    };
  });
}

/**
 * Mendapatkan slot roda berikutnya dalam urutan inspeksi berantai
 */
export function getNextAuditWheelSlot(
  currentPosition: WheelPosition,
  chassisType: string | undefined,
  truckTires: TireAsset[],
  currentOdometer: number,
) {
  const auditSequence = getAuditSequence(chassisType);
  const currentIndex = auditSequence.indexOf(currentPosition);
  const nextIndex = (currentIndex + 1) % auditSequence.length;
  const nextPosition = auditSequence[nextIndex];
  const nextTire =
    truckTires.find((t) => {
      return t.currentPosition === nextPosition;
    }) || null;

  return evaluateWheelSlot(nextPosition, nextTire, currentOdometer);
}

/**
 * Menjalankan rotasi ban (Swap posisi atau Ganti dari Gudang)
 */
export function executeTireRotation(
  truckList: TruckFleetTireItem[],
  warehouseTires: TireAsset[],
  activeTruckId: string,
  payload: RotationResultPayload,
): {
  updatedTruckList: TruckFleetTireItem[];
  updatedWarehouseTires: TireAsset[];
} {
  if (payload.mode === "SWAP_POSITION" && payload.targetPosition) {
    const targetPos = payload.targetPosition;
    const updatedTruckList = truckList.map((truck) => {
      if (truck.id !== activeTruckId) {
        return truck;
      }
      const updatedTires = truck.tires.map((t) => {
        if (t.id === payload.sourceTire.id) {
          return { ...t, currentPosition: targetPos };
        }
        if (payload.targetTire && t.id === payload.targetTire.id) {
          return { ...t, currentPosition: payload.sourcePosition };
        }
        return t;
      });
      return { ...truck, tires: updatedTires };
    });
    return { updatedTruckList, updatedWarehouseTires: warehouseTires };
  }

  if (
    payload.mode === "REPLACE_FROM_WAREHOUSE" &&
    payload.warehouseTireToInstall
  ) {
    const warehouseTire = payload.warehouseTireToInstall;
    const newTireForTruck: TireAsset = {
      ...warehouseTire,
      currentVehicleId: activeTruckId,
      currentPosition: payload.sourcePosition,
      installOdometer: payload.odometer,
      lastInspectionDate: new Date().toISOString().split("T")[0],
    };
    const tireMovedToWarehouse: TireAsset = {
      ...payload.sourceTire,
      currentVehicleId: null,
      currentPosition: payload.sourceTireDestination || "GUDANG",
    };

    const updatedTruckList = truckList.map((truck) => {
      if (truck.id !== activeTruckId) {
        return truck;
      }
      const filteredTires = truck.tires.filter((t) => {
        return t.id !== payload.sourceTire.id;
      });
      return { ...truck, tires: [...filteredTires, newTireForTruck] };
    });

    const updatedWarehouseTires = [
      ...warehouseTires.filter((w) => {
        return w.id !== warehouseTire.id;
      }),
      tireMovedToWarehouse,
    ];

    return { updatedTruckList, updatedWarehouseTires };
  }

  return { updatedTruckList: truckList, updatedWarehouseTires: warehouseTires };
}

/**
 * Memasang ban baru atau ban dari gudang ke slot kosong
 */
export function installTireToSlot(
  truckList: TruckFleetTireItem[],
  warehouseTires: TireAsset[],
  activeTruckId: string,
  position: WheelPosition,
  newTire: TireAsset,
): {
  updatedTruckList: TruckFleetTireItem[];
  updatedWarehouseTires: TireAsset[];
} {
  const updatedTruckList = truckList.map((truck) => {
    if (truck.id !== activeTruckId) {
      return truck;
    }
    const filteredTires = truck.tires.filter((t) => {
      return t.currentPosition !== position;
    });
    return { ...truck, tires: [...filteredTires, newTire] };
  });

  const updatedWarehouseTires = warehouseTires.filter((w) => {
    return w.id !== newTire.id;
  });

  return { updatedTruckList, updatedWarehouseTires };
}

/**
 * Menukar ban operasional dengan ban serep (S1) secara darurat
 */
export function swapTireWithSpare(
  truckList: TruckFleetTireItem[],
  activeTruckId: string,
  position: WheelPosition,
): TruckFleetTireItem[] {
  return truckList.map((truck) => {
    if (truck.id !== activeTruckId) {
      return truck;
    }
    const updatedTires = truck.tires.map((t) => {
      if (t.currentPosition === position) {
        return { ...t, currentPosition: "S1" as WheelPosition };
      }
      if (t.currentPosition === "S1") {
        return { ...t, currentPosition: position };
      }
      return t;
    });
    return { ...truck, tires: updatedTires };
  });
}

/**
 * Memberikan toleransi mekanik (+5.000 KM override)
 */
export function applyMechanicOverride(
  truckList: TruckFleetTireItem[],
  activeTruckId: string,
  position: WheelPosition,
  mechanicName: string,
  reason: string,
): {
  updatedTruckList: TruckFleetTireItem[];
  updatedTire: TireAsset | null;
} {
  let updatedTireRef: TireAsset | null = null;

  const updatedTruckList = truckList.map((truck) => {
    if (truck.id !== activeTruckId) {
      return truck;
    }
    const updatedTires = truck.tires.map((t) => {
      if (t.currentPosition === position) {
        const overridden: TireAsset = {
          ...t,
          isMechanicOverridden: true,
          overrideReason: reason,
          overrideApprovedBy: mechanicName,
        };
        updatedTireRef = overridden;
        return overridden;
      }
      return t;
    });
    return { ...truck, tires: updatedTires };
  });

  return { updatedTruckList, updatedTire: updatedTireRef };
}

/**
 * Memindahkan ban dari satu slot roda ke slot roda lain (truk yang sama)
 */
export function moveTireBetweenSlots(
  truckList: TruckFleetTireItem[],
  activeTruckId: string,
  fromPosition: WheelPosition,
  toPosition: WheelPosition,
): TruckFleetTireItem[] {
  return truckList.map((truck) => {
    if (truck.id !== activeTruckId) {
      return truck;
    }
    const updatedTires = truck.tires.map((t) => {
      if (t.currentPosition === fromPosition) {
        return { ...t, currentPosition: toPosition };
      }
      return t;
    });
    return { ...truck, tires: updatedTires };
  });
}

/**
 * Memindahkan/mengambil ban dari unit truk lain di armada ke slot kosong truk aktif
 */
export function transferTireFromOtherTruck(
  truckList: TruckFleetTireItem[],
  sourceTruckId: string,
  sourceTireId: string,
  targetTruckId: string,
  targetPosition: WheelPosition,
  targetOdometer: number,
): TruckFleetTireItem[] {
  let movedTire: TireAsset | null = null;

  // 1. Ambil ban dari truk sumber
  const intermediateList = truckList.map((truck) => {
    if (truck.id !== sourceTruckId) {
      return truck;
    }
    const targetTire = truck.tires.find((t) => {
      return t.id === sourceTireId;
    });
    if (targetTire) {
      movedTire = {
        ...targetTire,
        currentVehicleId: targetTruckId,
        currentPosition: targetPosition,
        installOdometer: targetOdometer,
        lastInspectionDate: new Date().toISOString().split("T")[0],
      };
    }
    return {
      ...truck,
      tires: truck.tires.filter((t) => {
        return t.id !== sourceTireId;
      }),
    };
  });

  if (!movedTire) {
    return truckList;
  }

  const validMovedTire: TireAsset = movedTire;

  // 2. Pasang ban ke truk tujuan
  return intermediateList.map((truck) => {
    if (truck.id !== targetTruckId) {
      return truck;
    }
    const filteredTires = truck.tires.filter((t) => {
      return t.currentPosition !== targetPosition;
    });
    return {
      ...truck,
      tires: [...filteredTires, validMovedTire],
    };
  });
}
