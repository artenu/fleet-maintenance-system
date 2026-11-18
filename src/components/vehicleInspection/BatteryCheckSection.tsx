// src/components/vehicleInspection/BatteryCheckSection.tsx
import {
  Zap,
  Lock,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, Badge, Checkbox } from "@/components/common";
import { FormInput } from "@/components/forms";
import { COMPONENT_CONDITION_OPTIONS } from "@/constants/vehicleInspection";
import type {
  BatteryCheckData,
  ComponentConditionStatus,
} from "@/types/vehicleInspection";

interface BatteryCheckSectionProps {
  battery: BatteryCheckData;
  onChangeBattery: (patch: Partial<BatteryCheckData>) => void;
}

export default function BatteryCheckSection({
  battery,
  onChangeBattery,
}: BatteryCheckSectionProps) {
  const isBattery1Good = battery.battery1.condition === "B";
  const isBattery2Good = battery.battery2.condition === "B";
  const isSecure = battery.caseLockedWithChain;

  return (
    <Card className="space-y-4">
      {/* Title & Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500 text-white shadow-xs">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Seksi 3: Pemeriksaan Aki Unit (Sistem 24V • 2 Aki Seri)
            </h3>
            <p className="text-[11px] text-slate-500">
              Pengecekan Serial Number Aset, Voltase/Kondisi, dan Pengamanan
              Rantai Gembok
            </p>
          </div>
        </div>

        {/* Status Indikator Aki */}
        <div className="flex items-center gap-2">
          {isBattery1Good && isBattery2Good && isSecure ? (
            <Badge variant="success" className="text-xs py-1 px-2.5">
              <CheckCircle2 size={12} className="mr-1" />
              Sistem Aki Aman
            </Badge>
          ) : (
            <Badge variant="danger" className="text-xs py-1 px-2.5">
              <AlertTriangle size={12} className="mr-1" />
              Perlu Perhatian Mekanik
            </Badge>
          )}
        </div>
      </div>

      {/* Grid 2 Aki (Aki 1 & Aki 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aki 1 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isBattery1Good
              ? "bg-white border-slate-200"
              : "bg-rose-50/50 border-rose-200"
          }`}>
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              Aki 1 (Kutub Positif Utama / Depan)
            </span>
            <Badge
              variant={isBattery1Good ? "success" : "danger"}
              className="text-[10px]">
              {battery.battery1.condition === "B" ? "Normal" : "Ada Kendala"}
            </Badge>
          </div>

          <div className="space-y-3">
            <FormInput
              label="Merk Aki 1"
              value={battery.battery1.brand}
              onChange={(e) =>
                onChangeBattery({
                  battery1: { ...battery.battery1, brand: e.target.value },
                })
              }
              placeholder="cth: GS Astra Hybrid / Yuasa"
            />

            <FormInput
              label="Nomor Seri / Barcode Aki 1"
              value={battery.battery1.serialNumber}
              onChange={(e) =>
                onChangeBattery({
                  battery1: {
                    ...battery.battery1,
                    serialNumber: e.target.value,
                  },
                })
              }
              placeholder="cth: GS-2024-08991 (Anti-Tukar)"
            />

            {/* Status Button Group */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Kondisi Fisik Aki 1
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {COMPONENT_CONDITION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      onChangeBattery({
                        battery1: {
                          ...battery.battery1,
                          condition: opt.value as ComponentConditionStatus,
                        },
                      })
                    }
                    className={`py-1.5 px-1 text-center rounded-lg text-[11px] font-bold transition-all ${
                      battery.battery1.condition === opt.value
                        ? opt.value === "B"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : opt.value === "RM"
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-rose-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}>
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>

            <FormInput
              label="Catatan Aki 1"
              value={battery.battery1.notes}
              onChange={(e) =>
                onChangeBattery({
                  battery1: { ...battery.battery1, notes: e.target.value },
                })
              }
              placeholder="cth: Kepala kutub bersih, air aki pas"
            />
          </div>
        </div>

        {/* Aki 2 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isBattery2Good
              ? "bg-white border-slate-200"
              : "bg-rose-50/50 border-rose-200"
          }`}>
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              Aki 2 (Kutub Seri / Belakang)
            </span>
            <Badge
              variant={isBattery2Good ? "success" : "danger"}
              className="text-[10px]">
              {battery.battery2.condition === "B" ? "Normal" : "Ada Kendala"}
            </Badge>
          </div>

          <div className="space-y-3">
            <FormInput
              label="Merk Aki 2"
              value={battery.battery2.brand}
              onChange={(e) =>
                onChangeBattery({
                  battery2: { ...battery.battery2, brand: e.target.value },
                })
              }
              placeholder="cth: GS Astra Hybrid / Yuasa"
            />

            <FormInput
              label="Nomor Seri / Barcode Aki 2"
              value={battery.battery2.serialNumber}
              onChange={(e) =>
                onChangeBattery({
                  battery2: {
                    ...battery.battery2,
                    serialNumber: e.target.value,
                  },
                })
              }
              placeholder="cth: GS-2024-08992 (Anti-Tukar)"
            />

            {/* Status Button Group */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Kondisi Fisik Aki 2
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {COMPONENT_CONDITION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      onChangeBattery({
                        battery2: {
                          ...battery.battery2,
                          condition: opt.value as ComponentConditionStatus,
                        },
                      })
                    }
                    className={`py-1.5 px-1 text-center rounded-lg text-[11px] font-bold transition-all ${
                      battery.battery2.condition === opt.value
                        ? opt.value === "B"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : opt.value === "RM"
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-rose-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}>
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>

            <FormInput
              label="Catatan Aki 2"
              value={battery.battery2.notes}
              onChange={(e) =>
                onChangeBattery({
                  battery2: { ...battery.battery2, notes: e.target.value },
                })
              }
              placeholder="cth: Baut klem kencang, tidak berkerak"
            />
          </div>
        </div>
      </div>

      {/* Bagian Keamanan: Rantai & Gembok Kotak Aki */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          battery.caseLockedWithChain
            ? "bg-emerald-50/50 border-emerald-200"
            : "bg-rose-50 border-rose-300"
        }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`grid h-9 w-9 place-items-center rounded-xl ${
                battery.caseLockedWithChain
                  ? "bg-emerald-600 text-white"
                  : "bg-rose-600 text-white"
              }`}>
              {battery.caseLockedWithChain ? (
                <ShieldCheck size={20} />
              ) : (
                <Lock size={20} />
              )}
            </div>
            <div>
              <Checkbox
                label="Kotak Aki Tergembok & Dirantai Rapat Sesuai SOP"
                subLabel="Wajib dikunci rapat sebelum unit diberangkatkan untuk mencegah insiden kehilangan aki di jalan"
                checked={battery.caseLockedWithChain}
                onChange={(checked: boolean) =>
                  onChangeBattery({ caseLockedWithChain: checked })
                }
              />
            </div>
          </div>

          <Badge
            variant={battery.caseLockedWithChain ? "success" : "danger"}
            className="text-xs">
            {battery.caseLockedWithChain ? "Terkunci & Aman" : "BELUM DIGEMBOK"}
          </Badge>
        </div>

        {!battery.caseLockedWithChain && (
          <div className="mt-3 flex items-start gap-2 text-xs text-rose-700 bg-rose-100/60 p-2.5 rounded-lg border border-rose-200">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span>
              <strong>PERINGATAN SOP POOL:</strong> Unit dilarang keluar
              pool/depo jika kotak aki belum dipasangi rantai gembok standar PT
              ALN!
            </span>
          </div>
        )}
      </div>

      {/* Catatan Keseluruhan Sistem Kelistrikan */}
      <FormInput
        label="Catatan Tambahan Sistem Aki / Kelistrikan"
        value={battery.notes}
        onChange={(e) => onChangeBattery({ notes: e.target.value })}
        placeholder="cth: Kabel grounding sudah diganti baru, voltase alternator normal"
      />
    </Card>
  );
}
