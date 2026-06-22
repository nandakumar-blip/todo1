// ─────────────────────────────────────────────
//  useToast — lightweight toast notification hook
// ─────────────────────────────────────────────

import { useState, useCallback } from 'react';

export interface ToastItem {
  id: string;
  message: string;
  icon: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, icon = 'ti-check') => {
    const id = Date.now().toString(36);
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2200);
  }, []);

  return { toasts, showToast };
}
