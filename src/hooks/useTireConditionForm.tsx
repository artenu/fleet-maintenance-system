// src/hooks/useTireConditionForm.ts
import { useState, useMemo } from "react";
import type { TruckFleetTireItem } from "@/data/mockTires";
import type {
  ChassisType,
  TireAsset,
  WheelPosition,
} from "@/types/truck/tires";
import type { SearchableOption } from "@/types/components/forms/formsTypes";
import { mockCurrentSurveyor } from "@/types/auth/auth";
import { getWheelPositionDescription } from "@/constants/truck";
import {
  mockCentralTruckApiResponse,
  deriveChassisTypeFromCapacity,
} from "@/data/MockCentralTruckApi";
import { getOdometerKmByVin } from "@/data/MockHinoIotApi";
import type {
  TireInputData,
  UseTireConditionFormProps,
} from "@/types/AddNewTruckView/AddNewTruckViewTypes";

export function useTireConditionForm({
  existingTrucks = [],
  onSaveNewTruck,
}: UseTireConditionFormProps) {
  // 1. Deteksi unit truk baru dari database sebelah yang belum didaftarkan bannya di FMS
  const pendingNewTrucks = useMemo(() => {
    return mockCentralTruckApiResponse.filter(
      (centralTruck) =>
        !existingTrucks.some(
          (existing) =>
            existing.unitCode === centralTruck.unitCode ||
            existing.plateNumber === centralTruck.plateNumber,
        ),
    );
  }, [existingTrucks]);

  // Default unit pertama
  const defaultTruck = pendingNewTrucks[0] || mockCentralTruckApiResponse[0];

  // Master Data Truk Terpilih
  const [plateNumber, setPlateNumber] = useState<string>(
    defaultTruck.plateNumber,
  );
  const [unitCode, setUnitCode] = useState<string>(defaultTruck.unitCode);
  const [chassisCode, setChassisCode] = useState<string>(
    defaultTruck.currentChassisCode || "CHS-018",
  );
  const [truckBrand, setTruckBrand] = useState<string>(
    `${defaultTruck.brand} ${defaultTruck.type}`,
  );
  const [chassisType, setChassisType] = useState<ChassisType>(
    deriveChassisTypeFromCapacity(defaultTruck.capacity),
  );
  const [odometer, setOdometer] = useState<number>(
    getOdometerKmByVin(defaultTruck.vin, 76890),
  );
  const [driverName, setDriverName] = useState<string>(
    defaultTruck.defaultDriver,
  );
  const [inspectionDate, setInspectionDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  // Opsi untuk SearchableSelect Combobox
  const plateOptions = useMemo<SearchableOption[]>(() => {
    const pendingOptions: SearchableOption[] = pendingNewTrucks.map((t) => ({
      value: t.plateNumber,
      label: `${t.plateNumber} • Unit ${t.unitCode}`,
      subLabel: `${t.brand} ${t.type} • ${t.capacity} • Supir: ${t.defaultDriver}`,
      badge: "Unit Baru",
      badgeColor: "bg-blue-100 text-blue-800",
    }));

    const allOptions: SearchableOption[] = mockCentralTruckApiResponse.map(
      (t) => ({
        value: t.plateNumber,
        label: `${t.plateNumber} • Unit ${t.unitCode}`,
        subLabel: `${t.brand} ${t.type} • ${t.capacity} • Supir: ${t.defaultDriver}`,
      }),
    );

    return [
      ...pendingOptions,
      ...allOptions.filter(
        (o) => !pendingOptions.some((p) => p.value === o.value),
      ),
    ];
  }, [pendingNewTrucks]);

  // Roda yang aktif
  const [activeSlot, setActiveSlot] = useState<WheelPosition>("H1");

  // Daftar Posisi Roda Sesuai Sasis (14 atau 18 Roda)
  const wheelPositions = useMemo<WheelPosition[]>(() => {
    return [
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
      ...(chassisType === "3_AXLE"
        ? (["C9", "C10", "C11", "C12"] as WheelPosition[])
        : []),
      "S1",
    ];
  }, [chassisType]);

  // Handler Ganti Nomor Polisi
  const handleSelectPlateNumber = (selectedPlate: string) => {
    const target = mockCentralTruckApiResponse.find(
      (t) => t.plateNumber === selectedPlate,
    );
    if (target) {
      setPlateNumber(target.plateNumber);
      setUnitCode(target.unitCode);
      setChassisCode(target.currentChassisCode || `CHS-${target.unitCode}`);
      setTruckBrand(`${target.brand} ${target.type}`);
      setChassisType(deriveChassisTypeFromCapacity(target.capacity));
      setDriverName(target.defaultDriver);
      setOdometer(getOdometerKmByVin(target.vin, 76890));
      setActiveSlot("H1");
    }
  };

  // State Data Ban Per Roda
  const [tiresData, setTiresData] = useState<Record<string, TireInputData>>({
    H1: {
      serialNumber: "BS-2024-9988",
      brand: "Bridgestone",
      pattern: "R168",
      retreadStatus: "R0",
      pressurePsi: 110,
      treadDepthMm: 8.5,
      physicalPercent: 65,
      damages: ["Normal"],
      photoUrl:
        "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80",
    },
  });

  // Modal Lightbox Foto
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form Ban Posisi Aktif
  const currentTireForm: TireInputData = tiresData[activeSlot] || {
    serialNumber: "",
    brand: "Bridgestone",
    pattern: "R168",
    retreadStatus: activeSlot === "H1" || activeSlot === "H2" ? "R0" : "R1",
    pressurePsi: 110,
    treadDepthMm: 14.0,
    physicalPercent: 90,
    damages: ["Normal"],
    photoUrl: null,
  };

  // Helper update data ban
  const updateCurrentTire = (patch: Partial<TireInputData>) => {
    setTiresData((prev) => ({
      ...prev,
      [activeSlot]: {
        ...currentTireForm,
        ...patch,
      },
    }));
  };

  // Toggle Cacat Kerusakan
  const handleToggleDamage = (label: string) => {
    let currentDamages = [...currentTireForm.damages];
    if (label === "Normal") {
      updateCurrentTire({ damages: ["Normal"] });
      return;
    }

    currentDamages = currentDamages.filter((d) => d !== "Normal");
    if (currentDamages.includes(label)) {
      currentDamages = currentDamages.filter((d) => d !== label);
      if (currentDamages.length === 0) {
        currentDamages = ["Normal"];
      }
    } else {
      currentDamages.push(label);
    }
    updateCurrentTire({ damages: currentDamages });
  };

  // Upload/Kamera Foto
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCurrentTire({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Lanjut Roda Berikutnya
  const handleNextWheel = () => {
    const currentIndex = wheelPositions.indexOf(activeSlot);
    const nextIndex = (currentIndex + 1) % wheelPositions.length;
    setActiveSlot(wheelPositions[nextIndex]);
  };

  // Jumlah Roda Terisi
  const completedWheelsCount = wheelPositions.filter(
    (pos) => tiresData[pos] && tiresData[pos].serialNumber.trim() !== "",
  ).length;

  // Label Deskripsi Roda
  const getSlotDescription = (pos: WheelPosition) => {
    return getWheelPositionDescription(pos);
  };

  // Validasi Golden Rule Kemudi Steer
  const isSteer = activeSlot === "H1" || activeSlot === "H2";
  const isSteerViolation =
    isSteer &&
    currentTireForm.retreadStatus !== "R0" &&
    currentTireForm.retreadStatus !== "R1";

  // Simpan Truk
  const handleRegisterTruck = () => {
    const surveyorBadge = `${mockCurrentSurveyor.name} (${mockCurrentSurveyor.nik})`;
    const compiledTires: TireAsset[] = wheelPositions.map((pos, idx) => {
      const data = tiresData[pos] || {
        serialNumber: `SN-${unitCode}-${pos}`,
        brand: "Super Grip / MI RFD",
        pattern: "Standar",
        retreadStatus: pos === "H1" || pos === "H2" ? "R0" : "R1",
        pressurePsi: 115,
        treadDepthMm: 12.0,
        physicalPercent: 80,
        damages: ["Normal"],
        photoUrl: null,
      };

      return {
        id: `TIRE-${unitCode}-${pos}-${idx}`,
        serialNumber: data.serialNumber || `SN-${unitCode}-${pos}`,
        brand:
          `${data.brand} ${data.pattern ? `/ ${data.pattern}` : ""}`.trim(),
        size: "10.00-20 16PR",
        retreadStatus: data.retreadStatus,
        currentVehicleId: unitCode,
        currentPosition: pos,
        installOdometer: odometer,
        lastInspectionPercent: data.physicalPercent,
        lastInspectionDate: inspectionDate,
        treadDepthMm: data.treadDepthMm,
        pressurePsi: data.pressurePsi,
        visualDamages: data.damages,
        inspectorName: surveyorBadge,
        photoEvidenceUrl: data.photoUrl || undefined,
        actionRecommendation:
          data.physicalPercent < 40 ? "REPLACE_SERVICE" : "KEEP",
      };
    });

    const newTruckRecord: TruckFleetTireItem = {
      id: unitCode,
      unitCode,
      plateNumber,
      brand: truckBrand,
      driver: driverName,
      capacity: chassisType === "2_AXLE" ? "20FT" : "40FT",
      chassisType,
      currentOdometer: odometer,
      lastIotSync: "Baru saja terdaftar di pool",
      auditSchedule: {
        period: "November 2026",
        lastAuditDate: inspectionDate,
        nextAuditSchedule: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "COMPLETED",
        surveyorName: surveyorBadge,
        rescheduledTo: null,
        rescheduleReason: null,
      },
      tires: compiledTires,
    };

    onSaveNewTruck(newTruckRecord);
  };

  return {
    pendingNewTrucks,
    plateOptions,
    plateNumber,
    unitCode,
    chassisCode,
    truckBrand,
    chassisType,
    odometer,
    driverName,
    inspectionDate,
    setInspectionDate,
    setChassisType,
    handleSelectPlateNumber,
    wheelPositions,
    activeSlot,
    setActiveSlot,
    completedWheelsCount,
    getSlotDescription,
    currentTireForm,
    updateCurrentTire,
    handleToggleDamage,
    handlePhotoCapture,
    handleNextWheel,
    isSteer,
    isSteerViolation,
    handleRegisterTruck,
    previewImage,
    setPreviewImage,
    tiresData,
  };
}
