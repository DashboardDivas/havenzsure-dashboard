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
