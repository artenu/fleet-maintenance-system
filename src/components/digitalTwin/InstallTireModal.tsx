// src/components/digitalTwin/InstallTireModal.tsx
import { useState } from "react";
import {
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { Modal, Button, Badge } from "@/components/common";
import { Select } from "@/components/forms";
import type {
  WheelSlotEvaluation,
  TireAsset,
  WheelPosition,
} from "@/types/truck/tires";

interface InstallTireModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: WheelSlotEvaluation | null;
  truckUnitCode: string;
  currentOdometer: number;
  warehouseTires: TireAsset[];
  onConfirmInstall: (position: WheelPosition, tire: TireAsset) => void;
}

export default function InstallTireModal({
  isOpen,
  onClose,
  slot,
  truckUnitCode,
  currentOdometer,
  warehouseTires,
  onConfirmInstall,
}: InstallTireModalProps) {
  // Pilihan ID Ban dari Stok Gudang Pool
  const [selectedWarehouseTireId, setSelectedWarehouseTireId] =
    useState<string>(warehouseTires[0]?.id || "");

  if (!slot) {
    return null;
  }

  const selectedTire = warehouseTires.find(
    (t) => t.id === selectedWarehouseTireId,
  );

  // Validasi Golden Rule #1: Steer (H1 & H2) wajib R0 atau R1
  const isSteerSlot = slot.position === "H1" || slot.position === "H2";
  const isSteerViolation =
    isSteerSlot &&
    selectedTire &&
    selectedTire.retreadStatus !== "R0" &&
    selectedTire.retreadStatus !== "R1";

  const handleSave = () => {
    if (!selectedTire || isSteerViolation) {
      return;
    }

    const finalTire: TireAsset = {
      ...selectedTire,
      currentVehicleId: truckUnitCode,
      currentPosition: slot.position,
      installOdometer: currentOdometer,
      lastInspectionDate: new Date().toISOString().split("T")[0],
    };

    onConfirmInstall(slot.position, finalTire);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pasang Ban ke Slot ${slot.position} • Unit ${truckUnitCode}`}
      description="Ambil ban siap pakai dari stok gudang pool untuk dipasang ke gandar roda"
      size="md"
      footer={
        <div className="flex justify-end gap-2 w-full pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={
              warehouseTires.length === 0 ||
              !selectedTire ||
              Boolean(isSteerViolation)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
            <CheckCircle2 size={14} className="mr-1.5" />
            Konfirmasi Pasang ke Slot {slot.position}
          </Button>
        </div>
      }>
      <div className="space-y-4 text-xs">
        {warehouseTires.length === 0 ? (
          /* Peringatan SOP jika gudang pool kosong */
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-black text-amber-800">
              <AlertTriangle size={18} className="text-amber-600 shrink-0" />
              <span>Stok Ban di Gudang Pool Kosong</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Sesuai SOP PT ALN, setiap ban baru atau ban vulkanisir wajib{" "}
              <strong>
                di-input terlebih dahulu melalui menu "Master Stok & Gudang Ban"
              </strong>{" "}
              agar tercatat penerimaannya sebelum dapat dipasangkan ke armada.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Dropdown Ban dari Gudang */}
            <Select
              label="Pilih Ban Siap Pakai di Gudang Pool"
              icon={Warehouse}
              value={selectedWarehouseTireId}
              onChange={(e) => setSelectedWarehouseTireId(e.target.value)}
              options={warehouseTires.map((t) => ({
                value: t.id,
                label: `${t.serialNumber} • ${t.brand} (${t.retreadStatus}) • Tapak: ${
                  t.treadDepthMm || 14
                } mm`,
              }))}
              helperText={`Tersedia ${warehouseTires.length} ban siap pasang di gudang pool.`}
            />

            {/* Kartu Ringkasan Detail Ban Terpilih */}
            {selectedTire && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                  <div>
                    <span className="font-extrabold text-xs text-blue-950 block">
                      No. Seri: {selectedTire.serialNumber}
                    </span>
                    <span className="text-[11px] text-blue-800 font-medium">
                      {selectedTire.brand} • {selectedTire.size}
                    </span>
                  </div>
                  <Badge variant="info" className="font-black">
                    {selectedTire.retreadStatus === "R0"
                      ? "R0 (Baru Asli)"
                      : selectedTire.retreadStatus === "R1"
                        ? "R1 (Vulkanisir 1)"
                        : `${selectedTire.retreadStatus}`}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-blue-900">
                  <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">
                      Tekanan Angin
                    </span>
                    <strong className="text-slate-900">
                      {selectedTire.pressurePsi || 120} PSI
                    </strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">
                      Tebal Tapak
                    </span>
                    <strong className="text-slate-900">
                      {selectedTire.treadDepthMm || 14} mm
                    </strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">
                      Odo Pasang
                    </span>
                    <strong className="text-slate-900">
                      {currentOdometer.toLocaleString("id-ID")} KM
                    </strong>
                  </div>
                </div>

                {/* Peringatan jika melanggar Golden Rule #1 (Gandar Steer) */}
                {isSteerViolation && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
                    <ShieldAlert size={16} className="text-rose-600 shrink-0" />
                    <span>
                      Pelanggaran Golden Rule: Gandar Kemudi (Steer{" "}
                      {slot.position}) hanya boleh ban Baru (R0) atau 1x
                      Vulkanisir (R1)!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
