// src/components/vehicleInspection/ToolsDocumentsSection.tsx
import {
  Wrench,
  FileText,
  AlertTriangle,
  CheckCircle2,
  CheckCheck,
} from "lucide-react";
import { Card, Badge, Button } from "@/components/common";
import { FormInput } from "@/components/forms";
import { TOOL_DOC_STATUS_OPTIONS } from "@/constants/vehicleInspection";
import type { ToolDocItem, ToolDocStatus } from "@/types/VehicleInspection";

// 🧱 Subkomponen Reusable
import StatusPillGroup from "./StatusPillGroup";
import CheckmarkToggle from "./CheckMarkToggle";

interface ToolsDocumentsSectionProps {
  toolDocs: ToolDocItem[];
  onUpdateStatus: (id: string, status: ToolDocStatus) => void;
  onUpdateExpiry?: (id: string, expiryDate: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function ToolsDocumentSection({
  toolDocs,
  onUpdateStatus,
  onUpdateNotes,
}: ToolsDocumentsSectionProps) {
  const goodCount = toolDocs.filter((i) => i.status === "B").length;
  const defectCount = toolDocs.filter((i) => i.status !== "B").length;

  const handleSetAllGood = () => {
    toolDocs.forEach((item) => {
      onUpdateStatus(item.id, "B");
    });
  };

  return (
    <Card className="space-y-4">
      {/* Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500 text-white shadow-xs">
            <Wrench size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Seksi 1: Checklist Kelengkapan Tools & Dokumen Legalitas
            </h3>
            <p className="text-[11px] text-slate-500">
              12 Item Standar Wajib Jalan PT ALN (Pelabuhan Tanjung Priok &
              Perkakas Lapangan)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSetAllGood}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold">
            <CheckCheck size={14} className="mr-1.5 text-emerald-600" />
            Setel Semua Lengkap (Ceklis Semua)
          </Button>
        </div>
      </div>

      {/* Ringkasan Status Cepat */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge variant="success" className="py-1 px-2.5 font-bold">
          <CheckCircle2 size={12} className="mr-1" /> Lengkap / Baik:{" "}
          {goodCount}
        </Badge>
        {defectCount > 0 && (
          <Badge variant="danger" className="py-1 px-2.5 font-bold">
            <AlertTriangle size={12} className="mr-1" /> Kurang / Rusak:{" "}
            {defectCount} Item
          </Badge>
        )}
      </div>

      {/* DAFTAR CHECKLIST BARIS TIPIS DENGAN KOLOM SEJAJAR */}
      <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white overflow-hidden shadow-2xs">
        {/* Table Header Bar */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-3 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-5">Item Checklist / Dokumen</div>
          <div className="col-span-3 text-center">Status Kondisi</div>
          <div className="col-span-4">Catatan / Keterangan</div>
        </div>

        {toolDocs.map((item, idx) => {
          const isGood = item.status === "B";
          const isDoc = item.id.startsWith("doc-");

          return (
            <div
              key={item.id}
              className={`p-2.5 px-3 grid grid-cols-1 md:grid-cols-12 gap-3 md:items-center transition-colors ${
                isGood ? "hover:bg-slate-50/80" : "bg-amber-50/40"
              }`}>
              {/* 1. Reusable Checkmark Toggle & Nama Item */}
              <div className="md:col-span-5 flex items-center gap-2.5 min-w-0">
                <CheckmarkToggle
                  isGood={isGood}
                  statusLabel={item.status}
                  onToggle={() => onUpdateStatus(item.id, isGood ? "R" : "B")}
                />

                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className={`grid h-5 w-5 place-items-center rounded shrink-0 ${
                      isDoc
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-600 bg-slate-100"
                    }`}>
                    {isDoc ? <FileText size={12} /> : <Wrench size={12} />}
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {idx + 1}. {item.name}
                  </span>
                  {isDoc && (
                    <Badge
                      variant="info"
                      className="text-[9px] py-0 px-1.5 shrink-0">
                      Dokumen
                    </Badge>
                  )}
                </div>
              </div>

              {/* 2. Reusable StatusPillGroup (Sejajar Kolom Tengah) */}
              <div className="md:col-span-3 flex justify-start md:justify-center">
                <StatusPillGroup
                  options={TOOL_DOC_STATUS_OPTIONS}
                  activeValue={item.status}
                  onChange={(val) => onUpdateStatus(item.id, val)}
                />
              </div>

              {/* 3. Reusable FormInput (Sejajar Kolom Kanan) */}
              <div className="md:col-span-4">
                <FormInput
                  value={item.notes || ""}
                  onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                  placeholder="Catatan / keterangan..."
                  className="py-1 px-2.5 text-xs rounded-lg font-medium"
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
