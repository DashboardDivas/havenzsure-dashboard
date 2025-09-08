"use client";

import { WorkOrderStatus } from "@/types/workOrder";

interface StatusChipProps {
  status: WorkOrderStatus;
}

export default function StatusChip({ status }: StatusChipProps) {
  const getStyles = (status: WorkOrderStatus) => {
    switch (status) {
      case WorkOrderStatus.WaitingForInspection:
        return { backgroundColor: "#f0f0f0", borderColor: "#000", color: "#000" };
      case WorkOrderStatus.InProgress:
        return { backgroundColor: "#e0f0ff", borderColor: "#000", color: "#000" };
      case WorkOrderStatus.FollowUpRequired:
        return { backgroundColor: "#ffe0e0", borderColor: "#000", color: "#000" };
      case WorkOrderStatus.Completed:
        return { backgroundColor: "#e0ffe0", borderColor: "#000", color: "#000" };
      case WorkOrderStatus.WaitingForInformation:
        return { backgroundColor: "#fff7e0", borderColor: "#000", color: "#000" };
      default:
        return { backgroundColor: "#fff", borderColor: "#000", color: "#000" };
    }
  };

  const styles = getStyles(status);

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: 4,
        border: `1px solid ${styles.borderColor}`,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {status}
    </span>
  );
}
