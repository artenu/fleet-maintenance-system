import type {
  SpinnerProps,
  SpinnerSize,
  SpinnerVariant,
} from "@/types/components/common/commonTypes";

export default function Spinner({
  size = "md",
  variant = "primary",
  text,
  className = "",
  fullPage = false,
}: SpinnerProps) {
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-9 w-9 border-3",
    xl: "h-12 w-12 border-4",
  };

  const variantClasses: Record<SpinnerVariant, string> = {
    primary: "border-red-600 border-t-transparent",
    white: "border-white border-t-transparent",
    slate: "border-slate-600 border-t-transparent",
    emerald: "border-emerald-600 border-t-transparent",
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-2.5 ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}
      />
      {text && <span className="text-xs font-bold text-slate-500">{text}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
}
