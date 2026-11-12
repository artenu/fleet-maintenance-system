// src/components/common/StatCard.tsx
import {
  type StatCardProps,
  type StatCardVariant,
} from "@/types/components/common/commonTypes";

export default function StatCard({
  title,
  value,
  subValue,
  subtitle,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const containerClasses: Record<StatCardVariant, string> = {
    default: "border-slate-200 bg-white",
    success: "border-emerald-200 bg-emerald-50/60",
    danger: "border-rose-200 bg-rose-50/60",
    info: "border-blue-200 bg-blue-50/60",
    purple: "border-purple-200 bg-purple-50/60",
  };

  const titleClasses: Record<StatCardVariant, string> = {
    default: "text-slate-500",
    success: "text-emerald-700",
    danger: "text-rose-700",
    info: "text-blue-700",
    purple: "text-purple-700",
  };

  const iconClasses: Record<StatCardVariant, string> = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-emerald-600 text-white shadow-xs",
    danger: "bg-rose-600 text-white shadow-xs",
    info: "bg-blue-600 text-white shadow-xs",
    purple: "bg-purple-600 text-white shadow-xs",
  };

  const valueClasses: Record<StatCardVariant, string> = {
    default: "text-slate-900",
    success: "text-emerald-900",
    danger: "text-rose-900",
    info: "text-blue-900",
    purple: "text-purple-900",
  };

  return (
    <div
      className={`rounded-2xl border p-4 shadow-2xs ${containerClasses[variant]}`}>
      <div
        className={`flex items-center justify-between ${titleClasses[variant]}`}>
        <span className="text-xs font-bold uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`grid h-8 w-8 place-items-center rounded-xl ${iconClasses[variant]}`}>
          <Icon size={17} />
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-2xl font-black ${valueClasses[variant]}`}>
          {value}
        </span>
        {subValue && (
          <span className={`text-xs font-bold ${titleClasses[variant]}`}>
            {subValue}
          </span>
        )}
      </div>
      {subtitle && (
        <div className="text-[11px] text-slate-500 mt-1 font-medium">
          {subtitle}
        </div>
      )}
    </div>
  );
}
