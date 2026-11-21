// src/utils/chassisOperations.ts
import type {
  ChassisTrailerAsset,
  TruckFleetTireItem,
} from "@/types/TireManagement/tires";
import { EXPECTED_TIRE_COUNTS } from "@/constants/digitalTwin";

/**
 * Menghitung jumlah ban yang diharapkan terpasang berdasarkan status sasis
 */
export function getExpectedTireCount(
  isBobtail: boolean,
  configType?: string,
): number {
  if (isBobtail) {
    return EXPECTED_TIRE_COUNTS.BOBTAIL;
  }
  return configType === "2_AXLE"
    ? EXPECTED_TIRE_COUNTS.TWO_AXLE
    : EXPECTED_TIRE_COUNTS.THREE_AXLE;
}

/**
 * Menghitung jumlah armada yang bannya belum lengkap atau unit baru (0 ban)
 */
export function countIncompleteTiresTrucks(
  truckList: TruckFleetTireItem[],
  chassisList: ChassisTrailerAsset[],
): number {
  return truckList.filter((truck) => {
    const attachedChassis = chassisList.find((c) => {
      return c.attachedHeadId === truck.id;
    });
    const isBobtail = !attachedChassis;
    const configType = attachedChassis?.type || truck.chassisType;
    const expectedCount = getExpectedTireCount(isBobtail, configType);
    const installedCount = truck.tires.filter((t) => {
      return t.currentPosition !== "S1";
    }).length;
    const hasNoTires = truck.tires.length === 0;
    return hasNoTires || installedCount < expectedCount;
  }).length;
}

/**
 * Mengaitkan sasis ke kepala truk (Drop & Hook Coupling)
 */
export function coupleChassisToHead(
  truckList: TruckFleetTireItem[],
  chassisList: ChassisTrailerAsset[],
  truckId: string,
  newChassis: ChassisTrailerAsset,
): {
  updatedTruckList: TruckFleetTireItem[];
  updatedChassisList: ChassisTrailerAsset[];
} {
  const updatedChassisList = chassisList.map((c) => {
    if (c.id === newChassis.id) {
      return {
        ...newChassis,
        status: "ATTACHED" as const,
        attachedHeadId: truckId,
      };
    }
    if (c.attachedHeadId === truckId) {
      return {
        ...c,
        status: "STANDALONE_POOL" as const,
        attachedHeadId: null,
      };
    }
    return c;
  });

  const updatedTruckList = truckList.map((t) => {
    if (t.id === truckId) {
      return {
        ...t,
        capacity: newChassis.lengthCategory,
        chassisType: newChassis.type,
      };
    }
    return t;
  });

  return { updatedTruckList, updatedChassisList };
}

/**
 * Melepas sasis dari kepala truk (Uncoupling to Pool)
 */
export function uncoupleChassisFromHead(
  chassisList: ChassisTrailerAsset[],
  truckId: string,
): ChassisTrailerAsset[] {
  return chassisList.map((c) => {
    if (c.attachedHeadId === truckId) {
      return {
        ...c,
        status: "STANDALONE_POOL" as const,
        attachedHeadId: null,
      };
    }
    return c;
  });
}
