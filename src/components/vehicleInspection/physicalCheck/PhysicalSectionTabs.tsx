// src/components/vehicleInspection/physicalCheck/PhysicalSectionTabs.tsx
import { PHYSICAL_SECTION_TABS } from "@/constants/vehicleInspection";
import type { PhysicalSectionTabsProps } from "@/types/VehicleInspection/physicalCheckTypes";

/**
 * Sub-komponen tab pill filter kategori bagian fisik (Wajah Depan, Sisi Kanan/Kiri, Kabin, dll)
 */
export default function PhysicalSectionTabs({
  currentSection,
  allItems,
  onChangeSection,
}: PhysicalSectionTabsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PHYSICAL_SECTION_TABS.map((tab) => {
        const isActive = currentSection === tab.id;
        const tabItemCount =
          tab.id === "ALL"
            ? allItems.length
            : allItems.filter((i) => {
                return i.section === tab.id;
              }).length;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              onChangeSection(tab.id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}>
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}>
              {tabItemCount}
            </span>
          </button>
        );
      })}
    </div>
  );
}
