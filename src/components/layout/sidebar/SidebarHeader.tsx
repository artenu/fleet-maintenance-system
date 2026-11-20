// src/components/layout/sidebar/SidebarHeader.tsx
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/common";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarHeader({
  isCollapsed,
  onToggleCollapse,
}: SidebarHeaderProps) {
  return (
    <div
      className={`border-b border-slate-100 flex items-center transition-all duration-300 ${
        isCollapsed
          ? "p-3.5 justify-center flex-col gap-2"
          : "p-4 justify-between"
      }`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl">
          <img src="/armadaLogo.png" alt="Logo Armada" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-slate-900 tracking-tight truncate">
                FMS System
              </span>
              <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-extrabold text-red-700">
                POOL
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 truncate">
              Fleet Maintenance System
            </p>
          </div>
        )}
      </div>

      <Button
        onClick={onToggleCollapse}
        title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
        className="secondary">
        {isCollapsed ? (
          <PanelLeftOpen size={18} />
        ) : (
          <PanelLeftClose size={18} />
        )}
      </Button>
    </div>
  );
}
