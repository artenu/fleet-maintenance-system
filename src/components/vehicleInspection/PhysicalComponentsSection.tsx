// src/components/vehicleInspection/PhysicalComponentsSection.tsx
import { Card } from "@/components/common";
import { SearchInput } from "@/components/forms";
import type {
  PhysicalCheckItem,
  PhysicalSectionFilter,
  ComponentConditionStatus,
} from "@/types/VehicleInspection";
import {
  PhysicalSummaryHeader,
  PhysicalSectionTabs,
  PhysicalCheckItemRow,
} from "./physicalCheck";

export interface PhysicalComponentsSectionProps {
  items: PhysicalCheckItem[];
  allItems: PhysicalCheckItem[];
  currentSection: PhysicalSectionFilter;
  searchQuery: string;
  onChangeSection: (section: PhysicalSectionFilter) => void;
  onChangeSearch: (query: string) => void;
  onUpdateStatus: (id: string, status: ComponentConditionStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onSetAllGood: () => void;
}

/**
 * Seksi 2: Checklist 50 Komponen Fisik Unit Truk & Rangkaian Sasis
 */
export default function PhysicalComponentsSection({
  items,
  allItems,
  currentSection,
  searchQuery,
  onChangeSection,
  onChangeSearch,
  onUpdateStatus,
  onUpdateNotes,
  onSetAllGood,
}: PhysicalComponentsSectionProps) {
  const goodCount = allItems.filter((i) => {
    return i.status === "B";
  }).length;
  const defectCount = allItems.filter((i) => {
    return i.status !== "B";
  }).length;

  return (
    <Card className="space-y-4">
      {/* 1. Header Seksi & Ringkasan Metrik Kondisi */}
      <PhysicalSummaryHeader
        goodCount={goodCount}
        defectCount={defectCount}
        onSetAllGood={onSetAllGood}
      />

      {/* 2. Filter & Pencarian Komponen */}
      <div className="space-y-2.5 pt-1">
        <SearchInput
          value={searchQuery}
          onChange={onChangeSearch}
          placeholder="Cari item fisik (cth: wiper, spion, tangki, kingpin)..."
        />

        <PhysicalSectionTabs
          currentSection={currentSection}
          allItems={allItems}
          onChangeSection={onChangeSection}
        />
      </div>

      {/* 3. Daftar Checklist Komponen Fisik */}
      <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white overflow-hidden shadow-2xs">
        {items.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            Tidak ada komponen fisik yang cocok dengan pencarian &quot;{searchQuery}&quot;
          </div>
        ) : (
          items.map((item, idx) => {
            return (
              <PhysicalCheckItemRow
                key={item.id}
                item={item}
                index={idx}
                onUpdateStatus={onUpdateStatus}
                onUpdateNotes={onUpdateNotes}
              />
            );
          })
        )}
      </div>
    </Card>
  );
}
