// src/views/TireHistoryView.tsx
import { useTireHistory } from "@/hooks/useTireHistory";
import { Container, PageHeader, Grid } from "@/components/layout";
import { StatCard } from "@/components/common";
import { TireHistoryList } from "@/components/tireHistory";
import {
  History,
  RotateCw,
  RefreshCw,
  Layers,
  Sparkles,
} from "lucide-react";

export default function TireHistoryView() {
  const {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    filteredLogs,
    metrics,
  } = useTireHistory();

  return (
    <Container className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Header Halaman */}
      <PageHeader
        icon={History}
        iconBgColor="bg-blue-600 text-white shadow-blue-500/20"
        title="Audit Trail Mutasi & Rotasi Roda"
        subtitle="Histori lengkap perpindahan ban, pemasangan baru, pengiriman vulkanisir rekanan, dan afkir scrap"
        badge="Audit Trail Resmi"
        badgeColor="bg-blue-100 text-blue-700"
      />

      {/* 2. Kartu KPI Riwayat Mutasi */}
      <Grid cols={1} mdCols={2} lgCols={4} gap="md">
        <StatCard
          title="Total Log Aktivitas"
          value={`${metrics.totalLogs} Catatan`}
          subValue="Aksi Tercatat"
          subtitle="Seluruh mutasi terdokumentasi"
          icon={Layers}
          variant="default"
        />
        <StatCard
          title="Rotasi Antar Gandar"
          value={`${metrics.rotationCount} Kali`}
          subValue="Optimalisasi Tapak"
          subtitle="Rotasi menjaga keausan ban"
          icon={RotateCw}
          variant="info"
        />
        <StatCard
          title="Pemasangan Baru (R0)"
          value={`${metrics.newInstallCount} Unit`}
          subValue="Ban Baru"
          subtitle="Masuk ke gandar kemudi / baru"
          icon={Sparkles}
          variant="success"
        />
        <StatCard
          title="Vulkanisir & Afkir"
          value={`${metrics.retreadCount + metrics.scrapCount} Unit`}
          subValue="Retread & Scrap"
          subtitle={`${metrics.retreadCount} Retread • ${metrics.scrapCount} Scrap`}
          icon={RefreshCw}
          variant="purple"
        />
      </Grid>

      {/* 3. Panel Log Mutasi */}
      <TireHistoryList
        filteredLogs={filteredLogs}
        totalLogsCount={metrics.totalLogs}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />
    </Container>
  );
}
