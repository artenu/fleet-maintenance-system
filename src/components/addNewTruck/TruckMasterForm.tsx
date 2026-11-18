// src/components/addNewTruck/TruckMasterForm.tsx
import { PlusCircle, UserCheck } from "lucide-react";
import { PageHeader, Grid } from "@/components/layout";
import { Badge, Card } from "@/components/common";
import { FormInput, NumberInput, DateInput, Select } from "@/components/forms";
import { mockCurrentSurveyor } from "@/types/auth/auth";
import type { ChassisType } from "@/types/truck/tires";
import { CHASSIS_CONFIG_OPTIONS } from "@/constants/truck";
import type { TruckMasterFormProps } from "@/types/AddNewTruckView/AddNewTruckViewTypes";

/**
 * Kartu data master identitas truk & sasis (Grid 3x3 simetris)
 */
export default function TruckMasterForm({
  plateOptions,
  plateNumber,
  onSelectPlateNumber,
  unitCode,
  truckBrand,
  chassisCode,
  chassisType,
  onChangeChassisType,
  driverName,
  odometer,
  inspectionDate,
  onChangeInspectionDate,
}: TruckMasterFormProps) {
  return (
    <Card className="space-y-5">
      <PageHeader
        icon={PlusCircle}
        iconBgColor="bg-red-600 shadow-red-500/20"
        title="Update Kondisi Ban & Cek Fisik Roda"
        subtitle="Pilih nomor polisi unit truk dari database sebelah dan input/update seluruh kondisi ban yang terpasang"
        badge="Data API Sebelah"
        badgeColor="bg-blue-100 text-blue-700"
        flush
      />

      {/* Form Master Truk: Simetris 3 Kolom x 3 Baris */}
      <Grid cols={1} mdCols={3} gap="md">
        {/* BARIS 1: IDENTITAS TRUK */}
        <div className="w-full text-xs">
          <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
            <span>Nomor Polisi (Plat Truk)</span>
            <Badge variant="danger">Dari API</Badge>
          </label>
          <Select
            options={plateOptions}
            value={plateNumber}
            onChange={(e) => onSelectPlateNumber(e.target.value)}
            placeholder="Pilih Nomor Polisi..."
            searchPlaceholder="Ketik plat, unit, supir..."
          />
        </div>

        <FormInput
          label="Kode Unit Truk"
          value={unitCode}
          readOnly
          className="uppercase cursor-not-allowed"
        />

        <FormInput
          label="Merk / Model Truk"
          value={truckBrand}
          readOnly
          className="cursor-not-allowed"
        />

        {/* BARIS 2: GANDENGAN & SUPIR */}
        <FormInput
          label="Kode Sasis (Chassis ID)"
          value={chassisCode}
          readOnly
          className="font-bold text-blue-700 cursor-not-allowed"
        />

        <Select
          label="Konfigurasi Gandar Sasis"
          value={chassisType}
          onChange={(e) => onChangeChassisType(e.target.value as ChassisType)}
          options={CHASSIS_CONFIG_OPTIONS}
        />

        <FormInput
          label="Nama Supir Utama"
          value={driverName}
          readOnly
          className="cursor-not-allowed"
        />

        {/* BARIS 3: TELEMATICS, TANGGAL & SURVEYOR */}
        <NumberInput
          label="Odometer Dashboard (KM)"
          subLabel={<Badge variant="info">IoT Hino</Badge>}
          value={odometer}
          onChange={() => {}}
          readOnly
          suffixText="KM"
        />

        <DateInput
          label="Tanggal Pengecekan"
          value={inspectionDate}
          onChange={(e) => onChangeInspectionDate(e.target.value)}
          required
        />

        <div className="w-full text-xs">
          <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
            <span>Surveyor PIC Lapangan</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <UserCheck size={11} /> Terverifikasi
            </span>
          </label>
          <div className="w-full h-10 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 flex items-center font-semibold text-slate-800 text-xs truncate">
            {mockCurrentSurveyor.name} ({mockCurrentSurveyor.nik})
          </div>
        </div>
      </Grid>
    </Card>
  );
}
