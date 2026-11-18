import { useState, useMemo } from "react";
import Sidebar, { type TireMaintenanceView } from "./components/layout/Sidebar";
import {
  TireInspectionModal,
  TireRotationModal,
} from "./components/digitalTwin";
import type { RotationResultPayload } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import { Select } from "./components/common";

// Views Terisolasi
import DigitalTwinView from "./views/DigitalTwinView";
import TireInventoryView from "./views/TireInventoryView";
import AddNewTruckView from "./views/AddNewTruckView";
import TireHistoryView from "./views/TireHistoryView";
import TireAnalyticsView from "./views/TireAnalyticsView";
import TireAuditScheduleView from "./views/TireAuditScheduleView";
import FleetHealthDashboardView from "./views/FleetHealthDashboardView";
import VehicleInspectionView from "./views/VehicleInspectionView";

import {
  mockTruckTireList,
  mockWarehouseTires,
  type TruckFleetTireItem,
} from "./data/mockTires";
import {
  type TireAsset,
  type WheelPosition,
  type WheelSlotEvaluation,
} from "./types/truck/tires";
import { evaluateWheelSlot } from "./utils/tireCalculations";
import { Truck } from "lucide-react";
import { ReceiveTireModal } from "@/components/tireInventory";
import ToastContainer from "./components/common/Toast";
import type { ToastMessage } from "./types/components/common/commonTypes";

