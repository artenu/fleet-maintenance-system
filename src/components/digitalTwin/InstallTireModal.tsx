// src/components/digitalTwin/InstallTireModal.tsx
import { useState, useMemo } from "react";
import {
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Truck,
  ArrowLeftRight,
} from "lucide-react";
import { Modal, Button, Badge } from "@/components/common";
import { Select } from "@/components/forms";
import { TIRE_THRESHOLDS } from "@/constants/truck/tireRules";
import {
  addYearsToDateString,
  getTotalPunctureCount,
} from "@/utils/tireManagement/tireCalculations";
import type {
  WheelSlotEvaluation,
  TireAsset,
  WheelPosition,
  TruckFleetTireItem,
} from "@/types/TireManagement/tires";

interface InstallTireModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: WheelSlotEvaluation | null;
  truckUnitCode: string;
  activeTruckId?: string;
  currentOdometer: number;
  warehouseTires: TireAsset[];
  currentTruckTires?: TireAsset[];
  truckList?: TruckFleetTireItem[];
  onConfirmInstall: (position: WheelPosition, tire: TireAsset) => void;
  onMoveTireFromSlot?: (
    fromPosition: WheelPosition,
    toPosition: WheelPosition,
  ) => void;
  onTransferTireFromOtherTruck?: (
    sourceTruckId: string,
    sourceTireId: string,
    targetPosition: WheelPosition,
  ) => void;
}

type InstallSourceType = "WAREHOUSE" | "INTERNAL_SLOT" | "OTHER_TRUCK";

