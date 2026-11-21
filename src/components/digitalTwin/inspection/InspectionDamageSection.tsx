// src/components/digitalTwin/inspection/InspectionDamageSection.tsx
import { Checkbox } from "@/components/forms";
import { VISUAL_DAMAGE_OPTIONS } from "@/constants/digitalTwin";
import type { InspectionDamageSectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Bagian 3: Checklist Temuan Kerusakan & Kelainan Fisik Lapangan
 */
export default function InspectionDamageSection({
  visualDamages,
  onToggleDamage,
}: InspectionDamageSectionProps) {
  return (
    <div>
      <label className="block font-bold text-slate-700 text-xs mb-1.5">
        Checklist Temuan Kerusakan & Kelainan Fisik (Surveyor):
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {VISUAL_DAMAGE_OPTIONS.map((damage) => {
          const isChecked = visualDamages.includes(damage);
          return (
            <div
              key={damage}
              className={`rounded-xl border px-3 py-2 transition ${
                isChecked
                  ? "border-rose-400 bg-rose-50/70 shadow-2xs"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}>
              <Checkbox
                checked={isChecked}
                onChange={() => onToggleDamage(damage)}
                label={
                  <span
                    className={`text-[11px] truncate block ${
                      isChecked
                        ? "font-bold text-rose-900"
                        : "font-semibold text-slate-700"
                    }`}>
                    {damage}
                  </span>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

