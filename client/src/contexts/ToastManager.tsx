import Toast from "@/components/Toast";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useState } from "react";

export interface ToastOptions {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
}

let addToastExternal:
  | ((
      message: string,
      type: "success" | "error" | "info",
      duration?: number
    ) => void)
  | null = null;

const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info", duration = 3000) => {
      const id = nanoid();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    addToastExternal = addToast;
  }, [addToast]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex flex-col justify-start items-end z-0">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          msg={toast.message}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export const toast = {
  success: (msg: string, duration?: number) =>
    addToastExternal?.(msg, "success", duration),
  error: (msg: string, duration?: number) =>
    addToastExternal?.(msg, "error", duration),
  info: (msg: string, duration?: number) =>
    addToastExternal?.(msg, "info", duration),
};

export default ToastManager;
