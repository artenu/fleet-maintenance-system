// src/hooks/useDigitalTwin.ts
import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import type {
  UseDigitalTwinProps,
  PhotoPreviewState,
} from "@/types/DigitalTwinView/DigitalTwinViewTypes";

export function useDigitalTwin({
  activeTruck,
  selectedSlot,
  onEmergencySwapSpare,
  onApplyMechanicOverride,
}: UseDigitalTwinProps) {
  // Modal Preview Foto
  const [previewImage, setPreviewImage] = useState<PhotoPreviewState | null>(
    null,
  );

  // Modal Toleransi Mekanik (+5.000 KM Override)
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState<boolean>(false);
  const [mechanicName, setMechanicName] = useState<string>(
    "Slamet Riyadi (Kepala Mekanik)"
  );
  const [overrideReason, setOverrideReason] = useState<string>(
    "Fisik kembangan masih tebal (>60%) & merata, rute operasional jalan tol datar"
  );

  // Modal Peringatan Pelanggaran Swap Serep
  const [spareViolationMsg, setSpareViolationMsg] = useState<string | null>(null);

  // Data ban serep S1
  const spareTire = useMemo(() => {
    return activeTruck.tires.find((t) => t.currentPosition === "S1");
  }, [activeTruck.tires]);

  // Handler Aksi Tukar Ban Serep (Golden Rule #1: Steer izinkan R0 & R1!)
  const handleQuickSwapSpare = () => {
    if (!selectedSlot || !selectedSlot.tire) {
      return;
    }

    const isSteer =
      selectedSlot.position === "H1" || selectedSlot.position === "H2";

    // Validasi: Steer hanya boleh R0 (Baru) atau R1 (1x Vulkanisir)
    if (
      isSteer &&
      spareTire &&
      spareTire.retreadStatus !== "R0" &&
      spareTire.retreadStatus !== "R1"
    ) {
      setSpareViolationMsg(
        `DILARANG KERAS (Golden Rule #1): Ban serep S1 berstatus ${spareTire.retreadStatus}. Gandar Kemudi (Steer ${selectedSlot.position}) hanya diizinkan ban baru (R0) atau 1x vulkanisir (R1) demi keselamatan manuver kemudi di jalan raya!`
      );
      return;
    }

    if (
      window.confirm(
        `Konfirmasi Emergency Roadside Swap:\nTukar posisi ban ${selectedSlot.position} (${selectedSlot.tire.serialNumber}) dengan Ban Serep S1 (${spareTire ? spareTire.serialNumber : "Kosong"})?`
      )
    ) {
      onEmergencySwapSpare(selectedSlot.position);
    }
  };

  // Handler Konfirmasi Toleransi Mekanik
  const handleConfirmOverride = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      return;
    }

    onApplyMechanicOverride(
      selectedSlot.position,
      mechanicName,
      overrideReason
    );
    setIsOverrideModalOpen(false);
  };

  // Evaluasi Kelayakan Jalan Armada (Dispatch Readiness)
  const criticalTires = useMemo(() => {
    return activeTruck.tires.filter((t) => {
      const isSteer = t.currentPosition === "H1" || t.currentPosition === "H2";
      // Sinkron dengan aturan resmi MOM 4-11-2026: steer boleh R0 dan R1
      const isSteerViolation =
        isSteer && t.retreadStatus !== "R0" && t.retreadStatus !== "R1";
      const isPhysicalCritical = t.lastInspectionPercent < 40;
      const isAfkir = t.retreadStatus === "AFKIR";
      return isSteerViolation || isPhysicalCritical || isAfkir;
    });
  }, [activeTruck.tires]);

  const isGrounded = criticalTires.length > 0;
  const readinessPercent = Math.round(
    ((activeTruck.tires.length - criticalTires.length) /
      (activeTruck.tires.length || 1)) *
      100
  );

  return {
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
    spareTire,
    handleQuickSwapSpare,
    handleConfirmOverride,
    criticalTires,
    isGrounded,
    readinessPercent,
  };
}

