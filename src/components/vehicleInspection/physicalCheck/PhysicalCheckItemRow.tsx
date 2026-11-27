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
      className={`p-2.5 px-3 grid grid-cols-1 md:grid-cols-12 gap-3 md:items-center transition-colors ${
        isGood ? "hover:bg-slate-50/80" : "bg-rose-50/40"
      }`}>
      {/* 1. Toggle Cepat & Nama Komponen */}
      <div className="md:col-span-5 flex items-center gap-2.5 min-w-0">
        <CheckmarkToggle
          isGood={isGood}
          statusLabel={item.status}
          onToggle={() => {
            onUpdateStatus(item.id, isGood ? "RM" : "B");
          }}
        />

        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-bold text-slate-800 truncate">
            {index + 1}. {item.name}
          </span>
          <Badge variant="neutral" className="text-[9px] py-0 px-1 shrink-0">
            {item.section}
          </Badge>
        </div>
      </div>

      {/* 2. Pilihan Status Kondisi (Sejajar Kolom Tengah) */}
      <div className="md:col-span-3 flex justify-start md:justify-center">
        <StatusPillGroup
          options={COMPONENT_CONDITION_OPTIONS}
          activeValue={item.status}
          onChange={(val) => {
            onUpdateStatus(item.id, val);
          }}
        />
      </div>

      {/* 3. Catatan Temuan Segaris (Sejajar Kolom Kanan) */}
      <div className="md:col-span-4">
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
  );
}
