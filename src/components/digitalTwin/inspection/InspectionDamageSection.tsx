// src/components/digitalTwin/inspection/InspectionDamageSection.tsx
import { Wrench, AlertTriangle, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/common";
import { Checkbox, NumberInput } from "@/components/forms";
import {
  VISUAL_DAMAGE_OPTIONS,
  INSPECTION_THRESHOLDS,
} from "@/constants/digitalTwin";
import type { RetreadCycleKey } from "@/types/TireManagement/tires";
import type { InspectionDamageSectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

const RETREAD_CYCLE_LABELS: Array<{ key: RetreadCycleKey; label: string }> = [
  { key: "R0", label: "Baru (R0)" },
  { key: "R1", label: "Retread ke-1 (R1)" },
  { key: "R2", label: "Retread ke-2 (R2)" },
  { key: "R3", label: "Retread ke-3 (R3)" },
];

/**
 * Bagian 3: Checklist Temuan Kerusakan Visual & Riwayat Tambal / Bocor Ban per Siklus Retread
 */
export default function InspectionDamageSection({
  visualDamages,
  onToggleDamage,
  punctureByCycle,
  currentRetreadStatus,
  onChangePunctureForCycle,
  totalPunctures,
}: InspectionDamageSectionProps) {
  const maxPuncture = INSPECTION_THRESHOLDS.MAX_PUNCTURE_BEFORE_AFKIR;
  const isOverLimit = totalPunctures >= maxPuncture;
  const isNearLimit = totalPunctures === maxPuncture - 1;

  return (
    <div className="space-y-4">
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

      {/* Pencatatan Jumlah Tambalan / Bocor Ban dari Baru (R0) hingga Retread ke-3 (R3) */}
      <div
        className={`rounded-xl border p-3.5 space-y-3 ${
          isOverLimit
            ? "border-rose-300 bg-rose-50/60"
            : isNearLimit
              ? "border-amber-300 bg-amber-50/50"
              : "border-slate-200 bg-slate-50/40"
        }`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Wrench
              size={14}
              className={isOverLimit ? "text-rose-600" : "text-slate-600"}
            />
            <span className="font-black text-slate-800 text-xs uppercase tracking-wider">
              Riwayat Jumlah Tambal / Bocor Selama Pemakaian
            </span>
          </div>

          <Badge
            variant={
              isOverLimit ? "danger" : isNearLimit ? "warning" : "neutral"
            }
            className="text-[10px] font-black">
            Total: {totalPunctures}x / Maks {maxPuncture}x{" "}
            {isOverLimit
              ? "(Wajib Afkir • Stop Retread)"
              : isNearLimit
                ? "(Sisa 1x Batas Aman)"
                : "(Aman)"}
          </Badge>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          Perbarui jumlah kebocoran/tambalan setiap kali inspeksi dari masa ban
          baru hingga retread ke-1, ke-2, dan ke-3. Jika total mencapai{" "}
          <strong>3x bocor</strong>, ban{" "}
          <strong className="text-rose-700">
            tidak dapat di-retread dan wajib diafkirkan
          </strong>
          .
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {RETREAD_CYCLE_LABELS.map(({ key, label }) => {
            const isCurrentCycle = currentRetreadStatus === key;
            const value = punctureByCycle[key] || 0;

            return (
              <div
                key={key}
                className={`rounded-xl border p-2.5 bg-white space-y-1.5 ${
                  isCurrentCycle
                    ? "border-blue-400 ring-1 ring-blue-300/60"
                    : "border-slate-200"
                }`}>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-bold text-slate-800">
                    {label}
                  </span>
                  {isCurrentCycle && (
                    <Badge variant="info" className="text-[8px] py-0 px-1">
                      Aktif
                    </Badge>
                  )}
                </div>

                <NumberInput
                  min={0}
                  max={20}
                  value={value}
                  onChange={(val) => onChangePunctureForCycle(key, val)}
                  suffixText="kali"
                  className="py-1 text-xs"
                />
              </div>
            );
          })}
        </div>

        {isOverLimit && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-300 bg-white p-2.5 text-[11px] text-rose-900 font-bold">
            <ShieldAlert size={15} className="text-rose-600 shrink-0 mt-0.5" />
            <span>
              Total tambalan sudah {totalPunctures}x (&ge; 3x bocor). Ban tidak
              memenuhi syarat untuk retread lanjutan dan wajib di-AFKIRKAN!
            </span>
          </div>
        )}

        {isNearLimit && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-white p-2.5 text-[11px] text-amber-900 font-bold">
            <AlertTriangle
              size={15}
              className="text-amber-600 shrink-0 mt-0.5"
            />
            <span>
              Ban sudah 2x bocor/tambal. Pastikan pengecekan kebocoran halus
              agar terpantau sebelum melewati batas 3x afkir.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

