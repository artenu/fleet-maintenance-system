// src/components/vehicleInspection/CheckmarkToggle.tsx
import { Check } from "lucide-react";

interface CheckmarkToggleProps {
  isGood: boolean;
  statusLabel?: string;
  onToggle: () => void;
}

export default function CheckmarkToggle({
  isGood,
  statusLabel,
  onToggle,
}: CheckmarkToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={
        isGood
          ? "Kondisi Baik (Klik jika ada kendala)"
          : "Klik untuk setel Baik"
      }
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition-all cursor-pointer ${
        isGood
          ? "border-emerald-500 bg-emerald-500 text-white shadow-xs hover:bg-emerald-600"
          : "border-rose-400 bg-rose-100 text-rose-700 hover:bg-rose-200"
      }`}>
      {isGood ? (
        <Check size={14} strokeWidth={3} />
      ) : (
        <span className="text-[10px] font-black">{statusLabel}</span>
      )}
    </button>
  );
}
