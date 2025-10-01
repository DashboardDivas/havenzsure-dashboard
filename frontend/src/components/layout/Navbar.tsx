// src/components/layout/Navbar.tsx
"use client";

import React from "react";
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

export default function Navbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const theme = useTheme();
  const [filter, setFilter] = React.useState<"workOrder" | "customer">(
    "workOrder"
  );
  const [query, setQuery] = React.useState("");

  const handleSearch = () => {
    console.log(
      `Searching for "${query}" by ${
        filter === "workOrder" ? "Work Order ID" : "Customer Name"
      }`
    );
  };

  return (
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
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Avatar alt="User Avatar" src="https://i.pravatar.cc/40" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
