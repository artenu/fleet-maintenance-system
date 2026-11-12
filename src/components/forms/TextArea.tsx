// src/components/forms/TextArea.tsx
import type { TextAreaProps } from "@/types/components/forms/formsTypes";

export default function TextArea({
  label,
  subLabel,
  error,
  helperText,
  className = "",
  disabled,
  required,
  ...props
}: TextAreaProps) {
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

      <textarea
        disabled={disabled}
        className={`w-full rounded-xl border bg-white p-3 font-semibold text-slate-800 text-xs transition focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
          error
            ? "border-rose-400 bg-rose-50 text-rose-900 focus:border-rose-500"
            : "border-slate-300 focus:border-red-500"
        } ${
          disabled
            ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
            : ""
        } ${className}`}
        {...props}
      />

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

