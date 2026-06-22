// ─────────────────────────────────────────────
//  BackToTop — appears after scroll
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={[
        'fixed bottom-6 left-6 z-50 w-10 h-10 rounded-lg bg-accent text-white shadow-md',
        'flex items-center justify-center transition-all duration-300',
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        'hover:opacity-90 hover:-translate-y-0.5',
      ].join(' ')}
    >
      <i className="ti ti-arrow-up text-[18px]" aria-hidden="true" />
    </button>
  );
}
