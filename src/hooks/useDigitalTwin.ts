// src/hooks/useDigitalTwin.ts
import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import type {
  UseDigitalTwinProps,
  PhotoPreviewState,
} from "@/types/DigitalTwinView/DigitalTwinViewTypes";
import {
  getActiveWheelPositions,
  getCriticalSlots,
  getInstalledActiveTires,
} from "@/utils/tireManagement/wheelLayout";

export function useDigitalTwin({
  activeTruck,
  selectedSlot,
  isBobTail,
  chassisType,
  onEmergencySwapSpare,
  onApplyMechanicOverride,
}: UseDigitalTwinProps) {
  // Modal Preview Foto
  const [previewImage, setPreviewImage] = useState<PhotoPreviewState | null>(
    null,
  );

  // Modal Toleransi Mekanik (+5.000 KM Override)
  const [isOverrideModalOpen, setIsOverrideModalOpen] =
    useState<boolean>(false);
  const [mechanicName, setMechanicName] = useState<string>(
    "Slamet Riyadi (Kepala Mekanik)",
  );
  const [overrideReason, setOverrideReason] = useState<string>(
    "Fisik kembangan masih tebal (>60%) & merata, rute operasional jalan tol datar",
  );
  const [overridePhotoUrl, setOverridePhotoUrl] = useState<string | null>(null);
  const [overrideError, setOverrideError] = useState<string | null>(null);

  // Modal Peringatan Pelanggaran Swap Serep
  const [spareViolationMsg, setSpareViolationMsg] = useState<string | null>(
    null,
  );

  // Data ban serep S1
  const spareTire = useMemo(() => {
    return activeTruck.tires.find((t) => t.currentPosition === "S1");
  }, [activeTruck.tires]);

  const handleOverridePhotoCapture = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setOverridePhotoUrl(reader.result as string);
      setOverrideError(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteOverridePhoto = () => {
    setOverridePhotoUrl(null);
  };

  const handleOpenOverrideModal = () => {
    setOverridePhotoUrl(null);
    setOverrideError(null);
    setIsOverrideModalOpen(true);
  };

  // Handler Aksi Tukar Ban Serep (Golden Rule #1: Steer izinkan R0 & R1 + Warning R1!)
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
        `DILARANG KERAS (Golden Rule #1): Ban serep S1 berstatus ${spareTire.retreadStatus}. Gandar Kemudi (Steer ${selectedSlot.position}) hanya diizinkan ban baru (R0) atau 1x vulkanisir (R1) demi keselamatan manuver kemudi di jalan raya!`,
      );
      return;
    }

    const r1SteerWarning =
      isSteer && spareTire && spareTire.retreadStatus === "R1"
        ? "\n\n⚠️ PERINGATAN STEER (R1): Ban serep S1 adalah ban 1x vulkanisir (R1). Memasang ban vulkanisir di Steer depan memerlukan pengawasan ekstra dan disarankan segera diganti ban baru (R0)."
        : "";

    if (
      window.confirm(
        `Konfirmasi Emergency Roadside Swap:\nTukar posisi ban ${selectedSlot.position} (${selectedSlot.tire.serialNumber}) dengan Ban Serep S1 (${spareTire ? spareTire.serialNumber : "Kosong"})?${r1SteerWarning}`,
      )
    ) {
      onEmergencySwapSpare(selectedSlot.position);
    }
  };

  // Handler Konfirmasi Toleransi Mekanik (Wajib Bukti Foto)
  const handleConfirmOverride = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      return;
    }

    if (!overridePhotoUrl) {
      setOverrideError(
        "Bukti foto kondisi fisik ban wajib dilampirkan untuk menyetujui toleransi +5.000 KM!",
      );
      return;
    }

    onApplyMechanicOverride(
      selectedSlot.position,
      mechanicName,
      overrideReason,
      overridePhotoUrl,
    );
    setOverridePhotoUrl(null);
    setOverrideError(null);
    setIsOverrideModalOpen(false);
  };

  // Evaluasi Kelayakan Jalan Armada (Dispatch Readiness)
  // Hanya posisi roda aktif sesuai layout (S1 / ban serep tidak dihitung)
  const activePositions = useMemo(() => {
    return getActiveWheelPositions(isBobTail, chassisType);
  }, [isBobTail, chassisType]);

  const installedTiresCount = useMemo(() => {
    return getInstalledActiveTires(activeTruck.tires, activePositions).length;
  }, [activeTruck.tires, activePositions]);

  const criticalTires = useMemo(() => {
    return getCriticalSlots(
      activeTruck.tires,
      activePositions,
      activeTruck.currentOdometer,
    );
  }, [activeTruck.tires, activePositions, activeTruck.currentOdometer]);

  const hasNoTires = activeTruck.tires.length === 0;
  const expectedTiresCount = activePositions.length;
  const missingTiresCount = Math.max(
    0,
    expectedTiresCount - installedTiresCount,
  );
  const isTiresIncomplete = !hasNoTires && missingTiresCount > 0;

  // GROUNDED jika: belum ada ban, ada ban kritis, atau ban belum lengkap
  const isGrounded =
    hasNoTires || criticalTires.length > 0 || isTiresIncomplete;

  const readinessPercent = hasNoTires
    ? 0
    : Math.round(
        ((installedTiresCount - criticalTires.length) / expectedTiresCount) *
          100,
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
    overridePhotoUrl,
    overrideError,
    handleOverridePhotoCapture,
    handleDeleteOverridePhoto,
    handleOpenOverrideModal,
    spareViolationMsg,
    setSpareViolationMsg,
    spareTire,
    handleQuickSwapSpare,
    handleConfirmOverride,
    criticalTires,
    isGrounded,
    hasNoTires,
    readinessPercent,
    expectedTiresCount,
    installedTiresCount,
    missingTiresCount,
    isTiresIncomplete,
  };
}
