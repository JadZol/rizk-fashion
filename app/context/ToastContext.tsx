// app/context/ToastContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Link from "next/link";

type ToastContextType = {
  showToast: (message: string, actionUrl?: string, actionText?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    actionUrl?: string;
    actionText?: string;
    visible: boolean;
  }>({
    message: "",
    visible: false,
  });

  const showToast = (message: string, actionUrl?: string, actionText?: string) => {
    setToast({ message, actionUrl, actionText, visible: true });

    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Elite Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out transform ${
          toast.visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-[#2E2624] text-[#FBF3EC] px-6 py-4 border border-[#D98C7A]/40 shadow-2xl flex items-center gap-4 min-w-[280px] max-w-md">
          <div className="w-2 h-2 rounded-full bg-[#D98C7A] animate-pulse flex-shrink-0" />
          <p className="text-xs tracking-wider uppercase flex-1 font-medium">{toast.message}</p>
          {toast.actionUrl && toast.actionText && (
            <Link
              href={toast.actionUrl}
              onClick={() => setToast(prev => ({ ...prev, visible: false }))}
              className="text-[10px] uppercase tracking-widest text-[#D98C7A] hover:text-white underline underline-offset-4 font-bold transition-colors cursor-pointer flex-shrink-0"
            >
              {toast.actionText} →
            </Link>
          )}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}