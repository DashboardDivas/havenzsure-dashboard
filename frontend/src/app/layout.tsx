// src/app/layout.tsx
"use client";

import React from "react";
import CustomThemeProvider from "@/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <html lang="en">
      <body>
        <CustomThemeProvider>
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          {children}
        </CustomThemeProvider>
      </body>
    </html>
  );
}
