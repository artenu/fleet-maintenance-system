// src/constants/digitalTwin/useTireInspectionFormConstants.ts

/**
 * Daftar merk ban standar acuan operasional pool & workshop
 */
export const STANDARD_BRANDS = [
  "Super Grip / MI RFD",
  "PT Boxer (Karet Medan)",
  "Bridgestone",
  "Michelin",
  "Giti",
  "Gajah Tunggal",
  "Dunlop",
  "Lainnya",
];

/**
 * Daftar opsi temuan cacat / kerusakan visual pada dinding dan tapak ban
 */
export const VISUAL_DAMAGE_OPTIONS = [
  "Benjol / Bulge (Dinding Ban)",
  "Sobek Dinding Samping",
  "Kawat Baja Terbuka",
  "Aus Tidak Rata (Camber/Toe)",
  "Tertusuk Paku / Bocor Halus",
  "Retak Rambut (Ozone / Cuaca)",
];

/**
 * Cacat visual tingkat fatal yang seketika memicu status KRITIS (Golden Rule #5)
 */
export const SEVERE_DAMAGE_OPTIONS = [
  "Benjol / Bulge (Dinding Ban)",
  "Sobek Dinding Samping",
  "Kawat Baja Terbuka",
];

/**
 * Memeriksa apakah daftar kerusakan ban memiliki kerusakan tingkat parah/fatal
 */
export function checkHasSevereDamage(visualDamages: string[]): boolean {
  return visualDamages.some((damage) => SEVERE_DAMAGE_OPTIONS.includes(damage));
}

/**
 * Pilihan opsi status casing / vulkanisir untuk form inspeksi
 */
export const INSPECTION_RETREAD_STATUS_OPTIONS = [
  { value: "R0", label: "R0 • Ban Baru Asli" },
  { value: "R1", label: "R1 • Vulkanisir ke-1 (Boleh Steer)" },
  { value: "R2", label: "R2 • Vulkanisir ke-2" },
  { value: "R3", label: "R3 • Vulkanisir ke-3 (Maksimal)" },
  { value: "AFKIR", label: "AFKIR • Rusak / Afkir" },
];

/**
 * Pilihan opsi rekomendasi tindakan surveyor lapangan
 */
export const INSPECTION_RECOMMENDATION_OPTIONS = [
  { value: "KEEP", label: "🟢 Lanjut Operasi (Kondisi Aman)" },
  { value: "INFLATE", label: "🟡 Perlu Tambah Angin (Tekanan Rendah)" },
  { value: "ROTATE", label: "🔄 Jadwalkan Rotasi Gandar" },
  { value: "REPLACE_SERVICE", label: "🔴 Wajib Servis / Bongkar (Kritis)" },
];

/**
 * Ambang batas teknis evaluasi inspeksi ban
 */
export const INSPECTION_THRESHOLDS = {
  MIN_PRESSURE_PSI: 95,
  MAX_PRESSURE_PSI: 130,
  DEFAULT_PRESSURE_PSI: 115,
  CRITICAL_PHYSICAL_PERCENT: 40,
  WARNING_PHYSICAL_PERCENT: 70,
  DEFAULT_INITIAL_PERCENT: 75,
  MAX_PUNCTURE_BEFORE_AFKIR: 3,
};
