// src/components/layout/sidebar/SidebarFleetMenu.tsx
import { useState } from "react";
import { Truck, Link2, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/common";
import type { TireMaintenanceView } from "@/types/components/layout/layoutTypes";
import SidebarNavAccordion from "./SidebarNavAccordion";
import SidebarNavItem from "./SidebarNavItem";

interface SidebarFleetMenuProps {
  activeView: TireMaintenanceView;
  onSelectView: (view: TireMaintenanceView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarFleetMenu({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
}: SidebarFleetMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const isModuleActive =
    activeView === "coupling" || activeView === "vehicle-inspection";

  return (
    <SidebarNavAccordion
      label="Manajemen Armada & Sasis"
      icon={Truck}
      iconColor="text-blue-600"
      isOpen={isOpen}
      onToggle={() => {
        if (isCollapsed) {
          onToggleCollapse();
        }
        setIsOpen((prev) => !prev);
      }}
      isCollapsed={isCollapsed}
      isModuleActive={isModuleActive}
      borderColor="border-blue-200/60">
      <SidebarNavItem
        label="Perangkaian Sasis (Coupling)"
        icon={Link2}
        isActive={activeView === "coupling"}
        activeColor="blue"
        onClick={() => onSelectView("coupling")}
      />
      <SidebarNavItem
        label="Inspeksi Form Surveyor"
        icon={ClipboardCheck}
        isActive={activeView === "vehicle-inspection"}
        activeColor="blue"
        badge={
          <Badge variant="neutral" className="text-[9px]">
            Pilar 3
          </Badge>
        }
        onClick={() => onSelectView("vehicle-inspection")}
      />
    </SidebarNavAccordion>
  );
}
