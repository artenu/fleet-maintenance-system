// src/components/digitalTwin/inspection/InspectionPhotoSection.tsx
import { Camera, ZoomIn, Trash2 } from "lucide-react";
import { Modal, Button } from "@/components/common";
import { FileInput } from "@/components/forms";
import type { InspectionPhotoSectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Bagian 4: Upload / Jepret Foto Bukti Fisik Lapangan & Lightbox Modal
 */
export default function InspectionPhotoSection({
  photoPreview,
  onPhotoCapture,
  onDeletePhoto,
  onOpenFullPreview,
  isFullPreviewOpen,
  onCloseFullPreview,
  serialNumber,
}: InspectionPhotoSectionProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 space-y-2">
      <label className="block font-bold text-slate-700 text-xs">
        Foto Bukti Fisik Lapangan (Tapak / Dinding Ban):
      </label>
      <div className="flex items-center gap-3">
        <FileInput
          buttonText="Ambil / Upload Foto"
          icon={Camera}
          accept="image/*"
          capture="environment"
          onChange={onPhotoCapture}
        />

        {photoPreview ? (
          <div className="space-y-2">
            <div
              onClick={onOpenFullPreview}
              className="relative group overflow-hidden rounded-xl border border-slate-300 bg-slate-900 shadow-xs max-h-48 cursor-pointer">
              <img
                src={photoPreview}
                alt="Preview Bukti Lapangan"
                className="w-full h-40 object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                <ZoomIn size={18} />
                <span>Klik untuk Memperbesar</span>
              </div>
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePhoto();
                }}
                title="Hapus foto"
                className="absolute top-2 right-2 p-1.5 shadow-md z-10"
              />
            </div>
            <p className="text-[10px] text-slate-500 italic">
              Klik foto untuk melihat ukuran penuh. Klik ikon tempat sampah jika
              ingin mengganti.
            </p>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">
            Belum ada foto terlampir
          </span>
        )}
      </div>

      {/* Lightbox Modal Gambar Resolusi Penuh */}
      <Modal
        isOpen={isFullPreviewOpen && Boolean(photoPreview)}
        onClose={onCloseFullPreview}
        title={`Foto Bukti Fisik Lapangan • ${serialNumber}`}
        size="xl">
        {photoPreview && (
          <div className="flex items-center justify-center p-2 bg-slate-900 rounded-xl">
            <img
              src={photoPreview}
              alt="Ukuran Penuh"
              className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-lg"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