export default function InstallTireModal({
  isOpen,
  onClose,
  slot,
  truckUnitCode,
  activeTruckId,
  currentOdometer,
  warehouseTires = [],
  currentTruckTires = [],
  truckList = [],
  onConfirmInstall,
  onMoveTireFromSlot,
  onTransferTireFromOtherTruck,
}: InstallTireModalProps) {
  // Mode Sumber Ban
  const [sourceType, setSourceType] = useState<InstallSourceType>("WAREHOUSE");

  // State 1: Pilihan Gudang Pool
  const [selectedWarehouseTireId, setSelectedWarehouseTireId] =
    useState<string>(warehouseTires[0]?.id || "");

  // State 2: Pilihan Ban dari Slot Lain (Truk yang Sama)
  const availableInternalTires = useMemo(() => {
    return currentTruckTires.filter((t) => {
      return t.currentPosition !== slot?.position;
    });
  }, [currentTruckTires, slot?.position]);

  const [selectedInternalPosition, setSelectedInternalPosition] =
    useState<WheelPosition>(
      availableInternalTires[0]?.currentPosition || ("S1" as WheelPosition),
    );

  // State 3: Pilihan Ban dari Truk Lain di Pool
  const otherTrucks = useMemo(() => {
    return truckList.filter((t) => {
      return t.id !== activeTruckId && t.unitCode !== truckUnitCode;
    });
  }, [truckList, activeTruckId, truckUnitCode]);

  const [selectedDonorTruckId, setSelectedDonorTruckId] = useState<string>(
    otherTrucks[0]?.id || "",
  );

  const selectedDonorTruck = otherTrucks.find((t) => {
    return t.id === selectedDonorTruckId;
  });

  const availableDonorTires = useMemo(() => {
    return selectedDonorTruck?.tires || [];
  }, [selectedDonorTruck]);

  const [selectedDonorTireId, setSelectedDonorTireId] = useState<string>(
    availableDonorTires[0]?.id || "",
  );

  if (!slot) {
    return null;
  }

  // Tentukan ban terpilih berdasarkan mode sumber
  let selectedCandidateTire: TireAsset | undefined;
  if (sourceType === "WAREHOUSE") {
    selectedCandidateTire = warehouseTires.find((t) => {
      return t.id === selectedWarehouseTireId;
    });
  } else if (sourceType === "INTERNAL_SLOT") {
    selectedCandidateTire = availableInternalTires.find((t) => {
      return t.currentPosition === selectedInternalPosition;
    });
  } else if (sourceType === "OTHER_TRUCK") {
    selectedCandidateTire = availableDonorTires.find((t) => {
      return t.id === selectedDonorTireId;
    });
  }

  // Validasi Golden Rule #1: Steer (H1 & H2) wajib R0 atau R1 (R1 beri warning khusus!)
  const isSteerSlot = slot.position === "H1" || slot.position === "H2";
  const isSteerViolation =
    isSteerSlot &&
    selectedCandidateTire &&
    selectedCandidateTire.retreadStatus !== "R0" &&
    selectedCandidateTire.retreadStatus !== "R1";
  const isSteerR1Warning =
    isSteerSlot &&
    selectedCandidateTire &&
    selectedCandidateTire.retreadStatus === "R1";
  const isCandidateAfkirOrOverPunctured =
    selectedCandidateTire &&
    (selectedCandidateTire.retreadStatus === "AFKIR" ||
      getTotalPunctureCount(selectedCandidateTire) >=
        TIRE_THRESHOLDS.MAX_PUNCTURE_BEFORE_AFKIR);

  const handleSave = () => {
    if (
      !selectedCandidateTire ||
      isSteerViolation ||
      isCandidateAfkirOrOverPunctured
    ) {
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    if (sourceType === "WAREHOUSE") {
      const finalTire: TireAsset = {
        ...selectedCandidateTire,
        currentVehicleId: truckUnitCode,
        currentPosition: slot.position,
        installOdometer: currentOdometer,
        installDate: todayStr,
        expiryDate:
          selectedCandidateTire.retreadStatus === "R0"
            ? addYearsToDateString(
                todayStr,
                TIRE_THRESHOLDS.NEW_TIRE_USAGE_EXPIRY_YEARS,
              )
            : selectedCandidateTire.expiryDate,
        lastInspectionDate: todayStr,
      };
      onConfirmInstall(slot.position, finalTire);
    } else if (sourceType === "INTERNAL_SLOT") {
      if (onMoveTireFromSlot) {
        onMoveTireFromSlot(selectedInternalPosition, slot.position);
      }
    } else if (sourceType === "OTHER_TRUCK") {
      if (onTransferTireFromOtherTruck && selectedDonorTruck) {
        onTransferTireFromOtherTruck(
          selectedDonorTruck.id,
          selectedCandidateTire.id,
          slot.position,
        );
      }
    }

    onClose();
  };

  const isSubmitDisabled =
    !selectedCandidateTire ||
    Boolean(isSteerViolation) ||
    Boolean(isCandidateAfkirOrOverPunctured);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pasang / Tukar Ban ke Slot ${slot.position} • Unit ${truckUnitCode}`}
      description="Pilih sumber ban: dari stok gudang pool, pindahkan dari roda lain, atau ambil dari unit truk lain"
      size="2xl"
      footer={
        <div className="flex justify-end gap-2 w-full pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSubmitDisabled}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
            <CheckCircle2 size={14} className="mr-1.5" />
            {sourceType === "WAREHOUSE" &&
              `Pasang dari Gudang ke ${slot.position}`}
            {sourceType === "INTERNAL_SLOT" &&
              `Pindahkan dari ${selectedInternalPosition} ke ${slot.position}`}
            {sourceType === "OTHER_TRUCK" &&
              `Mutasi dari Unit ${selectedDonorTruck?.unitCode || ""} ke ${slot.position}`}
          </Button>
        </div>
      }>
      <div className="h-100 space-y-4 text-xs">
        {/* Navigasi Sumber Ban (3 Tab Mode) */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setSourceType("WAREHOUSE")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition shadow-2xs ${
              sourceType === "WAREHOUSE"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}>
            <Warehouse size={14} />
            <span>Gudang ({warehouseTires.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceType("INTERNAL_SLOT")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition shadow-2xs ${
              sourceType === "INTERNAL_SLOT"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}>
            <ArrowLeftRight size={14} />
            <span>Tukar Roda Truk Ini</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceType("OTHER_TRUCK")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition shadow-2xs ${
              sourceType === "OTHER_TRUCK"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}>
            <Truck size={14} />
            <span>Dari Truk Lain ({otherTrucks.length})</span>
          </button>
        </div>

        {/* TAB 1: GUDANG POOL */}
        {sourceType === "WAREHOUSE" && (
          <div className="space-y-3">
            {warehouseTires.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-800">
                  <AlertTriangle
                    size={18}
                    className="text-amber-600 shrink-0"
                  />
                  <span>Stok Ban di Gudang Pool Kosong</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Tidak ada stok ban siap pakai di gudang. Anda dapat memilih
                  tab <strong>"Tukar Roda Truk Ini"</strong> (misal memindahkan
                  ban serep S1) atau <strong>"Dari Truk Lain"</strong>.
                </p>
              </div>
            ) : (
              <Select
                label="Pilih Ban Siap Pakai di Gudang Pool"
                icon={Warehouse}
                value={selectedWarehouseTireId}
                onChange={(e) => setSelectedWarehouseTireId(e.target.value)}
                options={warehouseTires.map((t) => ({
                  value: t.id,
                  label: `${t.serialNumber} • ${t.brand} (${t.retreadStatus}) • Tapak: ${t.treadDepthMm || 14} mm`,
                }))}
                helperText={`Tersedia ${warehouseTires.length} ban siap pasang di gudang pool.`}
              />
            )}
          </div>
        )}

        {/* TAB 2: TUKAR DARI RODA LAIN (TRUK INI) */}
        {sourceType === "INTERNAL_SLOT" && (
          <div className="space-y-3">
            {availableInternalTires.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <p className="text-xs">
                  Tidak ada ban lain yang terpasang pada unit {truckUnitCode}{" "}
                  saat ini.
                </p>
              </div>
            ) : (
              <Select
                label={`Pilih Roda Donor di Unit ${truckUnitCode}`}
                icon={ArrowLeftRight}
                value={selectedInternalPosition}
                onChange={(e) =>
                  setSelectedInternalPosition(e.target.value as WheelPosition)
                }
                options={availableInternalTires.map((t) => ({
                  value: t.currentPosition,
                  label: `Posisi ${t.currentPosition} • No Seri: ${t.serialNumber} (${t.brand} - ${t.retreadStatus}) • Tapak: ${t.treadDepthMm} mm`,
                }))}
                helperText="Ban dari posisi yang dipilih akan dipindahkan ke slot kosong saat ini."
              />
            )}
          </div>
        )}

        {/* TAB 3: DARI TRUK LAIN DI POOL */}
        {sourceType === "OTHER_TRUCK" && (
          <div className="space-y-3">
            {otherTrucks.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <p className="text-xs">
                  Tidak ada unit truk lain yang terdaftar di pool.
                </p>
              </div>
            ) : (
              <>
                <Select
                  label="Pilih Unit Truk Donor"
                  icon={Truck}
                  value={selectedDonorTruckId}
                  onChange={(e) => {
                    const nextTruckId = e.target.value;
                    setSelectedDonorTruckId(nextTruckId);
                    const donor = otherTrucks.find((t) => {
                      return t.id === nextTruckId;
                    });
                    if (donor && donor.tires.length > 0) {
                      setSelectedDonorTireId(donor.tires[0].id);
                    }
                  }}
                  options={otherTrucks.map((t) => ({
                    value: t.id,
                    label: `${t.unitCode} (${t.plateNumber}) • ${t.brand} (${t.tires.length} Roda)`,
                  }))}
                />

                {availableDonorTires.length === 0 ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    Unit truk ini tidak memiliki ban terpasang.
                  </div>
                ) : (
                  <Select
                    label="Pilih Ban yang Ingin Diambil dari Unit Donor"
                    value={selectedDonorTireId}
                    onChange={(e) => setSelectedDonorTireId(e.target.value)}
                    options={availableDonorTires.map((t) => ({
                      value: t.id,
                      label: `Posisi ${t.currentPosition} • No Seri: ${t.serialNumber} (${t.brand} - ${t.retreadStatus}) • Tapak: ${t.treadDepthMm} mm`,
                    }))}
                    helperText={`Ban ini akan dilepas dari ${selectedDonorTruck?.unitCode} dan dipasang ke slot ${slot.position} ${truckUnitCode}.`}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* KARTU RINGKASAN BAN KANDIDAT YANG AKAN DIPASANG */}
        {selectedCandidateTire && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
              <div>
                <span className="font-extrabold text-xs text-blue-950 block">
                  No. Seri: {selectedCandidateTire.serialNumber}
                </span>
                <span className="text-[11px] text-blue-800 font-medium">
                  {selectedCandidateTire.brand} • {selectedCandidateTire.size}
                </span>
              </div>
              <Badge variant="info" className="font-black">
                {selectedCandidateTire.retreadStatus === "R0"
                  ? "R0 (Baru Asli)"
                  : selectedCandidateTire.retreadStatus === "R1"
                    ? "R1 (Vulkanisir 1)"
                    : `${selectedCandidateTire.retreadStatus}`}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] text-blue-900">
              <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                <span className="text-[9px] text-slate-500 block uppercase font-bold">
                  Tekanan Angin
                </span>
                <strong className="text-slate-900">
                  {selectedCandidateTire.pressurePsi || 120} PSI
                </strong>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                <span className="text-[9px] text-slate-500 block uppercase font-bold">
                  Tebal Tapak
                </span>
                <strong className="text-slate-900">
                  {selectedCandidateTire.treadDepthMm || 14} mm
                </strong>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                <span className="text-[9px] text-slate-500 block uppercase font-bold">
                  Odo Pasang
                </span>
                <strong className="text-slate-900 font-mono">
                  {currentOdometer.toLocaleString("id-ID")} KM
                </strong>
              </div>
            </div>

            {/* Peringatan jika melanggar Golden Rule #1 (Gandar Steer) */}
            {isSteerViolation && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
                <ShieldAlert size={16} className="text-rose-600 shrink-0" />
                <span>
                  Pelanggaran Golden Rule: Gandar Kemudi (Steer {slot.position})
                  hanya boleh ban Baru (R0) atau 1x Vulkanisir (R1)!
                </span>
              </div>
            )}

            {/* Validasi & Peringatan Khusus: Ban R1 (1x Vulkanisir) dipasang di Steer Depan */}
            {isSteerR1Warning && !isSteerViolation && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Peringatan Validasi Steer ({slot.position}): Ban ini sudah 1x
                  vulkanisir (R1). Memasang ban vulkanisir di kemudi depan head
                  truck berisiko lebih tinggi — pastikan kondisi karkas prima atau
                  utamakan Ban Baru (R0).
                </span>
              </div>
            )}

            {/* Blokir jika ban berstatus AFKIR atau >= 3x Bocor */}
            {isCandidateAfkirOrOverPunctured && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
                <ShieldAlert size={16} className="text-rose-600 shrink-0" />
                <span>
                  DILARANG PASANG: Ban ini berstatus AFKIR atau sudah bocor/tambal
                  ≥ 3x dan tidak layak beroperasi di armada!
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
