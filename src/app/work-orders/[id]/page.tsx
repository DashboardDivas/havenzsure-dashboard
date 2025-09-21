"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { WorkOrderProvider } from "./_ctx";
import WorkOrderTabs from "./WorkOrderTabs";
import OverviewTab from "./tabs/OverviewTab";
import AIScanTab from "./tabs/AIScanTab";
import QuoteTab from "./tabs/QuoteTab";
import ClaimTab from "./tabs/ClaimTab";
import PaymentTab from "./tabs/PaymentTab";
import LogTab from "./tabs/LogTab";
import * as React from "react";
import { Typography } from "@mui/material";

import { fetchWorkOrders } from "@/lib/fakeApi"; // ✅ using mock data
import { WorkOrder } from "@/types/workOrder";

const REGISTRY: Record<string, React.ComponentType<{ workOrder: WorkOrder }>> = {
  overview: OverviewTab,
  aiscan: AIScanTab,
  quote: QuoteTab,
  claim: ClaimTab,
  payment: PaymentTab,
  log: LogTab,
};

export default function WorkOrderDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const sp = useSearchParams();
  const router = useRouter();

  const tab = sp.get("tab") ?? "overview";
  const Section = REGISTRY[tab] ?? OverviewTab;

  // ✅ Fetch the work order by ID from mock API
  const workOrders = fetchWorkOrders();
  const workOrder = workOrders.find((wo) => wo.WorkOrderID === id);

  if (!workOrder) {
    return <div>Work Order not found</div>;
  }

  const onTabChange = (next: string) => {
    const qp = new URLSearchParams(sp.toString());
    qp.set("tab", next);
    router.replace(`?${qp.toString()}`);
  };

  return (
    <WorkOrderProvider id={id}>
      <Typography variant="h5" gutterBottom>
        Work Order #{id}
      </Typography>

      {/* ✅ pass workOrder here */}
      <WorkOrderTabs
        workOrder={workOrder}
        activeTab={tab}
        onTabChange={onTabChange}
      />

      {/* ✅ Section also needs workOrder */}
      
    </WorkOrderProvider>
  );
}
