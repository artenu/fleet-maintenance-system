// src/components/vehicleInspection/batteryCheck/BatteryItemCard.tsx
import { Zap } from "lucide-react";
import { Badge } from "@/components/common";
import { FormInput } from "@/components/forms";
import {
  COMPONENT_CONDITION_OPTIONS,
  getBatteryConditionColor,
} from "@/constants/vehicleInspection";
import type {
  BatteryCheckData,
  ComponentConditionStatus,
} from "@/types/VehicleInspection";

export type SingleBatteryData = BatteryCheckData["battery1"];

export interface BatteryItemCardProps {
  batteryKey: "battery1" | "battery2";
  title: string;
  slotLabel: string;
  data: SingleBatteryData;
  serialPlaceholder: string;
  notesPlaceholder: string;
  onChange: (
    key: "battery1" | "battery2",
    patch: Partial<SingleBatteryData>,
  ) => void;
}

/**
 * Sub-komponen formulir pengecekan individual unit aki (Aki 1 / Aki 2)
 */
export default function BatteryItemCard({
  batteryKey,
  title,
  slotLabel,
  data,
  serialPlaceholder,
  notesPlaceholder,
  onChange,
}: BatteryItemCardProps) {
  const isGood = data.condition === "B";

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isGood
          ? "bg-white border-slate-200"
          : "bg-rose-50/50 border-rose-200"
      }`}>
      {/* Header Kartu Aki */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Zap size={14} className="text-amber-500" />
          {title}
        </span>
        <Badge
          variant={isGood ? "success" : "danger"}
          className="text-[10px]">
          {isGood ? "Normal" : "Ada Kendala"}
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Input Merk */}
        <FormInput
          label={`Merk ${slotLabel}`}
          value={data.brand}
          onChange={(e) => {
            onChange(batteryKey, { brand: e.target.value });
          }}
          placeholder="cth: GS Astra Hybrid / Yuasa"
        />

        {/* Input Nomor Seri / Barcode Anti-Tukar */}
        <FormInput
          label={`Nomor Seri / Barcode ${slotLabel}`}
          value={data.serialNumber}
          onChange={(e) => {
            onChange(batteryKey, { serialNumber: e.target.value });
          }}
          placeholder={serialPlaceholder}
        />

        {/* Tombol Opsi Kondisi Fisik */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
            Kondisi Fisik {slotLabel}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {COMPONENT_CONDITION_OPTIONS.map((opt) => {
              const isSelected = data.condition === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(batteryKey, {
                      condition: opt.value as ComponentConditionStatus,
                    });
                  }}
                  className={`py-1.5 px-1 text-center rounded-lg text-[11px] font-bold transition-all ${
                    isSelected
                      ? getBatteryConditionColor(
                          opt.value as ComponentConditionStatus,
                        )
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}>
                  {opt.value}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Catatan Spesifik Aki */}
        <FormInput
          label={`Catatan ${slotLabel}`}
          value={data.notes}
          onChange={(e) => {
            onChange(batteryKey, { notes: e.target.value });
          }}
          placeholder={notesPlaceholder}
        />
      </div>
    </div>
  );
}
