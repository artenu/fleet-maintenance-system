// src/components/digitalTwin/inspection/InspectionIdentitySection.tsx
import { Sparkles } from "lucide-react";
import { FormInput, Select } from "@/components/forms";
import {
  STANDARD_BRANDS,
  INSPECTION_RETREAD_STATUS_OPTIONS,
} from "@/constants/digitalTwin";
import type { RetreadStatus } from "@/types/TireManagement/tires";
import type { InspectionIdentitySectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Bagian 1: Identitas Aset Ban & Casing Vulkanisir
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
  isSteer,
}: InspectionIdentitySectionProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-3.5 space-y-3 bg-slate-50/40">
      <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles size={14} className="text-red-600" />
        1. Verifikasi Identitas Aset Ban (Cegah Penukaran Liar)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          options={INSPECTION_RETREAD_STATUS_OPTIONS}
          helperText={
            isSteer
              ? "Steer diizinkan R0 atau R1"
              : "Maksimal 3x Vulkanisir (R3)"
          }
          required
        />
      </div>
    </div>
  );
}
