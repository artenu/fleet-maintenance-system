// src/views/TireInventoryView.tsx
import { useTireInventory } from "@/hooks/useTireInventory";
import type { TireInventoryViewProps } from "@/types/TireInventoryView/TireInventoryViewTypes";
import { Container, PageHeader, Grid } from "@/components/layout";
import { StatCard, Button } from "@/components/common";
import { TireInventoryTable } from "@/components/tireInventory";
import {
  Warehouse,
  PlusCircle,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function TireInventoryView({
  truckList,
  warehouseTires,
  onReceiveNewTire,
}: TireInventoryViewProps) {
  const {
    searchTerm,
    setSearchTerm,
    retreadFilter,
    setRetreadFilter,
    selectedBrand,
    setSelectedBrand,
    brandList,
    filteredTires,
    canViewFinancials,
    metrics,
  } = useTireInventory({ truckList, warehouseTires });

  return (
    <Container className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Header Halaman */}
      <PageHeader
        icon={Warehouse}
        iconBgColor="bg-blue-600 text-white shadow-blue-500/20"
        title="Master Stok & Gudang Ban Pool"
        subtitle="Kelola stok ban baru (R0), hasil vulkanisir standby, dan inventaris siap pasang/rotasi"
        badge="Pool Cakung Standby"
        badgeColor="bg-blue-100 text-blue-700"
        actions={
          <Button
            variant="danger"
            onClick={onReceiveNewTire}
            icon={PlusCircle}>
            Terima Ban Baru
          </Button>
        }
      />

      {/* 2. Kartu KPI Inventaris Ban */}
      <Grid cols={1} mdCols={2} lgCols={4} gap="md">
        <StatCard
          title="Total Ban Terpasang"
          value={`${metrics.totalMountedTires} Unit`}
          subValue="Di Armada"
          subtitle={`Terdistribusi di ${truckList.length} unit truk`}
          icon={Layers}
          variant="default"
        />
        <StatCard
          title="Stok Gudang (Standby)"
          value={`${metrics.totalWarehouseTires} Unit`}
          subValue="Siap Pakai"
          subtitle="Tersedia di gudang pool"
          icon={Warehouse}
          variant="info"
        />
        <StatCard
          title="Ban Baru (R0)"
          value={`${metrics.r0Count} Unit`}
          subValue="Casing Baru"
          subtitle="Khusus gandar steer & armada baru"
          icon={Sparkles}
          variant="success"
        />
        <StatCard
          title="Vulkanisir (R1 - R3)"
          value={`${metrics.retreadCount} Unit`}
          subValue="Casing Rekondisi"
          subtitle="Khusus gandar drive & trailer"
          icon={RefreshCw}
          variant="purple"
        />
      </Grid>

      {/* 3. Panel Filter & Tabel Stok Gudang */}
      <TireInventoryTable
        filteredTires={filteredTires}
        totalWarehouseTires={metrics.totalWarehouseTires}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        retreadFilter={retreadFilter}
        onRetreadFilterChange={setRetreadFilter}
        selectedBrand={selectedBrand}
        onSelectedBrandChange={setSelectedBrand}
        brandList={brandList}
        canViewFinancials={canViewFinancials}
      />
    </Container>
  );
}
