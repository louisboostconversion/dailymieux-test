"use client";

import { useEffect, useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", visible, onClose, duration = 3000 }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      // Small delay for enter animation
      requestAnimationFrame(() => setShow(true));
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-lg transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      } ${
        type === "success"
          ? "bg-[#2D5A3D] text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <Check className="h-3.5 w-3.5" />
        </div>
      ) : (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <AlertCircle className="h-3.5 w-3.5" />
        </div>
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={() => { setShow(false); setTimeout(onClose, 300); }} className="ml-2 rounded-full p-1 hover:bg-white/20">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
