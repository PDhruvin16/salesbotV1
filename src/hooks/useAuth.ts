import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAuthState } from './useRedux';
import { setAuthData, clearAuthData } from '../redux/slices/authSlice';
import { setPermissions } from '../redux/slices/permissionSlice';
import authApi, { LoginRequest, LoginResponse } from '../lib/authApi';

/**
 * Hook to manage authentication logic using React Query for mutations
 * and Redux for global persistent state management.
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAuthState();

  const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => {
      console.log('🚀 Attempting Login for:', credentials.email);
      return authApi.login(credentials);
    },
    onSuccess: (response: LoginResponse) => {
      if (response.status && response.data) {
        // 1. Handle Auth Data (tokens, user, etc.)
        dispatch(setAuthData(response.data));
        
        // 2. Handle Permissions
        if (response.data.permissions) {
          dispatch(setPermissions(response.data.permissions));
        }
        console.log('✅ Login Successful');
      }
    },
    onError: (error: any) => {
      console.error('❌ Login Failed:', error.message);
    }
  });

  const logout = () => {
    dispatch(clearAuthData());
  };

  return {
    ...authState, // Spread current auth state (is_onboarded, user, etc.)
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error ? (loginMutation.error as any).message : authState.error,
    isSuccess: loginMutation.isSuccess,
  };
};

/**
 * Hook to retrieve auth status safely
 */
export const useAuthStatus = () => {
  const { access, is_onboarded } = useAuthState();
  return {
    isAuthenticated: !!access,
    isOnboarded: !!is_onboarded,
  };
};
