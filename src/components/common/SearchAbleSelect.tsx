// src/components/common/SearchableSelect.tsx
import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { SearchableSelectProps } from "@/types/components/common/commonTypes";

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Ketik untuk mencari...",
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      (o.subLabel && o.subLabel.toLowerCase().includes(search.toLowerCase())),
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full text-xs" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearch("");
          }
        }}
        className="w-full flex items-center justify-between rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-bold text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:bg-slate-100 disabled:cursor-not-allowed">
        <span className="truncate">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in duration-150">
          <div className="relative mb-2">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left font-semibold transition ${
                      isSelected
                        ? "bg-red-50 text-red-700 font-bold"
                        : "text-slate-800 hover:bg-slate-100"
                    }`}>
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{opt.label}</span>
                        {opt.badge && (
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-black uppercase ${opt.badgeColor || "bg-slate-100 text-slate-600"}`}>
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.subLabel && (
                        <p className="text-[11px] text-slate-400 truncate">
                          {opt.subLabel}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <Check size={14} className="text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">
                Tidak ada opsi ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
