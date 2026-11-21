// src/hooks/auditSchedule/useAuditSchedule.ts
import { useState, useMemo } from "react";
import type { TruckFleetTireItem } from "@/types/TireManagement/tires";
import type {
  UseAuditScheduleProps,
  AuditStatusFilter,
  AuditScheduleMetrics,
} from "@/types/TireAuditScheduleView/TireAuditScheduleViewTypes";
import { getAuditStatus, getExtendedDueDate } from "@/utils/auditSchedule";

/**
 * State halaman Jadwal Audit Bulanan (filter, metrik, modal reschedule)
 */
export function useAuditSchedule({
  truckList,
  onRescheduleTruck,
}: UseAuditScheduleProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<AuditStatusFilter>("ALL");

  // State Modal Reschedule
  const [targetTruck, setTargetTruck] = useState<TruckFleetTireItem | null>(
    null,
  );
  const [rescheduleReason, setRescheduleReason] = useState<string>(
    "Unit sedang membawa kontainer ekspor ke Pelabuhan Belawan",
  );

  const [extendDays, setExtendDays] = useState<number>(7);

  // Filter Data Truk
  const filteredTrucks = useMemo(() => {
    return truckList.filter((truck) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        truck.unitCode.toLowerCase().includes(query) ||
        truck.plateNumber.toLowerCase().includes(query) ||
        truck.driver.toLowerCase().includes(query) ||
        truck.auditSchedule.surveyorName.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        getAuditStatus(truck.auditSchedule) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [truckList, searchTerm, statusFilter]);

  // Metrik Agregat Kepatuhan Audit (dihitung dari tanggal, bukan data statis)
  const metrics = useMemo<AuditScheduleMetrics>(() => {
    const statuses = truckList.map((t) => getAuditStatus(t.auditSchedule));
    const countOf = (status: AuditStatusFilter) => {
      return statuses.filter((s) => s === status).length;
    };
    return {
      totalTrucks: truckList.length,
      overdueCount: countOf("OVERDUE"),
      dueSoonCount: countOf("DUE_SOON"),
      rescheduledCount: countOf("RESCHEDULED"),
      completedCount: countOf("COMPLETED"),
    };
  }, [truckList]);

  // Modal Handlers
  const handleOpenReschedule = (truck: TruckFleetTireItem) => {
    setTargetTruck(truck);
    setRescheduleReason(
      "Unit sedang membawa muatan rute luar kota / ekspedisi",
    );
    // Default 7 hari ke depan (Phase B: diganti input jumlah hari)
    setExtendDays(7);
  };

  const handleCloseReschedule = () => {
    setTargetTruck(null);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTruck || extendDays < 1) {
      return;
    }
    const newDueDate = getExtendedDueDate(
      targetTruck.auditSchedule,
      extendDays,
    );
    onRescheduleTruck(targetTruck.id, rescheduleReason, newDueDate);
    setTargetTruck(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredTrucks,
    extendDays,
    setExtendDays,
    targetTruck,
    rescheduleReason,
    setRescheduleReason,
    handleOpenReschedule,
    handleCloseReschedule,
    handleConfirmReschedule,
    metrics,
  };
}
