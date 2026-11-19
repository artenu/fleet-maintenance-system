// src/hooks/tireManagement/useWarehouseTires.ts
import { useState } from "react";
import { mockWarehouseTires } from "@/data/mockTires";
import type { TireAsset } from "@/types/TireManagement/tires";

interface UseWarehouseTiresProps {
  addToast?: (
    type: "success" | "warning" | "info",
    title: string,
    description?: string,
  ) => void;
  onLogActivity?: (
    truck: string,
    desc: string,
    type: "ROTASI_GANDAR" | "GANTI_BARU" | "VULKANISIR" | "AFKIR",
  ) => void;
}

export function useWarehouseTires({
  addToast,
  onLogActivity,
}: UseWarehouseTiresProps = {}) {
  // 1. State Stok Ban Gudang Pool
  const [warehouseTires, setWarehouseTires] =
    useState<TireAsset[]>(mockWarehouseTires);

  // 2. Aksi Penerimaan Ban Baru / Hasil Vulkanisir ke Gudang
  const handleConfirmReceiveTire = (newTire: TireAsset) => {
    setWarehouseTires((prev) => {
      return [newTire, ...prev];
    });

    if (addToast) {
      addToast(
        "success",
        `Ban ${newTire.serialNumber} Berhasil Masuk Gudang!`,
        `Merk: ${newTire.brand}, Status: ${newTire.retreadStatus}, Tapak: ${newTire.treadDepthMm || 14} mm.`,
      );
    }

    if (onLogActivity) {
      const isNew = newTire.retreadStatus === "R0";
      onLogActivity(
        "GUDANG POOL",
        `Penerimaan ban ${newTire.serialNumber} (${newTire.brand} ${newTire.retreadStatus}) ke stok gudang pool.`,
        isNew ? "GANTI_BARU" : "VULKANISIR",
      );
    }
  };

  return {
    warehouseTires,
    setWarehouseTires,
    handleConfirmReceiveTire,
  };
}
