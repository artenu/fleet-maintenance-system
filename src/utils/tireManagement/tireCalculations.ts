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

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Helper: Menambah N tahun ke tanggal "YYYY-MM-DD"
 */
export function addYearsToDateString(dateStr: string, years: number): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const fallback = new Date();
    fallback.setFullYear(fallback.getFullYear() + years);
    return fallback.toISOString().split("T")[0];
  }
  const [year, month, day] = dateStr.split("-").map(Number);
  const next = new Date(year + years, month - 1, day);
  const y = next.getFullYear();
  const m = String(next.getMonth() + 1).padStart(2, "0");
  const d = String(next.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Helper: Mengambil seluruh daftar URL foto inspeksi ban (multi-foto dengan kompatibilitas single photo)
 */
export function getTirePhotos(
  tire?: Pick<TireAsset, "photoEvidenceUrl" | "photoEvidenceUrls"> | null,
): string[] {
  if (!tire) {
    return [];
  }
  if (tire.photoEvidenceUrls && tire.photoEvidenceUrls.length > 0) {
    return tire.photoEvidenceUrls;
  }
  if (tire.photoEvidenceUrl && tire.photoEvidenceUrl.trim()) {
    return [tire.photoEvidenceUrl.trim()];
  }
  return [];
}

/**
 * Helper: Menghitung total jumlah tambal / bocor ban selama masa pemakaian
 */
export function getTotalPunctureCount(
  tire?: Pick<TireAsset, "punctureCount" | "punctureByCycle"> | null,
): number {
  if (!tire) {
    return 0;
  }
  if (tire.punctureByCycle) {
    const cycleSum =
      (tire.punctureByCycle.R0 || 0) +
      (tire.punctureByCycle.R1 || 0) +
      (tire.punctureByCycle.R2 || 0) +
      (tire.punctureByCycle.R3 || 0);
    if (cycleSum > 0 || tire.punctureCount === undefined) {
      return cycleSum;
    }
  }
  return tire.punctureCount || 0;
}

export interface TireExpiryInfo {
  baseDate: string | null;
  expiryDate: string | null;
  daysRemaining: number | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
  ruleLabel: string | null;
}

/**
 * Helper: Menghitung informasi masa kedaluwarsa ban
 * - Ban baru (R0) yang sedang terpasang/dipakai: masa expired 1 tahun dari tanggal pasang
 * - Ban tidak terpakai di gudang: masa expired 5 tahun dari tanggal masuk gudang
 */
export function calculateTireExpiryInfo(
  tire: TireAsset,
  today: Date = new Date(),
): TireExpiryInfo {
  const isInWarehouse = tire.currentPosition === "GUDANG";
  let baseDate: string | null = null;
  let expiryDate: string | null = tire.expiryDate || null;
  let ruleLabel: string | null = null;

  if (isInWarehouse) {
    baseDate = tire.warehouseEntryDate || tire.lastInspectionDate || null;
    if (!expiryDate && baseDate) {
      expiryDate = addYearsToDateString(
        baseDate,
        TIRE_THRESHOLDS.WAREHOUSE_UNUSED_EXPIRY_YEARS,
      );
    }
    ruleLabel = expiryDate ? "5 Tahun Gudang" : null;
  } else if (
    tire.retreadStatus === "R0" &&
    tire.currentPosition !== "AFKIR" &&
    tire.currentPosition !== "VULKANISIR"
  ) {
    baseDate = tire.installDate || tire.lastInspectionDate || null;
    if (!expiryDate && baseDate) {
      expiryDate = addYearsToDateString(
        baseDate,
        TIRE_THRESHOLDS.NEW_TIRE_USAGE_EXPIRY_YEARS,
      );
    }
    ruleLabel = expiryDate ? "1 Tahun Pemakaian Ban Baru" : null;
  }

  if (!expiryDate || !/^\d{4}-\d{2}-\d{2}$/.test(expiryDate)) {
    return {
      baseDate,
      expiryDate: null,
      daysRemaining: null,
      isExpired: false,
      isExpiringSoon: false,
      ruleLabel,
    };
  }

  const [ey, em, ed] = expiryDate.split("-").map(Number);
  const expUtc = new Date(ey, em - 1, ed);
  const todayLocal = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const daysRemaining = Math.round(
    (expUtc.getTime() - todayLocal.getTime()) / MS_PER_DAY,
  );

  return {
    baseDate,
    expiryDate,
    daysRemaining,
    isExpired: daysRemaining < 0,
    isExpiringSoon:
      daysRemaining >= 0 &&
      daysRemaining <= TIRE_THRESHOLDS.EXPIRY_WARNING_DAYS,
    ruleLabel,
  };
}

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
    ruleWarnings: [],
  };
}

