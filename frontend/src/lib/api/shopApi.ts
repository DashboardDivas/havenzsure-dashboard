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

export interface ApiResponse<T> {
  data?: T;
  error?: {
    type: "INVALID_INPUT" | "CONFLICT" | "NOT_FOUND" | "SERVER_ERROR";
    message: string;
    statusCode: number;
  };
  success: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper function to map HTTP status codes to error types
const mapErrorType = (
  statusCode: number
): "INVALID_INPUT" | "CONFLICT" | "NOT_FOUND" | "SERVER_ERROR" => {
  switch (statusCode) {
    case 400:
      return "INVALID_INPUT";
    case 409:
      return "CONFLICT";
    case 404:
      return "NOT_FOUND";
    default:
      return "SERVER_ERROR";
  }
};

// Helper function to get user-friendly error messages
const getErrorMessage = (
  type: string,
  statusCode: number,
  defaultMessage: string
): string => {
  switch (type) {
    case "INVALID_INPUT":
      return "Invalid input data. Please check your entries and try again.";
    case "CONFLICT":
      return "A shop with this code already exists. Please use a different shop code.";
    case "NOT_FOUND":
      return "Shop not found. It may have been deleted or the code is incorrect.";
    case "SERVER_ERROR":
    default:
      return "An unexpected error occurred. Please try again later.";
  }
};

export const shopApi = {
  // List all shops
  async getShops(limit = 50, offset = 0): Promise<ApiResponse<Shop[]>> {
    try {
      const res = await axios.get(`${API_BASE_URL}/shops`, {
        params: { limit, offset },
      });
      return {
        data: res.data,
        success: true,
      };
    } catch (error: any) {
      const statusCode = error.response?.status || 500;
      const errorType = mapErrorType(statusCode);
      return {
        error: {
          type: errorType,
          message: getErrorMessage(errorType, statusCode, error.message),
          statusCode,
        },
        success: false,
      };
    }
  },

  // Get single shop by code
  async getShopByCode(code: string): Promise<ApiResponse<Shop>> {
    try {
      const res = await axios.get(`${API_BASE_URL}/shops/${code}`);
      return {
        data: res.data,
        success: true,
      };
    } catch (error: any) {
      const statusCode = error.response?.status || 500;
      const errorType = mapErrorType(statusCode);
      return {
        error: {
          type: errorType,
          message: getErrorMessage(errorType, statusCode, error.message),
          statusCode,
        },
        success: false,
      };
    }
  },

  //  Create a new shop
  async createShop(
    shop: Omit<Shop, "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Shop>> {
    try {
      const res = await axios.post(`${API_BASE_URL}/shops`, shop);
      return {
        data: res.data,
        success: true,
      };
    } catch (error: any) {
      const statusCode = error.response?.status || 500;
      const errorType = mapErrorType(statusCode);
      return {
        error: {
          type: errorType,
          message: getErrorMessage(errorType, statusCode, error.message),
          statusCode,
        },
        success: false,
      };
    }
  },

  // Update a shop
  async updateShop(
    code: string,
    shop: Partial<Shop>
  ): Promise<ApiResponse<Shop>> {
    try {
      const res = await axios.put(`${API_BASE_URL}/shops/${code}`, shop);
      return {
        data: res.data,
        success: true,
      };
    } catch (error: any) {
      const statusCode = error.response?.status || 500;
      const errorType = mapErrorType(statusCode);
      return {
        error: {
          type: errorType,
          message: getErrorMessage(errorType, statusCode, error.message),
          statusCode,
        },
        success: false,
      };
    }
  },
};
