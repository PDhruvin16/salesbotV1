// ─── Request Types ───────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

// ─── Shared Models ───────────────────────────────────────────
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

export interface Subscription {
  id: string;
  start_date: string;
  end_date: string;
  status: "active" | "expired";
}

export interface Tenant {
  id: string;
  business_name: string;
  business_type: string;
  tenant_timezone: string;
}

export interface AuthUser {
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  location?: string;
}

// ─── Response Types ───────────────────────────────────────────
export interface LoginResponseData {
  is_onboarded: boolean;
  access: string;
  refresh: string;
  tenant: Tenant;
  user: AuthUser;
  subscription: Subscription;
  order_id: string | null;
  plan_id: string | null;
  payment_status: string | null;
  permissions: ModulePermission[];
}

export interface LoginResponse {
  status: boolean;
  error: number;
  data: LoginResponseData;
  message: string;
}

// ─── Redux State ──────────────────────────────────────────────
export interface AuthState {
  access: string;
  refresh: string;
  onboarding_token?: string | null;
  subscription?: Subscription | null;
  is_onboarded: boolean | null;
  tenant: Tenant | null;
  user: AuthUser | null;
  order_id: string | null;
  plan_id: string | null;
  payment_status: string | null;
  quick_setup_completed?: boolean;
  permissions?: ModulePermission[];
}
