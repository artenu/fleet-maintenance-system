// src/components/layout/sidebar/SidebarFooter.tsx
import { Radio, ShieldCheck } from "lucide-react";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export default function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  return (
    <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
      {!isCollapsed ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <Radio size={14} className="text-emerald-600 animate-pulse" />
            <span className="text-[11px]">Hino Connect IoT</span>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded">
            ONLINE
          </span>
        </div>
      ) : (
        <div
          title="Hino Connect IoT: ONLINE"
          className="flex justify-center py-1 text-emerald-600">
          <Radio size={16} className="animate-pulse" />
        </div>
      )}

      <div
        className={`flex items-center gap-2.5 ${isCollapsed ? "justify-center" : "pt-1"}`}>
        <div
          title={isCollapsed ? "Budi Santoso (Surveyor Pool)" : undefined}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-200 text-slate-700 font-bold text-xs">
          BS
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <strong className="text-xs font-bold text-slate-900 block truncate">
              Budi Santoso
            </strong>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <ShieldCheck size={11} className="text-blue-600" /> Surveyor
              Terverifikasi
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
