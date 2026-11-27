// src/components/digitalTwin/inspection/InspectionIdentitySection.tsx
import { Sparkles } from "lucide-react";
import { FormInput, Select, DateInput } from "@/components/forms";
import {
  STANDARD_BRANDS,
  INSPECTION_RETREAD_STATUS_OPTIONS,
} from "@/constants/digitalTwin";
import type { RetreadStatus } from "@/types/TireManagement/tires";
import type { InspectionIdentitySectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Bagian 1: Identitas Aset Ban, Casing Vulkanisir & Tanggal Inspeksi
 */
export default function InspectionIdentitySection({
  serialNumber,
  onChangeSerialNumber,
  brand,
  onChangeBrand,
  customBrand,
  onChangeCustomBrand,
  retreadStatus,
  onChangeRetreadStatus,
  inspectionDate,
  onChangeInspectionDate,
  isSteer,
  isAfkirMandatory = false,
  totalPunctures = 0,
}: InspectionIdentitySectionProps) {
  const retreadOptions = INSPECTION_RETREAD_STATUS_OPTIONS.map((opt) => {
    const isRetreadOption =
      opt.value === "R1" || opt.value === "R2" || opt.value === "R3";
    return {
      ...opt,
      disabled: Boolean(isAfkirMandatory && isRetreadOption),
      label:
        isAfkirMandatory && isRetreadOption
          ? `${opt.label} (Terkunci: ≥3x Bocor)`
          : opt.label,
    };
  });

  return (
    <div className="rounded-xl border border-slate-200 p-3.5 space-y-3 bg-slate-50/40">
      <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles size={14} className="text-red-600" />
        1. Verifikasi Identitas Aset Ban (Cegah Penukaran Liar)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <FormInput
          label="Nomor Seri Ban (DOT / Serial)"
          placeholder="Contoh: BS-991204"
          value={serialNumber}
          onChange={(e) => onChangeSerialNumber(e.target.value.toUpperCase())}
          helperText="Cek fisik nomor pada dinding ban"
          required
        />

        <div>
          <Select
            label="Merk Ban"
            value={brand}
            onChange={(e) => onChangeBrand(e.target.value)}
            options={STANDARD_BRANDS.map((b) => ({ value: b, label: b }))}
            required
          />
          {brand === "Lainnya" && (
            <FormInput
              placeholder="Ketik merk ban..."
              value={customBrand}
              onChange={(e) => onChangeCustomBrand(e.target.value)}
              className="mt-1"
            />
          )}
        </div>

        <Select
          label="Status Casing (Vulkanisir)"
          value={retreadStatus}
          onChange={(e) =>
            onChangeRetreadStatus(e.target.value as RetreadStatus)
          }
          options={retreadOptions}
          error={
            isAfkirMandatory && retreadStatus !== "AFKIR"
              ? `Sudah ${totalPunctures}x bocor — tidak bisa retread, wajib status AFKIR!`
              : undefined
          }
          helperText={
            isAfkirMandatory
              ? "Terkunci: ban ≥3x bocor tidak dapat di-retread (wajib AFKIR)"
              : isSteer
                ? "Steer diizinkan R0 atau R1 (R1 memicu peringatan)"
                : "Maksimal 3x Vulkanisir (R3)"
          }
          required
        />

        <DateInput
          label="Tanggal Inspeksi Unit Ban"
          value={inspectionDate}
          onChange={(e) => onChangeInspectionDate(e.target.value)}
          helperText="Tercatat pada kartu Digital Twin"
          required
        />
      </div>
    </div>
  );
}
