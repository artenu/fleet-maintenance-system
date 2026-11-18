// src/constants/truck/wheelPositions.ts
import type { WheelPosition } from "@/types/truck/tires";

/**
 * Kamus deskripsi posisi roda standar surveyor PT ALN.
 * Mengikuti konvensi penomoran gandar dan orientasi kabin:
 * - H1, H3, H4: Sisi Kanan (Supir 🇮🇩 - Kemudi Kanan Indonesia)
 * - H2, H5, H6: Sisi Kiri (Kernet / Penumpang)
 * - S1: Keranjang Cadangan (Ban Serep)
 */
export const WHEEL_POSITION_DESCRIPTIONS: Record<string, string> = {
  H1: "Gandar 1 Depan • SISI KANAN (SUPIR 🇮🇩)",
  H2: "Gandar 1 Depan • SISI KIRI (KERNET / PENUMPANG)",
  H3: "Gandar 2 Drive • SISI KANAN (SUPIR 🇮🇩)",
  H4: "Gandar 2 Drive • SISI KANAN (SUPIR 🇮🇩)",
  H5: "Gandar 2 Drive • SISI KIRI (KERNET)",
  H6: "Gandar 2 Drive • SISI KIRI (KERNET)",
  S1: "Keranjang Cadangan • BAN SEREP",
};

/**
 * Mendapatkan label deskripsi posisi roda lengkap dengan informasi gandar dan sisi supir/kernet
 *
 * @param pos - Kode posisi roda (contoh: "H1", "H2", "C1", "S1")
 * @returns String deskripsi informatif posisi roda
 */
export function getWheelPositionDescription(
  pos: WheelPosition | string,
): string {
  if (WHEEL_POSITION_DESCRIPTIONS[pos]) {
    return WHEEL_POSITION_DESCRIPTIONS[pos];
  }
  return `Sasis Trailer • Posisi ${pos}`;
}

