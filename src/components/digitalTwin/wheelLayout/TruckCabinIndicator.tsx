// src/components/digitalTwin/wheelLayout/TruckCabinIndicator.tsx
import { ArrowUp } from "lucide-react";

/**
 * Komponen penunjuk arah orientasi fisik kabin depan truk dan sisi supir/kernet
 */
export default function TruckCabinIndicator() {
  return (
    <div className="max-w-2xl mx-auto flex items-center justify-between px-4 text-[10px] font-black uppercase border-b border-slate-200 pb-2">
      <span className="text-slate-500 flex items-center gap-1 font-bold">
        ◀ SISI KIRI (PENUMPANG / KERNET)
      </span>
      <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shadow-2xs font-bold text-[10px]">
        <ArrowUp size={12} className="text-red-600 animate-bounce" />
        <span>ARAH DEPAN KABIN TRUK (FRONT)</span>
      </div>
      <span className="text-blue-700 flex items-center gap-1 font-black bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
        SISI KANAN (SUPIR 🇮🇩) ▶
      </span>
    </div>
  );
}

