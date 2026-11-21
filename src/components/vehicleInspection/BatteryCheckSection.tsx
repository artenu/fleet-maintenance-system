// src/components/vehicleInspection/BatteryCheckSection.tsx
import { Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, Badge } from "@/components/common";
import { FormInput } from "@/components/forms";
import { BATTERY_SLOT_CONFIGS } from "@/constants/vehicleInspection";
import type { BatteryCheckData } from "@/types/VehicleInspection";
import {
  BatteryItemCard,
  BatterySecurityCard,
  type SingleBatteryData,
} from "./batteryCheck";

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

  // Deteksi nomor seri duplikat / serial kembar (Audit Anti-Fraud)
  const isDuplicateSerial =
    Boolean(battery.battery1.serialNumber) &&
    Boolean(battery.battery2.serialNumber) &&
    battery.battery1.serialNumber.trim().toLowerCase() ===
      battery.battery2.serialNumber.trim().toLowerCase();

  const handleUpdateSingleBattery = (
    key: "battery1" | "battery2",
    patch: Partial<SingleBatteryData>,
  ) => {
    onChangeBattery({
      [key]: { ...battery[key], ...patch },
    });
  };

  return (
    <Card className="space-y-4">
      {/* 1. Header & Info Bar Seksi 3 */}
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

        {/* Status Indikator Sistem Kelistrikan */}
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

      {/* Warning Serial Kembar (Anti-Fraud) */}
      {isDuplicateSerial && (
        <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
          <AlertTriangle size={14} className="shrink-0 text-amber-600" />
          <span>
            <strong>Peringatan Anti-Fraud:</strong> Nomor seri Aki 1 dan Aki 2
            tercatat identik (<strong>{battery.battery1.serialNumber}</strong>).
            Pastikan barcode setiap unit aki dicatat terpisah.
          </span>
        </div>
      )}

      {/* 2. Grid Dua Kartu Aki (Aki 1 & Aki 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BATTERY_SLOT_CONFIGS.map((config) => {
          return (
            <BatteryItemCard
              key={config.key}
              batteryKey={config.key}
              title={config.title}
              slotLabel={config.slotLabel}
              data={battery[config.key]}
              serialPlaceholder={config.serialPlaceholder}
              notesPlaceholder={config.notesPlaceholder}
              onChange={handleUpdateSingleBattery}
            />
          );
        })}
      </div>

      {/* 3. Kartu Keamanan: Rantai & Gembok Kotak Aki */}
      <BatterySecurityCard
        isLockedWithChain={battery.caseLockedWithChain}
        onToggleLock={(checked) => {
          onChangeBattery({ caseLockedWithChain: checked });
        }}
      />

      {/* 4. Catatan Tambahan Sistem Kelistrikan */}
      <FormInput
        label="Catatan Tambahan Sistem Aki / Kelistrikan"
        value={battery.notes}
        onChange={(e) => {
          onChangeBattery({ notes: e.target.value });
        }}
        placeholder="cth: Kabel grounding sudah diganti baru, voltase alternator normal"
      />
    </Card>
  );
}
