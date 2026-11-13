// src/components/forms/RangeInput.tsx
import type { RangeInputProps } from "@/types/components/forms/formsTypes";

export default function RangeInput({
  label,
  subLabel,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  valueDisplay,
  error,
  helperText,
  disabled,
  className = "",
  ...props
}: RangeInputProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || valueDisplay) && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700">
            {label}
            {subLabel && (
              <span className="block text-[11px] font-normal text-slate-400 mt-0.5">
                {subLabel}
              </span>
            )}
          </label>
          {valueDisplay && (
            <div className="text-right text-xs">{valueDisplay}</div>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          {...props}
        />
      </div>

      {helperText && !error && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}

      {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
    </div>
  );
}
