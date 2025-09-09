"use client"
import { cn } from "@/lib/utils"

interface TabItem {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  items: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function Tabs({ items, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("border-b border-gray-200", className)}>
      <nav className="flex space-x-8" aria-label="Tabs">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
              activeTab === item.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  "ml-2 py-0.5 px-2 rounded-full text-xs",
                  activeTab === item.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-900",
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}

// Status Tab Component
interface StatusTabProps {
  activeStatus: string
  onStatusChange: (status: string) => void
  statusCounts?: Record<string, number>
}

export function StatusTab({ activeStatus, onStatusChange, statusCounts }: StatusTabProps) {
  const statusItems: TabItem[] = [
    { id: "all", label: "All Status", count: statusCounts?.all },
    { id: "waiting", label: "Waiting for Inspection", count: statusCounts?.waiting },
    { id: "progress", label: "In Progress", count: statusCounts?.progress },
    { id: "followup", label: "Follow Up Required", count: statusCounts?.followup },
    { id: "completed", label: "Completed", count: statusCounts?.completed },
  ]

  return <Tabs items={statusItems} activeTab={activeStatus} onTabChange={onStatusChange} className="mb-4" />
}

// Work Order Tab Component
interface WorkOrderTabProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function WorkOrderTab({ activeTab, onTabChange }: WorkOrderTabProps) {
  const workOrderItems: TabItem[] = [
    { id: "overview", label: "OverView" },
    { id: "aiscan", label: "AI Scan" },
    { id: "quote", label: "Quote" },
    { id: "claim", label: "Claim" },
    { id: "payment", label: "Payment & Dispatch" },
    { id: "log", label: "Log" },
  ]

  return <Tabs items={workOrderItems} activeTab={activeTab} onTabChange={onTabChange} className="mb-6" />
}
