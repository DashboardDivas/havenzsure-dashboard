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
import { useAuth } from "@/context/AuthContext"; 
import { alpha } from "@mui/material/styles";


function getInitials(first?: string, last?: string, email?: string) {
  const a = (first ?? "").trim();
  const b = (last ?? "").trim();
  if (a || b) return `${a.charAt(0)}${b.charAt(0)}`.toUpperCase();

  const e = (email ?? "").trim();
  return e ? e.charAt(0).toUpperCase() : "?";
}

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { profile } = useAuth(); 

  const [filter, setFilter] = useState<"workOrder" | "customer">("workOrder");
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
      router.push("/workorder");
    }
  };

  const initials = getInitials(profile?.firstName, profile?.lastName, profile?.email);
  const avatarSrc = profile?.imageUrl?.trim() ? profile.imageUrl : undefined;
  const displayName =
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() || "User";

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

          {pathname !== "/dashboard" && pathname !== "/" && (
            <SearchBar
              filter={filter}
              setFilter={setFilter}
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
            />
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ThemeMenuButton />

            <IconButton onClick={() => setNotificationsOpen(true)}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <NotificationPanel
              open={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />

            <IconButton onClick={() => setProfileOpen(true)}>
              <Avatar
                alt={displayName}
                src={avatarSrc}
                sx={{
                  width: 36,
                  height: 36,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.paper,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <UserProfile open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
