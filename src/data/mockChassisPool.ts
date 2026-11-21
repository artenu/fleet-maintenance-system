// src/data/mockChassisPool.ts
import { type ChassisTrailerAsset } from "../types/TireManagement/tires";

export const mockChassisPoolList: ChassisTrailerAsset[] = [
  // 1. Sasis 20FT Aktif di TRK-001
  {
    id: "CHS-ID-001",
    chassisCode: "CHS-001",
    type: "2_AXLE",
    lengthCategory: "20FT",
    wheelCount: 14,
    attachedHeadId: "TRK-001", // Gandeng TRK-001
    status: "ATTACHED",
  },
  // 2. Sasis 20FT Aktif di TRK-003
  {
    id: "CHS-ID-005",
    chassisCode: "CHS-005",
    type: "2_AXLE",
    lengthCategory: "20FT",
    wheelCount: 14,
    attachedHeadId: "TRK-003", // Gandeng TRK-003
    status: "ATTACHED",
  },
  // 3. Sasis 40FT (Standby di Pool)
  {
    id: "CHS-ID-018",
    chassisCode: "CHS-018",
    type: "3_AXLE",
    lengthCategory: "40FT",
    wheelCount: 18,
    attachedHeadId: null, // Standby di pool
    status: "STANDALONE_POOL",
  },
  // 4. Sasis 40FT 2 Sumbu (Standby di Pool)
  {
    id: "CHS-ID-40-02",
    chassisCode: "CHS-40-02",
    type: "2_AXLE",
    lengthCategory: "40FT",
    wheelCount: 14,
    attachedHeadId: null,
    status: "STANDALONE_POOL",
  },
  // 5. Sasis 40FT 3 Sumbu (Standby di Pool)
  {
    id: "CHS-ID-40-03",
    chassisCode: "CHS-40-03",
    type: "3_AXLE",
    lengthCategory: "40FT",
    wheelCount: 18,
    attachedHeadId: null,
    status: "STANDALONE_POOL",
  },
  // 6. Sasis 20FT Sedang Perbaikan di Bengkel
  {
    id: "CHS-ID-20-04",
    chassisCode: "CHS-20-04",
    type: "2_AXLE",
    lengthCategory: "20FT",
    wheelCount: 14,
    attachedHeadId: null,
    status: "UNDER_REPAIR",
  },
  {
    id: "CHS-ID-002",
    chassisCode: "CHS-002",
    type: "2_AXLE",
    lengthCategory: "20FT",
    wheelCount: 14,
    attachedHeadId: "TRK-005", // 👈 Pasangkan ke TRK-005
    status: "ATTACHED", // 👈 Ubah status jadi ATTACHED
  },
];
