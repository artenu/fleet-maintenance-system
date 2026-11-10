import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import type {
  ToastProps,
  ToastMessage,
} from "@/types/components/common/commonTypes";

export default function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      bg: "bg-white border-emerald-300 text-slate-800 shadow-emerald-500/10",
      icon: (
        <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
      ),
      tag: "bg-emerald-100 text-emerald-800",
    },
    warning: {
      bg: "bg-white border-amber-300 text-slate-800 shadow-amber-500/10",
      icon: (
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
      ),
      tag: "bg-amber-100 text-amber-800",
    },
    info: {
      bg: "bg-white border-blue-300 text-slate-800 shadow-blue-500/10",
      icon: <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />,
      tag: "bg-blue-100 text-blue-800",
    },
  }[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-2xl border shadow-xl transition-all animate-in slide-in-from-top-2 fade-in duration-200 ${config.bg}`}>
      <div className="flex items-start gap-2.5 min-w-0">
        {config.icon}
        <div className="min-w-0">
          <strong className="text-xs font-black block truncate">
            {toast.title}
          </strong>
          {toast.description && (
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              {toast.description}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 p-0.5">
        <X size={14} />
      </button>
    </div>
  );
}
