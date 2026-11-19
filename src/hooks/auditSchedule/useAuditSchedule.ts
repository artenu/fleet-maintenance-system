import { useMemo, type Dispatch, type SetStateAction } from "react";
import type { TruckFleetTireItem } from "@/types/TireManagement/tires";

interface UseAuditRescheduleProps {
  truckList: TruckFleetTireItem[];
  setTruckList: Dispatch<SetStateAction<TruckFleetTireItem[]>>;
}

export function useAuditReschedule({
  truckList,
  setTruckList,
}: UseAuditRescheduleProps) {
  const overdueCount = useMemo(() => {
    return truckList.filter((t) => {
      return t.auditSchedule.status === "OVERDUE";
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
              status: "RESCHEDULED",
              nextAuditSchedule: newDate,
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
