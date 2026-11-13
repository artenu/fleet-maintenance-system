// src/views/TireAuditScheduleView.tsx
import { useAuditSchedule } from "@/hooks/useAuditSchedule";
import type { TireAuditScheduleViewProps } from "@/types/TireAuditScheduleView/TireAuditScheduleViewTypes";
import { Container, PageHeader, Grid } from "@/components/layout";
import { StatCard } from "@/components/common";
import {
  TireAuditScheduleTable,
  RescheduleAuditModal,
} from "@/components/auditSchedule";
import {
  CalendarClock,
  Clock,
  Truck,
  ShieldAlert,
  CalendarCheck2,
} from "lucide-react";

export default function TireAuditScheduleView({
  truckList,
  onRescheduleTruck,
}: TireAuditScheduleViewProps) {
  const {
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
    metrics,
  } = useAuditSchedule({ truckList, onRescheduleTruck });

  return (
    <Container className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Header Halaman */}
      <PageHeader
        icon={CalendarClock}
        iconBgColor="bg-rose-600 text-white shadow-rose-500/20"
        title="Jadwal Audit Fisik Rutin & Izin Penundaan"
        subtitle="SOP PT ALN: Audit fisik wajib per 30 hari. Kepala Pool berhak memberikan dispensasi Reschedule bagi unit luar kota"
        badge="SOP Siklus 30 Hari"
        badgeColor="bg-rose-100 text-rose-700"
      />

      {/* 2. Kartu KPI Kepatuhan Jadwal Audit */}
      <Grid cols={1} mdCols={2} lgCols={4} gap="md">
        <StatCard
          title="Total Unit Armada"
          value={`${metrics.totalTrucks} Unit`}
          subValue="Wajib Audit"
          subtitle="Audit berkala bulanan"
          icon={Truck}
          variant="default"
        />
        <StatCard
          title="Status Overdue (Kritis)"
          value={`${metrics.overdueCount} Unit`}
          subValue="Lewat Jatuh Tempo"
          subtitle="Perlu audit / dispensasi segera"
          icon={ShieldAlert}
          variant="danger"
        />
        <StatCard
          title="Dalam Dispensasi"
          value={`${metrics.rescheduledCount} Unit`}
          subValue="Rescheduled"
          subtitle="Izin muatan kontainer aktif"
          icon={Clock}
          variant="info"
        />
        <StatCard
          title="Audit Terjadwal Aman"
          value={`${metrics.healthyCount} Unit`}
          subValue="Taat Jadwal"
          subtitle="Kepatuhan operasional normal"
          icon={CalendarCheck2}
          variant="success"
        />
      </Grid>

      {/* 3. Panel Tabel Jadwal Audit Armada */}
      <TireAuditScheduleTable
        filteredTrucks={filteredTrucks}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenReschedule={handleOpenReschedule}
      />

      {/* 4. Modal Formulir Persetujuan Reschedule */}
      <RescheduleAuditModal
        targetTruck={targetTruck}
        rescheduleDate={rescheduleDate}
        onRescheduleDateChange={setRescheduleDate}
        rescheduleReason={rescheduleReason}
        onRescheduleReasonChange={setRescheduleReason}
        onClose={handleCloseReschedule}
        onConfirm={handleConfirmReschedule}
      />
    </Container>
  );
}
