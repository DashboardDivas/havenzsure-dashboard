// This file is crucial to theming. Please read the comments carefully if you plan to modify it:
//Related files: /settings/page.tsx, src/lib/theme.ts, src/app/layout.tsx
//(Explanations are provided by ChatGPT)

// ========== App Theme Providers (Next.js App Router + MUI) ==========
// PURPOSE
// -------
// This file centralizes all app-level providers required for MUI in the Next.js
// App Router (app/) environment AND exposes a typed React Context so that any
// page/component (e.g. /settings) can read & change the current theme.

//   KEY DEPENDENCIES & HOW THEY CONNECT
//    -----------------------------------
//    - `@/lib/theme`:
//        • Exposes the union type `ThemeName` and the function `getTheme(name)`.
//          `Providers` stores only a string-like `themeName` in state and uses
//          `getTheme(themeName)` to obtain the full MUI theme object for
//          `ThemeProvider`.
  
//    - `/settings/page.tsx`:
//        • Uses `React.useContext(ThemeNameContext)` to read `themeName` and call
//          `setThemeName(nextName)`. This is the UI for switching themes.
//          Changing the context state here triggers `Providers` to re-render with
//          a new MUI theme, updating the whole app instantly.
  
//    - `src/app/layout.tsx` (App Shell):
//        • Should wrap the entire app tree with `<Providers>{children}</Providers>`.
//          That ensures all pages/components can safely consume `ThemeNameContext`
//          and also receive MUI styles (baseline + theme tokens).
  
//    DATA FLOW (USER ACTION → GLOBAL THEME)
//    --------------------------------------
//    1) User selects a theme on /settings (Select → onChange).
//    2) Settings calls `setThemeName("DarkSleek")` from `ThemeNameContext`.
//    3) Providers updates internal state `themeName`.
//    4) Providers calls `getTheme(themeName)` and re-renders `ThemeProvider`.
//    5) Entire app now receives the new theme tokens (colors/shape/etc.).
//    6) New `themeName` is persisted to `localStorage` for future reloads.
 
'use client';

import * as React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
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
