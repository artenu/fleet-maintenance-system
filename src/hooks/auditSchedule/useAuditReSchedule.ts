// src/hooks/auditSchedule/useAuditReschedule.ts
import { useMemo, type Dispatch, type SetStateAction } from "react";
import type { TruckFleetTireItem } from "@/types/TireManagement/tires";
import { getAuditStatus } from "@/utils/auditSchedule";

interface UseAuditRescheduleProps {
  truckList: TruckFleetTireItem[];
  setTruckList: Dispatch<SetStateAction<TruckFleetTireItem[]>>;
}

/**
 * State global dispensasi audit (dipakai di useFleetMaintenance)
 */
export function useAuditReschedule({
  truckList,
  setTruckList,
}: UseAuditRescheduleProps) {
  const overdueCount = useMemo(() => {
    return truckList.filter((t) => {
      return getAuditStatus(t.auditSchedule) === "OVERDUE";
    }).length;
  }, [truckList]);

  const handleRescheduleTruck = (
    truckId: string,
    reason: string,
    newDate: string,
  ) => {
    setTruckList((prev) => {
      return prev.map((t) => {
        if (t.id === truckId) {
          return {
            ...t,
            auditSchedule: {
              ...t.auditSchedule,
              rescheduledTo: newDate,
              rescheduleReason: reason,
            },
          };
        }
        return t;
      });
    });
  };

  return {
    overdueCount,
    handleRescheduleTruck,
  };
}
