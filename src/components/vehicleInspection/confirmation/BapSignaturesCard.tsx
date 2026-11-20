// src/components/vehicleInspection/confirmation/BapSignaturesCard.tsx
import { UserCheck } from "lucide-react";
import { Card, Badge } from "@/components/common";
import { DEFAULT_POOL_LEADER_NAME } from "@/constants/vehicleInspection";
import type { VehicleInspectionHeader } from "@/types/VehicleInspection";

export interface BapSignaturesCardProps {
  header: VehicleInspectionHeader;
  poolLeaderName?: string;
}

/**
 * Sub-komponen kolom tanda tangan pengesahan Berita Acara Pemeriksaan (BAP) 3 Pihak
 */
export default function BapSignaturesCard({
  header,
  poolLeaderName = DEFAULT_POOL_LEADER_NAME,
}: BapSignaturesCardProps) {
  return (
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
            {poolLeaderName}
          </span>
        </div>
      </div>
    </Card>
  );
}
