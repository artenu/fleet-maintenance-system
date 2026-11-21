// src/hooks/useFleetMaintenance.ts
import { useState, useMemo } from "react";
import { mockTruckTireList } from "@/data/mockTires";
import type { TruckFleetTireItem } from "@/types/TireManagement/tires";
import { useChassisOperations } from "./truckCoupling";
import { useAuditReschedule } from "./auditSchedule";
import { useTireOperations, useWarehouseTires } from "./tireManagement";
import { useTireHistory } from "./useTireHistory";

export function useFleetMaintenance(
  addToast: (
    type: "success" | "warning" | "info",
    title: string,
    description?: string,
  ) => void,
) {
  // 1. Master Fleet State
  const [truckList, setTruckList] =
    useState<TruckFleetTireItem[]>(mockTruckTireList);
  const [selectedTruckId, setSelectedTruckId] = useState<string>(
    mockTruckTireList[0].id,
  );

  const activeTruck = useMemo(() => {
    return (
      truckList.find((t) => {
        return t.id === selectedTruckId;
      }) || truckList[0]
    );
  }, [truckList, selectedTruckId]);

  // 2. Modul Audit Trail Riwayat Mutasi & Rotasi
  const historyOps = useTireHistory();

  // 3. Modul Operasi Sasis (Coupling)
  const chassisOps = useChassisOperations({
    truckList,
    setTruckList,
    addToast,
  });

  // 4. Modul Gudang Ban Pool
  const warehouseOps = useWarehouseTires({
    addToast,
    onLogActivity: (truck, desc, type) => {
      historyOps.appendHistoryLog(truck, desc, type);
    },
  });

  // 5. Modul Audit & Penundaan Izin (Reschedule)
  const auditOps = useAuditReschedule({
    truckList,
    setTruckList,
  });

  // 6. Modul Operasi Ban (Tires)
  const tireOps = useTireOperations({
    truckList,
    setTruckList,
    activeTruck,
    warehouseTires: warehouseOps.warehouseTires,
    setWarehouseTires: warehouseOps.setWarehouseTires,
    addToast,
    onLogActivity: (desc, type) => {
      historyOps.appendHistoryLog(activeTruck.unitCode, desc, type);
    },
  });

  // Mengembalikan data lengkap
  return {
    truckList,
    setTruckList,
    selectedTruckId,
    setSelectedTruckId,
    activeTruck,
    // Operasi Sasis
    ...chassisOps,
    // Operasi Audit / Reschedule
    ...auditOps,
    // Operasi Ban
    ...tireOps,
    // Operasi Gudang
    ...warehouseOps,
    // Operasi Riwayat Mutasi (Audit Trail)
    ...historyOps,
  };
}
