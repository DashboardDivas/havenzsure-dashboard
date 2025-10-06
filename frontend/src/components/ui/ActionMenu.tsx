"use client";

import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import { useThemeContext } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

type EntityType = "user" | "shop" | "workorder" | "job";

type ActionMenuProps = {
  id: string | number;
  type: EntityType;
  onArchive?: (id: string | number, type: EntityType) => void;
};

export default function ActionMenu({ id, type, onArchive }: ActionMenuProps) {
  const { mode } = useThemeContext();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: "view" | "edit" | "archive") => {
    handleMenuClose();

    // ✅ Navigate or perform logic based on entity type
    switch (action) {
      case "view":
        if (type === "workorder") router.push(`/workorder/${id}`);
        else router.push(`/${type}s/${id}`);
        break;

      case "edit":
        // Navigate to same detail page — edit dialog will handle the rest
        if (type === "workorder") router.push(`/workorder/${id}`);
        else router.push(`/${type}s/${id}`);
        // The edit modal will open within that page
        break;

      case "archive":
        if (onArchive) onArchive(id, type);
        break;
    }
  };

  const dropdownOptions = [
    {
      label: "View",
      value: "view",
      icon: <VisibilityIcon fontSize="small" />,
      color: mode === "light" ? "#4CAF50" : "#81C784", // green
    },
    {
      label: "Edit",
      value: "edit",
      icon: <EditIcon fontSize="small" />,
      color: mode === "light" ? "#FF9800" : "#FFB74D", // orange
    },
    {
      label: "Archive",
      value: "archive",
      icon: <ArchiveIcon fontSize="small" />,
      color: mode === "light" ? "#F44336" : "#E57373", // red
    },
  ];

  return (
    <>
      <IconButton size="small" onClick={handleMenuOpen}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {dropdownOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() =>
              handleAction(option.value as "view" | "edit" | "archive")
            }
            sx={{
              color: option.color,
              "&:hover": {
                backgroundColor: option.color + "30",
              },
              display: "flex",
              gap: 1,
            }}
          >
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
