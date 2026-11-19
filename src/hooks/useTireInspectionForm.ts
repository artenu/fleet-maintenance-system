// src/hooks/useTireInspectionForm.ts
import { useState } from "react";
import type {
  TireAsset,
  RetreadStatus,
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

// Re-export untuk backward-compatibility
export { STANDARD_BRANDS, VISUAL_DAMAGE_OPTIONS };

/**
 * Custom hook untuk mengelola state, perhitungan validasi teknis, dan foto bukti inspeksi ban lapangan
 */
export function useTireInspectionForm({
  tire,
  axleType,
  currentOdometer,
}: UseTireInspectionFormProps) {
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState<boolean>(false);
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
  const [actionRecommendation, setActionRecommendation] =
    useState<ActionRecommendation>(
      tire.actionRecommendation ||
        (initialPercent < INSPECTION_THRESHOLDS.CRITICAL_PHYSICAL_PERCENT
          ? "REPLACE_SERVICE"
          : "KEEP"),
    );
  const [notes, setNotes] = useState<string>(tire.inspectionNotes || "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    tire.photoEvidenceUrl || null,
  );

  const surveyorBadge = `${mockCurrentSurveyor.name} (${mockCurrentSurveyor.nik})`;

  // Toggle checklist temuan kerusakan
  const toggleDamage = (label: string) => {
    setVisualDamages((prev) =>
      prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label],
    );
  };

  // Upload / Jepret Foto Bukti Lapangan
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasSevereDamage = checkHasSevereDamage(visualDamages);

  // Golden Rule #5: Fisik < 40% langsung CRITICAL
  const isPhysicalCritical =
    physicalPercent < INSPECTION_THRESHOLDS.CRITICAL_PHYSICAL_PERCENT ||
    hasSevereDamage;

  // Golden Rule #1: Steer wajib R0 atau R1
  const isSteerViolation =
    isSteer && retreadStatus !== "R0" && retreadStatus !== "R1";

  const liveStatus: "CRITICAL" | "WARNING" | "GOOD" =
    isSteerViolation || isPhysicalCritical
      ? "CRITICAL"
      : physicalPercent < INSPECTION_THRESHOLDS.WARNING_PHYSICAL_PERCENT ||
          pressurePsi < INSPECTION_THRESHOLDS.MIN_PRESSURE_PSI ||
          pressurePsi > INSPECTION_THRESHOLDS.MAX_PRESSURE_PSI
        ? "WARNING"
        : "GOOD";

  const activeBrandName = brand === "Lainnya" ? customBrand || "Custom" : brand;

  // Susun payload hasil audit
  const buildUpdatedTire = (): TireAsset => ({
    ...tire,
    serialNumber: serialNumber.trim() || tire.serialNumber,
    brand: activeBrandName,
    retreadStatus,
    lastInspectionPercent: physicalPercent,
    lastInspectionDate: new Date().toISOString().split("T")[0],
    treadDepthMm,
    pressurePsi,
    visualDamages,
    inspectorName: surveyorBadge,
    inspectionNotes: notes,
    photoEvidenceUrl: photoPreview || undefined,
    actionRecommendation,
  });

  return {
    isFullPreviewOpen,
    setIsFullPreviewOpen,
    serialNumber,
    setSerialNumber,
    brand,
    setBrand,
    customBrand,
    setCustomBrand,
    retreadStatus,
    setRetreadStatus,
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
    actionRecommendation,
    setActionRecommendation,
    notes,
    setNotes,
    photoPreview,
    setPhotoPreview,
    handlePhotoCapture,
    hasSevereDamage,
    isPhysicalCritical,
    isSteerViolation,
    liveStatus,
    surveyorBadge,
    buildUpdatedTire,
    isSteer,
  };
}
