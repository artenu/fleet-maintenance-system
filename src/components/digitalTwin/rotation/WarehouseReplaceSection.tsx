// src/components/digitalTwin/rotation/WarehouseReplaceSection.tsx
import { Select } from "@/components/forms";
import { Button } from "@/components/common";
import { SOURCE_DESTINATION_OPTIONS } from "@/constants/digitalTwin";
import type { WarehouseReplaceSectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Seksi form untuk Mode 2: Ganti Ban dari Gudang (Replace from Warehouse)
 */
export default function WarehouseReplaceSection({
  sourcePosition,
  sourceTireSerialNumber,
  warehouseTireId,
  onChangeWarehouseTireId,
  warehouseTireOptions,
  sourceDestination,
  onChangeSourceDestination,
}: WarehouseReplaceSectionProps) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-3">
      <Select
        label={`Pilih Ban dari Gudang (Untuk Dipasang ke ${sourcePosition}):`}
        value={warehouseTireId}
        onChange={(e) => onChangeWarehouseTireId(e.target.value)}
        options={warehouseTireOptions}
        required
      />

      <div>
        <label className="block font-bold text-slate-800 text-xs mb-1.5">
          Tujuan Ban Lama ({sourceTireSerialNumber}):
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SOURCE_DESTINATION_OPTIONS.map((item) => {
            const isSelected = sourceDestination === item.id;
            return (
              <Button
                key={item.id}
                type="button"
                variant={isSelected ? "primary" : "outline"}
                size="sm"
                onClick={() => onChangeSourceDestination(item.id)}
                className="w-full">
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

