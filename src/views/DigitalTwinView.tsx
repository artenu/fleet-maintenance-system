import { useState, useMemo } from "react";

// src/views/DigitalTwinView.tsx
import { AlertTriangle, Sparkles, Info } from "lucide-react";
import { useDigitalTwin } from "@/hooks/useDigitalTwin";
import type { DigitalTwinViewProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

// 🧱 Komponen Reusable Design System
import { Container } from "@/components/layout";
import { Button, Modal, Badge } from "@/components/common";
import {
  WheelLayoutVisualizer,
  FleetReadinessBanner,
  DigitalTwinMetrics,
  SelectedWheelDetailCard,
  MechanicOverrideModal,
  InstallTireModal,
} from "@/components/digitalTwin";

export default function DigitalTwinView({
  activeTruck,
  chassisList = [],
  warehouseTires = [],
  truckList = [],
  onSelectTruck,
  selectedSlot,
  onSelectSlot,
  onOpenInspection,
  onOpenRotation,
  onEmergencySwapSpare,
  onApplyMechanicOverride,
  onInstallTire,
  onMoveTireBetweenSlots,
  onTransferTireFromOtherTruck,
}: DigitalTwinViewProps) {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  const {
    previewImage,
    setPreviewImage,
    isOverrideModalOpen,
    setIsOverrideModalOpen,
    mechanicName,
    setMechanicName,
    overrideReason,
    setOverrideReason,
    spareViolationMsg,
    setSpareViolationMsg,
    handleQuickSwapSpare,
    handleConfirmOverride,
    criticalTires,
    hasNoTires,
    isGrounded,
    readinessPercent,
  } = useDigitalTwin({
    activeTruck,
    selectedSlot,
    onEmergencySwapSpare,
    onApplyMechanicOverride,
  });

  // Cari sasis aktif dari hasil perangkaian (Drop & Hook)
  const activeChassis = chassisList.find(
    (c) => c.attachedHeadId === activeTruck.id,
  );

  const isBobTail = !activeChassis;

  // 👇 Hitung apakah ban masih belum lengkap terpasang di slot roda
  const currentChassisType = activeChassis?.type || activeTruck.chassisType;
  const expectedTiresCount = isBobTail
    ? 6
    : currentChassisType === "2_AXLE"
      ? 14
      : 18;
  const installedTiresCount = activeTruck.tires.filter(
    (t) => t.currentPosition !== "S1",
  ).length;
  const isTiresIncomplete =
    !hasNoTires && installedTiresCount < expectedTiresCount;
  const missingTiresCount = Math.max(
    0,
    expectedTiresCount - installedTiresCount,
  );

  // 🔍 Pemindaian Otomatis Database: Cari truk baru (0 ban) atau yang bannya belum lengkap
  const pendingTireTrucks = useMemo(() => {
    return truckList
      .map((truck) => {
        const attachedChassis = chassisList.find(
          (c) => c.attachedHeadId === truck.id,
        );
        const isTruckBobtail = !attachedChassis;
        const configType = attachedChassis?.type || truck.chassisType;
        const expectedCount = isTruckBobtail
          ? 6
          : configType === "2_AXLE"
            ? 14
            : 18;
        const installedCount = truck.tires.filter(
          (t) => t.currentPosition !== "S1",
        ).length;
        const hasNoTires = truck.tires.length === 0;
        const isIncomplete = !hasNoTires && installedCount < expectedCount;

        if (hasNoTires || isIncomplete) {
          return {
            truck,
            hasNoTires,
            isIncomplete,
            installedCount,
            expectedCount,
            missingCount: Math.max(0, expectedCount - installedCount),
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [truckList, chassisList]);

  return (
    <Container className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 🚨 1. BANNER AUTO-DETECT GLOBAL: Muncul jika di database ada unit baru / ban belum lengkap */}
      {pendingTireTrucks.length > 0 && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-4 shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500 text-white shadow-xs">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-950 flex items-center gap-2">
                  <span>Perhatian Armada di Database:</span>
                  <Badge variant="warning" className="text-[10px]">
                    {pendingTireTrucks.length} Unit Perlu Tindakan
                  </Badge>
                </h4>
                <p className="text-[11px] text-amber-800">
                  Terdeteksi truk baru yang belum memiliki ban atau unit dengan
                  ban yang belum lengkap terpasang di gandar.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-3 py-1.5 rounded-xl border border-amber-200">
              📦 Stok Gudang Pool: {warehouseTires.length} Ban Siap Pasang
            </span>
          </div>
          {/* Tombol Cepat (Quick Pills) untuk Langsung Membuka Unit Truk Tersebut */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-[11px] font-bold text-amber-900 mr-1">
              Klik untuk langsung periksa unit:
            </span>
            {pendingTireTrucks.map((item) => {
              const isCurrentActive = item.truck.id === activeTruck.id;
              return (
                <button
                  key={item.truck.id}
                  type="button"
                  onClick={() => onSelectTruck?.(item.truck.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs ${
                    isCurrentActive
                      ? "bg-amber-600 text-white ring-2 ring-amber-500/40"
                      : "bg-white border border-amber-300 text-amber-900 hover:bg-amber-100"
                  }`}>
                  <span>
                    {item.truck.unitCode} ({item.truck.plateNumber})
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase ${
                      item.hasNoTires
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                    {item.hasNoTires
                      ? "0 Roda (Unit Baru)"
                      : `${item.installedCount}/${item.expectedCount} Roda`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* 1. Banner Kelaikan Jalan Armada (Fit to Dispatch vs Grounded) */}
      <FleetReadinessBanner
        unitCode={activeTruck.unitCode}
        plateNumber={activeTruck.plateNumber}
        isGrounded={isGrounded}
        hasNoTires={hasNoTires}
        criticalTiresCount={criticalTires.length}
        readinessPercent={readinessPercent}
        isBobTail={isBobTail}
        attachedChassisCode={activeChassis?.chassisCode}
        chassisType={activeChassis?.type || activeTruck.chassisType}
        chassisLengthCategory={
          activeChassis?.lengthCategory || activeTruck.capacity
        }
      />

      {/* 2. Banner Notifikasi Auto-Detect: Unit Baru / Ban Belum Lengkap Terpasang */}
      {hasNoTires && (
        <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/80 p-4.5 flex flex-wrap items-center justify-between gap-4 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="warning" className="font-black text-xs">
                  UNIT BARU TERDETEKSI
                </Badge>
                <span className="font-extrabold text-sm text-amber-950">
                  Truk Belum Memiliki Ban Terpasang (0 Roda)
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Unit <strong>{activeTruck.unitCode}</strong> (
                {activeTruck.plateNumber}) baru didaftarkan ke armada dan belum
                memiliki ban pada gandarnya. Silakan pasang ban dari stok gudang
                pool dengan mengklik kotak roda pada denah di bawah.
              </p>
            </div>
          </div>
          <Badge
            variant="neutral"
            className="bg-amber-100 text-amber-800 font-bold px-3 py-1.5 border border-amber-200">
            📦 Stok Gudang: {warehouseTires.length} Ban Siap Pasang
          </Badge>
        </div>
      )}

      {isTiresIncomplete && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Info size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="info" className="font-black text-xs">
                  INSTALASI BELUM LENGKAP
                </Badge>
                <span className="font-extrabold text-xs text-blue-950">
                  Terdapat {missingTiresCount} Slot Roda Kosong Belum Terpasang
                </span>
              </div>
              <p className="text-xs text-blue-800 mt-0.5">
                Konfigurasi{" "}
                {isBobTail
                  ? "Bobtail (6 Ban)"
                  : currentChassisType === "2_AXLE"
                    ? "14 Ban"
                    : "18 Ban"}{" "}
                memerlukan {expectedTiresCount} roda aktif, saat ini baru
                terpasang {installedTiresCount} roda. Klik slot roda yang kosong
                pada denah untuk memasang ban dari gudang pool.
              </p>
            </div>
          </div>
          <Badge
            variant="info"
            className="bg-white text-blue-800 font-bold border border-blue-200">
            {installedTiresCount} / {expectedTiresCount} Roda Terpasang
          </Badge>
        </div>
      )}

      {/* 2. Kartu Ringkasan KPI & Metrik Armada */}
      <DigitalTwinMetrics activeTruck={activeTruck} />

      {/* 3. Denah Tata Letak Roda & Detail Inspector Terpilih */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Kolom Kiri: Visualizer Denah Roda Interaktif */}
        <div className="lg:col-span-2">
          <WheelLayoutVisualizer
            key={`${activeTruck.id}-${activeChassis?.id || "bobtail"}-${activeChassis?.type || activeTruck.chassisType}`}
            unitCode={activeTruck.unitCode}
            plateNumber={activeTruck.plateNumber}
            brand={activeTruck.brand}
            driver={activeTruck.driver}
            currentOdometer={activeTruck.currentOdometer}
            initialChassisType={activeChassis?.type || activeTruck.chassisType}
            attachedChassisCode={activeChassis?.chassisCode}
            chassisLengthCategory={
              activeChassis?.lengthCategory || activeTruck.capacity
            }
            tires={activeTruck.tires}
            isBobTail={isBobTail}
            onSelectSlot={(slot) => onSelectSlot(slot)}
          />
        </div>

        {/* Kolom Kanan: Panel Detail Roda Terpilih */}
        <SelectedWheelDetailCard
          selectedSlot={selectedSlot}
          onOpenInspection={onOpenInspection}
          onOpenRotation={onOpenRotation}
          onQuickSwapSpare={handleQuickSwapSpare}
          onOpenOverrideModal={() => setIsOverrideModalOpen(true)}
          onPreviewPhoto={setPreviewImage}
          onOpenInstallTire={() => setIsInstallModalOpen(true)}
        />
      </div>

      {/* 4. Modal Toleransi Mekanik (+5.000 KM) */}
      <MechanicOverrideModal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        mechanicName={mechanicName}
        onChangeMechanicName={setMechanicName}
        overrideReason={overrideReason}
        onChangeOverrideReason={setOverrideReason}
        onSubmit={handleConfirmOverride}
      />

      {/* 5. Modal Peringatan Pelanggaran Ban Serep */}
      <Modal
        isOpen={Boolean(spareViolationMsg)}
        onClose={() => setSpareViolationMsg(null)}
        title={
          <span className="flex items-center gap-2 text-rose-600">
            <AlertTriangle size={18} />
            <span>Pelanggaran Golden Rule #1 Ditolak!</span>
          </span>
        }
        size="md"
        footer={
          <Button
            variant="danger"
            size="sm"
            onClick={() => setSpareViolationMsg(null)}>
            Saya Mengerti
          </Button>
        }>
        <p className="text-xs text-rose-900 leading-relaxed bg-rose-50 p-3.5 rounded-xl border border-rose-200">
          {spareViolationMsg}
        </p>
      </Modal>

      {/* 6. Modal Preview Foto Ukuran Penuh */}
      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.title}
        description={previewImage?.subtitle}
        size="lg">
        {previewImage && (
          <div className="flex items-center justify-center p-2 bg-slate-900 rounded-xl">
            <img
              src={previewImage.url}
              alt="Foto Ukuran Penuh"
              className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain"
            />
          </div>
        )}
      </Modal>
      {/* 7. Modal Pasang / Daftarkan Ban di Slot Kosong */}
      <InstallTireModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        slot={selectedSlot}
        truckUnitCode={activeTruck.unitCode}
        activeTruckId={activeTruck.id}
        currentOdometer={activeTruck.currentOdometer}
        warehouseTires={warehouseTires}
        currentTruckTires={activeTruck.tires}
        truckList={truckList}
        onConfirmInstall={(position, tire) => {
          if (onInstallTire) {
            onInstallTire(position, tire);
          }
          setIsInstallModalOpen(false);
        }}
        onMoveTireFromSlot={(fromPos, toPos) => {
          if (onMoveTireBetweenSlots) {
            onMoveTireBetweenSlots(fromPos, toPos);
          }
          setIsInstallModalOpen(false);
        }}
        onTransferTireFromOtherTruck={(
          sourceTruckId,
          sourceTireId,
          targetPos,
        ) => {
          if (onTransferTireFromOtherTruck) {
            onTransferTireFromOtherTruck(
              sourceTruckId,
              sourceTireId,
              targetPos,
            );
          }
          setIsInstallModalOpen(false);
        }}
      />
    </Container>
  );
}
