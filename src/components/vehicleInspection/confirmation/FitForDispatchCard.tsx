// src/components/vehicleInspection/confirmation/FitForDispatchCard.tsx
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card, Badge, TextArea } from "@/components/common";

export interface InspectionMetricsData {
  totalDefectsCount: number;
  damagedComponentsCount: number;
  missingToolsCount: number;
  damagedToolsCount: number;
  hasBatteryIssues: boolean;
  isFitForOperation: boolean;
  hasDriverPhoto: boolean;
}

export interface FitForDispatchCardProps {
  metrics: InspectionMetricsData;
  overallNotes: string;
  onChangeOverallNotes: (notes: string) => void;
}

/**
 * Sub-komponen status kelayakan armada (Fit to Dispatch), rekapitulasi temuan defect, dan catatan akhir
 */
export default function FitForDispatchCard({
  metrics,
  overallNotes,
  onChangeOverallNotes,
}: FitForDispatchCardProps) {
  return (
    <Card className="space-y-3.5">
      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
        <ShieldCheck size={15} className="text-blue-600" />
        Status Kelayakan Operasional (Fit to Dispatch)
      </h4>

      {/* Banner Status Fit / Bersyarat */}
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

      {/* Rincian Angka Defect 4 Kolom */}
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
        onChange={(e) => {
          onChangeOverallNotes(e.target.value);
        }}
        placeholder="Tuliskan catatan khusus kondisi sasis, keluhan supir, jadwal servis berkala berikutnya, atau instruksi perbaikan..."
        rows={3}
      />
    </Card>
  );
}
