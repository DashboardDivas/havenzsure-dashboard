// src/lib/api/shop.ts
import { http } from "../http";
import type { Shop, ShopStatus, ShopCreate, ShopUpdate} from "@/types/shop";


export type ShopListParams = {
  status?: ShopStatus; 
  q?: string;          
  page?: number;
  pageSize?: number;
};

function qs(params?: Record<string, any>) {
  if (!params) return "";
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const ShopsAPI = {
  list: (params?: ShopListParams) =>
    http<Shop[]>(`/api/shops${qs(params)}`),

  read: (id: number) =>
    http<Shop>(`/api/shops/${id}`),

  create: (data: ShopCreate) =>
    http<Shop>(`/api/shops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  update: (id: number, patch: ShopUpdate) =>
    http<Shop>(`/api/shops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }),
};
