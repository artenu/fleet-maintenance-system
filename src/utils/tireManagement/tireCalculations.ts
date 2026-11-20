// src/utils/tireManagement/tireCalculations.ts
import {
  AXLE_RULES,
  getAxleTypeByPosition,
  getBrandProfile,
  TIRE_THRESHOLDS,
} from "../../constants/truck/tireRules";
import {
  type AxleType,
  type TireAsset,
  type TireHealthStatus,
  type WheelPosition,
  type WheelSlotEvaluation,
} from "../../types/TireManagement/tires";

/**
 * 1. Evaluasi Slot Roda Kosong (Default Fallback)
 */
export function createEmptyWheelSlot(
  position: WheelPosition,
  axleType: AxleType,
  baseIntervalKm: number,
): WheelSlotEvaluation {
  return {
    position,
    axleType,
    tire: null,
    kmElapsed: 0,
    maxAllowedKm: baseIntervalKm,
    remainingKm: baseIntervalKm,
    wearPercentage: 0,
    healthStatus: "GOOD",
    ruleViolations: [],
  };
}

/**
 * 2. Validasi Aturan Keselamatan Gandar & Status Casing (Golden Rule #1 & Anti-Afkir)
 */
export function validateTireAxleRules(
  position: WheelPosition,
  axleType: AxleType,
  tire: TireAsset,
): string[] {
  const violations: string[] = [];

  // Gandar Steer (H1 & H2) hanya diizinkan Ban Baru (R0) atau Maksimal 1x Vulkanisir (R1)
  if (
    axleType === "steer" &&
    tire.retreadStatus !== "R0" &&
    tire.retreadStatus !== "R1"
  ) {
    violations.push(
      `PELANGGARAN KESELAMATAN: Posisi ${position} (Steer) hanya diizinkan Ban Baru (R0) atau 1x Vulkanisir (R1). Ban saat ini berstatus ${tire.retreadStatus}!`,
    );
  }

  // Ban berstatus AFKIR / SCRAP dilarang beroperasi di gandar manapun
  if (tire.retreadStatus === "AFKIR") {
    violations.push(
      `BAHAYA: Ban ${tire.serialNumber} berstatus AFKIR / SCRAP dan dilarang dipasang di armada!`,
    );
  }

  return violations;
}

/**
 * 3. Menghitung Batas Maksimal KM dengan Toleransi Merk & Override Mekanik
 */
export function calculateMaxAllowedKm(
  baseIntervalKm: number,
  brandName: string,
  isMechanicOverridden?: boolean,
): number {
  const brandProfile = getBrandProfile(brandName);
  let maxKm = Math.round(baseIntervalKm * brandProfile.toleranceMultiplier);

  // Jika mekanik memberikan toleransi darurat +5.000 KM
  if (isMechanicOverridden) {
    maxKm += TIRE_THRESHOLDS.MECHANIC_OVERRIDE_KM;
  }

  return maxKm;
}

/**
 * 4. Menghitung Jarak Tempuh, Sisa Jarak, dan Persentase Keausan Ban
 */
export function calculateTireWear(
  currentTruckOdo: number,
  installOdometer: number | undefined,
  maxAllowedKm: number,
): { kmElapsed: number; remainingKm: number; wearPercentage: number } {
  const kmElapsed = Math.max(0, currentTruckOdo - (installOdometer || 0));
  const remainingKm = Math.max(0, maxAllowedKm - kmElapsed);
  const wearPercentage = Math.min(
    100,
    Math.round((kmElapsed / maxAllowedKm) * 100),
  );

  return { kmElapsed, remainingKm, wearPercentage };
}

/**
 * 5. Decision Matrix Penentuan Status Kesehatan Ban (GOOD / WARNING / CRITICAL)
 */
export function determineTireHealthStatus(params: {
  physicalPercent: number;
  wearPercentage: number;
  kmElapsed: number;
  maxAllowedKm: number;
  axleType: AxleType;
  baseViolations: string[];
}): { healthStatus: TireHealthStatus; violations: string[] } {
  const violations = [...params.baseViolations];
  let healthStatus: TireHealthStatus = "GOOD";

  // GOLDEN RULE #5: Kondisi fisik surveyor < 40% seketika Kritis (Bahaya Pecah Ban)
  if (params.physicalPercent < TIRE_THRESHOLDS.CRITICAL_PHYSICAL_PERCENT) {
    healthStatus = "CRITICAL";
    violations.push(
      `KONDISI FISIK KRITIS: Ketebalan tapak fisik hanya ${params.physicalPercent}% (< 40% batas aman SOP). Sangat berisiko pecah ban (blowout) di jalan tol!`,
    );
  }
  // Batas Maksimal KM Gandar telah terlampaui (>= 100%)
  else if (params.kmElapsed >= params.maxAllowedKm) {
    healthStatus = "CRITICAL";
    violations.push(
      `BATAS KM TERLAMPAUI: Ban telah menempuh ${params.kmElapsed.toLocaleString("id-ID")} KM (melebihi batas aman ${params.maxAllowedKm.toLocaleString("id-ID")} KM pada gandar ${params.axleType}).`,
    );
  }
  // Pelanggaran aturan gandar (misal Steer dipasang ban R2 atau AFKIR)
  else if (violations.length > 0) {
    healthStatus = "CRITICAL";
  }
  // Peringatan Keausan KM (80-99%) atau Fisik Menipis (40-70%)
  else if (
    params.wearPercentage >= TIRE_THRESHOLDS.WARNING_KM_PERCENT ||
    params.physicalPercent <= TIRE_THRESHOLDS.WARNING_PHYSICAL_PERCENT
  ) {
    healthStatus = "WARNING";
  }

  return { healthStatus, violations };
}

