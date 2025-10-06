// src/components/theme/ThemeMenuButton.tsx
"use client";

import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { ThemeMode } from "@/theme";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // light/dark toggle icon

export default function ThemeMenuButton() {
  const { mode, setMode } = useThemeContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleChange = (newMode: ThemeMode) => {
    setMode(newMode);
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-controls="theme-menu"
        aria-haspopup="true"
      >
        <Brightness4Icon />
      </IconButton>
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          selected={mode === "light"}
          onClick={() => handleChange("light")}
        >
          Light Theme
        </MenuItem>
        <MenuItem
          selected={mode === "dark"}
          onClick={() => handleChange("dark")}
        >
          Dark Theme
        </MenuItem>
        <MenuItem
          selected={mode === "corporate"}
          onClick={() => handleChange("corporate")}
        >
          Corporate Blue
        </MenuItem>
        <MenuItem
          selected={mode === "darkVibrant"}
          onClick={() => handleChange("darkVibrant")}
        >
          Dark Vibrant
        </MenuItem>
        <MenuItem
          selected={mode === "minimalGray"}
          onClick={() => handleChange("minimalGray")}
        >
          Minimal Gray
        </MenuItem>
        <MenuItem
          selected={mode === "darkSleek"}
          onClick={() => handleChange("darkSleek")}
        >
          Dark Sleek
        </MenuItem>
      </Menu>
    </>
  );
}
