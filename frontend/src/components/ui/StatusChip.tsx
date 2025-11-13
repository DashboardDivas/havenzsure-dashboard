"use client";

import React from "react";
import { Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Separate types
type UserStatus = "active" | "inactive";
type WorkOrderStatus =
  | "waiting_for_inspection"
  | "in_progress"
  | "follow_up_needed"
  | "completed";
type JobStatus =
  | "pending"
  | "assigned"
  | "on_hold"
  | "cancelled"
  | "in_progress"
  | "approved"
  | "rejected"
  | "archived";

export type StatusType = UserStatus | WorkOrderStatus | JobStatus;

export default function StatusChip({ status }: { status: StatusType }) {
  const theme = useTheme();

  const getChipProps = () => {
    switch (status.toLowerCase()) {
      // 🔹 User statuses
      case "active":
        return { label: "Active", color: theme.palette.success.main };
      case "inactive":
        return { label: "Inactive", color: theme.palette.error.main };

      // 🔹 Work order statuses
      case "waiting_for_inspection":
        return {
          label: "Waiting for Inspection",
          color: theme.palette.warning.light,
        };
      case "in_progress":
        return { label: "In Progress", color: theme.palette.primary.main };
      case "follow_up_needed":
        return {
          label: "Follow Up Needed",
          color: theme.palette.error.light,
        };
      case "completed":
        return { label: "Completed", color: theme.palette.info.main };

      // 🔹 Job statuses
      case "pending":
        return { label: "Pending", color: theme.palette.warning.main };
      case "assigned":
        return { label: "Assigned", color: theme.palette.info.main };
      case "on_hold":
        return { label: "On Hold", color: theme.palette.secondary.main };
      case "cancelled":
        return { label: "Cancelled", color: theme.palette.error.main };
      case "in_progress":
        return { label: "In Progress", color: theme.palette.primary.light };
      case "approved":
        return { label: "Approved", color: theme.palette.success.main };
      case "rejected":
        return { label: "Rejected", color: theme.palette.error.light };
      case "archived":
        return { label: "Archived", color: theme.palette.grey[500] };

      default:
        return { label: status, color: theme.palette.grey[500] };
    }
  };

  const { label, color } = getChipProps();

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        fontWeight: 500,
        borderRadius: 1,
        px: 1,
        bgcolor: color,
        color: theme.palette.getContrastText(color),
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: `0 0 6px ${color}`,
          cursor: "pointer",
        },
      }}
    />
  );
}
