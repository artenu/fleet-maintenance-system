// src/hooks/useToast.ts
import { useState, useCallback } from "react";
import type { ToastMessage } from "@/types/components/common/commonTypes";

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (
      type: "success" | "warning" | "info",
      title: string,
      description?: string,
    ) => {
      const newToast: ToastMessage = {
        id: Date.now().toString(),
        type,
        title,
        description,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
