// src/components/layout/PageHeader.tsx
import type { PageHeaderProps } from "@/types/components/layout/layoutTypes";

interface ExtendedPageHeaderProps extends PageHeaderProps {
  flush?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  badgeColor = "bg-blue-100 text-blue-700",
  icon: Icon,
  iconBgColor = "bg-red-600",
  actions,
  className = "",
  flush = false,
}: ExtendedPageHeaderProps) {
  return (
    <div
      className={
        flush
          ? className // Jika flush = true, tidak ada border, shadow, maupun p-6 bawaan
          : `rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs ${className}`
      }>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-md ${iconBgColor}`}>
              <Icon size={24} />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                {title}
              </h1>
              {badge && (
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-wrap">{actions}</div>
        )}
      </div>
    </div>
  );
}
