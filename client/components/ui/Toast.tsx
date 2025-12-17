"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseClasses =
    "fixed top-5 right-5 z-50 p-4 rounded-lg shadow-xl text-white flex items-center gap-3";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-sky-500",
  };

  const Icon = () => {
    // You can use more specific icons for each type
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <Icon />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-lg">
        &times;
      </button>
    </div>
  );
};

export default Toast;
