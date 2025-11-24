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
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState<"workOrder" | "customer">("workOrder");
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sync search bar state with URL parameters
  React.useEffect(() => {
    const q = searchParams.get("q");
    const f = searchParams.get("filter");
    if (q) setQuery(q);
    if (f === "workOrder" || f === "customer") setFilter(f);
  }, [searchParams]);

  const handleSearch = () => {
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("q", query);
      params.set("filter", filter);
      router.push(`/workorder?${params.toString()}`);
    } else {
      // If query is empty, maybe just go to workorder page without params?
      router.push("/workorder");
    }
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
          {pathname !== "/dashboard" && pathname !== "/" && (
            <SearchBar
              filter={filter}
              setFilter={setFilter}
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
            />
          )}

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
