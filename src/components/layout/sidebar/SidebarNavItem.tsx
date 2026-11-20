// src/components/layout/sidebar/SidebarNavItem.tsx
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type SidebarNavColor = "red" | "blue" | "purple";

interface SidebarNavItemProps {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  activeColor?: SidebarNavColor;
  badge?: ReactNode;
  isCollapsed?: boolean;
  className?: string;
  onClick: () => void;
}

export default function SidebarNavItem({
  label,
  icon: Icon,
  isActive = false,
  activeColor = "red",
  badge,
  isCollapsed = false,
  className = "",
  onClick,
}: SidebarNavItemProps) {
  const activeClasses: Record<SidebarNavColor, string> = {
    red: "bg-red-600 text-white shadow-xs",
    blue: "bg-blue-600 text-white shadow-xs",
    purple: "bg-purple-600 text-white shadow-md shadow-purple-500/20",
  };

  const hoverClasses: Record<SidebarNavColor, string> = {
    red: "text-slate-600 hover:bg-red-50 hover:text-red-900",
    blue: "text-slate-600 hover:bg-blue-50 hover:text-blue-900",
    purple: "text-slate-700 hover:bg-purple-50 hover:text-purple-700",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full relative flex items-center justify-between rounded-xl px-2.5 py-2 font-bold text-xs transition select-none cursor-pointer ${
        isActive ? activeClasses[activeColor] : hoverClasses[activeColor]
      } ${className}`}>
      <div className="flex items-center gap-2 truncate min-w-0">
        <div className="relative shrink-0">
          <Icon size={15} />
        </div>
        {!isCollapsed && <span className="truncate">{label}</span>}
      </div>

      {!isCollapsed && badge && <div className="shrink-0 ml-2">{badge}</div>}
    </button>
  );
}
