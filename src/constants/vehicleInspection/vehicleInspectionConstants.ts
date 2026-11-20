// src/constants/vehicleInspection/vehicleInspectionConstants.ts
import type { BadgeVariant } from "@/types/components/common/commonTypes";
import type {
  ToolDocStatus,
  ComponentConditionStatus,
  ToolDocItem,
  PhysicalCheckItem,
  BatteryCheckData,
} from "@/types/VehicleInspection";

/**
 * Opsi tombol status kelengkapan Tools & Dokumen (Seksi 1)
 */
export const TOOL_DOC_STATUS_OPTIONS: Array<{
  value: ToolDocStatus;
  label: string;
  badgeVariant: BadgeVariant;
}> = [
  { value: "B", label: "Baik (B)", badgeVariant: "success" },
  { value: "R", label: "Rusak (R)", badgeVariant: "danger" },
  { value: "H", label: "Hilang (H)", badgeVariant: "warning" },
  { value: "T", label: "Tidak Ada (T)", badgeVariant: "neutral" },
];

/**
 * Opsi tombol status kondisi Fisik Komponen Body & Sasis (Seksi 2 & 3)
 */
export const COMPONENT_CONDITION_OPTIONS: Array<{
  value: ComponentConditionStatus;
  label: string;
  badgeVariant: BadgeVariant;
}> = [
  { value: "B", label: "Baik (B)", badgeVariant: "success" },
  { value: "RM", label: "Rusak Minor (RM)", badgeVariant: "warning" },
  { value: "RB", label: "Rusak Berat (RB)", badgeVariant: "danger" },
  { value: "H", label: "Hilang (H)", badgeVariant: "danger" },
];

/**
 * Daftar 12 item Tools, Perlengkapan, dan Masa Berlaku Dokumen Legalitas (Seksi 1)
 */
export const INITIAL_TOOL_DOC_ITEMS: ToolDocItem[] = [
  { id: "doc-stnk", name: "STNK Asli", hasExpiryDate: true, status: "B" },
  {
    id: "doc-kir-card",
    name: "Kartu Uji Berkala (KIR)",
    hasExpiryDate: true,
    status: "B",
  },
  {
    id: "doc-kir-paper",
    name: "Kertas Hasil Uji KIR",
    hasExpiryDate: true,
    status: "B",
  },
  {
    id: "doc-stid",
    name: "Kartu STID Pelabuhan (Tanjung Priok)",
    hasExpiryDate: true,
    status: "B",
  },
  {
    id: "tool-apar",
    name: "Tabung Pemadam (APAR)",
    hasExpiryDate: true,
    status: "B",
  },
  {
    id: "tool-triangle",
    name: "Segitiga Pengaman Darurat",
    hasExpiryDate: false,
    status: "B",
  },
  {
    id: "tool-wrench",
    name: "Kunci Roda Standar Truk",
    hasExpiryDate: false,
    status: "B",
  },
  {
    id: "tool-jack",
    name: "Dongkrak Hidrolik Truk (20-30 Ton)",
    hasExpiryDate: false,
    status: "B",
  },
  {
    id: "tool-helmet",
    name: "Helm Keselamatan Kerja (APD)",
    hasExpiryDate: false,
    status: "B",
  },
  {
    id: "tool-vest",
    name: "Rompi Reflektor Safety",
    hasExpiryDate: false,
    status: "B",
  },
  {
    id: "tool-ecu",
    name: "Modul Komputer ECU Truk",
    hasExpiryDate: false,
    status: "B",
  },
  {
    id: "tool-audio",
    name: "Head Unit / Audio Tape Hino",
    hasExpiryDate: false,
    status: "B",
  },
];

/**
 * Daftar 50 item pemeriksaan fisik body, kabin, lampu & sasis (Seksi 2)
 */
