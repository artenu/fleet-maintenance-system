// src/components/vehicleInspection/DriverPhotoConfirmationSection.tsx
import { type ChangeEvent } from "react";
import {
  Camera,
  UploadCloud,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { Card, Badge, Button, TextArea } from "@/components/common";
import type { VehicleInspectionHeader } from "@/types/vehicleInspection";

interface DriverPhotoConfirmationSectionProps {
  header: VehicleInspectionHeader;
  driverPhotoUrl: string | null;
  onPhotoCapture: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  overallNotes: string;
  onChangeOverallNotes: (notes: string) => void;
  metrics: {
    totalDefectsCount: number;
    damagedComponentsCount: number;
    missingToolsCount: number;
    damagedToolsCount: number;
    hasBatteryIssues: boolean;
    isFitForOperation: boolean;
    hasDriverPhoto: boolean;
  };
  isSubmitted: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

export default function DriverPhotoConfirmationSection({
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
}: DriverPhotoConfirmationSectionProps) {
  return (
    <div className="space-y-4">
      {/* 1. SOP Wajib: Unggah Foto Supir di Depan Truk */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-600 text-white shadow-xs">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Seksi 4: SOP Wajib Foto Supir & Pengesahan BAP
              </h3>
              <p className="text-[11px] text-slate-500">
                Foto Pengemudi berdiri di depan unit memegang form fisik
                inspeksi sebagai bukti nyata
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
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              id="driver-photo-input"
              className="hidden"
              onChange={onPhotoCapture}
            />
            <label
              htmlFor="driver-photo-input"
              className="cursor-pointer flex flex-col items-center gap-2">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 shadow-2xs">
                <UploadCloud size={24} />
              </div>
              <span className="text-xs font-bold text-slate-800">
                Klik untuk Ambil Foto Kamera / Unggah Bukti Supir
              </span>
              <span className="text-[11px] text-slate-500 max-w-sm">
                SOP Lapangan: Supir wajib difoto di depan grille/kabin unit truk
                dengan memegang formulir inspeksi fisik
              </span>
            </label>
          </div>
        )}
      </Card>

      {/* 2. Ringkasan Kelayakan Jalan Unit (Fit for Operation) */}
      <Card className="space-y-3.5">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck size={15} className="text-blue-600" />
          Status Kelayakan Operasional (Fit to Dispatch)
        </h4>

        <div
          className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
            metrics.isFitForOperation
              ? "bg-emerald-50/60 border-emerald-200"
              : "bg-amber-50/60 border-amber-200"
          }`}>
          <div className="flex items-center gap-3">
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl text-white ${
                metrics.isFitForOperation ? "bg-emerald-600" : "bg-amber-600"
              }`}>
              {metrics.isFitForOperation ? (
                <CheckCircle2 size={22} />
              ) : (
                <AlertTriangle size={22} />
              )}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">
                {metrics.isFitForOperation
                  ? "UNIT LAYAK JALAN (FIT FOR DISPATCH)"
                  : "UNIT BERSYARAT / BUTUH TINDAKAN MEKANIK"}
              </p>
              <p className="text-xs text-slate-600">
                {metrics.isFitForOperation
                  ? "Seluruh perlengkapan, dokumen legalitas, 50 komponen fisik, dan aki unit dalam kondisi aman."
                  : `Ditemukan total ${metrics.totalDefectsCount} temuan/cacat yang perlu diperhatikan sebelum surat jalan dirilis.`}
              </p>
            </div>
          </div>

          <Badge
            variant={metrics.isFitForOperation ? "success" : "warning"}
            className="text-xs font-bold py-1 px-3">
            {metrics.isFitForOperation
              ? "Siap Muat Pelabuhan"
              : "Perlu Verifikasi Workshop"}
          </Badge>
        </div>

        {/* Rincian Angka Defect */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">
              Cacat Komponen Fisik
            </span>
            <span className="text-sm font-black text-slate-900">
              {metrics.damagedComponentsCount} Item
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">
              Tools Hilang / Kosong
            </span>
            <span className="text-sm font-black text-slate-900">
              {metrics.missingToolsCount} Item
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">
              Tools Rusak
            </span>
            <span className="text-sm font-black text-slate-900">
              {metrics.damagedToolsCount} Item
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">
              Status Gembok Aki
            </span>
            <span
              className={`text-sm font-black ${
                !metrics.hasBatteryIssues ? "text-emerald-700" : "text-rose-700"
              }`}>
              {!metrics.hasBatteryIssues ? "Aman Terkunci" : "Ada Kendala"}
            </span>
          </div>
        </div>

        {/* Input Catatan Keseluruhan */}
        <TextArea
          label="Catatan Keseluruhan Hasil Pemeriksaan (Surveyor / Mekanik)"
          value={overallNotes}
          onChange={(e) => onChangeOverallNotes(e.target.value)}
          placeholder="Tuliskan catatan khusus kondisi sasis, keluhan supir, jadwal servis berkala berikutnya, atau instruksi perbaikan..."
          rows={3}
        />
      </Card>

      {/* 3. Kolom Pengesahan 3 Pihak (Mekanik Merangkap Surveyor) */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Kolom Pengesahan Berita Acara Pemeriksaan (BAP)
          </h4>
          <span className="text-[10px] text-slate-400 italic">
            *Saat ini Mekanik merangkap sebagai Petugas Surveyor PIC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
          {/* 1. Supir */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between h-28">
            <span className="text-[10px] text-slate-500 uppercase font-bold">
              1. Pengemudi (Supir)
            </span>
            <div className="my-auto font-mono text-[11px] text-slate-400 italic">
              [Tanda Tangan Supir]
            </div>
            <span className="font-bold text-slate-900 border-t border-slate-200 pt-1 text-[11px]">
              {header.driverName}
            </span>
          </div>

          {/* 2. Mekanik & Surveyor PIC (Gabungan Role) */}
          <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 flex flex-col justify-between h-28">
            <span className="text-[10px] text-emerald-800 uppercase font-bold flex items-center justify-center gap-1">
              <UserCheck size={12} /> 2. Mekanik / Petugas Pemeriksa
            </span>
            <div className="my-auto">
              <Badge variant="success" className="text-[9px]">
                NIK Terverifikasi Auto-Auth
              </Badge>
            </div>
            <span className="font-bold text-slate-900 border-t border-emerald-200 pt-1 text-[11px]">
              {header.inspectorName} ({header.inspectorNik})
            </span>
          </div>

          {/* 3. Ka. Pool / Kepala Bengkel */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between h-28">
            <span className="text-[10px] text-slate-500 uppercase font-bold">
              3. Ka. Pool / Kepala Bengkel
            </span>
            <div className="my-auto font-mono text-[11px] text-slate-400 italic">
              [Persetujuan Workshop]
            </div>
            <span className="font-bold text-slate-900 border-t border-slate-200 pt-1 text-[11px]">
              Bambang H. (Pool Leader)
            </span>
          </div>
        </div>
      </Card>

      {/* 4. Tombol Aksi Akhir Submit / Reset */}
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
              SOP: Ambil foto supir terlebih dahulu untuk mengaktifkan submit
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
    </div>
  );
}
