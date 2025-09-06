'use client';

import * as React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

// import the selector and type from your theme file
import { getTheme, type ThemeName } from '@/lib/theme';

type ThemeCtx = {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
};

// expose a context so any component (e.g., Settings page) can switch theme
export const ThemeNameContext = React.createContext<ThemeCtx | undefined>(undefined);

const THEME_STORAGE_KEY = 'themeName';

export default function Providers({ children }: { children: React.ReactNode }) {
  // default to BlueTech; read persisted value on client to avoid SSR mismatch
  const [themeName, setThemeName] = React.useState<ThemeName>('BlueTech');

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
      if (saved) setThemeName(saved);
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch {}
  }, [themeName]);

  const ctxValue = React.useMemo(() => ({ themeName, setThemeName }), [themeName]);

  return (
    <AppRouterCacheProvider options={{ key: 'mui', enableCssLayer: true }}>
      <ThemeNameContext.Provider value={ctxValue}>
        <ThemeProvider theme={getTheme(themeName)}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeNameContext.Provider>
    </AppRouterCacheProvider>
  );
}
