// src/components/vehicleInspection/confirmation/ConfirmationActionBar.tsx
import { XCircle, FileCheck } from "lucide-react";
import { Button } from "@/components/common";
import { DRIVER_PHOTO_SOP_GUIDELINES } from "@/constants/vehicleInspection";

export interface ConfirmationActionBarProps {
  driverPhotoUrl: string | null;
  isSubmitted: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

/**
 * Sub-komponen toolbar tombol aksi submit dan reset Berita Acara Pemeriksaan (BAP)
 */
export default function ConfirmationActionBar({
  driverPhotoUrl,
  isSubmitted,
  onSubmit,
  onReset,
}: ConfirmationActionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="text-xs">
        Reset Formulir
      </Button>

      <div className="flex items-center gap-2">
        {!driverPhotoUrl && (
          <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
            <XCircle size={13} />
            {DRIVER_PHOTO_SOP_GUIDELINES.warningMissingPhoto}
          </span>
        )}

        <Button
          type="button"
          variant="primary"
          onClick={onSubmit}
          disabled={!driverPhotoUrl || isSubmitted}
          className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2">
          <FileCheck size={16} className="mr-1.5" />
          {isSubmitted
            ? "BAP Berhasil Disimpan"
            : "Sahkan & Simpan BAP Digital"}
        </Button>
      </div>
    </div>
  );
}
