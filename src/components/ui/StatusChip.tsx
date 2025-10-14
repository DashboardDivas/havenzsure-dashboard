"use client";

import { WorkOrderStatus } from "@/types/workOrder";
import { ShopStatus } from "@/types/shop";
import { useTheme } from "@mui/material/styles";

interface StatusChipProps {
  status: WorkOrderStatus | ShopStatus;
}

export default function StatusChip({ status }: StatusChipProps) {
  const theme = useTheme();

  const getStyles = (status: WorkOrderStatus | ShopStatus) => {
    switch (status) {
      // ---- work order status ----
      case WorkOrderStatus.WaitingForInspection:
        return {
          backgroundColor: theme.palette.divider,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
        };
      case WorkOrderStatus.InProgress:
        return {
          backgroundColor: theme.palette.primary.light,
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText ?? "#000",
        };
      case WorkOrderStatus.FollowUpRequired:
        return {
          backgroundColor: theme.palette.warning.light,
          borderColor: theme.palette.warning.main,
          color: theme.palette.warning.contrastText ?? "#000",
        };
      case WorkOrderStatus.Completed:
        return {
          backgroundColor: theme.palette.success.light,
          borderColor: theme.palette.success.main,
          color: theme.palette.success.contrastText ?? "#000",
        };
      case WorkOrderStatus.WaitingForInformation:
        return {
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.warning.main,
          color: theme.palette.text.secondary,
        };

      // ---- shop status ----
      case ShopStatus.Active:
        return {
          backgroundColor: theme.palette.success.main,
          borderColor: theme.palette.success.main,
          color: theme.palette.getContrastText(theme.palette.success.main),
        };
      case ShopStatus.Inactive:
        return {
          backgroundColor: theme.palette.grey[300] ?? theme.palette.divider,
          borderColor: theme.palette.divider,
          color: theme.palette.text.secondary,
        };

      // ---- default ----
      default:
        return {
          backgroundColor: theme.palette.background.paper,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
        };
    }
  };

  const styles = getStyles(status);

  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 8px",
        borderRadius: 4,
        border: `1px solid ${styles.borderColor}`,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontSize: 14,
        fontWeight: 500,
        maxHeight: 40,
      }}
    >
      {status}
    </span>
  );
}
