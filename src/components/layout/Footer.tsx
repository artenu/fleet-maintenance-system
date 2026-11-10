// src/components/layout/Footer.tsx
import { Radio } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">
            PT Armada Lintas Nusantara
          </span>
          <span>•</span>
          <span>Fleet Maintenance & Asset System v2.0</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
          <Radio size={13} className="animate-pulse" />
          <span>IoT Hino Connect Telematics Live</span>
        </div>
      </div>
    </footer>
  );
}
