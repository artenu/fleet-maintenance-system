// src/components/forms/Select.tsx
import type { SelectProps } from "@/types/components/forms/formsTypes";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  subLabel,
  error,
  helperText,
  icon: Icon,
  options,
  children,
  className = "",
  disabled,
  required,
  ...props
}: SelectProps) {
  return (
    <div className="w-full text-xs">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </span>
          {subLabel && <span>{subLabel}</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <Icon size={15} />
          </div>
        )}

        <select
          disabled={disabled}
          className={`w-full h-10 appearance-none rounded-xl border bg-white px-3 pr-8 font-semibold text-slate-800 text-xs transition focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
            error
              ? "border-rose-400 bg-rose-50 text-rose-900 focus:border-rose-500"
              : "border-slate-300 focus:border-red-500"
          } ${
            disabled
              ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
              : "cursor-pointer"
          } ${Icon ? "pl-9" : ""} ${className}`}
          {...props}>
          {options
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="absolute right-3 text-slate-400 pointer-events-none">
          <ChevronDown size={14} />
        </div>
      </div>

      {error ? (
        <span className="mt-1 block text-[10px] text-rose-600 font-medium">
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

