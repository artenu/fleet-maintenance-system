// src/components/layout/Sidebar.tsx
import { LayoutDashboard } from "lucide-react";
import type {
  TireMaintenanceView,
  SidebarProps,
} from "@/types/components/layout/layoutTypes";
import {
  SidebarHeader,
  SidebarFleetMenu,
  SidebarTireMenu,
  SidebarWorkshopMenu,
  SidebarFooter,
} from "./sidebar/index";

// Re-export types agar App.tsx tetap kompatibel
export type { TireMaintenanceView, SidebarProps };

export default function Sidebar({
  activeView,
  onSelectView,
  overdueCount = 1,
  incompleteTiresTruckCount = 0,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={`shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between min-h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-18" : "w-72"
      }`}>
      {/* 1. Header & Menu Navigasi */}
      <div className="flex flex-col flex-1 min-h-0">
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />

        <div className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth">
          {/* Menu Utama: Executive Dashboard */}
          <div>
            <button
              type="button"
              onClick={() => onSelectView("fleet-health")}
              title={isCollapsed ? "Executive Fleet Health" : undefined}
              className={`w-full flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 font-bold text-xs transition select-none ${
                activeView === "fleet-health"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 hover:bg-purple-700 hover:text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/60"
              } ${isCollapsed ? "justify-center px-0" : ""}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <LayoutDashboard
                  size={18}
                  className={
                    activeView === "fleet-health"
                      ? "text-white"
                      : "text-purple-600"
                  }
                />
                {!isCollapsed && (
                  <span className="truncate font-black tracking-tight">
                    Executive Fleet Health
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    activeView === "fleet-health"
                      ? "bg-white/20 text-white"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                  Overview
                </span>
              )}
            </button>
          </div>

          {/* Modul 1: Manajemen Armada & Sasis */}
          <SidebarFleetMenu
            activeView={activeView}
            onSelectView={onSelectView}
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
          />

          {/* Modul 2: Manajemen Ban (ATMS) */}
          <SidebarTireMenu
            activeView={activeView}
            onSelectView={onSelectView}
            overdueCount={overdueCount}
            incompleteTiresTruckCount={incompleteTiresTruckCount}
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
          />

          {/* Modul 3: Bengkel & Perawatan Pool */}
          <SidebarWorkshopMenu
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
          />
        </div>
      </div>

      {/* 2. Footer Telematics & PIC Surveyor */}
      <SidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
}
