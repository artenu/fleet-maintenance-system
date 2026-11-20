// src/components/vehicleInspection/physicalCheck/PhysicalCheckItemRow.tsx
import { Badge } from "@/components/common";
import { FormInput } from "@/components/forms";
import { COMPONENT_CONDITION_OPTIONS } from "@/constants/vehicleInspection";
import CheckmarkToggle from "../CheckMarkToggle";
import StatusPillGroup from "../StatusPillGroup";
import type { PhysicalCheckItemRowProps } from "@/types/VehicleInspection/physicalCheckTypes";
/**
 * Sub-komponen baris item checklist komponen fisik tunggal
 */
export default function PhysicalCheckItemRow({
  item,
  index,
  onUpdateStatus,
  onUpdateNotes,
}: PhysicalCheckItemRowProps) {
  const isGood = item.status === "B";

  return (
    <div
      className={`p-2.5 px-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 transition-colors ${
        isGood ? "hover:bg-slate-50/80" : "bg-rose-50/40"
      }`}>
      {/* 1. Toggle Cepat & Nama Komponen */}
      <div className="flex items-center gap-2.5 min-w-[280px]">
        <CheckmarkToggle
          isGood={isGood}
          statusLabel={item.status}
          onToggle={() => {
            onUpdateStatus(item.id, isGood ? "RM" : "B");
          }}
        />

        <div className="leading-tight">
          <span className="text-xs font-bold text-slate-800">
            {index + 1}. {item.name}
          </span>
          <Badge variant="neutral" className="text-[9px] py-0 px-1 ml-1.5">
            {item.section}
          </Badge>
        </div>
      </div>

      {/* 2. Pilihan Status Kondisi & Catatan Segaris */}
      <div className="flex flex-1 items-center gap-2 min-w-0">
        <StatusPillGroup
          options={COMPONENT_CONDITION_OPTIONS}
          activeValue={item.status}
          onChange={(val) => {
            onUpdateStatus(item.id, val);
          }}
        />

        <div className="flex-1 min-w-[150px]">
          <FormInput
            value={item.notes || ""}
            onChange={(e) => {
              onUpdateNotes(item.id, e.target.value);
            }}
            placeholder="Catatan temuan (opsional)..."
            className="py-1 px-2.5 text-xs rounded-lg font-medium"
          />
        </div>
      </div>
    </div>
  );
}
