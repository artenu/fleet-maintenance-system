// src/components/truckCoupling/HookChassisModal.tsx
import type { ChassisType } from "@/types/truck/tires";
import type { HookChassisModalProps } from "@/types/TruckCouplingView/TruckCouplingViewTypes";
import { Modal, Button } from "@/components/common";
import { Select } from "@/components/forms";
import { Link2, SlidersHorizontal } from "lucide-react";

/**
 * Modal Formulir Pemasangan Sasis (Hook) ke Kepala Truk
 * Mendukung pemilihan unit sasis standby di pool dan penyesuaian konfigurasi gandar roda.
 */
export default function HookChassisModal({
  isOpen,
  onClose,
  selectedTruckId,
  selectedChassisId,
  onSelectedChassisIdChange,
  overrideWheelConfig,
  onOverrideWheelConfigChange,
  availableChassis,
  onConfirmHook,
}: HookChassisModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Kaitkan Sasis ke Truk ${selectedTruckId}`}
      description="Pilih sasis yang standby di pool dan sesuaikan konfigurasi gandar roda"
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Link2}
            onClick={onConfirmHook}
            className="bg-blue-600 hover:bg-blue-700">
            Pasang Gandengan Sekarang
          </Button>
        </div>
      }>
      <div className="space-y-4 text-xs">
        {/* Pilihan Sasis Standby */}
        <Select
          label="Pilih Sasis Standby di Pool"
          value={selectedChassisId}
          onChange={(e) => onSelectedChassisIdChange(e.target.value)}
          options={availableChassis.map((c) => ({
            value: c.id,
            label: `${c.chassisCode} • ${c.lengthCategory} (${
              c.type === "2_AXLE" ? "14 Ban" : "18 Ban"
            })`,
          }))}
        />

        {/* Edge Case Pilihan Konfigurasi Roda */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 space-y-2">
          <Select
            label="Konfigurasi Gandar Roda (Edge Case Sasis)"
            icon={SlidersHorizontal}
            value={overrideWheelConfig}
            onChange={(e) =>
              onOverrideWheelConfigChange(e.target.value as ChassisType)
            }
            options={[
              {
                value: "2_AXLE",
                label: "2 Sumbu • 14 Ban (Trailer 20ft / 40ft Pendek)",
              },
              {
                value: "3_AXLE",
                label: "3 Sumbu • 18 Ban (Trailer 40ft Standar)",
              },
            ]}
          />
          <p className="text-[10px] text-blue-700 font-medium">
            💡 <strong>Sasis 40ft Fleksibel:</strong> Denah roda Digital Twin di
            ATMS akan otomatis menyesuaikan menjadi 14 ban atau 18 ban berdasarkan
            konfigurasi yang dipilih.
          </p>
        </div>
      </div>
    </Modal>
  );
}

