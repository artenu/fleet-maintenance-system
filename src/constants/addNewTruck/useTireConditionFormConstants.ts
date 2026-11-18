// src/constants/addNewTruck/useTireConditionFormConstants.ts
import type { ChassisType, WheelPosition } from "@/types/truck/tires";
import type { TireInputData } from "@/types/AddNewTruckView/AddNewTruckViewTypes";

/**
 * Nilai fallback default kode sasis dan odometer saat integrasi IoT
 */
export const DEFAULT_FALLBACK_CHASSIS_CODE = "CHS-018";
export const DEFAULT_FALLBACK_ODOMETER = 76890;

/**
 * Daftar urutan posisi roda dasar untuk truk standar 2 sumbu (14 ban)
 */
export const BASE_WHEEL_POSITIONS_14: WheelPosition[] = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "S1",
];

/**
 * Posisi roda tambahan untuk sasis 3 sumbu (18 ban)
 */
export const EXTRA_WHEEL_POSITIONS_18: WheelPosition[] = [
  "C9",
  "C10",
  "C11",
  "C12",
];

/**
 * Menghasilkan daftar posisi roda berdasarkan tipe sasis
 */
export function getWheelPositionsByChassisType(
  chassisType: ChassisType,
): WheelPosition[] {
  return [
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
    "C7",
    "C8",
    ...(chassisType === "3_AXLE" ? EXTRA_WHEEL_POSITIONS_18 : []),
    "S1",
  ];
}

/**
 * Data awal pencatatan ban per slot roda (mock data H1)
 */
export const INITIAL_TIRES_DATA: Record<string, TireInputData> = {
  H1: {
    serialNumber: "BS-2024-9988",
    brand: "Bridgestone",
    pattern: "R168",
    retreadStatus: "R0",
    pressurePsi: 110,
    treadDepthMm: 8.5,
    physicalPercent: 65,
    damages: ["Normal"],
    photoUrl:
      "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80",
  },
};

/**
 * Data formulir ban default saat memilih slot roda baru
 */
export const DEFAULT_TIRE_INPUT_TEMPLATE: Omit<
  TireInputData,
  "retreadStatus"
> = {
  serialNumber: "",
  brand: "Bridgestone",
  pattern: "R168",
  pressurePsi: 110,
  treadDepthMm: 14.0,
  physicalPercent: 90,
  damages: ["Normal"],
  photoUrl: null,
};

/**
 * Mendapatkan form data default berdasarkan posisi roda (Steer wajib R0, non-steer R1)
 */
export function getDefaultTireInputForSlot(pos: WheelPosition): TireInputData {
  const isSteer = pos === "H1" || pos === "H2";
  return {
    ...DEFAULT_TIRE_INPUT_TEMPLATE,
    retreadStatus: isSteer ? "R0" : "R1",
  };
}

/**
 * Nilai fallback saat mengompilasi ban untuk registrasi armada baru
 */
export const DEFAULT_COMPILED_TIRE_FALLBACK = {
  brand: "Super Grip / MI RFD",
  pattern: "Standar",
  pressurePsi: 115,
  treadDepthMm: 12.0,
  physicalPercent: 80,
  damages: ["Normal"],
  size: "10.00-20 16PR",
};

/**
 * Opsi checklist kerusakan / cacat visual ban walkaround
 */
export const TIRE_DEFECT_OPTIONS = [
  "Normal",
  "Benjol / Bulge",
  "Sobek Samping",
  "Botak Sebelah",
  "Kawat Terbuka",
  "Tertusuk Paku",
];

/**
 * Menghasilkan opsi dropdown status vulkanisir dengan proteksi gandar steer
 */
export function getRetreadOptionsForSteer(isSteer: boolean) {
  return [
    { value: "R0", label: "R0 • Ban Baru Asli (Casing Baru)" },
    { value: "R1", label: "R1 • Vulkanisir ke-1 (Diizinkan Steer)" },
    {
      value: "R2",
      label: `R2 • Vulkanisir ke-2 ${isSteer ? "(Dilarang Gandar Steer)" : ""}`,
      disabled: isSteer,
    },
    {
      value: "R3",
      label: `R3 • Vulkanisir ke-3 ${isSteer ? "(Dilarang Gandar Steer)" : "(Batas Maksimal)"}`,
      disabled: isSteer,
    },
    { value: "AFKIR", label: "AFKIR • Rusak / Afkir (Wajib Scrap)" },
  ];
}