/**
 * 2. Validasi Aturan Keselamatan Gandar & Status Casing (Golden Rule #1, Anti-Afkir, 3x Bocor, Kedaluwarsa)
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

  // Batas Tambalan / Bocor >= 3x wajib Afkir & tidak boleh retread
  const totalPunctures = getTotalPunctureCount(tire);
  if (totalPunctures >= TIRE_THRESHOLDS.MAX_PUNCTURE_BEFORE_AFKIR) {
    violations.push(
      `WAJIB AFKIR (${totalPunctures}x Bocor): Ban ${tire.serialNumber} telah mengalami ${totalPunctures}x bocor/tambal (batas maks. 3x). Ban tidak dapat di-retread dan harus segera diafkirkan!`,
    );
  }

  // Cek kedaluwarsa ban baru yang sedang dipakai (1 tahun)
  const expiryInfo = calculateTireExpiryInfo(tire);
  if (expiryInfo.isExpired && expiryInfo.expiryDate) {
    violations.push(
      `BAN KEDALUWARSA: Masa berlaku pemakaian ban baru (1 tahun) telah melewati tanggal expired (${expiryInfo.expiryDate}). Segera lakukan pemeriksaan / penggantian ban!`,
    );
  }

  return violations;
}

/**
 * 2b. Mengumpulkan Peringatan Non-Blokir (misal R1 di Steer depan, 2x bocor, mendekati kedaluwarsa)
 */
export function collectTireRuleWarnings(
  position: WheelPosition,
  axleType: AxleType,
  tire: TireAsset,
): string[] {
  const warnings: string[] = [];

  // Peringatan khusus: Ban 1x vulkanisir (R1) dipasang pada Steer depan head truck (H1 / H2)
  if (axleType === "steer" && tire.retreadStatus === "R1") {
    warnings.push(
      `PERINGATAN STEER (R1 • 1x Vulkanisir): Posisi kemudi depan ${position} menggunakan ban vulkanisir ke-1 (R1). Pantau kondisi fisik & tekanan angin secara ketat, atau prioritaskan Ban Baru (R0).`,
    );
  }

  const totalPunctures = getTotalPunctureCount(tire);
  if (totalPunctures === TIRE_THRESHOLDS.MAX_PUNCTURE_BEFORE_AFKIR - 1) {
    warnings.push(
      `PERINGATAN TAMBALAN (2x Bocor): Ban ${tire.serialNumber} sudah mengalami 2x bocor/tambal. Jika terjadi 1x kebocoran lagi (3x), ban tidak boleh di-retread dan wajib diafkirkan.`,
    );
  }

  const expiryInfo = calculateTireExpiryInfo(tire);
  if (expiryInfo.isExpiringSoon && expiryInfo.expiryDate) {
    warnings.push(
      `MENDEKATI EXPIRED: Masa pemakaian ban baru (1 tahun) berakhir pada ${expiryInfo.expiryDate} (sisa ${expiryInfo.daysRemaining} hari).`,
    );
  }

  return warnings;
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
  baseWarnings?: string[];
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
  // Pelanggaran aturan gandar (misal Steer dipasang ban R2, AFKIR, 3x bocor, atau kedaluwarsa)
  else if (violations.length > 0) {
    healthStatus = "CRITICAL";
  }
  // Peringatan Keausan KM (80-99%), Fisik Menipis (40-70%), atau Warning Gandar (misal R1 di Steer)
  else if (
    params.wearPercentage >= TIRE_THRESHOLDS.WARNING_KM_PERCENT ||
    params.physicalPercent <= TIRE_THRESHOLDS.WARNING_PHYSICAL_PERCENT ||
    (params.baseWarnings && params.baseWarnings.length > 0)
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

  // 1. Validasi Aturan Gandar & Peringatan
  const baseViolations = validateTireAxleRules(position, axleType, tire);
  const ruleWarnings = collectTireRuleWarnings(position, axleType, tire);

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
    baseWarnings: ruleWarnings,
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
    ruleWarnings,
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
