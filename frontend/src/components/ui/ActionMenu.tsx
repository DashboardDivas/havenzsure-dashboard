import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import { useThemeContext } from "@/context/ThemeContext"; // Import the context

type ActionMenuProps = {
  onView?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
};

export default function ActionMenu({ onView, onEdit, onArchive }: ActionMenuProps) {
  const { mode } = useThemeContext(); // Get the theme mode from context
  const [selectedAction, setSelectedAction] = useState<string | number>(""); // Track selected action
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for menu anchor
  const [isActionSelected, setIsActionSelected] = useState(false); // Track if an action is selected

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Set the anchor element for the menu
    setIsActionSelected(false); // Reset selection when the menu is opened
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
    setIsActionSelected(false); // Reset selection when menu closes
  };

  const handleActionSelect = (value: string | number) => {
    setSelectedAction(value); // Set the selected action
    setIsActionSelected(true); // Mark that an action was selected
  };

  const handleActionConfirm = () => {
    // Trigger the corresponding action when confirmed
    if (selectedAction === "view") onView?.();
    if (selectedAction === "edit") onEdit?.();
    if (selectedAction === "archive") onArchive?.();
    handleMenuClose(); // Close the menu after confirming the action
  };

  // Define the options for the dropdown with custom colors based on the theme
  const dropdownOptions = [
    { label: "View", value: "view", icon: <VisibilityIcon fontSize="small" />, color: mode === "light" ? "#4CAF50" : "#81C784" }, // Green for view
    { label: "Edit", value: "edit", icon: <EditIcon fontSize="small" />, color: mode === "light" ? "#FF9800" : "#FFB74D" }, // Orange for edit
    { label: "Archive", value: "archive", icon: <ArchiveIcon fontSize="small" />, color: mode === "light" ? "#F44336" : "#E57373" }, // Red for archive
  ];

  return (
    <>
      {/* Clicking the three dots will open the menu */}
      <IconButton size="small" onClick={handleMenuOpen}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      {/* Menu component with dropdown options */}
      <Menu
        anchorEl={anchorEl} // Specify the anchor element
        open={Boolean(anchorEl)} // Open when anchorEl is set
        onClose={handleMenuClose} // Close when clicking outside or making a selection
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
            onClick={() => handleActionSelect(option.value)} // Store the selected option
            sx={{
              color: option.color, // Apply the color based on action type
              '&:hover': {
                backgroundColor: option.color + '30', // Lighter hover effect
              },
            }}
          >
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Show the "Confirm Action" button only after an action is selected */}
      {isActionSelected && (
        <Button onClick={handleActionConfirm} color="primary">
          Confirm Action: {dropdownOptions.find(opt => opt.value === selectedAction)?.label}
        </Button>
      )}
    </>
  );
}
