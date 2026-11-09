import { useState } from "react";
import Sidebar, { TireMaintenanceView } from "./components/layout/Sidebar";
import TireInspectionModal from "./components/TireInspectionModal";
import TireRotationModal, {
  RotationResultPayload,
} from "./components/TireRotationModal";

// Views Terisolasi
import DigitalTwinView from "./views/DigitalTwinView";
import AddNewTruckView from "./views/AddNewTruckView";
import TireInventoryView from "./views/TireInventoryView";
import TireHistoryView from "./views/TireHistoryView";
import TireAnalyticsView from "./views/TireAnalyticsView";
import TireAuditScheduleView from "./views/TireAuditScheduleView";

import {
  mockTruckTireList,
  mockWarehouseTires,
  TruckFleetTireItem,
} from "./data/mockTires";
import { TireAsset, WheelSlotEvaluation, WheelPosition } from "./types/tires";
import { evaluateWheelSlot } from "./utils/tireCalculations";
import { Truck } from "lucide-react";
import ReceiveTireModal from "./components/ReceiveTireModal";
import ToastContainer, { ToastMessage } from "./components/common/Toast";

export default function App() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (
    type: "success" | "warning" | "info",
    title: string,
    description?: string,
  ) => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      type,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. State Navigasi & Sidebar
  const [activeView, setActiveView] =
    useState<TireMaintenanceView>("digital-twin");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // 2. State Data Armada & Stok Gudang
  const [truckList, setTruckList] =
    useState<TruckFleetTireItem[]>(mockTruckTireList);
  const [warehouseTires, setWarehouseTires] =
    useState<TireAsset[]>(mockWarehouseTires);

  // 3. State Pilihan Unit Truk & Slot Roda
  const [selectedTruckId, setSelectedTruckId] = useState<string>(
    mockTruckTireList[0].id,
  );
  const [selectedSlot, setSelectedSlot] = useState<WheelSlotEvaluation | null>(
    null,
  );

  // 4. State Modal Interaktif
  const [isInspectionModalOpen, setIsInspectionModalOpen] =
    useState<boolean>(false);
  const [isRotationModalOpen, setIsRotationModalOpen] =
    useState<boolean>(false);

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState<boolean>(false);

  // Truk yang sedang aktif
  const activeTruck =
    truckList.find((t) => t.id === selectedTruckId) || truckList[0];

  // Hitung unit overdue untuk indikator Sidebar
  const overdueCount = truckList.filter(
    (t) => t.auditSchedule.status === "OVERDUE",
  ).length;

  // Handler Simpan Hasil Audit Fisik Surveyor
  const handleSaveInspection = (
    updatedTire: TireAsset,
    newOdometer: number,
  ) => {
    setTruckList((prevList) =>
      prevList.map((truck) => {
        if (truck.id !== activeTruck.id) return truck;

        const updatedTires = truck.tires.map((t) =>
          t.id === updatedTire.id ? updatedTire : t,
        );

        return {
          ...truck,
          currentOdometer: Math.max(truck.currentOdometer, newOdometer),
          tires: updatedTires,
        };
      }),
    );

    const refreshedSlot = evaluateWheelSlot(
      updatedTire.currentPosition,
      updatedTire,
      newOdometer,
    );
    setSelectedSlot(refreshedSlot);
  };

  // Handler Eksekusi Rotasi / Mutasi Ban
  const handleExecuteRotation = (payload: RotationResultPayload) => {
    if (payload.mode === "SWAP_POSITION" && payload.targetPosition) {
      setTruckList((prevList) =>
        prevList.map((truck) => {
          if (truck.id !== activeTruck.id) return truck;

          const updatedTires = truck.tires.map((t) => {
            if (t.id === payload.sourceTire.id) {
              return { ...t, currentPosition: payload.targetPosition! };
            }
            if (payload.targetTire && t.id === payload.targetTire.id) {
              return { ...t, currentPosition: payload.sourcePosition };
            }
            return t;
          });

          return { ...truck, tires: updatedTires };
        }),
      );
    } else if (
      payload.mode === "REPLACE_FROM_WAREHOUSE" &&
      payload.warehouseTireToInstall
    ) {
      const newTireForTruck: TireAsset = {
        ...payload.warehouseTireToInstall,
        currentVehicleId: activeTruck.id,
        currentPosition: payload.sourcePosition,
        installOdometer: payload.odometer,
        lastInspectionDate: new Date().toISOString().split("T")[0],
      };

      const tireMovedToWarehouse: TireAsset = {
        ...payload.sourceTire,
        currentVehicleId: null,
        currentPosition: payload.sourceTireDestination || "GUDANG",
      };

      setTruckList((prevList) =>
        prevList.map((truck) => {
          if (truck.id !== activeTruck.id) return truck;

          const filteredTires = truck.tires.filter(
            (t) => t.id !== payload.sourceTire.id,
          );
          return { ...truck, tires: [...filteredTires, newTireForTruck] };
        }),
      );

      setWarehouseTires((prevWH) => {
        const withoutUsed = prevWH.filter(
          (w) => w.id !== payload.warehouseTireToInstall!.id,
        );
        return [...withoutUsed, tireMovedToWarehouse];
      });
    }

    setSelectedSlot(null);
  };

  // Handler Izin Reschedule Audit
  const handleRescheduleTruck = (
    truckId: string,
    reason: string,
    newDate: string,
  ) => {
    setTruckList((prev) =>
      prev.map((t) =>
        t.id === truckId
          ? {
              ...t,
              auditSchedule: {
                ...t.auditSchedule,
                status: "RESCHEDULED",
                nextAuditSchedule: newDate,
                rescheduleReason: reason,
              },
            }
          : t,
      ),
    );
  };

  // Handler Emergency Swap Ban Serep (S1) - Edge Case #3
  const handleEmergencySwapSpare = (position: WheelPosition) => {
    setTruckList((prevList) =>
      prevList.map((truck) => {
        if (truck.id !== activeTruck.id) return truck;

        const updatedTires = truck.tires.map((t) => {
          if (t.currentPosition === position) {
            return { ...t, currentPosition: "S1" as WheelPosition };
          }
          if (t.currentPosition === "S1") {
            return { ...t, currentPosition: position };
          }
          return t;
        });

        return { ...truck, tires: updatedTires };
      }),
    );

    setSelectedSlot(null);
  };

  // Handler Toleransi Mekanik (+5.000 KM Override) - Edge Case #4
  const handleApplyMechanicOverride = (
    position: WheelPosition,
    mechanicName: string,
    reason: string,
  ) => {
    let updatedTireRef: TireAsset | null = null;

    setTruckList((prevList) =>
      prevList.map((truck) => {
        if (truck.id !== activeTruck.id) return truck;

        const updatedTires = truck.tires.map((t) => {
          if (t.currentPosition === position) {
            const overridden: TireAsset = {
              ...t,
              isMechanicOverridden: true,
              overrideReason: reason,
              overrideApprovedBy: mechanicName,
            };
            updatedTireRef = overridden;
            return overridden;
          }
          return t;
        });

        return { ...truck, tires: updatedTires };
      }),
    );

    if (updatedTireRef) {
      const refreshedSlot = evaluateWheelSlot(
        position,
        updatedTireRef,
        activeTruck.currentOdometer,
      );
      setSelectedSlot(refreshedSlot);
    }
  };

  // Handler Penerimaan Ban Baru / Vulkanisir ke Gudang Pool - Edge Case #2 & #6
  const handleConfirmReceiveTire = (newTire: TireAsset) => {
    setWarehouseTires((prev) => [newTire, ...prev]);
  };

  // Handler Mode Inspeksi Berantai Surveyor (Rapid Inspection Flow)
  const handleSaveAndNext = (updatedTire: TireAsset, newOdometer: number) => {
    handleSaveInspection(updatedTire, newOdometer);

    addToast(
      "success",
      `Audit Posisi ${updatedTire.currentPosition} Tersimpan`,
      `Kondisi fisik: ${updatedTire.lastInspectionPercent}%, Odo: ${newOdometer.toLocaleString("id-ID")} KM`,
    );

    // Urutan posisi inspeksi fisik roda
    const auditSequence: WheelPosition[] = [
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "C1",
      "C2",
      "C3",
      "C4",
      "C5",
      "C6",
      "C7",
      "C8",
      ...(activeTruck.chassisType === "3_AXLE"
        ? (["C9", "C10", "C11", "C12"] as WheelPosition[])
        : []),
      "S1",
    ];

    const currentIndex = auditSequence.indexOf(updatedTire.currentPosition);
    const nextIndex = (currentIndex + 1) % auditSequence.length;
    const nextPosition = auditSequence[nextIndex];

    const nextTire =
      activeTruck.tires.find((t) => t.currentPosition === nextPosition) || null;
    const nextSlot = evaluateWheelSlot(
      nextPosition,
      nextTire,
      Math.max(activeTruck.currentOdometer, newOdometer),
    );

    setSelectedSlot(nextSlot);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      {/* 1. Sidebar Navigasi Kiri */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        overdueCount={overdueCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* 2. Area Konten Utama Kanan */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md px-8 py-3.5 shadow-2xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isSidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(false)}
                  title="Buka Sidebar"
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition">
                  <Truck size={16} className="text-red-600" />
                </button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {activeView === "digital-twin" &&
                      "Digital Twin & Visualizer Roda"}
                    {activeView === "add-truck" &&
                      "Tambah Unit Truk Baru & Registrasi Ban"}
                    {activeView === "inventory" && "Master Stok & Gudang Ban"}
                    {activeView === "history" && "Log Mutasi & Rotasi Ban"}
                    {activeView === "cpk-analytics" &&
                      "Analitik Biaya & Durabilitas Merk (CPK)"}
                    {activeView === "audit-schedule" &&
                      "Jadwal Audit Fisik & Penundaan Izin"}
                  </h1>
                  <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                    PORTAL POOL
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Pemantauan Siklus Hidup Ban & Telematics IoT Hino Connect
                </p>
              </div>
            </div>

            {/* Selector Unit Truk (Muncul di Digital Twin) */}
            {activeView === "digital-twin" && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Pilih Unit Truk:
                </span>
                <select
                  value={selectedTruckId}
                  onChange={(e) => {
                    setSelectedTruckId(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                  {truckList.map((truck) => (
                    <option key={truck.id} value={truck.id}>
                      {truck.unitCode} ({truck.plateNumber}) • {truck.capacity}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {activeView === "add-truck" && (
              <AddNewTruckView
                onSaveNewTruck={(newTruck) => {
                  setTruckList((prevList) => [newTruck, ...prevList]);
                  setSelectedTruckId(newTruck.id);
                  addToast(
                    "success",
                    `Unit Truk ${newTruck.unitCode} Berhasil Didaftarkan!`,
                    `Total ${newTruck.tires.length} ban tercatat lengkap dan masuk ke Digital Twin.`,
                  );
                  setActiveView("digital-twin");
                }}
              />
            )}
          </div>
        </header>

        {/* Dynamic Body Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-6 space-y-6">
          {activeView === "digital-twin" && (
            <DigitalTwinView
              activeTruck={activeTruck}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              onOpenInspection={() => setIsInspectionModalOpen(true)}
              onOpenRotation={() => setIsRotationModalOpen(true)}
              onEmergencySwapSpare={handleEmergencySwapSpare}
              onApplyMechanicOverride={handleApplyMechanicOverride}
            />
          )}

          {activeView === "inventory" && (
            <TireInventoryView
              truckList={truckList}
              warehouseTires={warehouseTires}
              onReceiveNewTire={() => setIsReceiveModalOpen(true)}
            />
          )}

          {activeView === "history" && <TireHistoryView />}

          {activeView === "cpk-analytics" && <TireAnalyticsView />}

          {activeView === "audit-schedule" && (
            <TireAuditScheduleView
              truckList={truckList}
              onRescheduleTruck={handleRescheduleTruck}
            />
          )}
        </main>
      </div>

      {/* Modal Inspeksi / Audit Bulanan Surveyor */}
      <TireInspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        slot={selectedSlot}
        truckUnitCode={activeTruck.unitCode}
        currentOdometer={activeTruck.currentOdometer}
        onSaveInspection={(t, odo) => {
          handleSaveInspection(t, odo);
          addToast(
            "success",
            `Audit Roda ${t.currentPosition} Berhasil Disimpan`,
          );
        }}
        onSaveAndNext={handleSaveAndNext}
      />

      {/* Modal Rotasi & Mutasi Ban Mekanik */}
      <TireRotationModal
        isOpen={isRotationModalOpen}
        onClose={() => setIsRotationModalOpen(false)}
        sourceSlot={selectedSlot}
        allTruckTires={activeTruck.tires}
        warehouseTires={warehouseTires}
        chassisType={activeTruck.chassisType}
        truckUnitCode={activeTruck.unitCode}
        currentOdometer={activeTruck.currentOdometer}
        onExecuteRotation={handleExecuteRotation}
      />

      <ReceiveTireModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        onConfirmReceive={handleConfirmReceiveTire}
      />

      {/* Container Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
