"use client";

import React from "react";
import CustomThemeProvider from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Box, CircularProgress } from "@mui/material";

// Auth-aware layout wrapper
function AuthLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Show loading screen while auth is initializing
  // This prevents API calls from being made before Firebase auth is ready
  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Box mt={2} color="text.secondary">
            Loading...
          </Box>
        </Box>
      </Box>
    );
  }

  // Auth is ready, render the app
  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {children}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CustomThemeProvider>
          <AuthProvider>
            <AuthLayout>{children}</AuthLayout>
          </AuthProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
