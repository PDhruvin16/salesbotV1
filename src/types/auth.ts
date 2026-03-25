import { Tenant, User, Subscription } from '../lib/authApi';

export interface AuthState {
  is_onboarded: boolean | null;
  access: string;
  onboarding_token: string | null;
  refresh: string;
  tenant: Tenant | null;
  user: User | null;
  subscription: Subscription | null;
  order_id: string | null;
  plan_id: string | null;
  payment_status: string | null;
  quick_setup_completed: boolean;
}
