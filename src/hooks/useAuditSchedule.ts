// src/hooks/useAuditSchedule.ts
import { useState, useMemo } from "react";
import type { TruckFleetTireItem } from "@/data/mockTires";
import type {
  UseAuditScheduleProps,
  AuditStatusFilter,
  AuditScheduleMetrics,
} from "@/types/TireAuditScheduleView/TireAuditScheduleViewTypes";

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
  const [rescheduleDate, setRescheduleDate] = useState<string>("2026-11-15");

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
        statusFilter === "ALL" || truck.auditSchedule.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [truckList, searchTerm, statusFilter]);

  // Metrik Agregat Kepatuhan Audit
  const overdueCount = useMemo(() => {
    return truckList.filter((t) => t.auditSchedule.status === "OVERDUE").length;
  }, [truckList]);

  const rescheduledCount = useMemo(() => {
    return truckList.filter((t) => t.auditSchedule.status === "RESCHEDULED")
      .length;
  }, [truckList]);

  const healthyCount = useMemo(() => {
    return truckList.length - overdueCount;
  }, [truckList, overdueCount]);

  // Modal Handlers
  const handleOpenReschedule = (truck: TruckFleetTireItem) => {
    setTargetTruck(truck);
    setRescheduleReason(
      "Unit sedang membawa muatan rute luar kota / ekspedisi",
    );
    // Default 7 hari ke depan
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setRescheduleDate(nextWeek.toISOString().split("T")[0]);
  };

  const handleCloseReschedule = () => {
    setTargetTruck(null);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTruck) {
      return;
    }
    onRescheduleTruck(targetTruck.id, rescheduleReason, rescheduleDate);
    setTargetTruck(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredTrucks,
    targetTruck,
    rescheduleReason,
    setRescheduleReason,
    rescheduleDate,
    setRescheduleDate,
    handleOpenReschedule,
    handleCloseReschedule,
    handleConfirmReschedule,
    metrics: {
      totalTrucks: truckList.length,
      overdueCount,
      rescheduledCount,
      healthyCount,
    } as AuditScheduleMetrics,
  };
}

