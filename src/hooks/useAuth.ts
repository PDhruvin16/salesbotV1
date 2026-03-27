import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useUserDetails } from '../redux/helper';
import { setAuthData, clearAuthData } from '../redux/slices/authSlice';
import { AuthClient } from '../lib/client';
import { API_ENDPOINTS } from '../lib/endpoints';
import { LoginRequest, LoginResponse } from '../types/auth';

/**
 * Hook to manage authentication logic using React Query for mutations
 * and Redux for global persistent state management.
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useUserDetails();

  const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials: LoginRequest) => {
      console.log('🚀 Attempting Login for:', credentials.email);
      const response = await AuthClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
      );
      return response.data;
    },
    onSuccess: (response: LoginResponse) => {
      if (response.status && response.data) {
        dispatch(setAuthData(response.data));
        console.log('✅ Login Successful');
      }
    },
    onError: (error: any) => {
      console.error('❌ Login Failed:', error.message);
    },
  });

  const logout = () => {
    dispatch(clearAuthData());
  };

  return {
    ...authState,
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
  const { access, is_onboarded } = useUserDetails();
  return {
    isAuthenticated: !!access,
    isOnboarded: !!is_onboarded,
  };
};



// import { useMutation } from '@tanstack/react-query';
// import { useAppDispatch, useUserDetails } from '../redux/helper';
// import { setAuthData, clearAuthData } from '../redux/slices/authSlice';
// import { setPermissions } from '../redux/slices/permissionSlice';
// import authApi, {
//   LoginRequest,
//   LoginResponse,
// } from '../lib/authApi';

// /**
//  * Hook to manage authentication logic
//  */
// export const useAuth = () => {
//   const dispatch = useAppDispatch();
//   const authState = useUserDetails();

//   // ==========================
//   // 🔐 LOGIN
//   // ==========================
//   const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
//     mutationFn: (credentials) => {
//       console.log('🚀 Attempting Login:', credentials.email);
//       return authApi.login(credentials);
//     },
//     onSuccess: (response) => {
//       if (response.status && response.data) {
//         dispatch(setAuthData(response.data));

//         if (response.data.permissions) {
//           dispatch(setPermissions(response.data.permissions));
//         }

//         console.log('✅ Login Successful');
//       }
//     },
//     onError: (error: any) => {
//       console.log('❌ Login Failed:', error.message);
//     },
//   });

//   // ==========================
//   // 📩 FORGOT PASSWORD
//   // ==========================
//   const forgotPasswordMutation = useMutation({
//     mutationFn: (email: string) => {
//       console.log('📩 Sending Forgot Password OTP:', email);
//       return authApi.forgotPassword({ email });
//     },
//     onSuccess: () => {
//       console.log('✅ OTP sent successfully');
//     },
//     onError: (error: any) => {
//       console.log('❌ Forgot Password Failed:', error.message);
//     },
//   });

//   // ==========================
//   // 🔁 RESET PASSWORD
//   // ==========================
//   const resetPasswordMutation = useMutation({
//     mutationFn: (payload: {
//       email: string;
//       otp: string;
//       password: string;
//     }) => {
//       console.log('🔁 Resetting Password for:', payload.email);
//       return authApi.resetPassword(payload);
//     },
//     onSuccess: () => {
//       console.log('✅ Password reset successful');
//     },
//     onError: (error: any) => {
//       console.log('❌ Reset Password Failed:', error.message);
//     },
//   });

//   // ==========================
//   // 🚪 LOGOUT
//   // ==========================
//   const logout = () => {
//     dispatch(clearAuthData());
//   };

//   return {
//     ...authState,

//     // 🔐 Login
//     login: loginMutation.mutate,
//     loginAsync: loginMutation.mutateAsync,
//     isLoginLoading: loginMutation.isPending,

//     // 📩 Forgot Password
//     forgotPassword: forgotPasswordMutation.mutate,
//     forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
//     isForgotLoading: forgotPasswordMutation.isPending,

//     // 🔁 Reset Password
//     resetPassword: resetPasswordMutation.mutate,
//     resetPasswordAsync: resetPasswordMutation.mutateAsync,
//     isResetLoading: resetPasswordMutation.isPending,

//     // 🚪 Logout
//     logout,

//     // ❌ Errors
//     error:
//       loginMutation.error?.message ||
//       forgotPasswordMutation.error?.message ||
//       resetPasswordMutation.error?.message ||
//       authState.error,

//     // ✅ Success flags
//     isLoginSuccess: loginMutation.isSuccess,
//     isForgotSuccess: forgotPasswordMutation.isSuccess,
//     isResetSuccess: resetPasswordMutation.isSuccess,
//   };
// };

// /**
//  * Auth status helper
//  */
// export const useAuthStatus = () => {
//   const { access, is_onboarded } = useUserDetails();

//   return {
//     isAuthenticated: !!access,
//     isOnboarded: !!is_onboarded,
//   };
// };