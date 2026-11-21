// src/components/layout/sidebar/SidebarWorkshopMenu.tsx
import { useState } from "react";
import { Wrench, Clock, Package } from "lucide-react";
import { Badge } from "@/components/common";
import SidebarNavAccordion from "./SidebarNavAccordion";
import SidebarNavItem from "./SidebarNavItem";

interface SidebarWorkshopMenuProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarWorkshopMenu({
  isCollapsed,
  onToggleCollapse,
}: SidebarWorkshopMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <SidebarNavAccordion
      label="Bengkel & Perawatan Pool"
      icon={Wrench}
      iconColor="text-slate-500"
      isOpen={isOpen}
      onToggle={() => {
        if (isCollapsed) {
          onToggleCollapse();
        }
        setIsOpen((prev) => !prev);
      }}
      isCollapsed={isCollapsed}>
      <SidebarNavItem
        label="SPK / Work Order"
        icon={Wrench}
        badge={
          <Badge variant="neutral" className="text-[9px]">
            Segera
          </Badge>
        }
        onClick={() => alert("Modul SPK Bengkel segera hadir!")}
      />
      <SidebarNavItem
        label="Servis Berkala (PM)"
        icon={Clock}
        badge={
          <Badge variant="neutral" className="text-[9px]">
            Segera
          </Badge>
        }
        onClick={() => alert("Modul Servis Berkala (PM) segera hadir!")}
      />
      <SidebarNavItem
        label="Stok Sparepart Pool"
        icon={Package}
        badge={
          <Badge variant="neutral" className="text-[9px]">
            Segera
          </Badge>
        }
        onClick={() => alert("Modul Sparepart Pool segera hadir!")}
      />
    </SidebarNavAccordion>
  );
}
