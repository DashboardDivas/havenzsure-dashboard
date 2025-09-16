//This file is created by ChatGPT as a context provider for work orders.
//Remember to replace the fetch stuff and data structure with actual API and data structure.
//Prompt: If creating a context provider is the only way to avoid props drilling in here, do it.

/**
 * Work Order Context (_ctx.tsx)
 *
 * 📌 Purpose:
 *   Provides a React Context for the Work Order Detail page.
 *   Fetches a single work order by ID and makes it available to
 *   all child components without props drilling.
 *
 * 🔑 Exports:
 *   1. WorkOrderProvider
 *      - Usage: <WorkOrderProvider id={id}>{children}</WorkOrderProvider>
 *      - Fetches data from `/api/work-orders/${id}`
 *      - Provides context value: { wo, loading }
 *
 *   2. useWorkOrder
 *      - Usage: const { wo, loading } = useWorkOrder()
 *      - Returns current work order data and loading state
 *
 * 📂 Typical Usage:
 *   In page.tsx:
 *     <WorkOrderProvider id={id}>
 *       <WorkOrderTabs activeTab={tab} onTabChange={onTabChange} />
 *       <Section id={id} />
 *     </WorkOrderProvider>
 *
 *   In a tab component:
 *     const { wo, loading } = useWorkOrder();
 *     if (loading) return <div>Loading...</div>;
 *     return <div>Customer: {wo.customerName}</div>;
 *
 * ✅ Benefits:
 *   - Avoids props drilling across tabs/components
 *   - Centralized fetch logic for work order data
 *   - Easy for new tabs (Quote, Claim, etc.) to consume shared data
 */


"use client";
import { createContext, useContext, useEffect, useState } from "react";
const Ctx = createContext<{wo: any; loading: boolean}>({ wo: null, loading: true });

export function WorkOrderProvider({ id, children }: { id: string; children: React.ReactNode }) {
  const [wo, setWo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const data = await fetch(`/api/work-orders/${id}`).then(r => r.json());
      setWo(data);
      setLoading(false);
    })();
  }, [id]);
  return <Ctx.Provider value={{ wo, loading }}>{children}</Ctx.Provider>;
}
export const useWorkOrder = () => useContext(Ctx);
