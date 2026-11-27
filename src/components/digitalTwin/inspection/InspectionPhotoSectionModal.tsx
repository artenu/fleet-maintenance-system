// src/components/digitalTwin/inspection/InspectionPhotoSectionModal.tsx
import { Camera, ZoomIn, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal, Button, Badge } from "@/components/common";
import { FileInput } from "@/components/forms";
import type { InspectionPhotoSectionProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Bagian 4: Upload / Jepret Beberapa Foto Bukti Fisik Lapangan & Lightbox Modal
 */
export default function InspectionPhotoSection({
  photoPreviews,
  onPhotoCapture,
  onDeletePhoto,
  previewPhotoIndex,
  onOpenFullPreview,
  onCloseFullPreview,
  serialNumber,
}: InspectionPhotoSectionProps) {
  const activePreviewUrl =
    previewPhotoIndex !== null && photoPreviews[previewPhotoIndex]
      ? photoPreviews[previewPhotoIndex]
      : null;

  return (
    <div className="rounded-xl border border-slate-200 p-3.5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block font-bold text-slate-700 text-xs">
          Foto Bukti Fisik Lapangan (Tapak / Dinding Ban):
        </label>
        <Badge variant={photoPreviews.length > 0 ? "info" : "neutral"}>
          {photoPreviews.length} Foto Terlampir
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <FileInput
          buttonText="Tambah / Upload Foto (Bisa >1)"
          icon={Camera}
          accept="image/*"
          capture="environment"
          multiple
          onChange={onPhotoCapture}
          helperText="Dapat mengunggah beberapa foto sekaligus (tapak, dinding samping, sudut kerusakan)"
        />
      </div>

      {photoPreviews.length > 0 ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {photoPreviews.map((url, idx) => (
              <div
                key={`${idx}-${url.slice(0, 24)}`}
                onClick={() => onOpenFullPreview(idx)}
                className="relative group overflow-hidden rounded-xl border border-slate-300 bg-slate-900 shadow-xs cursor-pointer">
                <img
                  src={url}
                  alt={`Preview Bukti Lapangan ${idx + 1}`}
                  className="w-full h-32 object-cover group-hover:scale-105 transition"
                />
                <span className="absolute top-2 left-2 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Foto #{idx + 1}
                </span>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                  <ZoomIn size={16} />
                  <span>Perbesar</span>
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePhoto(idx);
                  }}
                  title="Hapus foto ini"
                  className="absolute top-2 right-2 p-1.5 shadow-md z-10"
                />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 italic">
            Klik foto mana saja untuk melihat ukuran penuh. Klik ikon tempat
            sampah untuk menghapus foto terkait.
          </p>
        </div>
      ) : (
        <span className="block text-[11px] text-slate-400 italic">
          Belum ada foto terlampir
        </span>
      )}

      {/* Lightbox Modal Gambar Resolusi Penuh */}
      <Modal
        isOpen={Boolean(activePreviewUrl)}
        onClose={onCloseFullPreview}
        title={`Foto Bukti Fisik Lapangan (${(previewPhotoIndex ?? 0) + 1}/${photoPreviews.length}) • ${serialNumber}`}
        size="xl">
        {activePreviewUrl && (
          <div className="space-y-3">
            <div className="flex items-center justify-center p-2 bg-slate-900 rounded-xl">
              <img
                src={activePreviewUrl}
                alt="Ukuran Penuh"
                className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-lg"
              />
            </div>

            {photoPreviews.length > 1 && previewPhotoIndex !== null && (
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() =>
                    onOpenFullPreview(
                      (previewPhotoIndex - 1 + photoPreviews.length) %
                        photoPreviews.length,
                    )
                  }>
                  Sebelumnya
                </Button>
                <span className="text-xs font-bold text-slate-600">
                  Foto {previewPhotoIndex + 1} dari {photoPreviews.length}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={ChevronRight}
                  iconPosition="right"
                  onClick={() =>
                    onOpenFullPreview(
                      (previewPhotoIndex + 1) % photoPreviews.length,
                    )
                  }>
                  Berikutnya
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
