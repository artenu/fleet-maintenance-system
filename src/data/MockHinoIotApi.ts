// src/data/MockHinoIotApi.ts

export interface HinoTelematicsResponseItem {
  vin: string;
  vehicleStatus: "OFF" | "ON" | "IDLE" | string;
  odometer: number; // Nilai aktual sensor Hino Connect dalam satuan METER
  engineHours: number;
  longitude: number;
  latitude: number;
  heading: number;
  speed: number;
  positionDateTime: string;
  createdDateTime: string;
  altitude: number;
}

/**
 * Data Simulasi Response API Hino Telematics Connect
 * Sesuai response JSON riil dari perangkat telematics Hino!
 */
export const mockHinoIotResponse: HinoTelematicsResponseItem[] = [
  {
    vin: "MJEFG8JF2RJP11628", // VIN Truk Unit 18 / B 9211 BEL
    vehicleStatus: "OFF",
    odometer: 76890035, // 76.890 KM
    engineHours: 17576280,
    longitude: 106.9364288,
    latitude: -6.1385818,
    heading: 272.0,
    speed: 0.0,
    positionDateTime: "2026-10-22T10:27:02Z",
    createdDateTime: "2026-10-22T10:27:04.642066083Z",
    altitude: -1.0,
  },
  {
    vin: "MJEFG8JF2SJP09821", // VIN Truk Unit 05 / B 9123 UEK
    vehicleStatus: "OFF",
    odometer: 128450120, // 128.450 KM
    engineHours: 24510000,
    longitude: 106.9365,
    latitude: -6.1386,
    heading: 90.0,
    speed: 0.0,
    positionDateTime: "2026-10-22T10:30:00Z",
    createdDateTime: "2026-10-22T10:30:05.100Z",
    altitude: 2.0,
  },
  {
    vin: "MJEFG8JF2SJP88771", // VIN Truk TRK-001 / B 1234 XYZ
    vehicleStatus: "ON",
    odometer: 145400500, // 145.400 KM
    engineHours: 31200000,
    longitude: 106.9401,
    latitude: -6.1402,
    heading: 180.0,
    speed: 15.0,
    positionDateTime: "2026-10-22T10:35:00Z",
    createdDateTime: "2026-10-22T10:35:02.000Z",
    altitude: 1.0,
  },
];

/**
 * Helper Fungsi: Cari Odometer Hino berdasarkan VIN dan konversi ke Kilometer (KM)
 * Contoh: 76890035 meter -> 76.890 KM
 */
export function getOdometerKmByVin(
  vin: string,
  fallbackKm: number = 50000,
): number {
  const match = mockHinoIotResponse.find((item) => item.vin === vin);
  if (!match || !match.odometer) {return fallbackKm;}
  return Math.round(match.odometer / 1000);
}
