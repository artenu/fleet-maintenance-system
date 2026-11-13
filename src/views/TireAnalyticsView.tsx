// src/views/TireAnalyticsView.tsx
import { useTireAnalytics } from "@/hooks/useTireAnalytics";
import { Container, PageHeader, Grid } from "@/components/layout";
import { StatCard } from "@/components/common";
import { TireAnalyticsTable } from "@/components/analyticsCPK";
import { TrendingUp, Award, DollarSign, Gauge, Percent } from "lucide-react";

export default function TireAnalyticsView() {
  const {
    searchTerm,
    setSearchTerm,
    tierFilter,
    setTierFilter,
    sortBy,
    setSortBy,
    analyticsList,
    metrics,
  } = useTireAnalytics();

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

      {/* 2. Kartu KPI Analitik Biaya */}
      <Grid cols={1} mdCols={2} lgCols={4} gap="md">
        <StatCard
          title="Rata-rata CPK Armada"
          value={`Rp ${metrics.avgCpk}`}
          subValue="Per Kilometer"
          subtitle={`Berdasarkan data ${metrics.totalSample} sampel ban`}
          icon={DollarSign}
          variant="default"
        />
        <StatCard
          title="CPK Paling Efisien"
          value={`Rp ${metrics.bestValueCpk}`}
          subValue="Best ROI"
          subtitle={metrics.bestValueBrandName}
          icon={Award}
          variant="success"
        />
        <StatCard
          title="Durabilitas Tertinggi"
          value={`${metrics.topMileageKm.toLocaleString("id-ID")} KM`}
          subValue="Top Mileage"
          subtitle={metrics.topMileageBrandName}
          icon={Gauge}
          variant="info"
        />
        <StatCard
          title="Efisiensi Retread"
          value="Hemat s/d 42%"
          subValue="Optimalisasi Casing"
          subtitle="Jasa Retread vs Beli Baru"
          icon={Percent}
          variant="purple"
        />
      </Grid>

      {/* 3. Panel Tabel Performa Merk & CPK */}
      <TireAnalyticsTable
        analyticsList={analyticsList}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        tierFilter={tierFilter}
        onTierFilterChange={setTierFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />
    </Container>
  );
}
