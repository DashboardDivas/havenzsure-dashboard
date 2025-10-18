// src/api/shopApi.ts
import axios from "axios";

export interface Shop {
  id: number;
  code: string;
  shopName: string;
  status: "active" | "inactive";
  address: string;
  city: string;
  province: string;
  postalCode: string;
  contactName: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const shopApi = {
  // List all shops
  async getShops(limit = 50, offset = 0): Promise<Shop[]> {
    const res = await axios.get(`${API_BASE_URL}/shops`, {
      params: { limit, offset },
    });
    return res.data;
  },

  // Get single shop by code
  async getShopByCode(code: string): Promise<Shop> {
    const res = await axios.get(`${API_BASE_URL}/shops/${code}`);
    return res.data;
  },

  //  Create a new shop
  async createShop(shop: Omit<Shop, "id" | "createdAt" | "updatedAt">): Promise<Shop> {
    const res = await axios.post(`${API_BASE_URL}/shops`, shop);
    return res.data;
  },

  // Update a shop
  async updateShop(code: string, shop: Partial<Shop>): Promise<Shop> {
    const res = await axios.put(`${API_BASE_URL}/shops/${code}`, shop);
    return res.data;
  },
};
