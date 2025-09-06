'use client';
import { createTheme, Theme } from '@mui/material/styles';

const base = {
  shape: { borderRadius: 10 },
} as const;

/** 1) BlueTech (light, blue-focused) */
export const blueTech = createTheme({
  ...base,
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    secondary: { main: '#1e40af' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
    divider: '#cbd5e1',
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
  },
});

/** 2) DarkVibrant (dark, vivid purple/cyan) */
export const darkVibrant = createTheme({
  ...base,
  palette: {
    mode: 'dark',
    primary: { main: '#8b5cf6' },
    secondary: { main: '#06b6d4' },
    background: { default: '#0a0a0a', paper: '#171717' },
    text: { primary: '#fafafa', secondary: '#a3a3a3' },
    divider: '#262626',
    success: { main: '#22c55e' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
  },
});

/** 3) MinimalGray (light, neutral gray) */
export const minimalGray = createTheme({
  ...base,
  palette: {
    mode: 'light',
    primary: { main: '#374151' },
    secondary: { main: '#1f2937' },
    background: { default: '#fafafa', paper: '#ffffff' },
    text: { primary: '#111827', secondary: '#6b7280' },
    divider: '#e5e7eb',
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
  },
});

/** 4) DarkSleek (dark, cool cyan/gray) */
export const darkSleek = createTheme({
  ...base,
  palette: {
    mode: 'dark',
    primary: { main: '#06b6d4' },
    secondary: { main: '#64748b' },
    background: { default: '#020617', paper: '#0f172a' },
    text: { primary: '#f8fafc', secondary: '#94a3b8' },
    divider: '#334155',
    success: { main: '#22c55e' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
  },
});

/** Theme selector */
export type ThemeName = 'BlueTech' | 'DarkVibrant' | 'MinimalGray' | 'DarkSleek';

export function getTheme(name: ThemeName): Theme {
  switch (name) {
    case 'DarkVibrant': return darkVibrant;
    case 'MinimalGray': return minimalGray;
    case 'DarkSleek': return darkSleek;
    default: return blueTech;
  }
}
