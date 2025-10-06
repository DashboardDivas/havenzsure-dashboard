// src/components/layout/Layout.tsx
"use client";

import React from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar (collapsible) */}
      {sidebarOpen && (
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        </Box>
      )}

      {/* Main Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar onMenuClick={toggleSidebar} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
