import {
  AXLE_RULES,
  getAxleTypeByPosition,
  getBrandProfile,
  TIRE_THRESHOLDS,
} from "../constants/tireRules";
import {
  TireAsset,
  TireHealthStatus,
  WheelPosition,
  WheelSlotEvaluation,
} from "../types/tires";

/**
 * Evaluasi Status Kesehatan Satu Slot Roda (Decision Matrix Engine)
 *
 * @param position - Posisi roda (H1-H6, C1-C12, S1)
 * @param tire - Aset ban yang terpasang pada slot tersebut (atau null jika kosong)
 * @param currentTruckOdo - Angka odometer terkini truk dari IoT Hino Connect
 */
export function evaluateWheelSlot(
  position: WheelPosition,
  tire: TireAsset | null,
  currentTruckOdo: number,
): WheelSlotEvaluation {
  const axleType = getAxleTypeByPosition(position);
  const axleRule = AXLE_RULES[axleType];

  if (!tire) {
    return {
      position,
      axleType,
      tire: null,
      kmElapsed: 0,
      maxAllowedKm: axleRule.intervalKm,
      remainingKm: axleRule.intervalKm,
      wearPercentage: 0,
      healthStatus: "GOOD",
      ruleViolations: [],
    };
  }

  const ruleViolations: string[] = [];

  // 1. GOLDEN RULE #1: Gandar Steer (H1 & H2) WAJIB Ban Baru (R0)
  if (axleType === "steer" && tire.retreadStatus !== "R0") {
    ruleViolations.push(
      `PELANGGARAN KESELAMATAN: Posisi ${position} (Steer) wajib menggunakan Ban Baru (R0). Ban saat ini berstatus ${tire.retreadStatus}!`,
    );
  }

  // Validasi: Ban berstatus AFKIR dilarang beroperasi
  if (tire.retreadStatus === "AFKIR") {
    ruleViolations.push(
      `BAHAYA: Ban ${tire.serialNumber} berstatus AFKIR / SCRAP dan dilarang dipasang di armada!`,
    );
  }

  // 2. Hitung Batas Maksimal KM dengan Toleransi Merk & Override Mekanik
  const brandProfile = getBrandProfile(tire.brand);
  const baseInterval = axleRule.intervalKm;
  let maxAllowedKm = Math.round(
    baseInterval * brandProfile.toleranceMultiplier,
  );

  // Jika mekanik meng-override perpanjangan batas (Edge Case 4)
  if (tire.isMechanicOverridden) {
    maxAllowedKm += TIRE_THRESHOLDS.MECHANIC_OVERRIDE_KM;
  }

  // 3. Hitung Jarak Tempuh & Sisa KM
  const kmElapsed = Math.max(0, currentTruckOdo - (tire.installOdometer || 0));
  const remainingKm = Math.max(0, maxAllowedKm - kmElapsed);
  const wearPercentage = Math.min(
    100,
    Math.round((kmElapsed / maxAllowedKm) * 100),
  );

  // 4. Penentuan Status Kesehatan (Decision Matrix)
  let healthStatus: TireHealthStatus = "GOOD";

  if (ruleViolations.length > 0) {
    healthStatus = "CRITICAL";
  }
  // GOLDEN RULE #5: Kondisi fisik surveyor < 40% langsung Kritis
  else if (
    tire.lastInspectionPercent < TIRE_THRESHOLDS.CRITICAL_PHYSICAL_PERCENT
  ) {
    healthStatus = "CRITICAL";
  }
  // KM telah habis (>= 100%)
  else if (kmElapsed >= maxAllowedKm) {
    healthStatus = "CRITICAL";
  }
  // Peringatan KM (80-99%) atau Fisik Menipis (40-70%)
  else if (
    wearPercentage >= TIRE_THRESHOLDS.WARNING_KM_PERCENT ||
    tire.lastInspectionPercent <= TIRE_THRESHOLDS.WARNING_PHYSICAL_PERCENT
  ) {
    healthStatus = "WARNING";
  }

  return {
    position,
    axleType,
    tire,
    kmElapsed,
    maxAllowedKm,
    remainingKm,
    wearPercentage,
    healthStatus,
    ruleViolations,
  };
}

/**
 * Menghitung Cost-Per-Kilometer (CPK) untuk Analitik Manajemen
 *
 * @param purchasePrice - Harga beli ban (Rp)
 * @param totalKmAchieved - Total kilometer tempuh sampai afkir
 */
export function calculateCpk(
  purchasePrice: number,
  totalKmAchieved: number,
): number {
  if (!totalKmAchieved || totalKmAchieved <= 0) return 0;
  return Math.round((purchasePrice / totalKmAchieved) * 100) / 100;
}

/**
 * Konversi Respon IoT Telematics Hino: Meter ke KM
 * Contoh: 76890035 meter -> 76.890 KM
 */
export function convertIotOdometerMeterToKm(meterValue: number): number {
  if (!meterValue || Number.isNaN(meterValue)) return 0;
  return Math.round(meterValue / 1000);
}

/**
 * Hasil Pengecekan Ketimpangan Roda Ganda (Dual-Wheel Mating - Edge Case #5)
 */
export interface DualWheelMatingCheck {
  isImbalanced: boolean;
  diffPercent: number;
  outerPos: WheelPosition;
  innerPos: WheelPosition;
  warningMessage?: string;
}

/**
 * Validasi Pasangan Roda Ganda (Luar & Dalam)
 * SOP PT ALN: Selisih ketebalan fisik tapak tidak boleh > 20% (setara > 3mm selisih tapak)
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

  // Jika selisih kondisi fisik tapak melebihi 20% (> 3mm)
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
