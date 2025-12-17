"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react"; // <-- Import useCallback
import Toast from "../components/ui/Toast";

type ToastType = "success" | "error" | "info";

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // --- THIS IS THE CRITICAL CHANGE ---
  // Wrap showToast in useCallback to give it a stable identity across re-renders.
  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []); // The empty dependency array means this function is created only once.

  const closeToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </ToastContext.Provider>
  );
};
