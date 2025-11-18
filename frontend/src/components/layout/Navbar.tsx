"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ThemeMenuButton from "@/components/theme/ThemeMenuButton";
import SearchBar from "@/components/ui/SearchBar";
import UserProfile from "./UserProfile";
import NotificationPanel from "@/components/ui/NotificationPanel";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const theme = useTheme();
  const [filter, setFilter] = useState<"workOrder" | "customer">("workOrder");
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSearch = () => {
    console.log(
      `Searching for "${query}" by ${
        filter === "workOrder" ? "Work Order ID" : "Customer Name"
      }`
    );
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
          {/* Left: Menu + Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton edge="start" onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.primary.main }}
            >
              HavenzSure
            </Typography>
          </Box>

          {/* Center: SearchBar */}
          <SearchBar
            filter={filter}
            setFilter={setFilter}
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
          />

          {/* Right: Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ThemeMenuButton />

            {/* 🔔 Notifications */}
            <IconButton onClick={() => setNotificationsOpen(true)}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Notification Panel */}
            <NotificationPanel
              open={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />

            {/* Avatar → Profile */}
            <IconButton onClick={() => setProfileOpen(true)}>
              <Avatar
                alt="User Avatar"
                src="/admin.jpg"
                sx={{
                  width: 36,
                  height: 36,
                  border: `2px solid ${theme.palette.divider}`,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Drawer */}
      <UserProfile open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
