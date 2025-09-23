"use client";
import { WorkOrderTab } from "@/components/ui/Tabs";

export default function WorkOrderTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (t: string) => void;
}) {
  return <WorkOrderTab activeTab={activeTab} onTabChange={onTabChange} />;
}
