// src/components/digitalTwin/wheelDetail/WheelDetailEmptyState.tsx
import { Truck } from "lucide-react";

/**
 * Tampilan kosong saat belum ada slot roda yang dipilih
 */
export default function WheelDetailEmptyState() {
  return (
    <div className="py-12 text-center text-slate-400 space-y-2">
      <Truck size={32} className="mx-auto text-slate-300" />
      <p className="text-xs font-medium">
        Pilih salah satu kotak ban untuk melihat data
      </p>
    </div>
  );
}

