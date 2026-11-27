// src/hooks/useTireInspectionForm.ts
import { useState } from "react";
import type {
  TireAsset,
  RetreadStatus,
  RetreadCycleKey,
  TirePunctureByCycle,
  ActionRecommendation,
} from "@/types/TireManagement/tires";
import type { UseTireInspectionFormProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import { mockCurrentSurveyor } from "@/types/auth/auth";
import {
  STANDARD_BRANDS,
  VISUAL_DAMAGE_OPTIONS,
  checkHasSevereDamage,
  INSPECTION_THRESHOLDS,
} from "@/constants/digitalTwin";
import { formatDateOnly } from "@/utils/auditSchedule";
import {
  getTirePhotos,
  getTotalPunctureCount,
  addYearsToDateString,
} from "@/utils/tireManagement/tireCalculations";
import { TIRE_THRESHOLDS } from "@/constants/truck/tireRules";

// Re-export untuk backward-compatibility
export { STANDARD_BRANDS, VISUAL_DAMAGE_OPTIONS };

function buildInitialPunctureByCycle(tire: TireAsset): TirePunctureByCycle {
  if (tire.punctureByCycle) {
    return {
      R0: tire.punctureByCycle.R0 || 0,
      R1: tire.punctureByCycle.R1 || 0,
      R2: tire.punctureByCycle.R2 || 0,
      R3: tire.punctureByCycle.R3 || 0,
    };
  }
  const existingCount = tire.punctureCount || 0;
  const cycleKey: RetreadCycleKey =
    tire.retreadStatus === "AFKIR" ? "R3" : tire.retreadStatus;
  return {
    R0: cycleKey === "R0" ? existingCount : 0,
    R1: cycleKey === "R1" ? existingCount : 0,
    R2: cycleKey === "R2" ? existingCount : 0,
    R3: cycleKey === "R3" ? existingCount : 0,
  };
}

/**
 * Custom hook untuk mengelola state, perhitungan validasi teknis, multi-foto, & riwayat tambal ban lapangan
 */
export function useTireInspectionForm({
  tire,
  axleType,
  currentOdometer,
}: UseTireInspectionFormProps) {
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState<number | null>(
    null,
  );
  const isSteer = axleType === "steer";
  const initialPercent =
    tire.lastInspectionPercent || INSPECTION_THRESHOLDS.DEFAULT_INITIAL_PERCENT;

  // State Formulir Inspeksi Lapangan
  const [serialNumber, setSerialNumber] = useState<string>(tire.serialNumber);
  const [brand, setBrand] = useState<string>(tire.brand);
  const [customBrand, setCustomBrand] = useState<string>("");
  const [retreadStatus, setRetreadStatus] = useState<RetreadStatus>(
    tire.retreadStatus,
  );
  const [inspectionDate, setInspectionDate] = useState<string>(
    formatDateOnly(new Date()),
  );
  const [odometer, setOdometer] = useState<number>(currentOdometer);
  const [pressurePsi, setPressurePsi] = useState<number>(
    tire.pressurePsi || INSPECTION_THRESHOLDS.DEFAULT_PRESSURE_PSI,
  );
  const [treadDepthMm, setTreadDepthMm] = useState<number>(
    tire.treadDepthMm || Math.max(2, Math.round((initialPercent / 100) * 15)),
  );
  const [physicalPercent, setPhysicalPercent] =
    useState<number>(initialPercent);
  const [visualDamages, setVisualDamages] = useState<string[]>(
    tire.visualDamages || [],
  );
  const [punctureByCycle, setPunctureByCycle] = useState<TirePunctureByCycle>(
    () => buildInitialPunctureByCycle(tire),
  );
  const [actionRecommendation, setActionRecommendation] =
    useState<ActionRecommendation>(
      tire.actionRecommendation ||
        (initialPercent < INSPECTION_THRESHOLDS.CRITICAL_PHYSICAL_PERCENT
          ? "REPLACE_SERVICE"
          : "KEEP"),
    );
  const [notes, setNotes] = useState<string>(tire.inspectionNotes || "");
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(() =>
    getTirePhotos(tire),
  );

  const surveyorBadge = `${mockCurrentSurveyor.name} (${mockCurrentSurveyor.nik})`;

  // Toggle checklist temuan kerusakan
  const toggleDamage = (label: string) => {
    setVisualDamages((prev) =>
      prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label],
    );
  };

  // Update jumlah tambal/bocor per siklus casing (R0, R1, R2, R3)
  const handleChangePunctureForCycle = (
    cycle: RetreadCycleKey,
    count: number,
  ) => {
    const safeCount = Math.max(0, Number.isFinite(count) ? Math.floor(count) : 0);
    setPunctureByCycle((prev) => {
      const next = { ...prev, [cycle]: safeCount };
      const nextTotal = getTotalPunctureCount({ punctureByCycle: next });
      if (nextTotal >= INSPECTION_THRESHOLDS.MAX_PUNCTURE_BEFORE_AFKIR) {
        setActionRecommendation("REPLACE_SERVICE");
      }
      return next;
    });
  };

  // Upload / Jepret Beberapa Foto Bukti Lapangan
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const resultUrl = reader.result;
          setPhotoPreviews((prev) => [...prev, resultUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleDeletePhoto = (index: number) => {
    setPhotoPreviews((prev) => prev.filter((_, idx) => idx !== index));
    if (previewPhotoIndex === index) {
      setPreviewPhotoIndex(null);
    }
  };

  const totalPunctures = getTotalPunctureCount({ punctureByCycle });
  const isAfkirMandatory =
    totalPunctures >= INSPECTION_THRESHOLDS.MAX_PUNCTURE_BEFORE_AFKIR;

  const hasSevereDamage = checkHasSevereDamage(visualDamages);

  // Golden Rule #5: Fisik < 40% langsung CRITICAL
  const isPhysicalCritical =
    physicalPercent < INSPECTION_THRESHOLDS.CRITICAL_PHYSICAL_PERCENT ||
    hasSevereDamage;

  // Golden Rule #1: Steer wajib R0 atau R1 (R2/R3/AFKIR dilarang, R1 beri warning)
  const isSteerViolation =
    isSteer && retreadStatus !== "R0" && retreadStatus !== "R1";
  const isSteerRetreadWarning = isSteer && retreadStatus === "R1";

  const liveStatus: "CRITICAL" | "WARNING" | "GOOD" =
    isSteerViolation ||
    isPhysicalCritical ||
    isAfkirMandatory ||
    retreadStatus === "AFKIR"
      ? "CRITICAL"
      : isSteerRetreadWarning ||
          totalPunctures ===
            INSPECTION_THRESHOLDS.MAX_PUNCTURE_BEFORE_AFKIR - 1 ||
          physicalPercent < INSPECTION_THRESHOLDS.WARNING_PHYSICAL_PERCENT ||
          pressurePsi < INSPECTION_THRESHOLDS.MIN_PRESSURE_PSI ||
          pressurePsi > INSPECTION_THRESHOLDS.MAX_PRESSURE_PSI
        ? "WARNING"
        : "GOOD";

  const activeBrandName = brand === "Lainnya" ? customBrand || "Custom" : brand;

  // Susun payload hasil audit
  const buildUpdatedTire = (): TireAsset => {
    const resolvedInstallDate = tire.installDate || inspectionDate;
    const resolvedExpiryDate =
      retreadStatus === "R0"
        ? tire.expiryDate ||
          addYearsToDateString(
            resolvedInstallDate,
            TIRE_THRESHOLDS.NEW_TIRE_USAGE_EXPIRY_YEARS,
          )
        : tire.expiryDate;

    return {
      ...tire,
      serialNumber: serialNumber.trim() || tire.serialNumber,
      brand: activeBrandName,
      retreadStatus,
      installDate: resolvedInstallDate,
      expiryDate: resolvedExpiryDate,
      lastInspectionPercent: physicalPercent,
      lastInspectionDate: inspectionDate,
      treadDepthMm,
      pressurePsi,
      visualDamages,
      punctureByCycle,
      punctureCount: totalPunctures,
      inspectorName: surveyorBadge,
      inspectionNotes: notes,
      photoEvidenceUrls: photoPreviews.length > 0 ? photoPreviews : undefined,
      photoEvidenceUrl: photoPreviews[0] || undefined,
      actionRecommendation: isAfkirMandatory
        ? "REPLACE_SERVICE"
        : actionRecommendation,
    };
  };

  return {
    previewPhotoIndex,
    setPreviewPhotoIndex,
    serialNumber,
    setSerialNumber,
    brand,
    setBrand,
    customBrand,
    setCustomBrand,
    retreadStatus,
    setRetreadStatus,
    inspectionDate,
    setInspectionDate,
    odometer,
    setOdometer,
    pressurePsi,
    setPressurePsi,
    treadDepthMm,
    setTreadDepthMm,
    physicalPercent,
    setPhysicalPercent,
    visualDamages,
    toggleDamage,
    punctureByCycle,
    handleChangePunctureForCycle,
    totalPunctures,
    isAfkirMandatory,
    actionRecommendation,
    setActionRecommendation,
    notes,
    setNotes,
    photoPreviews,
    handlePhotoCapture,
    handleDeletePhoto,
    hasSevereDamage,
    isPhysicalCritical,
    isSteerViolation,
    isSteerRetreadWarning,
    liveStatus,
    surveyorBadge,
    buildUpdatedTire,
    isSteer,
  };
}
