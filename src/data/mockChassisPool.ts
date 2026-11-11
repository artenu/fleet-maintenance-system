// src/data/mockChassisPool.ts
import { type ChassisTrailerAsset } from "../types/truck/tires";

export const mockChassisPoolList: ChassisTrailerAsset[] = [
  {
    id: "CHS-ID-018",
    chassisCode: "CHS-018",
    type: "3_AXLE",
    lengthCategory: "40FT",
    wheelCount: 18,
    attachedHeadId: "TRK-003", // Sedang digandeng TRK-003
    status: "ATTACHED",
  },
  {
    id: "CHS-ID-005",
    chassisCode: "CHS-005",
    type: "2_AXLE",
    lengthCategory: "20FT",
    wheelCount: 14,
    attachedHeadId: null, // Standby di pool
    status: "STANDALONE_POOL",
  },
  {
    id: "CHS-ID-001",
    chassisCode: "CHS-001",
    type: "2_AXLE",
    lengthCategory: "20FT",
    wheelCount: 14,
    attachedHeadId: "TRK-001", // Sedang digandeng TRK-001
    status: "ATTACHED",
  },
  // 🌟 EDGE CASE BOS: Sasis Panjang 40ft TAPI Konfigurasi 14 Ban (2 Gandar)!
  {
    id: "CHS-ID-40-02",
    chassisCode: "CHS-40-02",
    type: "2_AXLE",
    lengthCategory: "40FT",
    wheelCount: 14,
    attachedHeadId: null,
    status: "STANDALONE_POOL",
  },
  {
    id: "CHS-ID-40-03",
    chassisCode: "CHS-40-03",
    type: "3_AXLE",
    lengthCategory: "40FT",
    wheelCount: 18,
    attachedHeadId: null,
    status: "STANDALONE_POOL",
  },
  {
    id: "CHS-ID-20-04",
    chassisCode: "CHS-20-04",
    type: "2_AXLE",
    lengthCategory: "20FT",
    wheelCount: 14,
    attachedHeadId: null,
    status: "UNDER_REPAIR", // Sedang diservis kakinya di bengkel
  },
];
