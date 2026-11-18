// src/components/addNewTruck/PendingTrucksBanner.tsx
import { BellRing } from "lucide-react";
import { Badge } from "@/components/common";
import type { PendingTrucksBannerProps } from "@/types/AddNewTruckView/AddNewTruckViewTypes";

/**
 * Banner notifikasi unit truk baru dari sistem pengadaan pusat
 */
export default function PendingTrucksBanner({
  pendingNewTrucks,
}: PendingTrucksBannerProps) {
  if (pendingNewTrucks.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-blue-950 shadow-2xs">
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
          <BellRing size={16} className="animate-bounce" />
        </div>
        <div>
          <p className="text-xs font-bold text-blue-900">
            Terdeteksi {pendingNewTrucks.length} Unit Truk Baru dari Database Pusat!
          </p>
          <p className="text-[11px] text-blue-700 mt-0.5">
            Unit{" "}
            {pendingNewTrucks
              .map((t) => `${t.plateNumber} (${t.brand})`)
              .join(", ")}{" "}
            terdaftar di pengadaan. Pilih unit di bawah untuk melengkapi kondisi
            bannya.
          </p>
        </div>
      </div>
      <Badge variant="info">{pendingNewTrucks.length} Butuh Ban</Badge>
    </div>
  );
}

