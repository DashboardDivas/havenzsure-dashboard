"use client";

import React from "react";
import Link from "next/link";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import {
  Dashboard,
  Assignment,
  People,
  Store,
  Work,
  HelpOutline,
  Settings,
  History,
} from "@mui/icons-material";

// Reusable SidebarButton
function SidebarButton({
  icon,
  label,
  badge,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string | null;
  href?: string;
}) {
  const theme = useTheme();
  return (
    <Button
      component={href ? Link : "button"}
      href={href}
      variant="text"
      startIcon={icon}
      sx={{
        justifyContent: "flex-start",
        textTransform: "none",
        color: theme.palette.text.primary,
        borderRadius: 2,
        px: 2,
        py: 1,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
      fullWidth
    >
      <Box sx={{ flexGrow: 1, textAlign: "left" }}>{label}</Box>
      {badge && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: theme.palette.primary.main,
            color: "white",
            borderRadius: "50%",
            fontSize: "0.75rem",
            minWidth: 20,
            height: 20,
          }}
        >
          {badge}
        </Box>
      )}
    </Button>
  );
}

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();

  const mainMenuItems = [
    { name: "Dashboard", icon: <Dashboard />, href: "/" },
    { name: "Work Orders", icon: <Assignment />, href: "/workorder" },
    { name: "Users", icon: <People />, href: "/users" },
    { name: "Shops", icon: <Store />, href: "/shops" },
    { name: "Jobs", icon: <Work />, href: "/jobs" },
    { name: "History", icon: <History />, href: "/history" },
    { name: "Help", icon: <HelpOutline />, href: "/help" },
  ];

  // Mock activity log
  const activities = [
    {
      id: 1,
      icon: <Assignment fontSize="small" color="primary" />,
      text: "Work Order #223 created",
      time: "2h ago",
    },
    {
      id: 2,
      icon: <People fontSize="small" color="secondary" />,
      text: "New customer added",
      time: "5h ago",
    },
    {
      id: 3,
      icon: <Work fontSize="small" color="success" />,
      text: "Job #87 completed",
      time: "1d ago",
    },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 280,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          height: "100%",
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{ px: 2, py: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            HavenzSure Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your workspace
          </Typography>
        </Box>

        <Divider />

        {/* Main Menu */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ px: 2, mb: 1, display: "block" }}
          >
            Main Menu
          </Typography>
          {mainMenuItems.map((item) => (
            <SidebarButton
              key={item.name}
              icon={item.icon}
              label={item.name}
              href={item.href}
            />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Settings */}
        <SidebarButton icon={<Settings />} label="Settings" href="/settings" />

        <Divider sx={{ my: 2 }} />

        {/* Footer / Activity Log */}
        <Box sx={{ mt: "auto", p: 2, display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            Recent Activity
          </Typography>

          {/* Scrollable list area */}
          <Box
            sx={{
              maxHeight: 200,
              overflowY: "auto",
              pr: 1,
            }}
          >
            {activities.map((activity) => (
              <Box
                key={activity.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  py: 1,
                }}
              >
                <Box
                  sx={{ minWidth: 32, display: "flex", justifyContent: "center" }}
                >
                  {activity.icon}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {activity.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {activity.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 1 }} />

          <Button
            startIcon={<History />}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              "&:hover": { borderColor: theme.palette.primary.dark },
            }}
          >
            View All Activity 
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