export const INITIAL_PHYSICAL_CHECK_ITEMS: PhysicalCheckItem[] = [
  // I. WAJAH DEPAN (FRONT - 5 Item)
  {
    id: "front-windshield",
    name: "Kaca Depan (Windshield)",
    section: "FRONT",
    status: "B",
  },
  {
    id: "front-wiper",
    name: "Wiper & Tabung Air Washer",
    section: "FRONT",
    status: "B",
  },
  {
    id: "front-grill",
    name: "Grill Depan & Lambang Hino",
    section: "FRONT",
    status: "B",
  },
  {
    id: "front-bumper",
    name: "Bumper Depan & Lis Bumper",
    section: "FRONT",
    status: "B",
  },
  {
    id: "front-sidemirror",
    name: "Kaca Spion Depan (Spion Bawah Trotoar)",
    section: "FRONT",
    status: "B",
  },

  // II. SISI KANAN SUPIR 🇮🇩 (RIGHT_SIDE - 9 Item)
  {
    id: "r-door",
    name: "Pintu Kabin Kanan (Handle & Engsel)",
    section: "RIGHT_SIDE",
    status: "B",
  },
  {
    id: "r-window",
    name: "Kaca Pintu Kanan & Regulator",
    section: "RIGHT_SIDE",
    status: "B",
  },
  {
    id: "r-mirror-main",
    name: "Kaca Spion Utama Kanan",
    section: "RIGHT_SIDE",
    status: "B",
  },
  {
    id: "r-mirror-convex",
    name: "Spion Cembung Tambahan Kanan",
    section: "RIGHT_SIDE",
    status: "B",
  },
  {
    id: "r-footstep",
    name: "Footstep / Tangga Pijakan Kanan",
    section: "RIGHT_SIDE",
    status: "B",
  },
  {
    id: "r-fender",
    name: "Fender & Spakbor Depan Kanan",
    section: "RIGHT_SIDE",
    status: "B",
  },
  {
    id: "r-fueltank",
    name: "Tangki Bahan Bakar Solar & Bracket",
    section: "RIGHT_SIDE",
    status: "B",
  },
  {
    id: "r-airtank",
    name: "Tabung Angin Rem Sisi Kanan",
    section: "RIGHT_SIDE",
    status: "B",
  },
  {
    id: "r-guardrail",
    name: "Palang Pengaman Samping Kanan (Side Guard)",
    section: "RIGHT_SIDE",
    status: "B",
  },

  // III. SISI KIRI PENUMPANG / KERNET (LEFT_SIDE - 9 Item)
  {
    id: "l-door",
    name: "Pintu Kabin Kiri (Handle & Engsel)",
    section: "LEFT_SIDE",
    status: "B",
  },
  {
    id: "l-window",
    name: "Kaca Pintu Kiri & Regulator",
    section: "LEFT_SIDE",
    status: "B",
  },
  {
    id: "l-mirror-main",
    name: "Kaca Spion Utama Kiri",
    section: "LEFT_SIDE",
    status: "B",
  },
  {
    id: "l-mirror-convex",
    name: "Spion Cembung Tambahan Kiri",
    section: "LEFT_SIDE",
    status: "B",
  },
  {
    id: "l-footstep",
    name: "Footstep / Tangga Pijakan Kiri",
    section: "LEFT_SIDE",
    status: "B",
  },
  {
    id: "l-fender",
    name: "Fender & Spakbor Depan Kiri",
    section: "LEFT_SIDE",
    status: "B",
  },
  {
    id: "l-airdryer",
    name: "Filter Air Dryer & Tabung Kiri",
    section: "LEFT_SIDE",
    status: "B",
  },
  {
    id: "l-toolbox",
    name: "Kotak Box Perkakas Kiri",
    section: "LEFT_SIDE",
    status: "B",
  },
  {
    id: "l-guardrail",
    name: "Palang Pengaman Samping Kiri (Side Guard)",
    section: "LEFT_SIDE",
    status: "B",
  },

  // IV. INTERIOR KABIN KEMUDI (CABIN - 7 Item)
  {
    id: "cab-dashboard",
    name: "Dashboard & Panel Instrumen Spedometer",
    section: "CABIN",
    status: "B",
  },
  {
    id: "cab-steering",
    name: "Roda Kemudi (Setir) & Klakson",
    section: "CABIN",
    status: "B",
  },
  {
    id: "cab-pedals",
    name: "Pedal Gas, Rem, dan Kopling",
    section: "CABIN",
    status: "B",
  },
  {
    id: "cab-shifter",
    name: "Tuas Persneling & Rem Tangan (Handbrake)",
    section: "CABIN",
    status: "B",
  },
  {
    id: "cab-driverseat",
    name: "Kursi Supir (Jok) & Sabuk Pengaman (Seatbelt)",
    section: "CABIN",
    status: "B",
  },
  {
    id: "cab-passengerseat",
    name: "Kursi Kernet & Ranjang Area Istirahat",
    section: "CABIN",
    status: "B",
  },
  {
    id: "cab-rearwindow",
    name: "Kaca Dinding Belakang Kabin",
    section: "CABIN",
    status: "B",
  },

  // V. SISTEM LAMPU-LAMPU (LIGHTS - 8 Item)
  {
    id: "light-head",
    name: "Lampu Utama Dekat & Jauh (Headlamp)",
    section: "LIGHTS",
    status: "B",
  },
  {
    id: "light-fog",
    name: "Lampu Kabut Depan (Fog Lamp)",
    section: "LIGHTS",
    status: "B",
  },
  {
    id: "light-turn-f",
    name: "Lampu Sein Depan (Kanan & Kiri)",
    section: "LIGHTS",
    status: "B",
  },
  {
    id: "light-turn-r",
    name: "Lampu Sein Belakang (Kepala & Sasis)",
    section: "LIGHTS",
    status: "B",
  },
  {
    id: "light-brake",
    name: "Lampu Rem Belakang (Kepala & Sasis)",
    section: "LIGHTS",
    status: "B",
  },
  {
    id: "light-reverse",
    name: "Lampu Mundur & Buzzer Alarm Mundur",
    section: "LIGHTS",
    status: "B",
  },
  {
    id: "light-interior",
    name: "Lampu Plafon / Interior Kabin",
    section: "LIGHTS",
    status: "B",
  },
  {
    id: "light-rotary",
    name: "Lampu Hazard / Lampu Rotary Atap",
    section: "LIGHTS",
    status: "B",
  },

  // VI. BODY SASIS, LANDING GEAR & PIN LOCK (CHASSIS - 12 Item)
  {
    id: "ch-5thwheel",
    name: "Meja Coupler 5th Wheel & Tuas Rilis",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-kingpin",
    name: "Kingpin Sasis Trailer",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-frame",
    name: "Rangka Balok Utama Sasis (Main Beam)",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-landinggear",
    name: "Kaki Penyangga Sasis (Landing Gear Kanan & Kiri)",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-landinghandle",
    name: "Engkol / Tuas Pemutar Landing Gear",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-pin-front",
    name: "Pin Lock Kontainer Depan (Kanan & Kiri)",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-pin-rear",
    name: "Pin Lock Kontainer Belakang (Kanan & Kiri)",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-pin-mid",
    name: "Pin Lock Kontainer Tengah (Khusus Sasis 40ft)",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-mudguard",
    name: "Spakbor & Karpet Lumpur Sasis (Mud Guard)",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-spiralhose",
    name: "Selang Spiral Angin Rem & Kabel Socket Trailer",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-bumper",
    name: "Bumper Belakang Sasis & Stiker Reflektor",
    section: "CHASSIS",
    status: "B",
  },
  {
    id: "ch-fuelcap",
    name: "Tutup Tangki Solar (Kencang & Anti-Bocor)",
    section: "CHASSIS",
    status: "B",
  },
];

/**
 * Data awal pemeriksaan aki unit (Seksi 3)
 */
export const DEFAULT_BATTERY_CHECK: BatteryCheckData = {
  battery1: {
    brand: "GS Astra / Yuasa",
    serialNumber: "",
    condition: "B",
    notes: "",
  },
  battery2: {
    brand: "GS Astra / Yuasa",
    serialNumber: "",
    condition: "B",
    notes: "",
  },
  caseLockedWithChain: true,
  notes: "",
};

/**
 * Pilihan lokasi pool & depo standar PT ALN
 */
export const DEFAULT_INSPECTION_LOCATIONS = [
  "Pool Utama Cakung (Jakarta Timur)",
  "Pool Marunda Logistik (Jakarta Utara)",
  "Depo Tanjung Priok (Dermaga)",
  "Pool Transit Cikarang Dry Port",
];
