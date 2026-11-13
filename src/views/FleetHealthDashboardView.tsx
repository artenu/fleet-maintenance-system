// src/views/FleetHealthDashboardView.tsx
import { useFleetHealthDashboard } from "@/hooks/useFleetHealthDashboard";
import type { FleetHealthDashboardViewProps } from "@/types/FleetHealthDashboardView/FleetHealthDashboardViewTypes";

// 🧱 Komponen Reusable Design System Kita
import { Container, PageHeader, Grid } from "@/components/layout";
import { Button, StatCard } from "@/components/common";
import { FleetHealthTable } from "@/components/dashboard";

import {
  LayoutDashboard,
  CheckCircle2,
  AlertOctagon,
  Truck,
  Link2,
  Warehouse,
} from "lucide-react";

export default function FleetHealthDashboardView({
  truckList,
  chassisList,
  warehouseTires,
  onSelectTruck,
  onNavigateCoupling,
  onNavigateUpdateTires,
}: FleetHealthDashboardViewProps) {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredAnalysis,
    stats,
  } = useFleetHealthDashboard({ truckList, chassisList });

  const {
    totalTrucks,
    fitCount,
    groundedCount,
    overdueAuditsCount,
    totalChassis,
    attachedChassisCount,
    standbyChassisCount,
  } = stats;

  return (
    <Container className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* ================= 1. PAGE HEADER ================= */}
      <PageHeader
        icon={LayoutDashboard}
        iconBgColor="bg-purple-600 shadow-purple-500/20"
        title="Executive Fleet Health Dashboard"
        subtitle="Monitoring kelaikan jalan armada (Fit to Dispatch), status rangkaian sasis, dan deteksi dini ban kritis"
        badge="Ringkasan Eksekutif Pool"
        badgeColor="bg-purple-100 text-purple-700"
        actions={
          <Button
            variant="outline"
            size="md"
            icon={Link2}
            onClick={onNavigateCoupling}
            className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
            Kelola Drop & Hook Sasis
          </Button>
        }
      />

      {/* ================= 2. KPI METRICS CARDS (GRID) ================= */}
      <Grid cols={1} smCols={2} lgCols={5} gap="md">
        {/* Total Armada */}
        <StatCard
          title="Total Armada"
          value={totalTrucks}
          subValue="Kepala Truk"
          subtitle="Terdaftar di sistem FMS"
          icon={Truck}
          variant="default"
        />

        {/* Fit to Dispatch */}
        <StatCard
          title="Fit To Dispatch"
          value={fitCount}
          subValue="Unit Siap Jalan"
          subtitle={`${Math.round((fitCount / (totalTrucks || 1)) * 100)}% Kelaikan Armada`}
          icon={CheckCircle2}
          variant="success"
        />

        {/* Grounded */}
        <StatCard
          title="Grounded (Bengkel)"
          value={groundedCount}
          subValue="Wajib Servis"
          subtitle={
            groundedCount > 0 ? (
              <span className="text-rose-700 font-bold">
                ⚠️ Ada ban kritis / bahaya
              </span>
            ) : (
              "Semua unit aman"
            )
          }
          icon={AlertOctagon}
          variant="danger"
        />

        {/* Sasis Standby di Pool */}
        <StatCard
          title="Sasis di Pool"
          value={standbyChassisCount}
          subValue={`/ ${totalChassis} Standby`}
          subtitle={`${attachedChassisCount} Sasis Tergandeng di Jalan`}
          icon={Link2}
          variant="info"
        />

        {/* Stok Ban Gudang */}
        <StatCard
          title="Stok Ban Gudang"
          value={warehouseTires.length}
          subValue="Ban Cadangan"
          subtitle={
            overdueAuditsCount > 0 ? (
              <span className="text-rose-600 font-bold">
                ⚠️ {overdueAuditsCount} Unit Overdue
              </span>
            ) : (
              "Audit up to date"
            )
          }
          icon={Warehouse}
          variant="default"
        />
      </Grid>

      {/* ================= 3. TABEL HEALTH STATUS ARMADA ================= */}
      <FleetHealthTable
        filteredAnalysis={filteredAnalysis}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        stats={stats}
        onSelectTruck={onSelectTruck}
        onNavigateCoupling={onNavigateCoupling}
        onNavigateUpdateTires={onNavigateUpdateTires}
      />
    </Container>
  );
}
