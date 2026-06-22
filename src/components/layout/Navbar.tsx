// ─────────────────────────────────────────────
//  Navbar — fixed top nav with brand, links,
//  and theme switcher buttons
// ─────────────────────────────────────────────

import { useTheme } from '../../context/ThemeContext';
import type { Theme } from '../../types';

interface NavbarProps {
  onScrollToBoard: () => void;
  onScrollToInsights: () => void;
}

const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: 'blue', label: 'Blue', icon: 'ti-building' },
  { id: 'dark', label: 'Dark', icon: 'ti-moon' },
];

export default function Navbar({ onScrollToBoard, onScrollToInsights }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 nav-bg shadow-lg"
      style={{ height: 'var(--nav-h)', backgroundColor: 'var(--bg-nav)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-4">

        {/* Brand */}
        <a href="#" className="flex items-center gap-3 flex-shrink-0" aria-label="ProveIT Catalysts home">
          <div className="w-9 h-9 bg-white rounded flex items-center justify-center text-accent font-bold text-sm">
            PC
          </div>
          <div>
            <div className="text-white font-semibold text-[15px] leading-tight tracking-wide">
              ProveIT Catalysts
            </div>
            <div className="text-white/55 text-[10px] uppercase tracking-widest">
              Task Intelligence
            </div>
          </div>
        </a>

        {/* Nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-0.5" role="menubar">
          {[].map(link => (
            <button
              key={link.label}
              role="menuitem"
              onClick={link.onClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-[13px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              <i className={`ti ${link.icon} text-[15px]`} aria-hidden="true" />
              {link.label}
            </button>
          ))}
        </div>

        {/* Theme switcher */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              aria-label={`Switch to ${t.label} theme`}
              className={[
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[12px] font-medium transition-all',
                'border border-white/25 text-white/85',
                theme === t.id
                  ? 'bg-white/22 border-white text-white'
                  : 'bg-white/8 hover:bg-white/18 hover:border-white/40',
              ].join(' ')}
            >
              <i className={`ti ${t.icon} text-[14px]`} aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>

      </div>
    </nav>
  );
}
