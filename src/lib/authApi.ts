import { AuthClient, ApiClient } from './client'; // ApiClient is the one with interceptors in interceptor.ts
import { API_ENDPOINTS } from './endpoints';
import { AxiosRequestConfig } from 'axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Permission {
  id: number | null;
  name: string;
  is_select: boolean;
  is_disable: boolean;
}

export interface ModulePermission {
  module_name: string;
  permissions: Permission[];
}

export interface Tenant {
  id: string;
  business_name: string;
  business_type: string;
  tenant_timezone: string;
}

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  is_admin?: boolean;
  location?: string;
}

export interface Subscription {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface LoginResponseData {
  is_onboarded: boolean;
  access: string;
  refresh: string;
  tenant: Tenant;
  user: User;
  subscription: Subscription;
  order_id: string | null;
  plan_id: string | null;
  payment_status: string | null;
  permissions: ModulePermission[];
}

export type UserPermission = ModulePermission;

export interface LoginResponse {
  status: boolean;
  error: number;
  data: LoginResponseData;
  message: string;
}

export interface RefreshTokenResponse {
  status: boolean;
  error: number;
  data: {
    access: string;
    refresh: string;
  };
  message: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export const authApi = {
  // Login user - using AuthClient (no interceptor for auth)
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await AuthClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data as LoginResponse;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await AuthClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refresh: refreshToken });
    return response.data as RefreshTokenResponse;
  },

  changePassword: async (
    payload: ChangePasswordPayload,
    token?: string,
  ): Promise<{
    status: boolean;
    error?: number;
    data?: { access_token?: string; refresh_token?: string };
    message?: string;
  }> => {
    const config: AxiosRequestConfig = {};
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` } as Record<string, string>;
    }
    const response = await ApiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload, config);
    return response.data;
  },
};

export default authApi;
