// src/components/digitalTwin/inspection/InspectionMeasurementsSection.tsx
import { Gauge } from "lucide-react";
import { NumberInput, RangeInput } from "@/components/forms";
import type { InspectionMeasurementsSectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Bagian 2: Parameter Pengukuran Fisik (Odometer, PSI, Tapak mm, Slider %)
 */
export default function InspectionMeasurementsSection({
  odometer,
  onChangeOdometer,
  pressurePsi,
  onChangePressurePsi,
  treadDepthMm,
  onChangeTreadDepthMm,
  physicalPercent,
  onChangePhysicalPercent,
}: InspectionMeasurementsSectionProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-3.5 space-y-3 bg-slate-50/40">
      <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
        <Gauge size={14} className="text-red-600" />
        2. Parameter Pengukuran Fisik Roda
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <NumberInput
          label="Odometer Truk (KM)"
          value={odometer}
          onChange={onChangeOdometer}
          helperText="KM Aktual di Speedometer"
          required
        />

        <NumberInput
          label="Tekanan Angin (PSI)"
          value={pressurePsi}
          onChange={onChangePressurePsi}
          helperText="Standar Ban Truk: 110 - 120 PSI"
          required
        />

        <NumberInput
          label="Kedalaman Alur (mm)"
          value={treadDepthMm}
          onChange={(val) => {
            onChangeTreadDepthMm(val);
            onChangePhysicalPercent(Math.min(100, Math.round((val / 15) * 100)));
          }}
          allowDecimals
          helperText="Gauge: <4.0 mm butuh penggantian"
          required
        />
      </div>

      {/* Slider Persentase Kondisi Fisik */}
      <RangeInput
        label="Kondisi Fisik Tapak:"
        min={10}
        max={100}
        value={physicalPercent}
        valueDisplay={
          <strong className="text-red-600 font-extrabold text-sm">
            {physicalPercent}% (
            {physicalPercent >= 70
              ? "Prima"
              : physicalPercent >= 40
                ? "Perhatian"
                : "Kritis"}
            )
          </strong>
        }
        onChange={(val) => {
          onChangePhysicalPercent(val);
          onChangeTreadDepthMm(Number(((val / 15) * 10).toFixed(1)));
        }}
        className="pt-1"
      />
    </div>
  );
}

