// src/constants/digitalTwin/useTireRotationFormConstants.ts
import type { WheelPosition } from "@/types/truck/tires";
import type { SourceTireDestination } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Pilihan alasan rotasi / mutasi roda truk
 */
export const ROTATION_REASON_OPTIONS = [
  {
    value: "Rotasi Rutin Keausan Gandar",
    label: "Rotasi Rutin Keausan Gandar",
  },
  {
    value: "Aus Steer Dipindah ke Trailer",
    label: "Aus Steer Dipindah ke Trailer",
  },
  {
    value: "Ban Bocor / Rusak Fisik",
    label: "Ban Bocor / Rusak Fisik",
  },
  {
    value: "Kirim ke Rekanan Vulkanisir",
    label: "Kirim ke Rekanan Vulkanisir",
  },
  {
    value: "Afkir & Pasang Ban Baru Gudang",
    label: "Afkir & Pasang Ban Baru Gudang",
  },
];

/**
 * Pilihan opsi destinasi penyimpanan ban bekas ganti gudang
 */
export const SOURCE_DESTINATION_OPTIONS: Array<{
  id: SourceTireDestination;
  label: string;
}> = [
  { id: "GUDANG", label: "Simpan di Gudang" },
  { id: "VULKANISIR", label: "Vendor Vulkanisir" },
  { id: "AFKIR", label: "Afkirkan (Scrap)" },
];

/**
 * Daftar urutan posisi roda dasar untuk truk standar (14 ban)
 */
export const BASE_WHEEL_POSITIONS: WheelPosition[] = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "S1",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
];

/**
 * Posisi roda tambahan untuk sasis 3 sumbu (18 ban)
 */
export const EXTRA_3AXLE_WHEEL_POSITIONS: WheelPosition[] = [
  "C9",
  "C10",
  "C11",
  "C12",
];

/**
 * Petugas mekanik default untuk form rotasi
 */
export const DEFAULT_ROTATION_MECHANIC_PIC = "Slamet Riyadi (Mekanik)";
