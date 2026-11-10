// src/components/layout/Navbar.tsx
import { Truck } from "lucide-react";
import type { NavbarProps } from "@/types/components/layout/layoutTypes";

export default function Navbar({
  title,
  subtitle = "Pemantauan Siklus Hidup Ban & Telematics IoT Hino Connect",
  isSidebarCollapsed,
  onToggleSidebar,
  actions,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md px-8 py-3.5 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isSidebarCollapsed && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title="Buka Sidebar"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition">
              <Truck size={16} className="text-red-600" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                PORTAL POOL
              </span>
            </div>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
