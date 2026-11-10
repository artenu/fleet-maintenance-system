import {
  type AxleType,
  type RetreadStatus,
  type BrandProfile,
  type WheelPosition,
} from "../../types/truck/tires";

/**
 * Aturan Gandar Berdasarkan Dokumen Operasional & SOP
 */
export const AXLE_RULES: Record<
  AxleType,
  {
    name: string;
    intervalKm: number;
    maxRetreadAllowed: RetreadStatus;
    description: string;
  }
> = {
  steer: {
    name: "Gandar Depan / Kemudi (Steer)",
    intervalKm: 60000,
    maxRetreadAllowed: "R1", // Toleransi operasional PT ALN: Diizinkan R0 & R1. Dilarang R2/R3.
    description:
      "Toleransi operasional: Diperbolehkan ban baru (R0) atau maksimal 1x vulkanisir (R1). Dilarang R2/R3/AFKIR.",
  },
  drive: {
    name: "Gandar Penggerak (Drive)",
    intervalKm: 25000,
    maxRetreadAllowed: "R3", // Maksimal 3x vulkanisir (MOM 5-11-2026)
    description:
      "Gandar kepala penarik beban kontainer. Maksimal 3x vulkanisir (R3).",
  },
  trailer: {
    name: "Gandar Gandengan (Trailer)",
    intervalKm: 25000,
    maxRetreadAllowed: "R3", // Maksimal 3x vulkanisir (MOM 5-11-2026)
    description:
      "Sumbu roda sasis trailer 20ft / 40ft. Maksimal 3x vulkanisir (R3).",
  },
};

/**
 * Ambang Batas Evaluasi Kesehatan Ban
 */
export const TIRE_THRESHOLDS = {
  CRITICAL_PHYSICAL_PERCENT: 40, // GOLDEN RULE #5: Kondisi < 40% seketika Merah
  WARNING_PHYSICAL_PERCENT: 70,
  WARNING_KM_PERCENT: 80,
  CRITICAL_KM_PERCENT: 100,
  MECHANIC_OVERRIDE_KM: 5000, // GOLDEN RULE #4 (Edge Case 4): Toleransi mekanik +5.000 KM
};

/**
 * Kamus Profil Merk Ban (Brand Tiering Sesuai Database Excel Resmi)
 */
export const BRAND_PROFILES: Record<string, BrandProfile> = {
  "Super Grip / MI RFD": {
    name: "Super Grip / MI RFD",
    tier: "TIER_1",
    toleranceMultiplier: 1.15, // Bisa capai 69.000 KM di jalan tol
    standardPrice: 3650000, // Harga acuan Excel (sebelum PPN 11%)
  },
  "PT Boxer (Karet Medan)": {
    name: "PT Boxer (Karet Medan)",
    tier: "TIER_2",
    toleranceMultiplier: 1.0,
    standardPrice: 1700000, // Beli ban casing jadi PT Boxer (+ ongkir 100k)
  },
  "Jasa Retread PT Boxer": {
    name: "Jasa Retread PT Boxer",
    tier: "TIER_2",
    toleranceMultiplier: 1.0,
    standardPrice: 950000, // Jasa vulkanisir ulang casing sendiri
  },
  Bridgestone: {
    name: "Bridgestone",
    tier: "TIER_1",
    toleranceMultiplier: 1.15,
    standardPrice: 3650000,
  },
  Michelin: {
    name: "Michelin",
    tier: "TIER_1",
    toleranceMultiplier: 1.2,
    standardPrice: 3850000,
  },
  Giti: {
    name: "Giti",
    tier: "TIER_2",
    toleranceMultiplier: 1.0,
    standardPrice: 2800000,
  },
  "Gajah Tunggal": {
    name: "Gajah Tunggal",
    tier: "TIER_2",
    toleranceMultiplier: 1.0,
    standardPrice: 2750000,
  },
  "Budget / Import": {
    name: "Budget / Import",
    tier: "TIER_3",
    toleranceMultiplier: 0.8,
    standardPrice: 2100000,
  },
};

/**
 * Mendapatkan profil merk ban (dengan pencocokan nama fleksibel)
 */
export function getBrandProfile(brandName: string): BrandProfile {
  if (brandName.includes("Super Grip") || brandName.includes("Bridgestone")) {
    return BRAND_PROFILES["Super Grip / MI RFD"];
  }
  if (brandName.includes("Boxer") || brandName.includes("Karet Medan")) {
    return BRAND_PROFILES["PT Boxer (Karet Medan)"];
  }
  return (
    BRAND_PROFILES[brandName] || {
      name: brandName,
      tier: "TIER_2",
      toleranceMultiplier: 1.0,
      standardPrice: 1700000,
    }
  );
}

/**
 * Pemetaan Posisi Roda ke Tipe Gandar
 */
export function getAxleTypeByPosition(position: WheelPosition): AxleType {
  if (position === "H1" || position === "H2") {return "steer";}
  if (["H3", "H4", "H5", "H6"].includes(position)) {return "drive";}
  return "trailer";
}

/**
 * Denah Tata Letak Visual (Layout Grid Roda):
 * Mengikuti sketsa lembar kerja surveyor PT ALN
 */
export const WHEEL_LAYOUT_CONFIG = {
  head: {
    steerAxle: {
      left: "H2" as WheelPosition,
      right: "H1" as WheelPosition,
    },
    driveAxle: {
      outerLeft: "H5" as WheelPosition,
      innerLeft: "H6" as WheelPosition,
      innerRight: "H4" as WheelPosition,
      outerRight: "H3" as WheelPosition,
    },
    spare: "S1" as WheelPosition,
  },
  chassis: {
    axle1: {
      outerLeft: "C3" as WheelPosition,
      innerLeft: "C4" as WheelPosition,
      innerRight: "C2" as WheelPosition,
      outerRight: "C1" as WheelPosition,
    },
    axle2: {
      outerLeft: "C7" as WheelPosition,
      innerLeft: "C8" as WheelPosition,
      innerRight: "C6" as WheelPosition,
      outerRight: "C5" as WheelPosition,
    },
    // Hanya aktif pada sasis 3 sumbu (18 ban)
    axle3: {
      outerLeft: "C11" as WheelPosition,
      innerLeft: "C12" as WheelPosition,
      innerRight: "C10" as WheelPosition,
      outerRight: "C9" as WheelPosition,
    },
  },
};
