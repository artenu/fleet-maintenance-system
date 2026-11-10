// src/components/common/SearchInput.tsx
import { Search, X } from "lucide-react";
import { SearchInputProps } from "@/types/components/common/commonTypes";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Cari data...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none transition"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
