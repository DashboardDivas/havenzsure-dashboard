import { http } from "../http";
import type { Shop, ShopStatus} from "@/types/shop";


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

const SHOP_PREFIX = '/shop';

export const ShopsAPI = {
    list: (params?: ShopListParams) =>
    http<{ items: Shop[]; total: number; page: number; pageSize: number }>(
      `${SHOP_PREFIX}${qs(params)}`
    ),

  read: (id: number | string) =>
    http<Shop>(`${SHOP_PREFIX}/${id}`),

  create: (payload: Partial<Shop>) =>
    http<Shop>(SHOP_PREFIX, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number | string, payload: Partial<Shop>) =>
    http<Shop>(`${SHOP_PREFIX}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

};
