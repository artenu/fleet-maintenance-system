// src/components/vehicleInspection/confirmation/DriverPhotoUploadCard.tsx
import { type ChangeEvent } from "react";
import { Camera, UploadCloud, Trash2, UserCheck } from "lucide-react";
import { Card, Badge, Button } from "@/components/common";
import { DRIVER_PHOTO_SOP_GUIDELINES } from "@/constants/vehicleInspection";
import type { VehicleInspectionHeader } from "@/types/VehicleInspection";
import { FileInput } from "@/components/forms";

export interface DriverPhotoUploadCardProps {
  header: VehicleInspectionHeader;
  driverPhotoUrl: string | null;
  onPhotoCapture: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
}

/**
 * Sub-komponen pengambilan dan pratinjau foto supir di depan kabin truk (SOP ALN)
 */
export default function DriverPhotoUploadCard({
  header,
  driverPhotoUrl,
  onPhotoCapture,
  onRemovePhoto,
}: DriverPhotoUploadCardProps) {
  return (
    <Card className="space-y-4">
      {/* Header Seksi SOP Foto */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-600 text-white shadow-xs">
            <Camera size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Seksi 4: {DRIVER_PHOTO_SOP_GUIDELINES.title}
            </h3>
            <p className="text-[11px] text-slate-500">
              {DRIVER_PHOTO_SOP_GUIDELINES.description}
            </p>
          </div>
        </div>

        <Badge
          variant={driverPhotoUrl ? "success" : "danger"}
          className="text-xs py-1 px-2.5">
          {driverPhotoUrl ? "Foto Terlampir" : "Wajib Foto"}
        </Badge>
      </div>

      {/* Area Upload & Pratinjau Foto */}
      {driverPhotoUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video max-h-72 flex items-center justify-center">
          <img
            src={driverPhotoUrl}
            alt="Bukti Inspeksi Supir"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div>
              <p className="font-bold flex items-center gap-1.5">
                <UserCheck size={14} className="text-emerald-400" />
                {header.driverName} • {header.unitCode} ({header.plateNumber})
              </p>
              <p className="text-[10px] text-slate-300">
                {header.inspectionDate} • {header.inspectionTime} WIB •{" "}
                {header.location}
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onRemovePhoto}
              className="text-xs">
              <Trash2 size={13} className="mr-1" />
              Hapus & Foto Ulang
            </Button>
          </div>
        </div>
      ) : (
        <FileInput
          variant="dropzone"
          id="driver-photo-input"
          accept="image/*"
          capture="environment"
          icon={UploadCloud}
          dropzoneTitle="Klik untuk Ambil Foto Kamera / Unggah Bukti Supir"
          dropzoneDescription={DRIVER_PHOTO_SOP_GUIDELINES.uploadHelper}
          onChange={onPhotoCapture}
        />
      )}
    </Card>
  );
}
