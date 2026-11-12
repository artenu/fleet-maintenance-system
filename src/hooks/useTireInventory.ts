// src/hooks/useTireInventory.ts
import { useState, useMemo } from "react";
import type { RetreadStatus } from "@/types/truck/tires";
import { mockCurrentSurveyor } from "@/types/auth/auth";
import type {
  UseTireInventoryProps,
  RetreadFilterType,
  InventoryMetrics,
} from "@/types/TireInventoryView/TireInventoryViewTypes";

export function useTireInventory({
  truckList,
  warehouseTires,
}: UseTireInventoryProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [retreadFilter, setRetreadFilter] = useState<RetreadFilterType>("ALL");
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");

  // RBAC Privasi Finansial (Hanya ADMIN dan FINANCE yang dapat melihat harga)
  const canViewFinancials =
    mockCurrentSurveyor.role === "ADMIN" ||
    mockCurrentSurveyor.role === "FINANCE";

  // Daftar unik merk di gudang
  const brandList = useMemo(() => {
    const brands = new Set<string>();
    warehouseTires.forEach((t) => brands.add(t.brand));
    return Array.from(brands);
  }, [warehouseTires]);

  // Filter Data Ban Gudang
  const filteredTires = useMemo(() => {
    return warehouseTires.filter((t) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        t.serialNumber.toLowerCase().includes(query) ||
        t.brand.toLowerCase().includes(query) ||
        t.size.toLowerCase().includes(query);

      const matchesBrand =
        selectedBrand === "ALL" || t.brand === selectedBrand;

      let matchesRetread = true;
      if (retreadFilter === "R0") {
        matchesRetread = t.retreadStatus === "R0";
      } else if (retreadFilter === "RETREAD") {
        matchesRetread = t.retreadStatus !== "R0";
      } else if (retreadFilter !== "ALL") {
        matchesRetread = t.retreadStatus === (retreadFilter as RetreadStatus);
      }

      return matchesSearch && matchesBrand && matchesRetread;
    });
  }, [warehouseTires, searchTerm, retreadFilter, selectedBrand]);

  // Kalkulasi Metrik Agregat
  const totalMountedTires = useMemo(() => {
    return truckList.reduce((acc, t) => acc + t.tires.length, 0);
  }, [truckList]);

  const r0Count = useMemo(() => {
    return warehouseTires.filter((w) => w.retreadStatus === "R0").length;
  }, [warehouseTires]);

  const retreadCount = useMemo(() => {
    return warehouseTires.filter((w) => w.retreadStatus !== "R0").length;
  }, [warehouseTires]);

  const averagePhysicalPercent = useMemo(() => {
    if (warehouseTires.length === 0) {
      return 0;
    }
    const total = warehouseTires.reduce(
      (acc, t) => acc + (t.lastInspectionPercent || 100),
      0,
    );
    return Math.round(total / warehouseTires.length);
  }, [warehouseTires]);

  return {
    searchTerm,
    setSearchTerm,
    retreadFilter,
    setRetreadFilter,
    selectedBrand,
    setSelectedBrand,
    brandList,
    filteredTires,
    canViewFinancials,
    currentUser: mockCurrentSurveyor,
    metrics: {
      totalMountedTires,
      totalWarehouseTires: warehouseTires.length,
      r0Count,
      retreadCount,
      averagePhysicalPercent,
    } as InventoryMetrics,
  };
}
