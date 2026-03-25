import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types/auth";

const initialState: AuthState = {
  is_onboarded: null,
  access: '',
  onboarding_token: null,
  refresh: '',
  tenant: null,
  user: null,
  subscription: null,
  order_id: null,
  plan_id: null,
  payment_status: null,
  quick_setup_completed: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload };
    },
    clearAuthData: () => {
      return { ...initialState };
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export default authSlice.reducer;
