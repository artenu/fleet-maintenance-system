// src/components/common/NumberInput.tsx
import React from "react";
import { formatThousand, parseThousand } from "@/utils/formatters";
import type { NumberInputProps } from "@/types/components/forms/formsTypes";

export default function NumberInput({
  label,
  subLabel,
  value,
  onChange,
  prefixText,
  suffixText,
  icon: Icon,
  error,
  helperText,
  allowDecimals = false,
  className = "",
  disabled,
  readOnly,
  required,
  placeholder = "0",
  ...props
}: NumberInputProps) {
  // ✨ Derived State murni dari prop (Bebas useEffect, tanpa cascading render!)
  const displayValue = formatThousand(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;

    if (rawInput === "") {
      onChange(0);
      return;
    }

    const cleanNumbersOnly = allowDecimals
      ? rawInput.replace(/[^0-9,.]/g, "")
      : rawInput.replace(/\D/g, "");

    const numericValue = parseThousand(cleanNumbersOnly);
    onChange(numericValue);
  };

  return (
    <div className="w-full text-xs">
      {label && (
        <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
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

        {prefixText && (
          <span className="absolute left-3 font-bold text-slate-400 select-none text-xs">
            {prefixText}
          </span>
        )}

        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-3 py-2.5 font-bold text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-red-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            error
              ? "border-rose-300 focus:border-rose-500"
              : "border-slate-300 focus:border-red-500"
          } ${
            disabled || readOnly
              ? "bg-slate-50 text-slate-600 cursor-not-allowed border-slate-200"
              : ""
          } ${Icon ? "pl-9" : prefixText ? "pl-9" : ""} ${
            suffixText ? "pr-12" : ""
          } ${className}`}
          {...props}
        />

        {suffixText && (
          <span className="absolute right-3 font-bold text-slate-400 select-none text-xs">
            {suffixText}
          </span>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-[11px] font-bold text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
