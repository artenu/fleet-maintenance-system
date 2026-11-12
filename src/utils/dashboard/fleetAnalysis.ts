// src/utils/dashboard/fleetAnalysis.ts
import type { TruckFleetTireItem } from "@/data/mockTires";
import type { ChassisTrailerAsset } from "@/types/truck/tires";
import type {
  FleetAnalysisItem,
  FleetFilterTab,
  FleetHealthSummaryStats,
} from "@/types/FleetHealthDashboardView/FleetHealthDashboardViewTypes";

/**
 * Menghitung analisis kesehatan & kelaikan jalan seluruh armada truk dan gandengan sasis.
 * Pure function: bebas dari efek samping (side effects) & React dependencies.
 */
export function calculateFleetAnalysis(
  truckList: TruckFleetTireItem[],
  chassisList: ChassisTrailerAsset[],
): FleetAnalysisItem[] {
  return truckList.map((truck) => {
    const attachedChassis = chassisList.find(
      (c) => c.attachedHeadId === truck.id,
    );

    const tires = truck.tires || [];
    const criticalTires = tires.filter(
      (t) => (t.lastInspectionPercent ?? 100) < 40,
    );
    const afkirTires = tires.filter((t) => t.retreadStatus === "AFKIR");

    // Pelanggaran Golden Rule #1 (Gandar Steer): posisi H1/H2 hanya boleh R0 & R1
    const steerViolations = tires.filter(
      (t) =>
        (t.currentPosition === "H1" || t.currentPosition === "H2") &&
        t.retreadStatus !== "R0" &&
        t.retreadStatus !== "R1",
    );

    const minPercent =
      tires.length > 0
        ? Math.min(...tires.map((t) => t.lastInspectionPercent ?? 100))
        : 100;

    const isAuditOverdue = truck.auditSchedule?.status === "OVERDUE";

    // Status Kelaikan (Fit to Dispatch vs Grounded)
    const isGrounded =
      criticalTires.length > 0 ||
      afkirTires.length > 0 ||
      steerViolations.length > 0;

    return {
      truck,
      attachedChassis,
      tiresCount: tires.length,
      criticalTiresCount: criticalTires.length,
      minPercent,
      isAuditOverdue,
      isGrounded,
    };
  });
}

/**
 * Memfilter daftar analisis armada berdasarkan pencarian teks dan tab status kelaikan.
 * Pure function: deterministic and unit-testable.
 */
export function filterFleetAnalysis(
  fleetAnalysis: FleetAnalysisItem[],
  searchQuery: string,
  statusFilter: FleetFilterTab,
): FleetAnalysisItem[] {
  const query = searchQuery.trim().toLowerCase();

  return fleetAnalysis.filter((item) => {
    const matchesSearch =
      !query ||
      item.truck.unitCode.toLowerCase().includes(query) ||
      item.truck.plateNumber.toLowerCase().includes(query) ||
      item.truck.driver.toLowerCase().includes(query) ||
      (item.attachedChassis?.chassisCode || "").toLowerCase().includes(query);

    if (!matchesSearch) {
      return false;
    }

    if (statusFilter === "FIT") {
      return !item.isGrounded;
    }
    if (statusFilter === "GROUNDED") {
      return item.isGrounded;
    }
    if (statusFilter === "BOBTAIL") {
      return !item.attachedChassis;
    }
    return true;
  });
}

/**
 * Menghitung agregat ringkasan KPI untuk metrik dashboard global pool.
 * Pure function: menghasilkan data ringkasan eksekutif pool.
 */
export function calculateFleetSummaryStats(
  fleetAnalysis: FleetAnalysisItem[],
  totalTrucks: number,
  chassisList: ChassisTrailerAsset[],
): FleetHealthSummaryStats {
  const fitCount = fleetAnalysis.filter((f) => !f.isGrounded).length;
  const groundedCount = fleetAnalysis.filter((f) => f.isGrounded).length;
  const overdueAuditsCount = fleetAnalysis.filter(
    (f) => f.isAuditOverdue,
  ).length;

  const totalChassis = chassisList.length;
  const attachedChassisCount = chassisList.filter(
    (c) => c.status === "ATTACHED",
  ).length;
  const standbyChassisCount = chassisList.filter(
    (c) => c.status === "STANDALONE_POOL",
  ).length;

  return {
    totalTrucks,
    fitCount,
    groundedCount,
    overdueAuditsCount,
    totalChassis,
    attachedChassisCount,
    standbyChassisCount,
  };
}

