// src/components/common/DateInput.tsx
import { Calendar } from "lucide-react";
import { DateInputProps } from "@/types/components/common/commonTypes";

export default function DateInput({
  label,
  subLabel,
  error,
  helperText,
  className = "",
  disabled,
  readOnly,
  required,
  ...props
}: DateInputProps) {
  return (
    <div className="w-full text-xs">
      {label && (
        <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-500" />
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
          </span>
          {subLabel && <span>{subLabel}</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          type="date"
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full rounded-xl border bg-white px-3 py-2.5 font-bold text-slate-900 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
            error ? "border-rose-300" : "border-slate-300"
          } ${
            disabled || readOnly
              ? "bg-slate-50 text-slate-600 cursor-not-allowed border-slate-200"
              : ""
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-1 text-[11px] font-bold text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
