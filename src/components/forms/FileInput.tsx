// src/components/forms/FileInput.tsx
import { useRef, useId } from "react";
import { Upload } from "lucide-react";
import type { FileInputProps } from "@/types/components/forms/formsTypes";

export default function FileInput({
  label,
  subLabel,
  buttonText = "Pilih File",
  icon: Icon = Upload,
  error,
  helperText,
  disabled,
  className = "",
  id,
  capture,
  accept,
  onChange,
  ...props
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-slate-700">
          {label}
          {subLabel && (
            <span className="block text-[11px] font-normal text-slate-400 mt-0.5">
              {subLabel}
            </span>
          )}
        </label>
      )}

      <div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          capture={capture}
          disabled={disabled}
          onChange={onChange}
          className="hidden"
          {...props}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 active:bg-slate-200 transition focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed select-none">
          <Icon size={16} className="text-slate-500 shrink-0" />
          <span>{buttonText}</span>
        </button>
      </div>

      {helperText && !error && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}

      {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
    </div>
  );
}
