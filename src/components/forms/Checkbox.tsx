// src/components/common/Checkbox.tsx
import { Check } from "lucide-react";
import type { CheckboxProps } from "@/types/components/forms/formsTypes";

export default function Checkbox({
  label,
  subLabel,
  checked,
  onChange,
  error,
  disabled,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <div className={`text-xs ${className}`}>
      <label
        className={`inline-flex items-start gap-2.5 select-none ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}>
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => !disabled && onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={`grid h-4.5 w-4.5 place-items-center rounded-md border transition ${
              checked
                ? "border-red-600 bg-red-600 text-white shadow-2xs"
                : "border-slate-300 bg-white hover:border-slate-400"
            } ${error ? "border-rose-400" : ""}`}>
            {checked && <Check size={12} strokeWidth={3} />}
          </div>
        </div>

        {(label || subLabel) && (
          <div className="leading-tight">
            {label && (
              <span className="font-bold text-slate-800 block">{label}</span>
            )}
            {subLabel && (
              <p className="text-[11px] text-slate-400 mt-0.5">{subLabel}</p>
            )}
          </div>
        )}
      </label>

      {error && (
        <p className="mt-1 text-[11px] font-bold text-rose-600">{error}</p>
      )}
    </div>
  );
}
