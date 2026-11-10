// src/components/common/Button.tsx
import {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "@/types/components/common/commonTypes";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Base styling
  const baseClasses =
    "inline-flex items-center justify-center font-bold rounded-xl transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  // Varian warna
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500/30 shadow-xs",
    secondary:
      "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 focus:ring-slate-500/30 shadow-xs",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500/30 shadow-xs",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500/30 shadow-xs",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus:ring-slate-400/20 shadow-2xs",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-400/20",
  };

  // Ukuran
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5",
    md: "px-3.5 py-2 text-xs gap-2",
    lg: "px-5 py-2.5 text-sm gap-2.5",
  };

  const iconSize = size === "sm" ? 14 : size === "md" ? 16 : 18;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}>
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon size={iconSize} className="shrink-0" />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon size={iconSize} className="shrink-0" />
          )}
        </>
      )}
    </button>
  );
}