/**
 * 6. Orkestrator Utama Evaluasi Slot Roda (Digital Twin Engine)
 */
export function evaluateWheelSlot(
  position: WheelPosition,
  tire: TireAsset | null,
  currentTruckOdo: number,
): WheelSlotEvaluation {
  const axleType = getAxleTypeByPosition(position);
  const axleRule = AXLE_RULES[axleType];

  // Jika slot roda kosong
  if (!tire) {
    return createEmptyWheelSlot(position, axleType, axleRule.intervalKm);
  }

  // 1. Validasi Aturan Gandar
  const baseViolations = validateTireAxleRules(position, axleType, tire);

  // 2. Hitung Batas Maksimal KM
  const maxAllowedKm = calculateMaxAllowedKm(
    axleRule.intervalKm,
    tire.brand,
    tire.isMechanicOverridden,
  );

  // 3. Hitung Jarak Tempuh & Sisa KM
  const { kmElapsed, remainingKm, wearPercentage } = calculateTireWear(
    currentTruckOdo,
    tire.installOdometer,
    maxAllowedKm,
  );

  // 4. Tentukan Status Kesehatan & Alasan Kritis
  const { healthStatus, violations } = determineTireHealthStatus({
    physicalPercent: tire.lastInspectionPercent,
    wearPercentage,
    kmElapsed,
    maxAllowedKm,
    axleType,
    baseViolations,
  });

  return {
    position,
    axleType,
    tire,
    kmElapsed,
    maxAllowedKm,
    remainingKm,
    wearPercentage,
    healthStatus,
    ruleViolations: violations,
  };
}

/**
 * 7. Menghitung Cost-Per-Kilometer (CPK) untuk Analitik Manajemen
 */
export function calculateCpk(
  purchasePrice: number,
  totalKmAchieved: number,
): number {
  if (!totalKmAchieved || totalKmAchieved <= 0) {
    return 0;
  }
  return Math.round((purchasePrice / totalKmAchieved) * 100) / 100;
}

/**
 * 8. Konversi Respon IoT Telematics Hino: Meter ke KM
 */
export function convertIotOdometerMeterToKm(meterValue: number): number {
  if (!meterValue || Number.isNaN(meterValue)) {
    return 0;
  }
  return Math.round(meterValue / 1000);
}

/**
 * Interface Pengecekan Ketimpangan Roda Ganda (Dual-Wheel Mating)
 */
export interface DualWheelMatingCheck {
  isImbalanced: boolean;
  diffPercent: number;
  outerPos: WheelPosition;
  innerPos: WheelPosition;
  warningMessage?: string;
}

/**
 * 9. Validasi Pasangan Roda Ganda (Luar & Dalam - Edge Case #5)
 * SOP PT ALN: Selisih ketebalan fisik tapak tidak boleh > 20%
 */
export function checkDualWheelMating(
  outerTire: TireAsset | null,
  innerTire: TireAsset | null,
  outerPos: WheelPosition,
  innerPos: WheelPosition,
): DualWheelMatingCheck {
  if (!outerTire || !innerTire) {
    return { isImbalanced: false, diffPercent: 0, outerPos, innerPos };
  }

  const outerPercent = outerTire.lastInspectionPercent || 70;
  const innerPercent = innerTire.lastInspectionPercent || 70;
  const diffPercent = Math.abs(outerPercent - innerPercent);

  const isImbalanced = diffPercent > 20;

  return {
    isImbalanced,
    diffPercent,
    outerPos,
    innerPos,
    warningMessage: isImbalanced
      ? `Ketimpangan Roda Ganda (${outerPos} & ${innerPos}): Selisih fisik tapak ${diffPercent}%. Roda yang lebih tebal menanggung 80% beban muatan!`
      : undefined,
  };
}
