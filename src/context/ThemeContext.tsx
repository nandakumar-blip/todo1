// ─────────────────────────────────────────────
//  ThemeContext — manages Blue / Dark / Green
//  Persists to localStorage, applies data-theme
// ─────────────────────────────────────────────

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Theme } from '../types';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'blue', setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try { return (localStorage.getItem('pc_theme') as Theme) || 'blue'; }
    catch { return 'blue'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Also toggle dark class for Tailwind dark: variant
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Debug log to help troubleshoot theme application
    try {
      // Visible in devtools console
      console.debug('[ThemeContext] applying theme:', theme);
      // Add an easy-to-inspect attribute on body for debugging tools
      document.body.setAttribute('data-theme-active', theme);
      localStorage.setItem('pc_theme', theme);
    } catch {}
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
