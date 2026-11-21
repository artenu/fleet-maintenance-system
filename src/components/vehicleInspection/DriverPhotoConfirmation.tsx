// src/components/vehicleInspection/DriverPhotoConfirmation.tsx
import { type ChangeEvent } from "react";
import type { VehicleInspectionHeader } from "@/types/VehicleInspection";
import {
  DriverPhotoUploadCard,
  FitForDispatchCard,
  BapSignaturesCard,
  ConfirmationActionBar,
  type InspectionMetricsData,
} from "./confirmation";

export interface DriverPhotoConfirmationProps {
  header: VehicleInspectionHeader;
  driverPhotoUrl: string | null;
  onPhotoCapture: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  overallNotes: string;
  onChangeOverallNotes: (notes: string) => void;
  metrics: InspectionMetricsData;
  isSubmitted: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

// Alias untuk backward compatibility
export type DriverPhotoConfirmationSectionProps = DriverPhotoConfirmationProps;

/**
 * Komponen Seksi 4: SOP Foto Supir, Status Kelayakan Jalan, Pengesahan BAP 3 Pihak, dan Aksi Simpan
 */
export default function DriverPhotoConfirmation({
  header,
  driverPhotoUrl,
  onPhotoCapture,
  onRemovePhoto,
  overallNotes,
  onChangeOverallNotes,
  metrics,
  isSubmitted,
  onSubmit,
  onReset,
}: DriverPhotoConfirmationProps) {
  return (
    <div className="space-y-4">
      {/* 1. SOP Wajib: Unggah & Pratinjau Foto Supir di Depan Truk */}
      <DriverPhotoUploadCard
        header={header}
        driverPhotoUrl={driverPhotoUrl}
        onPhotoCapture={onPhotoCapture}
        onRemovePhoto={onRemovePhoto}
      />

      {/* 2. Ringkasan Kelayakan Jalan Unit (Fit for Operation) & Catatan Akhir */}
      <FitForDispatchCard
        metrics={metrics}
        overallNotes={overallNotes}
        onChangeOverallNotes={onChangeOverallNotes}
      />

      {/* 3. Kolom Pengesahan 3 Pihak (Supir, Mekanik/Surveyor, Kepala Bengkel) */}
      <BapSignaturesCard header={header} />

      {/* 4. Tombol Aksi Akhir Submit & Reset BAP */}
      <ConfirmationActionBar
        driverPhotoUrl={driverPhotoUrl}
        isSubmitted={isSubmitted}
        onSubmit={onSubmit}
        onReset={onReset}
      />
    </div>
  );
}

// Named alias export jika ada consumer lama yang mengimpor DriverPhotoConfirmationSection
export { DriverPhotoConfirmation as DriverPhotoConfirmationSection };
