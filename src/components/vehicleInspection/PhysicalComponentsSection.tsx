// src/components/vehicleInspection/PhysicalComponentsSection.tsx
import {
  CheckCheck,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Card, Badge, Button } from "@/components/common";
import { FormInput } from "@/components/forms";
import { COMPONENT_CONDITION_OPTIONS } from "@/constants/vehicleInspection";
import type {
  PhysicalCheckItem,
  PhysicalSectionFilter,
  ComponentConditionStatus,
} from "@/types/VehicleInspection";

// 🧱 Reuse Subkomponen
import CheckmarkToggle from "./CheckMarkToggle";
import StatusPillGroup from "./StatusPillGroup";

interface PhysicalComponentsSectionProps {
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

const SECTION_TABS: Array<{ id: PhysicalSectionFilter; label: string }> = [
  { id: "ALL", label: "Semua Komponen" },
  { id: "FRONT", label: "Wajah Depan" },
  { id: "RIGHT_SIDE", label: "Sisi Kanan Supir 🇮🇩" },
  { id: "LEFT_SIDE", label: "Sisi Kiri Kenek" },
  { id: "CABIN", label: "Kabin & Interior" },
  { id: "LIGHTS", label: "Lampu & Kelistrikan" },
  { id: "CHASSIS", label: "Sasis & Gandar" },
];

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
  const goodCount = allItems.filter((i) => i.status === "B").length;
  const defectCount = allItems.filter((i) => i.status !== "B").length;

  return (
    <Card className="space-y-4">
      {/* Title & All Good Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Seksi 2: Checklist 50 Komponen Fisik Unit
            </h3>
            <p className="text-[11px] text-slate-500">
              Cukup centang status kondisi komponen fisik truk & sasis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSetAllGood}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold">
            <CheckCheck size={14} className="mr-1.5 text-emerald-600" />
            Setel Semua Baik (Ceklis Semua)
          </Button>
        </div>
      </div>

      {/* Ringkasan Status Cepat */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge variant="success" className="py-1 px-2.5 font-bold">
          <CheckCircle2 size={12} className="mr-1" /> Kondisi Baik: {goodCount}
        </Badge>
        {defectCount > 0 && (
          <Badge variant="danger" className="py-1 px-2.5 font-bold">
            <AlertTriangle size={12} className="mr-1" /> Ada Temuan/Cacat:{" "}
            {defectCount} Item
          </Badge>
        )}
      </div>

      {/* Search Input & Kategori Filter */}
      <div className="space-y-2.5 pt-1">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Cari item fisik (cth: wiper, spion, tangki, kingpin)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        {/* Tab Pills Navigasi Kategori */}
        <div className="flex flex-wrap gap-1.5">
          {SECTION_TABS.map((tab) => {
            const isActive = currentSection === tab.id;
            const tabItemCount =
              tab.id === "ALL"
                ? allItems.length
                : allItems.filter((i) => i.section === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeSection(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
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
      </div>

      {/* DAFTAR CHECKLIST BARIS TIPIS (COMPACT CHECKLIST TABLE) */}
      <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white overflow-hidden shadow-2xs">
        {items.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            Tidak ada komponen fisik yang cocok dengan pencarian "{searchQuery}"
          </div>
        ) : (
          items.map((item, idx) => {
            const isGood = item.status === "B";

            return (
              <div
                key={item.id}
                className={`p-2.5 px-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 transition-colors ${
                  isGood ? "hover:bg-slate-50/80" : "bg-rose-50/40"
                }`}>
                {/* 1. Reusable CheckmarkToggle & Nama Komponen */}
                <div className="flex items-center gap-2.5 min-w-[280px]">
                  <CheckmarkToggle
                    isGood={isGood}
                    statusLabel={item.status}
                    onToggle={() =>
                      onUpdateStatus(item.id, isGood ? "RM" : "B")
                    }
                  />

                  <div className="leading-tight">
                    <span className="text-xs font-bold text-slate-800">
                      {idx + 1}. {item.name}
                    </span>
                    <Badge
                      variant="neutral"
                      className="text-[9px] py-0 px-1 ml-1.5">
                      {item.section}
                    </Badge>
                  </div>
                </div>

                {/* 2. Reusable StatusPillGroup & Reusable FormInput Segaris */}
                <div className="flex flex-1 items-center gap-2 min-w-0">
                  <StatusPillGroup
                    options={COMPONENT_CONDITION_OPTIONS}
                    activeValue={item.status}
                    onChange={(val) => onUpdateStatus(item.id, val)}
                  />

                  <div className="flex-1 min-w-[150px]">
                    <FormInput
                      value={item.notes || ""}
                      onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                      placeholder="Catatan temuan (opsional)..."
                      className="py-1 px-2.5 text-xs rounded-lg font-medium"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
