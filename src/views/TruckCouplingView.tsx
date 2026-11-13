// src/views/TruckCouplingView.tsx
import { useTruckCoupling } from "@/hooks/useTruckCoupling";
import type { TruckCouplingViewProps } from "@/types/TruckCouplingView/TruckCouplingViewTypes";

// 🧱 Komponen Reusable Design System Kita
import { Container, PageHeader, Grid } from "@/components/layout";
import {
  HookChassisModal,
  TruckCouplingList,
  ChassisYardList,
} from "@/components/truckCoupling";

import { Link2 } from "lucide-react";

export default function TruckCouplingView({
  truckList,
  chassisList,
  onCouple,
  onUncouple,
}: TruckCouplingViewProps) {
  const {
    isHookModalOpen,
    setIsHookModalOpen,
    selectedTruckId,
    selectedChassisId,
    setSelectedChassisId,
    overrideWheelConfig,
    setOverrideWheelConfig,
    availableChassis,
    coupledChassis,
    repairChassis,
    handleOpenHookModal,
    handleExecuteHook,
  } = useTruckCoupling({ truckList, chassisList, onCouple, onUncouple });

  return (
    <Container className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* ================= 1. PAGE HEADER ================= */}
      <PageHeader
        icon={Link2}
        iconBgColor="bg-blue-600 shadow-blue-500/20"
        title="Perangkaian Armada (Coupling Drop & Hook)"
        subtitle="Manajemen pelepasan dan pengaitan kepala truk (Tractor Head) dengan sasis gandengan (Chassis Trailer)"
        badge="Drop & Hook Lifecycle"
        badgeColor="bg-blue-100 text-blue-800"
      />

      {/* ================= 2. KPI STATUS SASIS DI POOL ================= */}
      <Grid cols={2} smCols={4} gap="sm">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            Total Sasis di Pool
          </span>
          <span className="text-xl font-black text-slate-900">
            {chassisList.length} Unit
          </span>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">
            Tergandeng (Aktif)
          </span>
          <span className="text-xl font-black text-emerald-800">
            {coupledChassis.length} Rangkaian
          </span>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-blue-700 uppercase block">
            Standby Siap Gandeng
          </span>
          <span className="text-xl font-black text-blue-800">
            {availableChassis.length} Sasis
          </span>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase block">
            Perbaikan di Bengkel
          </span>
          <span className="text-xl font-black text-amber-800">
            {repairChassis.length} Sasis
          </span>
        </div>
      </Grid>

      {/* ================= 3. DAFTAR KEPALA TRUK & STATUS PERANGKAIAN ================= */}
      <TruckCouplingList
        truckList={truckList}
        chassisList={chassisList}
        availableChassisCount={availableChassis.length}
        onOpenHookModal={handleOpenHookModal}
        onUncouple={onUncouple}
      />

      {/* ================= 4. INVENTARIS SASIS STANDBY DI POOL ================= */}
      <ChassisYardList chassisList={chassisList} />

      {/* ================= 5. MODAL PASANG GANDENGAN (REUSABLE MODAL) ================= */}
      <HookChassisModal
        isOpen={isHookModalOpen}
        onClose={() => setIsHookModalOpen(false)}
        selectedTruckId={selectedTruckId}
        selectedChassisId={selectedChassisId}
        onSelectedChassisIdChange={setSelectedChassisId}
        overrideWheelConfig={overrideWheelConfig}
        onOverrideWheelConfigChange={setOverrideWheelConfig}
        availableChassis={availableChassis}
        onConfirmHook={handleExecuteHook}
      />
    </Container>
  );
}
