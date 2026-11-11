// src/components/common/Modal.tsx
import { useEffect } from "react";
import { X } from "lucide-react";
import type {
  ModalProps,
  ModalSize,
} from "@/types/components/common/commonTypes";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
}: ModalProps) {
  // Tutup dengan tombol Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll background saat modal buka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => closeOnOverlayClick && onClose()}
      />

      {/* Modal Dialog Content */}
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col`}>
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4 shrink-0">
            <div>
              {title && (
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body (Scrollable) */}
        <div className="overflow-y-auto pr-1 flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
