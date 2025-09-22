"use client";
import { WorkOrder } from "@/types/workOrder";
import OverviewTab from "./tabs/OverviewTab";
import ClaimTab from "./tabs/ClaimTab";
import QuoteTab from "./tabs/QuoteTab";
import * as React from "react";

export default function WorkOrderTabs({
  workOrder,
  activeTab,
  onTabChange,
}: {
  workOrder: WorkOrder;
  activeTab: string;
  onTabChange: (next: string) => void;
}) {
  return (
    <div>
      {/* Tab Headers */}
      <div className="flex gap-4 border-b pb-2">
        {["overview", "media", "claims", "estimate", "activity"].map((tab) => (
          <button
            key={tab}
            className={`capitalize ${
              activeTab === tab
                ? "font-bold border-b-2 border-blue-500"
                : ""
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "overview" && <OverviewTab workOrder={workOrder} />}
        {activeTab === "claims" && <ClaimTab />}     {/* no props for now */}
        {activeTab === "estimate" && <QuoteTab />}   {/* no props for now */}
        {activeTab === "media" && <div>Media & AI Scan content...</div>}
        {activeTab === "activity" && <div>Activity Log content...</div>}
      </div>
    </div>
  );
}
