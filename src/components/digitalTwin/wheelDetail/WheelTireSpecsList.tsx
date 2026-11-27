// src/components/digitalTwin/wheelDetail/WheelTireSpecsList.tsx
import { formatThousand } from "@/utils/formatters";
import {
  calculateTireExpiryInfo,
  getTotalPunctureCount,
} from "@/utils/tireManagement/tireCalculations";
import { TIRE_THRESHOLDS } from "@/constants/truck/tireRules";
import type { WheelTireSpecsListProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Daftar parameter teknis, tanggal inspeksi/pasang, masa expired, dan riwayat tambal ban terpasang
 */
export default function WheelTireSpecsList({
  slot,
  tire,
}: WheelTireSpecsListProps) {
  const retreadLabel =
    tire.retreadStatus === "R0"
      ? "R0 (Ban Baru Asli)"
      : tire.retreadStatus === "R1"
        ? "R1 (Vulkanisir ke-1)"
        : tire.retreadStatus === "R2"
          ? "R2 (Vulkanisir ke-2)"
          : tire.retreadStatus === "R3"
            ? "R3 (Vulkanisir ke-3 - Batas Maks)"
            : "AFKIR (Wajib Scrap)";

  const expiryInfo = calculateTireExpiryInfo(tire);
  const totalPunctures = getTotalPunctureCount(tire);

  return (
    <div className="space-y-2 text-xs">
      <div className="flex justify-between">
        <span className="text-slate-500">Nomor Seri:</span>
        <strong className="text-slate-900 font-bold">
          {tire.serialNumber}
        </strong>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Merk & Ukuran:</span>
        <span className="font-semibold text-slate-800">
          {tire.brand} ({tire.size})
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Siklus Casing:</span>
        <span className="font-bold text-blue-700">{retreadLabel}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Tanggal Inspeksi Ban:</span>
        <strong className="text-slate-900 font-bold">
          {tire.lastInspectionDate || "-"}
        </strong>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Tanggal Pasang / Ganti:</span>
        <span className="font-semibold text-slate-800">
          {tire.installDate || tire.lastInspectionDate || "-"}
        </span>
      </div>
      {expiryInfo.expiryDate && (
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Masa Expired (1 Thn):</span>
          <strong
            className={`font-bold ${
              expiryInfo.isExpired
                ? "text-rose-600"
                : expiryInfo.isExpiringSoon
                  ? "text-amber-600"
                  : "text-emerald-700"
            }`}>
            {expiryInfo.expiryDate}
            {expiryInfo.isExpired
              ? " (Expired!)"
              : expiryInfo.daysRemaining !== null
                ? ` (${expiryInfo.daysRemaining} hr)`
                : ""}
          </strong>
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-slate-500">Riwayat Tambal / Bocor:</span>
        <strong
          className={`font-bold ${
            totalPunctures >= TIRE_THRESHOLDS.MAX_PUNCTURE_BEFORE_AFKIR
              ? "text-rose-600"
              : totalPunctures === 2
                ? "text-amber-600"
                : "text-slate-900"
          }`}>
          {totalPunctures}x Bocor
          {totalPunctures >= TIRE_THRESHOLDS.MAX_PUNCTURE_BEFORE_AFKIR
            ? " (Wajib Afkir)"
            : ""}
        </strong>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Jarak Tempuh di Gandar:</span>
        <strong className="text-slate-900 font-bold">
          {formatThousand(slot.kmElapsed)} KM
        </strong>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Sisa Jarak Tempuh:</span>
        <strong
          className={`font-bold ${
            slot.remainingKm <= 0 ? "text-rose-600" : "text-slate-900"
          }`}>
          {formatThousand(slot.remainingKm)} KM
        </strong>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Fisik Tapak:</span>
        <strong className="text-slate-900 font-bold">
          {tire.lastInspectionPercent}%
          {tire.treadDepthMm && (
            <span className="text-slate-400 font-normal ml-1">
              ({tire.treadDepthMm} mm)
            </span>
          )}
        </strong>
      </div>

      {tire.pressurePsi && (
        <div className="flex justify-between">
          <span className="text-slate-500">Tekanan Angin:</span>
          <strong className="text-slate-900 font-bold">
            {tire.pressurePsi} PSI
          </strong>
        </div>
      )}
    </div>
  );
}
