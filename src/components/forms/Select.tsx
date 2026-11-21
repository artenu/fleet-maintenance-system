// src/components/forms/Select.tsx
import { useState, useRef, useEffect, useMemo } from "react";
import type {
  SelectProps,
  SelectOption,
  SelectChangeEvent,
} from "@/types/components/forms/formsTypes";
import { Search, ChevronDown, Check, PackageOpen, SearchX } from "lucide-react";

export default function Select({
  label,
  subLabel,
  error,
  helperText,
  icon: Icon,
  options = [],
  value,
  onChange,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Ketik untuk mencari...",
  emptyText = "Tidak ada data tersedia",
  isSearchable = true,
  disabled = false,
  required = false,
  className = "",
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalisasi opsi
  const safeOptions: SelectOption[] = useMemo(() => options || [], [options]);

  // Cari opsi yang sedang terpilih
  const selectedOption = safeOptions.find(
    (o) => String(o.value) === String(value),
  );

  // Filter opsi berdasarkan kata kunci pencarian
  const filteredOptions = useMemo(() => {
    if (!search.trim()) {
      return safeOptions;
    }
    const q = search.toLowerCase();
    return safeOptions.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.subLabel && o.subLabel.toLowerCase().includes(q)),
    );
  }, [safeOptions, search]);

  // Tutup dropdown saat klik di luar area
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

  // Tutup dropdown saat tombol Escape ditekan
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handler saat opsi dipilih (mengirim format synthetic event yang aman)
  const handleSelectOption = (opt: SelectOption) => {
    if (opt.disabled) {
      return;
    }
    if (onChange) {
      const syntheticEvent: SelectChangeEvent = {
        target: { value: opt.value, name: name || "" },
      };
      onChange(syntheticEvent);
    }
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative w-full text-xs ${className}`} ref={dropdownRef}>
      {/* 1. Label Input */}
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </span>
          {subLabel && (
            <span className="text-[11px] text-slate-400 font-normal">
              {subLabel}
            </span>
          )}
        </label>
      )}

      {/* 2. Tombol Pemicu Dropdown */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setIsOpen((prev) => !prev);
              setSearch("");
            }
          }}
          className={`w-full h-10 flex items-center justify-between rounded-xl border bg-white px-3 font-semibold text-xs transition shadow-2xs ${
            error
              ? "border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-500/20"
              : isOpen
                ? "border-red-500 ring-2 ring-red-500/20"
                : "border-slate-300 hover:border-slate-400"
          } ${
            disabled
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200 shadow-none"
              : "cursor-pointer text-slate-800"
          } ${Icon ? "pl-9" : ""}`}>
          {/* Icon Input jika ada */}
          {Icon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              <Icon size={15} />
            </div>
          )}

          <span className="truncate pr-2">
            {selectedOption ? (
              <span className="flex items-center gap-2">
                <span>{selectedOption.label}</span>
                {selectedOption.badge && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${
                      selectedOption.badgeColor || "bg-slate-100 text-slate-600"
                    }`}>
                    {selectedOption.badge}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-slate-400 font-normal">{placeholder}</span>
            )}
          </span>

          <ChevronDown
            size={14}
            className={`text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-red-500" : ""
            }`}
          />
        </button>

        {/* 3. Panel Menu Popover Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Input Pencarian (Search Box) */}
            {isSearchable && safeOptions.length > 0 && (
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500/20"
                />
              </div>
            )}

            {/* Daftar Opsi & Empty State */}
            <div className="max-h-56 overflow-y-auto space-y-0.5">
              {safeOptions.length === 0 ? (
                /* EMPTY STATE A: Data Asli Kosong (0 Item) */
                <div className="py-6 px-4 text-center space-y-1.5">
                  <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-400">
                    <PackageOpen size={18} />
                  </div>
                  <p className="text-xs font-black text-slate-700">
                    {emptyText}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Belum ada item yang terdaftar pada daftar ini
                  </p>
                </div>
              ) : filteredOptions.length === 0 ? (
                /* EMPTY STATE B: Pencarian Tidak Menemukan Hasil */
                <div className="py-6 px-4 text-center space-y-1.5">
                  <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-400">
                    <SearchX size={18} />
                  </div>
                  <p className="text-xs font-black text-slate-700">
                    Tidak ada hasil ditemukan
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Tidak ada opsi yang cocok dengan "{search}"
                  </p>
                </div>
              ) : (
                /* DAFTAR OPSI */
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                        opt.disabled
                          ? "opacity-40 cursor-not-allowed bg-slate-50"
                          : isSelected
                            ? "bg-red-50 text-red-700 font-bold"
                            : "text-slate-800 hover:bg-slate-100 font-medium"
                      }`}>
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{opt.label}</span>
                          {opt.badge && (
                            <span
                              className={`rounded px-1.5 py-0.2 text-[9px] font-black uppercase ${
                                opt.badgeColor || "bg-slate-100 text-slate-600"
                              }`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.subLabel && (
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
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
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Error Message / Helper Text */}
      {error ? (
        <span className="mt-1 block text-[10px] text-rose-600 font-bold">
          {error}
        </span>
      ) : helperText ? (
        <span className="mt-1 block text-[10px] text-slate-400 font-medium">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
