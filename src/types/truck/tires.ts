/**
 * Standarisasi Kode Posisi Roda:
 * - Head (H): Gandar Steer (H1, H2), Gandar Drive (H3, H4, H5, H6), Ban Serep (S1)
 * - Chassis (C): Sumbu 1 (C1-C4), Sumbu 2 (C5-C8), Sumbu 3 (C9-C12)
 */
export type HeadWheelPosition = "H1" | "H2" | "H3" | "H4" | "H5" | "H6" | "S1";
export type ChassisWheelPosition2Axle =
  | "C1"
  | "C2"
  | "C3"
  | "C4"
  | "C5"
  | "C6"
  | "C7"
  | "C8";
export type ChassisWheelPosition3Axle =
  | ChassisWheelPosition2Axle
  | "C9"
  | "C10"
  | "C11"
  | "C12";

export type WheelPosition =
  | HeadWheelPosition
  | ChassisWheelPosition3Axle
  | "GUDANG"
  | "AFKIR"
  | "VULKANISIR";

export type AxleType = "steer" | "drive" | "trailer";

/**
 * Tipe Gandar Sasis:
 * - 2 Sumbu = 14 Ban Total (H1-H6 + C1-C8)
 * - 3 Sumbu = 18 Ban Total (H1-H6 + C1-C12)
 */
export type ChassisType = "2_AXLE" | "3_AXLE";

/**
 * Siklus Hidup Casing Ban:
 * R0 = Baru
 * R1 = Vulkanisir ke-1
 * R2 = Vulkanisir ke-2 (Batas maksimal)
 * AFKIR = Rusak Total / Scrap
 */
export type RetreadStatus = "R0" | "R1" | "R2" | "R3" | "AFKIR";

/**
 * Status Kesehatan Ban (Decision Matrix Result):
 * - GOOD: KM < 80% & Fisik > 70%
 * - WARNING: KM 80-99% atau Fisik 40-70%
 * - CRITICAL: KM >= 100% atau Fisik < 40% (atau pelanggaran Golden Rule)
 */
export type TireHealthStatus = "GOOD" | "WARNING" | "CRITICAL";

/**
 * Tiering Kualitas Merk Ban:
 * - TIER_1 (Premium): Bridgestone, Michelin (Toleransi keawetan 115% - 120%)
 * - TIER_2 (Standard): Giti, Gajah Tunggal, Hankook, Boxer (100%)
 * - TIER_3 (Budget): Ban Impor / Kompon Lunak (80%)
 */
export type BrandTier = "TIER_1" | "TIER_2" | "TIER_3";

export interface BrandProfile {
  name: string;
  tier: BrandTier;
  toleranceMultiplier: number; // misal 1.15 untuk Tier 1, 0.85 untuk Tier 3
  standardPrice: number; // Harga acuan untuk kalkulasi CPK
}

/**
 * Entitas Aset Ban Terpasang / Di Gudang
 */
export interface TireAsset {
  id: string;
  serialNumber: string;
  brand: string;
  size: string;
  retreadStatus: RetreadStatus;
  currentVehicleId: string | null;
  currentPosition: WheelPosition;
  installOdometer: number; // Odometer truk saat ban ini pertama dipasang
  lastInspectionPercent: number; // Fisik (%) dari surveyor terakhir
  lastInspectionDate: string | null;
  isMechanicOverridden?: boolean; // True jika ada toleransi +5.000 KM mekanik
  overrideReason?: string;
  overrideApprovedBy?: string;
}

/**
 * Kartu Evaluasi Roda Terpasang
 */
export interface WheelSlotEvaluation {
  position: WheelPosition;
  axleType: AxleType;
  tire: TireAsset | null;
  kmElapsed: number;
  maxAllowedKm: number;
  remainingKm: number;
  wearPercentage: number;
  healthStatus: TireHealthStatus;
  ruleViolations: string[]; // Contoh: "PELANGGARAN: Posisi Steer H1 tidak boleh ban vulkanisir (R1)!"
}

/**
 * Status Jadwal Audit Surveyor
 */
export interface AuditSchedule {
  period: string;
  lastAuditDate: string;
  nextAuditSchedule: string;
  status: "PENDING" | "OVERDUE" | "RESCHEDULED" | "COMPLETED";
  surveyorName: string;
  rescheduledTo?: string | null;
  rescheduleReason?: string | null;
}

export type ActionRecommendation =
  | "KEEP"
  | "INFLATE"
  | "ROTATE"
  | "REPLACE_SERVICE";

/**
 * Entitas Aset Ban Terpasang / Di Gudang
 */
export interface TireAsset {
  id: string;
  serialNumber: string;
  brand: string;
  size: string;
  retreadStatus: RetreadStatus;
  currentVehicleId: string | null;
  currentPosition: WheelPosition;
  installOdometer: number; // Odometer truk saat ban ini pertama dipasang
  lastInspectionPercent: number; // Fisik (%) dari surveyor terakhir
  lastInspectionDate: string | null;
  isMechanicOverridden?: boolean; // True jika ada toleransi +5.000 KM mekanik
  overrideReason?: string;
  overrideApprovedBy?: string;

  // Parameter Tambahan Inspeksi Real-Time Lapangan
  treadDepthMm?: number; // Kedalaman alur tapak (mm)
  pressurePsi?: number; // Tekanan angin aktual (PSI)
  visualDamages?: string[]; // Checklist cacat fisik (benjol, sobek, dll)
  inspectorName?: string; // Nama surveyor yang mengaudit
  inspectionNotes?: string; // Catatan temuan / rekomendasi
  photoEvidenceUrl?: string; // URL / Preview foto bukti fisik
  actionRecommendation?: ActionRecommendation; // Rekomendasi tindakan lapangan
}

/**
 * Decoupling Entitas Armada (MOM 4 & 5 Nov 2026):
 * Tractor Head dan Chassis Trailer adalah aset mandiri (Drop & Hook).
 */
export interface TractorHeadAsset {
  id: string;
  unitCode: string; // contoh: "TRK-001"
  plateNumber: string; // contoh: "B 9123 UEK"
  brand: string; // contoh: "Hino Ranger FG 260 TH"
  currentOdometer: number; // KM dari telematics IoT
  assignedDriver: string; // Supir utama
  attachedChassisId: string | null; // ID Sasis yang sedang digandeng (jika ada)
}

export interface ChassisTrailerAsset {
  id: string;
  chassisCode: string; // contoh: "CHS-20-001" atau "CHS-40-088"
  type: ChassisType; // "2_AXLE" (2 sumbu / 14 ban) atau "3_AXLE" (3 sumbu / 18 ban)
  lengthCategory: "20FT" | "40FT"; // Panjang sasis
  wheelCount: 14 | 18; // Edge case: Sasis 40ft bisa 14 ban atau 18 ban
  attachedHeadId: string | null; // ID Tractor Head yang sedang menggandeng
  status: "ATTACHED" | "STANDALONE_POOL" | "UNDER_REPAIR";
}
