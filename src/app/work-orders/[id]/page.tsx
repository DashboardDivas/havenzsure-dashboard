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

const REGISTRY: Record<string, React.ComponentType<{ id: string }>> = {
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
      <WorkOrderTabs activeTab={tab} onTabChange={onTabChange} />
      <Section id={id} />
    </WorkOrderProvider>
  );
}
