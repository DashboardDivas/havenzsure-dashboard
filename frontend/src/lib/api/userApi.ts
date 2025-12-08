// User API client for HavenzSure Dashboard
// Handles all user-related API calls to Go backend

import { User, CreateUserInput, UpdateUserInput, ApiError, UpdateCurrentUserProfileInput, AuthUser, MeResponse } from "@/types/user";
import { getAuth} from "firebase/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
  if (typeof window === 'undefined') {
    return { 'Content-Type': 'application/json' };
  }

  const auth = getAuth();
  const user = auth.currentUser;  
  
  if (!user) {
    return { 'Content-Type': 'application/json' };
  }

  const token = await user.getIdToken(false);
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};


// Handle API errors
const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = "An error occurred";

  try {
    const errorData: ApiError = await response.json();
    errorMessage = errorData.error || errorMessage;
  } catch {
    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  }

  throw new Error(errorMessage);
};

// User API functions
export const userApi = {
  /**
   * List all users with pagination
   */
  list: async (limit = 50, offset = 0): Promise<User[]> => {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${API_BASE_URL}/users?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User> => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

   /**
   * Uses Firebase token to authenticate and fetch user data from backend
   */
  getCurrentUser: async (): Promise<MeResponse> => {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Create new user (passwordless flow)
   * Backend will:
   * 1. Create user in Firebase
   * 2. Save to database
   * 3. Send password setup email
   */
  create: async (userData: CreateUserInput): Promise<User> => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Update user information
   */
  update: async (id: string, userData: UpdateUserInput): Promise<User> => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Deactivate user account
   */
  deactivate: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/users/${id}/deactivate`, {
      method: "PUT",
      headers,
    });

    if (!response.ok) {
      await handleApiError(response);
    }
  },

  /**
   * Reactivate user account
   */
  reactivate: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/users/${id}/reactivate`, {
      method: "PUT",
      headers,
    });

    if (!response.ok) {
      await handleApiError(response);
    }
  },

  /**
   * Resend password setup link
   * Used when user didn't receive initial email or link expired
   */
  resendPasswordLink: async (id: string): Promise<{ message: string }> => {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${API_BASE_URL}/users/${id}/resend-password-link`,
      {
        method: "POST",
        headers,
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  /**
   * Update current user's own profile (phone, imageUrl)
   * -> PUT /me
   */
  updateCurrentUserProfile: async (userData: UpdateCurrentUserProfileInput): Promise<MeResponse> => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "PUT",
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },
};