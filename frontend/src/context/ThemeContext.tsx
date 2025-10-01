"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { ThemeProvider as EmotionThemeProvider, type Theme } from "@emotion/react";
import getTheme, { ThemeMode } from "@/theme";


type ThemeContextType = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export function CustomThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  // Load theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("app-theme") as ThemeMode | null;
    if (saved) setMode(saved);
  }, []);

  // Save theme to localStorage and update body attribute
  useEffect(() => {
    localStorage.setItem("app-theme", mode);
    document.body.setAttribute("data-theme", mode);
  }, [mode]);

  const theme: Theme = getTheme(mode) as Theme; // <-- cast to Theme

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <EmotionThemeProvider theme={theme}>
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
}
 // Custom hook to use the ThemeContext
export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used inside CustomThemeProvider");
  }
  return ctx;
}

export default CustomThemeProvider;
