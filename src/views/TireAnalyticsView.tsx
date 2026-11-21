// src/views/TireAnalyticsView.tsx
import { useTireAnalytics } from "@/hooks/useTireAnalytics";
import type { TireAnalyticsViewProps } from "@/types/TireAnalyticsView/TireAnalyticsViewTypes";
import { Container, PageHeader, Grid } from "@/components/layout";
import { StatCard, Button } from "@/components/common";
import {
  TireAnalyticsTable,
  TruckCostAnalyticsTable,
} from "@/components/analyticsCPK";
import {
  TrendingUp,
  Award,
  DollarSign,
  Gauge,
  Flame,
  Truck,
  Layers,
} from "lucide-react";

export default function TireAnalyticsView({
  truckList,
  warehouseTires,
}: TireAnalyticsViewProps = {}) {
  const {
    searchTerm,
    tierFilter,
    sortBy,
    truckSearchTerm,
    truckSortBy,
    truckRankings,
    highestCostTruck,
    longestServiceLifeTruck,
    analyticsList,
    activeTab,
    metrics,
    setSearchTerm,
    setTierFilter,
    setSortBy,
    setTruckSearchTerm,
    setTruckSortBy,
    setActiveTab,
  } = useTireAnalytics({ truckList, warehouseTires });

  return (
    <Container className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Header Halaman */}
      <PageHeader
        icon={TrendingUp}
        iconBgColor="bg-emerald-600 text-white shadow-emerald-500/20"
        title="Analitik Biaya & Durabilitas Merk (CPK)"
        subtitle="Cost-Per-Kilometer (CPK) = Harga Pengadaan dibagi Total KM Tempuh. Metrik evaluasi ROI ban untuk manajemen armada"
        badge="Analitik ROI Ban"
        badgeColor="bg-emerald-100 text-emerald-700"
      />
      {/* 2. Kartu KPI Analitik Eksekutif */}
      <Grid cols={1} mdCols={2} lgCols={4} gap="md">
        <StatCard
          title="Rata-rata CPK Armada"
          value={`Rp ${metrics.avgCpk}`}
          subValue="Per Kilometer"
          subtitle={`Berdasarkan ${metrics.totalSample} sampel ban`}
          icon={DollarSign}
          variant="default"
        />
        <StatCard
          title="CPK Paling Efisien"
          value={`Rp ${metrics.bestValueCpk}`}
          subValue="Best Value Brand"
          subtitle={metrics.bestValueBrandName}
          icon={Award}
          variant="success"
        />
        <StatCard
          title="Truk Biaya Tertinggi"
          value={metrics.highestCostTruck?.unitCode || "-"}
          subValue={
            metrics.highestCostTruck
              ? `Rp ${metrics.highestCostTruck.totalTireCost.toLocaleString("id-ID")}`
              : "0"
          }
          subtitle={
            metrics.highestCostTruck
              ? `${metrics.highestCostTruck.plateNumber} (${metrics.highestCostTruck.totalTires} ban)`
              : "Belum ada data"
          }
          icon={Flame}
          variant="danger"
        />
        <StatCard
          title="Masa Pakai Terpanjang"
          value={metrics.longestServiceLifeTruck?.unitCode || "-"}
          subValue={
            metrics.longestServiceLifeTruck
              ? `${metrics.longestServiceLifeTruck.currentOdometer.toLocaleString("id-ID")} KM`
              : "0 KM"
          }
          subtitle={
            metrics.longestServiceLifeTruck
              ? `Driver: ${metrics.longestServiceLifeTruck.driver}`
              : "Belum ada data"
          }
          icon={Gauge}
          variant="info"
        />
      </Grid>
      {/* 3. Tab Switcher: Analisis Merk vs Analisis Antar Truk */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
        <Button
          variant={activeTab === "brand" ? "success" : "outline"}
          size="sm"
          icon={Layers}
          onClick={() => setActiveTab("brand")}>
          Performa Merk & CPK Ban
        </Button>

        <Button
          variant={activeTab === "truck" ? "success" : "outline"}
          size="sm"
          icon={Truck}
          onClick={() => setActiveTab("truck")}>
          Analitik Biaya & Jam Terbang Unit Truk
        </Button>
      </div>
      {/* 4. Konten Tab Aktif */}
      {activeTab === "brand" ? (
        <TireAnalyticsTable
          analyticsList={analyticsList}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          tierFilter={tierFilter}
          onTierFilterChange={setTierFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
      ) : (
        <TruckCostAnalyticsTable
          truckRankings={truckRankings}
          highestCostTruck={highestCostTruck}
          longestServiceLifeTruck={longestServiceLifeTruck}
          searchTerm={truckSearchTerm}
          onSearchTermChange={setTruckSearchTerm}
          sortBy={truckSortBy}
          onSortByChange={setTruckSortBy}
        />
      )}
    </Container>
  );
}
