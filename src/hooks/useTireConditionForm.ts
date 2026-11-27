// src/hooks/useTireConditionForm.ts
import { useState, useMemo } from "react";
import type {
  ChassisType,
  TireAsset,
  WheelPosition,
  TruckFleetTireItem,
} from "@/types/TireManagement/tires";
import type { SearchableOption } from "@/types/components/forms/formsTypes";
import { mockCurrentSurveyor } from "@/types/auth/auth";
import { getWheelPositionDescription } from "@/constants/truck";
import { TIRE_THRESHOLDS } from "@/constants/truck/tireRules";
import { addYearsToDateString } from "@/utils/tireManagement/tireCalculations";
import {
  DEFAULT_FALLBACK_CHASSIS_CODE,
  DEFAULT_FALLBACK_ODOMETER,
  getWheelPositionsByChassisType,
  INITIAL_TIRES_DATA,
  getDefaultTireInputForSlot,
  DEFAULT_COMPILED_TIRE_FALLBACK,
} from "@/constants/addNewTruck";
import {
  mockCentralTruckApiResponse,
  deriveChassisTypeFromCapacity,
} from "@/data/MockCentralTruckApi";
import { getOdometerKmByVin } from "@/data/MockHinoIotApi";
import { AUDIT_RULES } from "@/constants/auditSchedule/auditRules";
import { addDays } from "@/utils/auditSchedule";
import type {
  TireInputData,
  UseTireConditionFormProps,
} from "@/types/AddNewTruckView/AddNewTruckViewTypes";

export function useTireConditionForm({
  existingTrucks = [],
  chassisList = [],
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
    defaultTruck.currentChassisCode || DEFAULT_FALLBACK_CHASSIS_CODE,
  );
  const [truckBrand, setTruckBrand] = useState<string>(
    `${defaultTruck.brand} ${defaultTruck.type}`,
  );
  const [chassisType, setChassisType] = useState<ChassisType>(
    deriveChassisTypeFromCapacity(defaultTruck.capacity),
  );
  const [odometer, setOdometer] = useState<number>(
    getOdometerKmByVin(defaultTruck.vin, DEFAULT_FALLBACK_ODOMETER),
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
    return getWheelPositionsByChassisType(chassisType);
  }, [chassisType]);

  // Handler Ganti Nomor Polisi
  const handleSelectPlateNumber = (selectedPlate: string) => {
    const existing = existingTrucks.find(
      (t) => t.plateNumber === selectedPlate,
    );
    const target = mockCentralTruckApiResponse.find(
      (t) => t.plateNumber === selectedPlate,
    );

    // Cari sasis yang sedang aktif digandeng oleh unit ini
    const truckId = existing ? existing.id : target?.unitCode;
    const activeChassis = chassisList.find((c) => c.attachedHeadId === truckId);

    if (existing) {
      setPlateNumber(existing.plateNumber);
      setUnitCode(existing.unitCode);
      setChassisCode(
        activeChassis ? activeChassis.chassisCode : `CHS-${existing.unitCode}`,
      );
      setTruckBrand(existing.brand);
      setChassisType(activeChassis ? activeChassis.type : existing.chassisType);
      setDriverName(existing.driver);
      setOdometer(existing.currentOdometer);
      setActiveSlot("H1");

      // 👇 SINKRONISASI: Muat data ban yang sudah ada di truk ini
      if (existing.tires && existing.tires.length > 0) {
        const loadedTires: Record<string, TireInputData> = {};
        existing.tires.forEach((t) => {
          loadedTires[t.currentPosition] = {
            serialNumber: t.serialNumber,
            brand: t.brand,
            pattern: "Standar",
            retreadStatus: t.retreadStatus,
            pressurePsi: t.pressurePsi || 120,
            treadDepthMm: t.treadDepthMm || 14,
            physicalPercent: t.lastInspectionPercent || 85,
            damages: t.visualDamages || ["Normal"],
            photoUrl: t.photoEvidenceUrl || null,
          };
        });
        setTiresData(loadedTires);
      }
    } else if (target) {
      setPlateNumber(target.plateNumber);
      setUnitCode(target.unitCode);
      setChassisCode(
        activeChassis
          ? activeChassis.chassisCode
          : target.currentChassisCode || `CHS-${target.unitCode}`,
      );
      setTruckBrand(`${target.brand} ${target.type}`);
      setChassisType(
        activeChassis
          ? activeChassis.type
          : deriveChassisTypeFromCapacity(target.capacity),
      );
      setDriverName(target.defaultDriver);
      setOdometer(getOdometerKmByVin(target.vin, DEFAULT_FALLBACK_ODOMETER));
      setActiveSlot("H1");
    }
  };

  // State Data Ban Per Roda
  const [tiresData, setTiresData] =
    useState<Record<string, TireInputData>>(INITIAL_TIRES_DATA);

  // Modal Lightbox Foto
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form Ban Posisi Aktif
  const currentTireForm: TireInputData =
    tiresData[activeSlot] || getDefaultTireInputForSlot(activeSlot);

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
        brand: DEFAULT_COMPILED_TIRE_FALLBACK.brand,
        pattern: DEFAULT_COMPILED_TIRE_FALLBACK.pattern,
        retreadStatus: pos === "H1" || pos === "H2" ? "R0" : "R1",
        pressurePsi: DEFAULT_COMPILED_TIRE_FALLBACK.pressurePsi,
        treadDepthMm: DEFAULT_COMPILED_TIRE_FALLBACK.treadDepthMm,
        physicalPercent: DEFAULT_COMPILED_TIRE_FALLBACK.physicalPercent,
        damages: DEFAULT_COMPILED_TIRE_FALLBACK.damages,
        photoUrl: null,
      };

      return {
        id: `TIRE-${unitCode}-${pos}-${idx}`,
        serialNumber: data.serialNumber || `SN-${unitCode}-${pos}`,
        brand:
          `${data.brand} ${data.pattern ? `/ ${data.pattern}` : ""}`.trim(),
        size: DEFAULT_COMPILED_TIRE_FALLBACK.size,
        retreadStatus: data.retreadStatus,
        currentVehicleId: unitCode,
        currentPosition: pos,
        installOdometer: odometer,
        installDate: inspectionDate,
        expiryDate:
          data.retreadStatus === "R0"
            ? addYearsToDateString(
                inspectionDate,
                TIRE_THRESHOLDS.NEW_TIRE_USAGE_EXPIRY_YEARS,
              )
            : undefined,
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
        nextAuditSchedule: addDays(inspectionDate, AUDIT_RULES.CYCLE_DAYS),
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
