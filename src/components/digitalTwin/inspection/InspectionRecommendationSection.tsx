// src/components/digitalTwin/inspection/InspectionRecommendationSection.tsx
import { UserCheck } from "lucide-react";
import { Select, TextArea } from "@/components/forms";
import { mockCurrentSurveyor } from "@/types/auth/auth";
import { INSPECTION_RECOMMENDATION_OPTIONS } from "@/constants/digitalTwin";
import type { ActionRecommendation } from "@/types/truck/tires";
import type { InspectionRecommendationSectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Bagian 5: Rekomendasi Tindakan Lapangan, Surveyor PIC, dan Catatan
 */
export default function InspectionRecommendationSection({
  actionRecommendation,
  onChangeActionRecommendation,
  notes,
  onChangeNotes,
}: InspectionRecommendationSectionProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Rekomendasi Tindakan Lapangan:"
          value={actionRecommendation}
          onChange={(e) =>
            onChangeActionRecommendation(e.target.value as ActionRecommendation)
          }
          options={INSPECTION_RECOMMENDATION_OPTIONS}
          required
        />

        <div>
          <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>Surveyor PIC Lapangan:</span>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <UserCheck size={12} /> Terverifikasi Otomatis
            </span>
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-red-600 text-white font-black text-[11px] shrink-0">
              {mockCurrentSurveyor.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 truncate">
                {mockCurrentSurveyor.name}
              </p>
              <p className="text-[10px] text-slate-500">
                NIK: {mockCurrentSurveyor.nik} •{" "}
                {mockCurrentSurveyor.poolLocation}
              </p>
            </div>
          </div>
        </div>
      </div>

      <TextArea
        label="Catatan Tambahan Temuan Lapangan"
        placeholder="Contoh: Keausan alur lebih berat di sisi luar, cek spooring"
        rows={2}
        value={notes}
        onChange={(e) => onChangeNotes(e.target.value)}
      />
    </div>
  );
}

