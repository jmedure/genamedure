"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  visible: boolean;
  onHide: () => void;
};

export function Toast({ message, visible, onHide }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const id = window.setTimeout(onHide, 2200);
    return () => window.clearTimeout(id);
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast pointer-events-none fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 bg-ink px-4 py-2.5 text-white"
    >
      <p className="font-body text-base tracking-[-0.08px]">{message}</p>
    </div>
  );
}
