// src/App.tsx
import { useState, useEffect } from "react";
import Sidebar, { type TireMaintenanceView } from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import { Select } from "./components/common";
import ToastContainer from "./components/common/Toast";

// Modal-modal Terisolasi
import {
  TireInspectionModal,
  TireRotationModal,
} from "./components/digitalTwin";
import { ReceiveTireModal } from "@/components/tireInventory";

// Views Terisolasi
import DigitalTwinView from "./views/DigitalTwinView";
import TireInventoryView from "./views/TireInventoryView";
import TireHistoryView from "./views/TireHistoryView";
import TireAnalyticsView from "./views/TireAnalyticsView";
import TireAuditScheduleView from "./views/TireAuditScheduleView";
import FleetHealthDashboardView from "./views/FleetHealthDashboardView";
import VehicleInspectionView from "./views/VehicleInspectionView";
import TruckCouplingView from "./views/TruckCouplingView";

// Custom Hooks & Constants
import { useToast } from "./hooks/useToast";
import { useFleetMaintenance } from "./hooks/useFleetMaintenance";
import { VIEW_TITLES } from "./constants/sidebar";

export default function App() {
  // 1. Toast Notification Hook
  const { toasts, addToast, removeToast } = useToast();

  // 2. Navigasi & Responsive Sidebar
  const [activeView, setActiveView] =
    useState<TireMaintenanceView>("fleet-health");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1280;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsSidebarCollapsed(!e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // 3. Centralized Fleet & Tire Business Logic Hook
  const fleet = useFleetMaintenance(addToast);

  // 4. Modal Visibility State
  const [isInspectionModalOpen, setIsInspectionModalOpen] =
    useState<boolean>(false);
  const [isRotationModalOpen, setIsRotationModalOpen] =
    useState<boolean>(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      {/* 1. Sidebar Navigasi Kiri */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        overdueCount={fleet.overdueCount}
        incompleteTiresTruckCount={fleet.incompleteTiresTruckCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* 2. Area Konten Utama Kanan */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* Reusable Navbar Component */}
        <Navbar
          title={VIEW_TITLES[activeView]}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(false)}
          actions={
            activeView === "digital-twin" && (
              <div className="flex items-center gap-2 min-w-[300px]">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  Pilih Unit Truk:
                </span>
                <Select
                  value={fleet.selectedTruckId}
                  onChange={(e) => {
                    fleet.setSelectedTruckId(e.target.value);
                    fleet.setSelectedSlot(null);
                  }}
                  searchPlaceholder="Cari lambung / plat truk..."
                  options={fleet.truckList.map((truck) => {
                    const attachedChassis = fleet.chassisList.find(
                      (c) => c.attachedHeadId === truck.id,
                    );
                    const statusLabel = attachedChassis
                      ? `${attachedChassis.lengthCategory} (${attachedChassis.chassisCode})`
                      : "Bobtail (6 Ban)";

                    return {
                      value: truck.id,
                      label: `${truck.unitCode} (${truck.plateNumber}) • ${statusLabel}`,
                    };
                  })}
                />
              </div>
            )
          }
        />

        {/* Dynamic Body Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-6 space-y-6">
          {activeView === "digital-twin" && (
            <DigitalTwinView
              activeTruck={fleet.activeTruck}
              chassisList={fleet.chassisList}
              warehouseTires={fleet.warehouseTires}
              selectedSlot={fleet.selectedSlot}
              onSelectSlot={fleet.setSelectedSlot}
              truckList={fleet.truckList}
              onSelectTruck={(truckId) => {
                fleet.setSelectedTruckId(truckId);
                fleet.setSelectedSlot(null);
              }}
              onOpenInspection={() => setIsInspectionModalOpen(true)}
              onOpenRotation={() => setIsRotationModalOpen(true)}
              onEmergencySwapSpare={fleet.handleEmergencySwapSpare}
              onApplyMechanicOverride={fleet.handleApplyMechanicOverride}
              onInstallTire={fleet.handleInstallTire}
              onMoveTireBetweenSlots={fleet.handleMoveTireBetweenSlots}
              onTransferTireFromOtherTruck={
                fleet.handleTransferTireFromOtherTruck
              }
              onSaveTruckTires={(updatedTruck) => {
                fleet.setTruckList((prevList) =>
                  prevList.map((t) =>
                    t.unitCode === updatedTruck.unitCode ? updatedTruck : t,
                  ),
                );
                addToast(
                  "success",
                  `Data Ban Unit ${updatedTruck.unitCode} Berhasil Diperbarui!`,
                  `Total ${updatedTruck.tires.length} ban aktif tersinkronisasi ke Digital Twin.`,
                );
              }}
            />
          )}

          {activeView === "fleet-health" && (
            <FleetHealthDashboardView
              truckList={fleet.truckList}
              chassisList={fleet.chassisList}
              warehouseTires={fleet.warehouseTires}
              onSelectTruck={(truckId) => {
                fleet.setSelectedTruckId(truckId);
                setActiveView("digital-twin");
              }}
              onNavigateCoupling={() => setActiveView("coupling")}
              onNavigateUpdateTires={(plateNumber) => {
                if (plateNumber) {
                  const target = fleet.truckList.find((t) => {
                    return t.plateNumber === plateNumber;
                  });
                  if (target) {
                    fleet.setSelectedTruckId(target.id);
                    fleet.setSelectedSlot(null);
                  }
                }
                setActiveView("digital-twin");
              }}
            />
          )}

          {activeView === "coupling" && (
            <TruckCouplingView
              truckList={fleet.truckList}
              chassisList={fleet.chassisList}
              onCouple={fleet.handleCoupleChassis}
              onUncouple={fleet.handleUncoupleChassis}
            />
          )}

          {activeView === "vehicle-inspection" && (
            <VehicleInspectionView
              onSuccessSubmit={(unitCode) => {
                addToast(
                  "success",
                  `BAP Inspeksi Fisik Unit ${unitCode} Berhasil Disahkan!`,
                  "Dokumen telah tersimpan dan siap dicetak untuk arsip pool/supir.",
                );
              }}
            />
          )}

          {activeView === "inventory" && (
            <TireInventoryView
              truckList={fleet.truckList}
              warehouseTires={fleet.warehouseTires}
              onReceiveNewTire={() => setIsReceiveModalOpen(true)}
            />
          )}

          {activeView === "history" && (
            <TireHistoryView historyLogs={fleet.historyLogs} />
          )}

          {activeView === "cpk-analytics" && <TireAnalyticsView />}

          {activeView === "audit-schedule" && (
            <TireAuditScheduleView
              truckList={fleet.truckList}
              onRescheduleTruck={fleet.handleRescheduleTruck}
            />
          )}
        </main>
      </div>

      {/* Modal Inspeksi Surveyor */}
      <TireInspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        slot={fleet.selectedSlot}
        truckUnitCode={fleet.activeTruck.unitCode}
        currentOdometer={fleet.activeTruck.currentOdometer}
        onSaveInspection={(t, odo) => {
          fleet.handleSaveInspection(t, odo);
          addToast(
            "success",
            `Audit Roda ${t.currentPosition} Berhasil Disimpan`,
          );
        }}
        onSaveAndNext={fleet.handleSaveAndNext}
      />

      {/* Modal Rotasi Ban Mekanik */}
      <TireRotationModal
        isOpen={isRotationModalOpen}
        onClose={() => setIsRotationModalOpen(false)}
        sourceSlot={fleet.selectedSlot}
        allTruckTires={fleet.activeTruck.tires}
        warehouseTires={fleet.warehouseTires}
        chassisType={fleet.activeTruck.chassisType}
        truckUnitCode={fleet.activeTruck.unitCode}
        currentOdometer={fleet.activeTruck.currentOdometer}
        onExecuteRotation={fleet.handleExecuteRotation}
      />

      {/* Modal Terima Ban Gudang */}
      <ReceiveTireModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        onConfirmReceive={fleet.handleConfirmReceiveTire}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
