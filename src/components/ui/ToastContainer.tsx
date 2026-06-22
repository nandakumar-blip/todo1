// ─────────────────────────────────────────────
//  ToastContainer — renders toast notifications
// ─────────────────────────────────────────────

import type { ToastItem } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastItem[];
}

export default function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed bottom-6 right-6 z-[3000] flex flex-col gap-2 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className="nav-bg text-white px-4 py-3 rounded-lg text-[13px] font-medium shadow-xl border border-white/10 flex items-center gap-2 max-w-[300px] animate-fade-in-up"
        >
          <i className={`ti ${t.icon} text-[16px]`} aria-hidden="true" />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