import TruckCouplingView from "./views/TruckCouplingView";
import { mockChassisPoolList } from "./data/mockChassisPool";
import { type ChassisTrailerAsset } from "./types/truck/tires";

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
    useState<TireMaintenanceView>("fleet-health");
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
        if (truck.id !== activeTruck.id) {
          return truck;
        }

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
      const targetPosition = payload.targetPosition; // 👈 1. Simpan ke variabel konstan

      setTruckList((prevList) =>
        prevList.map((truck) => {
          if (truck.id !== activeTruck.id) {
            return truck;
          }

          const updatedTires = truck.tires.map((t) => {
            if (t.id === payload.sourceTire.id) {
              return { ...t, currentPosition: targetPosition }; // 👈 Hapus tanda seru (!)
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
      const warehouseTire = payload.warehouseTireToInstall; // 👈 2. Simpan ke variabel konstan

      const newTireForTruck: TireAsset = {
        ...warehouseTire,
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
          if (truck.id !== activeTruck.id) {
            return truck;
          }

          const filteredTires = truck.tires.filter(
            (t) => t.id !== payload.sourceTire.id,
          );
          return { ...truck, tires: [...filteredTires, newTireForTruck] };
        }),
      );

      setWarehouseTires((prevWH) => {
        const withoutUsed = prevWH.filter(
          (w) => w.id !== warehouseTire.id, // 👈 Hapus tanda seru (!)
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
        if (truck.id !== activeTruck.id) {
          return truck;
        }

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
        if (truck.id !== activeTruck.id) {
          return truck;
        }

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

  // Handler Pasang Ban Baru / Ambil dari Gudang ke Slot Kosong di Digital Twin
  const handleInstallTire = (position: WheelPosition, newTire: TireAsset) => {
    // 1. Tambahkan ban ke armada truk aktif
    setTruckList((prevList) =>
      prevList.map((truck) => {
        if (truck.id !== activeTruck.id) {
          return truck;
        }
        const filteredTires = truck.tires.filter(
          (t) => t.currentPosition !== position,
        );
        return {
          ...truck,
          tires: [...filteredTires, newTire],
        };
      }),
    );

    // 2. Jika ban diambil dari gudang pool, kurangi stok gudang
    setWarehouseTires((prevWH) => prevWH.filter((w) => w.id !== newTire.id));

    // 3. Refresh slot yang terpilih secara real-time
    const refreshedSlot = evaluateWheelSlot(
      position,
      newTire,
      activeTruck.currentOdometer,
    );
    setSelectedSlot(refreshedSlot);

    addToast(
      "success",
      `Ban ${newTire.serialNumber} Berhasil Dipasang di Slot ${position}!`,
      `Status: ${newTire.retreadStatus}, Merk: ${newTire.brand}, Odo Pasang: ${activeTruck.currentOdometer.toLocaleString("id-ID")} KM`,
    );
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

  const [chassisList, setChassisList] =
    useState<ChassisTrailerAsset[]>(mockChassisPoolList);

  const handleCoupleChassis = (
    truckId: string,
    newChassis: ChassisTrailerAsset,
  ) => {
    // Update status sasis di pool
    setChassisList((prev) =>
      prev.map((c) =>
        c.id === newChassis.id
          ? { ...newChassis, status: "ATTACHED", attachedHeadId: truckId }
          : c.attachedHeadId === truckId
            ? { ...c, status: "STANDALONE_POOL", attachedHeadId: null }
            : c,
      ),
    );

    // Update truk agar denah rodanya sinkron dengan konfigurasi sasis baru
    setTruckList((prev) =>
      prev.map((t) =>
        t.id === truckId
          ? {
              ...t,
              capacity: newChassis.lengthCategory,
              chassisType: newChassis.type,
            }
          : t,
      ),
    );
    addToast(
      "success",
      `Sasis ${newChassis.chassisCode} Berhasil Dikaitkan!`,
      `Truk sekarang berkonfigurasi ${newChassis.lengthCategory} (${newChassis.type === "2_AXLE" ? "14 Ban" : "18 Ban"}).`,
    );
  };

  // Handler Lepas Gandengan (Drop to Pool)
  const handleUncoupleChassis = (truckId: string) => {
    setChassisList((prev) =>
      prev.map((c) =>
        c.attachedHeadId === truckId
          ? { ...c, status: "STANDALONE_POOL", attachedHeadId: null }
          : c,
      ),
    );
    addToast(
      "info",
      "Sasis Berhasil Dilepas ke Pool",
      "Kepala truk kini berstatus Bobtail (tanpa sasis).",
    );
  };

  // Hitung jumlah armada yang bannya belum lengkap atau unit baru tanpa ban
  const incompleteTiresTruckCount = useMemo(() => {
    return truckList.filter((truck) => {
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
      return hasNoTires || installedCount < expectedCount;
    }).length;
  }, [truckList, chassisList]);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      {/* 1. Sidebar Navigasi Kiri */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        overdueCount={overdueCount}
        incompleteTiresTruckCount={incompleteTiresTruckCount}
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
                    {activeView === "fleet-health" &&
                      "Executive Fleet Health Dashboard"}
                    {activeView === "digital-twin" &&
                      "Digital Twin & Visualizer Roda"}
                    {activeView === "add-truck" &&
                      "Update Kondisi Ban & Cek Fisik Roda"}
                    {activeView === "coupling" &&
                      "Manajemen Perangkaian Armada (Drop & Hook)"}
                    {activeView === "inventory" && "Master Stok & Gudang Ban"}
                    {activeView === "history" && "Log Mutasi & Rotasi Ban"}
                    {activeView === "cpk-analytics" &&
                      "Analitik Biaya & Durabilitas Merk (CPK)"}
                    {activeView === "audit-schedule" &&
                      "Jadwal Audit Fisik & Penundaan Izin"}
                    {activeView === "vehicle-inspection" &&
                      "Pemeriksaan Fisik Unit & Sasis (Pre-Trip Walkaround)"}
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
              <div className="flex items-center gap-2 min-w-[300px]">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  Pilih Unit Truk:
                </span>
                <Select
                  value={selectedTruckId}
                  onChange={(e) => {
                    setSelectedTruckId(e.target.value);
                    setSelectedSlot(null);
                  }}
                  searchPlaceholder="Cari lambung / plat truk..."
                  options={truckList.map((truck) => {
                    const attachedChassis = chassisList.find(
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
            )}
          </div>
        </header>

        {/* Dynamic Body Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-6 space-y-6">
          {activeView === "digital-twin" && (
            <DigitalTwinView
              activeTruck={activeTruck}
              chassisList={chassisList}
              warehouseTires={warehouseTires}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              truckList={truckList}
              onSelectTruck={(truckId) => {
                setSelectedTruckId(truckId);
                setSelectedSlot(null);
              }}
              onOpenInspection={() => setIsInspectionModalOpen(true)}
              onOpenRotation={() => setIsRotationModalOpen(true)}
              onEmergencySwapSpare={handleEmergencySwapSpare}
              onApplyMechanicOverride={handleApplyMechanicOverride}
              onInstallTire={handleInstallTire}
              onSaveTruckTires={(updatedTruck) => {
                setTruckList((prevList) =>
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
              truckList={truckList}
              chassisList={chassisList}
              warehouseTires={warehouseTires}
              onSelectTruck={(truckId) => {
                setSelectedTruckId(truckId);
                setActiveView("digital-twin");
              }}
              onNavigateCoupling={() => setActiveView("coupling")}
              onNavigateUpdateTires={(_plate) => {
                setActiveView("add-truck");
              }}
            />
          )}

          {activeView === "add-truck" && (
            <AddNewTruckView
              existingTrucks={truckList} // 👈 Agar TRK-001 tidak dideteksi sebagai unit baru
              onSaveNewTruck={(newTruck) => {
                setTruckList((prevList) => {
                  const exists = prevList.some(
                    (t) => t.unitCode === newTruck.unitCode,
                  );
                  if (exists) {
                    return prevList.map((t) =>
                      t.unitCode === newTruck.unitCode ? newTruck : t,
                    );
                  }
                  return [newTruck, ...prevList];
                });
                setSelectedTruckId(newTruck.id);
                addToast(
                  "success",
                  `Data Ban Unit ${newTruck.unitCode} (${newTruck.plateNumber}) Berhasil Disimpan!`,
                  `Total ${newTruck.tires.length} ban tercatat lengkap dan masuk ke Digital Twin.`,
                );
                setActiveView("digital-twin");
              }}
            />
          )}

          {activeView === "coupling" && (
            <TruckCouplingView
              truckList={truckList}
              chassisList={chassisList}
              onCouple={handleCoupleChassis}
              onUncouple={handleUncoupleChassis}
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
