'use client';

import * as React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '@/lib/theme';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui', enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
