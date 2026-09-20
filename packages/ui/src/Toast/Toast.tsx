import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import styles from "./Toast.module.scss";

export type ToastTone = "success" | "info" | "warning" | "danger";

export type ToastOptions = {
  duration?: number;
  message: ReactNode;
  tone?: ToastTone;
};

type ToastItem = Required<Pick<ToastOptions, "duration" | "tone">> & ToastOptions & { id: number };

type ToastContextValue = {
  dismiss: (id: number) => void;
  toast: (options: ToastOptions) => number;
};

const ToastContext = createContext<ToastContextValue | null>(null);
let nextToastId = 0;
const defaultDuration = 5000;

export type ToastProviderProps = { children: ReactNode };

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const dismiss = useCallback((id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const toast = useCallback(({ duration = defaultDuration, message, tone = "info" }: ToastOptions) => {
    const id = nextToastId++;
    setToasts((current) => [...current, { duration, id, message, tone }]);
    return id;
  }, []);

  useEffect(() => {
    const timers = toasts
      .filter((item) => item.duration > 0)
      .map((item) => window.setTimeout(() => dismiss(item.id), item.duration));
    return () => timers.forEach(window.clearTimeout);
  }, [dismiss, toasts]);

  const value = useMemo(() => ({ dismiss, toast }), [dismiss, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-label="Notifications" className={styles.viewport}>
        {toasts.map((item) => (
          <div className={[styles.toast, styles[item.tone]].join(" ")} key={item.id} role={item.tone === "danger" ? "alert" : "status"}>
            <div className={styles.message}>{item.message}</div>
            <button aria-label="Dismiss notification" className={styles.dismiss} onClick={() => dismiss(item.id)} type="button">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
