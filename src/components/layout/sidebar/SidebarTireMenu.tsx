// src/components/layout/sidebar/SidebarTireMenu.tsx
import { useState, useMemo } from "react";
import { Disc } from "lucide-react";
import { Badge } from "@/components/common";
import { getTireSubMenus } from "@/constants/sidebar";
import type { TireMaintenanceView } from "@/types/components/layout/layoutTypes";
import SidebarNavAccordion from "./SidebarNavAccordion";
import SidebarNavItem from "./SidebarNavItem";

interface SidebarTireMenuProps {
  activeView: TireMaintenanceView;
  onSelectView: (view: TireMaintenanceView) => void;
  overdueCount?: number;
  incompleteTiresTruckCount?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarTireMenu({
  activeView,
  onSelectView,
  overdueCount = 1,
  incompleteTiresTruckCount = 0,
  isCollapsed,
  onToggleCollapse,
}: SidebarTireMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Ambil daftar menu dari constants
  const tireSubMenus = useMemo(
    () => getTireSubMenus(incompleteTiresTruckCount, overdueCount),
    [incompleteTiresTruckCount, overdueCount],
  );

  const isModuleActive = tireSubMenus.some((m) => m.id === activeView);

  return (
    <SidebarNavAccordion
      label="Manajemen Ban (ATMS)"
      icon={Disc}
      iconColor="text-red-600"
      activeColor="red"
      isOpen={isOpen}
      onToggle={() => {
        if (isCollapsed) {
          onToggleCollapse();
        }
        setIsOpen((prev) => !prev);
      }}
      isCollapsed={isCollapsed}
      isModuleActive={isModuleActive}
      hasAlert={incompleteTiresTruckCount > 0}
      borderColor="border-red-200/60">
      {tireSubMenus.map((menu) => {
        const isActive = activeView === menu.id;

        return (
          <SidebarNavItem
            key={menu.id}
            label={menu.label}
            icon={menu.icon}
            isActive={isActive}
            activeColor="red"
            isCollapsed={isCollapsed}
            badge={
              menu.badge ? (
                <Badge
                  variant={menu.badgeVariant || "neutral"}
                  pulse={menu.pulse}
                  className={`text-[9px] px-1.5 py-0 font-extrabold tracking-tight shrink-0 ${
                    isActive ? "bg-white/20 text-white border-transparent" : ""
                  }`}>
                  {menu.badge}
                </Badge>
              ) : undefined
            }
            onClick={() => onSelectView(menu.id)}
          />
        );
      })}
    </SidebarNavAccordion>
  );
}
