// src/components/layout/Sidebar.tsx
import { useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Link2,
  ClipboardCheck,
  Disc,
  Warehouse,
  History,
  TrendingDown,
  CalendarClock,
  Wrench,
  Package,
  Radio,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  PlusCircle,
} from "lucide-react";

export type TireMaintenanceView =
  | "fleet-health"
  | "coupling"
  | "vehicle-inspection"
  | "digital-twin"
  | "add-truck"
  | "inventory"
  | "history"
  | "cpk-analytics"
  | "audit-schedule";

interface SidebarProps {
  activeView: TireMaintenanceView;
  onSelectView: (view: TireMaintenanceView) => void;
  overdueCount?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  activeView,
  onSelectView,
  overdueCount = 1,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  // State Accordion
  const [isFleetMenuOpen, setIsFleetMenuOpen] = useState<boolean>(true);
  const [isTireMenuOpen, setIsTireMenuOpen] = useState<boolean>(true);
  const [isWorkshopMenuOpen, setIsWorkshopMenuOpen] = useState<boolean>(false);

  // Submenu Manajemen Ban (ATMS)
  const tireSubMenus: {
    id: TireMaintenanceView;
    label: string;
    icon: typeof Disc;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: "digital-twin",
      label: "Digital Twin Armada",
      icon: Disc,
      badge: "Live",
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      id: "add-truck",
      label: "Update Kondisi Ban",
      icon: PlusCircle,
      badge: "Update",
      badgeColor: "bg-blue-100 text-blue-700 font-bold",
    },
    {
      id: "inventory",
      label: "Stok & Gudang Ban",
      icon: Warehouse,
      badge: "4 Unit",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "history",
      label: "Riwayat Mutasi & Rotasi",
      icon: History,
    },
    {
      id: "cpk-analytics",
      label: "Analitik CPK & Merk",
      icon: TrendingDown,
    },
    {
      id: "audit-schedule",
      label: "Jadwal Audit Bulanan",
      icon: CalendarClock,
      badge: overdueCount > 0 ? `${overdueCount} Overdue` : undefined,
      badgeColor: "bg-rose-100 text-rose-700 animate-pulse",
    },
  ];

  return (
    <aside
      className={`shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between min-h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-18" : "w-72"
      }`}>
      {/* 1. Header Brand Sidebar */}
      <div>
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

          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
            {isCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>

        {/* 2. Menu Navigasi */}
        <div className="p-3 space-y-3">
          {/* ================= 🏢 MENU UTAMA: EXECUTIVE DASHBOARD ================= */}
          <div>
            <button
              type="button"
              onClick={() => onSelectView("fleet-health")}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 font-black text-xs transition select-none ${
                activeView === "fleet-health"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "bg-slate-50 text-slate-700 hover:bg-purple-50 hover:text-purple-700"
              }`}>
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
                  <span className="truncate tracking-tight">
                    Executive Fleet Health
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <span
                  className={`rounded px-1.5 py-0.2 text-[9px] font-black uppercase ${
                    activeView === "fleet-health"
                      ? "bg-white/20 text-white"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                  Overview
                </span>
              )}
            </button>
          </div>

          {/* ================= 🚛 MODUL 1: MANAJEMEN ARMADA & ASET (MANDIRI) ================= */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (isCollapsed) {
                  onToggleCollapse();
                }
                setIsFleetMenuOpen((prev) => !prev);
              }}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 font-bold text-xs transition select-none ${
                activeView === "coupling" || activeView === "vehicle-inspection"
                  ? "bg-blue-50/80 text-blue-900 border border-blue-200"
                  : "text-slate-700 hover:bg-slate-50"
              }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <Truck size={17} className="text-blue-600" />
                {!isCollapsed && (
                  <span className="truncate tracking-tight font-black">
                    Manajemen Armada & Sasis
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="text-slate-400">
                  {isFleetMenuOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              )}
            </button>

            {isFleetMenuOpen && !isCollapsed && (
              <div className="mt-1.5 ml-4 pl-3 border-l-2 border-blue-200/60 space-y-1 animate-in fade-in duration-150">
                {/* Perangkaian Sasis (Drop & Hook) */}
                <button
                  type="button"
                  onClick={() => onSelectView("coupling")}
                  className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 font-bold text-xs transition ${
                    activeView === "coupling"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-900"
                  }`}>
                  <div className="flex items-center gap-2">
                    <Link2 size={15} />
                    <span>Perangkaian Sasis (Coupling)</span>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-black uppercase ${
                      activeView === "coupling"
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                    Drop & Hook
                  </span>
                </button>

                {/* Form Inspeksi Fisik Truk PT ALN (Pilar 3) */}
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Modul Digitalisasi Form Inspeksi Fisik PT ALN siap dikerjakan di Pilar 3!",
                    )
                  }
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 font-bold text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck size={15} />
                    <span>Inspeksi Fisik Truk</span>
                  </div>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                    Pilar 3
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* ================= 🛞 MODUL 2: TIRE MANAGEMENT SYSTEM (ATMS) ================= */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (isCollapsed) {
                  onToggleCollapse();
                }
                setIsTireMenuOpen((prev) => !prev);
              }}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 font-bold text-xs transition select-none ${
                tireSubMenus.some((m) => m.id === activeView)
                  ? "bg-red-50/80 text-red-900 border border-red-200"
                  : "text-slate-700 hover:bg-slate-50"
              }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <Disc size={17} className="text-red-600" />
                {!isCollapsed && (
                  <span className="truncate tracking-tight font-black">
                    Manajemen Ban (ATMS)
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="text-slate-400">
                  {isTireMenuOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              )}
            </button>

            {isTireMenuOpen && !isCollapsed && (
              <div className="mt-1.5 ml-4 pl-3 border-l-2 border-red-200/60 space-y-1 animate-in fade-in duration-150">
                {tireSubMenus.map((menu) => {
                  const Icon = menu.icon;
                  const isActive = activeView === menu.id;

                  return (
                    <button
                      key={menu.id}
                      type="button"
                      onClick={() => onSelectView(menu.id)}
                      className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 font-bold text-xs transition ${
                        isActive
                          ? "bg-red-600 text-white shadow-xs"
                          : "text-slate-600 hover:bg-red-50 hover:text-red-900"
                      }`}>
                      <div className="flex items-center gap-2 truncate">
                        <Icon size={15} />
                        <span className="truncate">{menu.label}</span>
                      </div>
                      {menu.badge && (
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-black uppercase shrink-0 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : menu.badgeColor || "bg-slate-100 text-slate-600"
                          }`}>
                          {menu.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================= 🔧 MODUL 3: BENGKEL & PERAWATAN POOL ================= */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (isCollapsed) {
                  onToggleCollapse();
                }
                setIsWorkshopMenuOpen((prev) => !prev);
              }}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 font-bold text-xs text-slate-700 hover:bg-slate-50 transition select-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <Wrench size={17} className="text-slate-500" />
                {!isCollapsed && (
                  <span className="truncate tracking-tight font-black">
                    Bengkel & Perawatan Pool
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="text-slate-400">
                  {isWorkshopMenuOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              )}
            </button>

            {isWorkshopMenuOpen && !isCollapsed && (
              <div className="mt-1.5 ml-4 pl-3 border-l-2 border-slate-200/60 space-y-1 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => alert("Modul SPK Bengkel segera hadir!")}
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 font-bold text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition">
                  <div className="flex items-center gap-2">
                    <Wrench size={15} className="text-slate-400" />
                    <span>SPK / Work Order</span>
                  </div>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">
                    Segera
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert("Modul Servis Berkala (PM) segera hadir!")
                  }
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 font-bold text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition">
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-slate-400" />
                    <span>Servis Berkala (PM)</span>
                  </div>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">
                    Segera
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => alert("Modul Sparepart Pool segera hadir!")}
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 font-bold text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition">
                  <div className="flex items-center gap-2">
                    <Package size={15} className="text-slate-400" />
                    <span>Stok Sparepart Pool</span>
                  </div>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">
                    Segera
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Footer Status Telematics & User PIC */}
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
    </aside>
  );
}
