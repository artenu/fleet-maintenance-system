// src/data/mockCentralTruckApi.ts
import { type ChassisType } from "../types/truck/tires";

export interface CentralTruckApiResponseItem {
  id: string;
  unitCode: string;
  plateNumber: string;
  capacity: "20FT" | "40FT" | string;
  unitKind: "TRUCK" | string;
  chassisSize?: string;
  receivedDate: string;
  stnkNumber: string;
  stnkExpiryDate: string;
  taxPaymentDate?: string;
  brand: string;
  type: string;
  vin: string;
  engineNumber: string;
  kirNumber: string;
  kirHeadNumber?: string;
  kirExpiryDate: string;
  kirChassisNumber?: string;
  currentChassisId?: string;
  currentChassisCode?: string; // contoh: "CHS-018"
  stidCode?: string;
  stidExpiryDate?: string;
  solarBarcodeNumber?: string;
  solarBarcodeDate?: string;
  defaultDriver: string;
  defaultDriverId?: string;
  status: "Aktif" | "Non-Aktif" | string;
}

/**
 * Data Simulasi Response API Database Pusat (Backend Sebelah)
 * Menggunakan struktur asli dari API yang kamu berikan!
 */
export const mockCentralTruckApiResponse: CentralTruckApiResponseItem[] = [
  // 1. Data Riil dari Backend (Unit 18) - Menunggu Inisialisasi Ban Baru di FMS
  {
    id: "d9820acc-b46d-4d44-9df2-67586c0b8be9",
    unitCode: "18",
    plateNumber: "B 9211 BEL",
    capacity: "40FT",
    unitKind: "TRUCK",
    chassisSize: "",
    receivedDate: "2025-07-18",
    stnkNumber: "02722350 I",
    stnkExpiryDate: "2030-04-08",
    taxPaymentDate: "2027-04-08",
    brand: "HINO",
    type: "FG 260 TH",
    vin: "MJEFG8JF2RJP11628",
    engineNumber: "J08EWEJ23723",
    kirNumber: "JKT2511667",
    kirHeadNumber: "JKT2511667",
    kirExpiryDate: "2027-01-15",
    kirChassisNumber: "CHS-018",
    currentChassisId: "fe78c3e4-a1ca-4c97-8597-ff8ee0338e36",
    currentChassisCode: "CHS-018",
    stidCode: "C31500",
    stidExpiryDate: "2027-04-25",
    solarBarcodeNumber: "",
    solarBarcodeDate: "2026-09-15",
    defaultDriver: "DEDE SUPRIADI",
    defaultDriverId: "3ff66719-5786-40e0-b981-69a49778a648",
    status: "Aktif",
  },

  // 2. Unit Lain (20FT) - Contoh Tambahan
  {
    id: "c4120acc-a12d-4d44-9df2-12345c0b8be1",
    unitCode: "05",
    plateNumber: "B 9123 UEK",
    capacity: "20FT",
    unitKind: "TRUCK",
    receivedDate: "2025-05-10",
    stnkNumber: "01992340 I",
    stnkExpiryDate: "2029-10-12",
    brand: "HINO",
    type: "FG 235 JJ",
    vin: "MJEFG8JF2SJP09821",
    engineNumber: "J08EWEJ11299",
    kirNumber: "JKT2510112",
    kirExpiryDate: "2026-12-20",
    currentChassisCode: "CHS-005",
    stidCode: "C21400",
    stidExpiryDate: "2027-02-18",
    defaultDriver: "SAMSUL ARIFIN",
    status: "Aktif",
  },

  // 3. Unit yang sudah aktif di FMS (TRK-001)
  {
    id: "a1120acc-b46d-4d44-9df2-55555c0b8be8",
    unitCode: "TRK-001",
    plateNumber: "B 1234 XYZ",
    capacity: "20FT",
    unitKind: "TRUCK",
    receivedDate: "2024-01-15",
    stnkNumber: "01122330 I",
    stnkExpiryDate: "2028-05-20",
    brand: "HINO",
    type: "Ranger FG 235 JJ",
    vin: "MJEFG8JF2SJP88771",
    engineNumber: "J08EWEJ00122",
    kirNumber: "JKT2400991",
    kirExpiryDate: "2026-11-20",
    currentChassisCode: "CHS-001",
    defaultDriver: "Andi Pratama",
    status: "Aktif",
  },
];

/**
 * Helper untuk menentukan ChassisType visual (2_AXLE vs 3_AXLE)
 * Sasis 40ft default 3 sumbu (18 ban), sasis 20ft default 2 sumbu (14 ban)
 */
export function deriveChassisTypeFromCapacity(capacity: string): ChassisType {
  return capacity.toUpperCase().includes("40") ? "3_AXLE" : "2_AXLE";
}
