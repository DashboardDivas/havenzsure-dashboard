// Source note:
// This file was partially refactored with assistance from AI (ChatGPT).
// Edited and reviewed by AN-NI HUANG
// Date: 2025-11-23

export interface Role {
  code: string;
  name: string;
}

export interface Shop {
  code: string;
  name: string;
}

// Main User interface
export interface User {
  id: string;
  code: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  imageUrl?: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: Role;
  shop?: Shop;
}

// Input types for API requests
export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  imageUrl?: string;
  roleCode: string;
  shopCode?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  imageUrl?: string;
  roleCode?: string;
  shopCode?: string;
}

export interface UpdateCurrentUserProfileInput {
  phone?: string;
  imageUrl?: string;
}

// Interface for "me" API response
export interface MeResponse {
  id: string;
  code: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  imageUrl?: string;
  roleCode: string;
  roleName: string;
  shopId?: string;
  shopCode?: string;
  shopName?: string;
  createdAt: string;
}

// For authentication context
export type AuthUser = Pick<MeResponse, "id" | "email" | "roleCode" | "shopId">;

// For Profile page
export type UserProfile = MeResponse;

// API response types
export interface UserListResponse {
  users: User[];
  total?: number;
}

export interface ApiError {
  error: string;
}
