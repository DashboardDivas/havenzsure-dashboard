import type React from "react"
import { cn } from "@/lib/utils";

export type StatusType =
  | "waiting-for-inspection"
  | "in-progress"
  | "follow-up-required"
  | "completed"
  | "active"
  | "inactive"

interface StatusChipProps {
  status: StatusType
  children: React.ReactNode
  className?: string
}

const statusStyles: Record<StatusType, string> = {
  "waiting-for-inspection": "bg-gray-100 text-gray-800 border-gray-300",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
  "follow-up-required": "bg-red-100 text-red-800 border-red-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  active: "bg-green-100 text-green-800 border-green-300",
  inactive: "bg-gray-100 text-gray-800 border-gray-300",
}

export function StatusChip({ status, children, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        statusStyles[status],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default StatusChip
