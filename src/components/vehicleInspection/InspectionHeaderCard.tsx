// src/components/vehicleInspection/InspectionHeaderCard.tsx
import { Truck, UserCheck, Database } from "lucide-react";
import { Card, Badge } from "@/components/common";
import { FormInput, NumberInput, Select, DateInput } from "@/components/forms";
import { DEFAULT_INSPECTION_LOCATIONS } from "@/constants/vehicleInspection";
import type { VehicleInspectionHeader } from "@/types/VehicleInspection";
import type { ChassisType } from "@/types/TireManagement/tires";

interface InspectionHeaderCardProps {
  header: VehicleInspectionHeader;
  truckOptions: Array<{ value: string; label: string; subLabel?: string }>;
  onSelectTruck: (unitCode: string) => void;
  onChangeHeader: (patch: Partial<VehicleInspectionHeader>) => void;
}

export default function InspectionHeaderCard({
  header,
  truckOptions,
  onSelectTruck,
  onChangeHeader,
}: InspectionHeaderCardProps) {
  return (
    <Card className="space-y-4">
      {/* Title Bar & PIC Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
            <Truck size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Formulir Pengecekan Fisik Unit Truk & Sasis
            </h3>
            <p className="text-[11px] text-slate-500">
              Pilar 3: Standar Operasional Prosedur Pre-Trip Walkaround PT ALN
            </p>
          </div>
        </div>

        {/* Badge Gabungan Mekanik = Surveyor */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs text-emerald-900 shadow-2xs">
          <UserCheck size={14} className="text-emerald-600 shrink-0" />
          <span>
            Petugas Pemeriksa: <strong>{header.inspectorName}</strong> (
            {header.inspectorNik})
          </span>
          <Badge variant="success" className="text-[9px]">
            Mekanik & Surveyor
          </Badge>
        </div>
      </div>

      {/* Grid Formulir Identitas Truk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* 1. Pilih Unit Truk (Dropdown Database) */}
        <div className="sm:col-span-2">
          <Select
            label="Pilih Unit Truk (Database Armada)"
            icon={Database}
            value={header.unitCode}
            onChange={(e) => onSelectTruck(e.target.value)}
            options={truckOptions}
            helperText="Auto-detect data unit, sasis aktif, dan supir batangan dari database"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Select
            label="Lokasi Pool / Depo Pengecekan"
            value={header.location}
            onChange={(e) => onChangeHeader({ location: e.target.value })}
            options={DEFAULT_INSPECTION_LOCATIONS.map((loc) => ({
              value: loc,
              label: loc,
            }))}
            required
          />
        </div>

        {/* 3. Nomor Lambung (Auto - Disabled) */}
        <FormInput
          label="Nomor Lambung (Kode Head)"
          value={header.unitCode}
          disabled
          helperText="Auto-fill dari database"
        />

        {/* 4. Kode Sasis Trailer (Auto - Disabled) */}
        <FormInput
          label="Kode Sasis Trailer (Aktif)"
          value={header.chassisCode}
          disabled
          helperText="Sinkron dari perangkaian sasis"
        />

        {/* 5. Panjang Sasis (BISA DIUBAH / TIDAK DISABLED) */}
        <Select
          label="Panjang Sasis"
          value={header.chassisLengthCategory}
          onChange={(e) =>
            onChangeHeader({
              chassisLengthCategory: e.target.value as "20FT" | "40FT",
            })
          }
          options={[
            { value: "40FT", label: "40 FT (Sasis Panjang Standar)" },
            { value: "20FT", label: "20 FT (Sasis Pendek Engkel)" },
          ]}
          disabled
        />

        {/* 6. Konfigurasi Gandar Sasis (BISA DIUBAH / TIDAK DISABLED) */}
        <Select
          label="Konfigurasi Gandar"
          value={header.chassisType}
          onChange={(e) =>
            onChangeHeader({ chassisType: e.target.value as ChassisType })
          }
          options={[
            { value: "3_AXLE", label: "3 Sumbu • 18 Ban (Standar 40ft)" },
            {
              value: "2_AXLE",
              label: "2 Sumbu • 14 Ban (Standar 20ft / Edge Case)",
            },
          ]}
          disabled
        />

        {/* 7. Odometer Aktual */}
        <NumberInput
          label="Odometer Fisik Aktual (KM)"
          value={header.odometer}
          onChange={(val) => onChangeHeader({ odometer: val })}
          placeholder="KM Dashboard Truk"
          disabled
        />

        {/* 8. Nama Pengemudi (Auto dari Supir Batangan) */}
        <FormInput
          label="Nama Pengemudi (Supir)"
          value={header.driverName}
          onChange={(e) => onChangeHeader({ driverName: e.target.value })}
          placeholder="Nama Supir"
          disabled
        />

        {/* 9. Petugas Mekanik / Surveyor (Auto-Auth & Disabled) */}
        <FormInput
          label="Petugas Pemeriksa (Mekanik = Surveyor)"
          value={`${header.inspectorName} (${header.inspectorNik})`}
          disabled
          helperText="Role gabungan: Mekanik merangkap Surveyor"
        />

        {/* 10. Tanggal Pemeriksaan */}
        <DateInput
          label="Tanggal Pemeriksaan"
          value={header.inspectionDate}
          onChange={(e) => onChangeHeader({ inspectionDate: e.target.value })}
          disabled
        />
      </div>
    </Card>
  );
}
