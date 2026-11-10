// src/components/common/Badge.tsx
import {
  BadgeVariant,
  type BadgeProps,
} from "@/types/components/common/commonTypes";

export default function Badge({
  children,
  variant = "neutral",
  icon: Icon,
  pulse = false,
  className = "",
}: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    purple: "bg-purple-50 text-purple-800 border-purple-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
        variantClasses[variant]
      } ${pulse ? "animate-pulse" : ""} ${className}`}>
      {Icon && <Icon size={11} className="shrink-0" />}
      {children}
    </span>
  );
}
