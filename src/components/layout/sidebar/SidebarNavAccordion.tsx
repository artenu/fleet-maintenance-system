// src/components/layout/sidebar/SidebarNavAccordion.tsx
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

export type SidebarAccordionColor = "red" | "blue" | "purple";

interface SidebarNavAccordionProps {
  label: string;
  icon: LucideIcon;
  iconColor?: string;
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  isModuleActive?: boolean;
  activeColor?: SidebarAccordionColor;
  hasAlert?: boolean;
  borderColor?: string;
  children: ReactNode;
}

export default function SidebarNavAccordion({
  label,
  icon: Icon,
  iconColor = "text-slate-600",
  isOpen,
  onToggle,
  isCollapsed,
  isModuleActive = false,
  activeColor = "blue",
  hasAlert = false,
  borderColor = "border-slate-200/60",
  children,
}: SidebarNavAccordionProps) {
  const activeColorClasses: Record<SidebarAccordionColor, string> = {
    red: "bg-red-50/80 text-red-900 border border-red-200",
    blue: "bg-blue-50/80 text-blue-900 border border-blue-200",
    purple: "bg-purple-50/80 text-purple-900 border border-purple-200",
  };

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full relative flex items-center justify-between rounded-xl px-3 py-2 font-bold text-xs transition-all duration-200 select-none cursor-pointer ${
          hasAlert
            ? !isOpen || isCollapsed
              ? "bg-amber-100/90 text-amber-950 border border-amber-400 animate-pulse shadow-xs"
              : "bg-amber-50 text-amber-900 border border-amber-300"
            : isModuleActive
              ? activeColorClasses[activeColor]
              : "text-slate-700 hover:bg-slate-50"
        }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon size={17} className={hasAlert ? "text-amber-600" : iconColor} />
          {!isCollapsed && (
            <span className="truncate tracking-tight font-black">{label}</span>
          )}
        </div>

        {/* 🔄 Animasi Rotasi Chevron yang Mulus */}
        {!isCollapsed && (
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ease-in-out shrink-0 ${
              hasAlert ? "text-amber-600" : "text-slate-400"
            } ${isOpen ? "rotate-0" : "-rotate-90"}`}
          />
        )}
      </button>

      {/* 🌊 Animasi Meluncur Buka/Tutup Submenu (CSS Grid Transition) */}
      {!isCollapsed && (
        <div
          className={`grid transition-all h-fit duration-300 ease-in-out overflow-hidden ${
            isOpen
              ? "grid-rows-[1fr] opacity-100 mt-1.5"
              : "grid-rows-[0fr] opacity-0 mt-0"
          }`}>
          <div
            className={`min-h-0 ml-2 pl-2 border-l-2 ${borderColor} space-y-1`}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
