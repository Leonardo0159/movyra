// Sistema de notificações toast para feedback do usuário
// Fornece notificações de sucesso, erro e informação

"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Sanitiza mensagens de erro para prevenir XSS
function sanitizeMessage(message: string): string {
  return message.replace(/<[^>]*>/g, "").slice(0, 500);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    const sanitizedMessage = sanitizeMessage(message);
    setToasts((prev) => [...prev, { id, type, message: sanitizedMessage }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm shadow-lg ${
              toast.type === "success"
                ? "bg-green-900/90 text-green-200 border border-green-700/50"
                : toast.type === "error"
                ? "bg-red-900/90 text-red-200 border border-red-700/50"
                : "bg-zinc-800/90 text-zinc-200 border border-zinc-700/50"
            }`}
            role="status"
          >
            {toast.type === "success" ? (
              <FiCheckCircle className="h-4 w-4 flex-shrink-0" />
            ) : toast.type === "error" ? (
              <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
            ) : null}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white"
              aria-label="Dismiss notification"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    success: (message: string) => context.addToast("success", message),
    error: (message: string) => context.addToast("error", message),
    info: (message: string) => context.addToast("info", message),
  };
}
