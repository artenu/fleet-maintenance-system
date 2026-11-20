// src/components/vehicleInspection/batteryCheck/BatterySecurityCard.tsx
import { ShieldCheck, Lock, AlertTriangle } from "lucide-react";
import { Badge, Checkbox } from "@/components/common";

export interface BatterySecurityCardProps {
  isLockedWithChain: boolean;
  onToggleLock: (checked: boolean) => void;
}

/**
 * Sub-komponen pengecekan keamanan gembok dan rantai kotak aki unit (SOP ALN Anti-Pencurian)
 */
export default function BatterySecurityCard({
  isLockedWithChain,
  onToggleLock,
}: BatterySecurityCardProps) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isLockedWithChain
          ? "bg-emerald-50/50 border-emerald-200"
          : "bg-rose-50 border-rose-300"
      }`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`grid h-9 w-9 place-items-center rounded-xl ${
              isLockedWithChain
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}>
            {isLockedWithChain ? (
              <ShieldCheck size={20} />
            ) : (
              <Lock size={20} />
            )}
          </div>
          <div>
            <Checkbox
              label="Kotak Aki Tergembok & Dirantai Rapat Sesuai SOP"
              subLabel="Wajib dikunci rapat sebelum unit diberangkatkan untuk mencegah insiden kehilangan aki di jalan"
              checked={isLockedWithChain}
              onChange={onToggleLock}
            />
          </div>
        </div>

        <Badge
          variant={isLockedWithChain ? "success" : "danger"}
          className="text-xs">
          {isLockedWithChain ? "Terkunci & Aman" : "BELUM DIGEMBOK"}
        </Badge>
      </div>

      {!isLockedWithChain && (
        <div className="mt-3 flex items-start gap-2 text-xs text-rose-700 bg-rose-100/60 p-2.5 rounded-lg border border-rose-200">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          <span>
            <strong>PERINGATAN SOP POOL:</strong> Unit dilarang keluar pool/depo
            jika kotak aki belum dipasangi rantai gembok standar PT ALN!
          </span>
        </div>
      )}
    </div>
  );
}
