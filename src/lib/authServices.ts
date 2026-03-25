import authApi, { LoginResponse, LoginResponseData, User, UserPermission } from './authApi';
import log from '../utils/Logger';
import storage from '../utils/Storage';

type ForcePasswordChangeResponse = {
  forcePasswordChange: true;
  accessToken?: string;
  message?: string;
};

const buildForcePasswordChangeResponse = (
  maybeData: Record<string, unknown>,
  response: Record<string, unknown>,
): ForcePasswordChangeResponse => {
  return {
    forcePasswordChange: true,
    accessToken: (maybeData.access_token || maybeData.access) as string | undefined,
    message: (response?.message as string | undefined) || 'Password change required',
  };
};

export const AUTH_TOKEN_KEY = 'authToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_DATA_KEY = 'userData';
export const USER_PERMISSIONS_KEY = 'userPermissions';

export const authService = {
  // Email/Password Login
  loginWithEmailPassword: async (email: string, password: string) => {
    try {
      const response: LoginResponse = await authApi.login({
        email,
        password,
      });

      // Check if the response indicates failure
      if (!response.status) {
        // Defensive check for force password change scenario
        const maybeData: Record<string, unknown> = (response.data || {}) as unknown as Record<
          string,
          unknown
        >;
        if (maybeData.force_password_change) {
          return buildForcePasswordChangeResponse(
            maybeData,
            response as unknown as Record<string, unknown>,
          );
        }

        throw new Error((response?.message as string) || 'Login failed');
      }

      if (!response.data) {
        throw new Error((response?.message as string) || 'Login failed');
      }

      const { access, refresh, user, permissions, tenant, subscription }: LoginResponseData =
        response.data;

      // Store auth data (with tenant and subscription info)
      await storage.setString(AUTH_TOKEN_KEY, access);
      await storage.setString(REFRESH_TOKEN_KEY, refresh);
      await storage.setString(USER_DATA_KEY, JSON.stringify(user));
      await storage.setString(USER_PERMISSIONS_KEY, JSON.stringify(permissions));
      // Also store tenant and subscription info for future use
      await storage.setString('tenantInfo', JSON.stringify(tenant));
      await storage.setString('subscriptionInfo', JSON.stringify(subscription));

      return {
        token: access,
        refreshToken: refresh,
        user,
        permissions,
      };
    } catch (error: unknown) {
      log.error('Error in email/password login:', error);

      // axios will reject HTTP 4xx/5xx responses. Some backends return
      // a 400 with a body containing { data: { force_password_change: true, access_token: '...' } }
      // Detect that shape and return the marker so the UI can redirect to reset password.
      const errorObj = error as unknown as Record<string, unknown>;
      const resp = (errorObj?.response as unknown as Record<string, unknown>)
        ?.data as unknown as Record<string, unknown>;
      if (resp && (resp.data as unknown as Record<string, unknown>)?.force_password_change) {
        return buildForcePasswordChangeResponse(
          resp.data as unknown as Record<string, unknown>,
          resp,
        );
      }

      throw error;
    }
  },

  // Store authentication data
  storeAuthData: async (
    token: string,
    refreshToken: string,
    user: User,
    permissions: UserPermission[],
  ) => {
    try {
      await storage.setString(AUTH_TOKEN_KEY, token);
      await storage.setString(REFRESH_TOKEN_KEY, refreshToken);
      await storage.setString(USER_DATA_KEY, JSON.stringify(user));
      await storage.setString(USER_PERMISSIONS_KEY, JSON.stringify(permissions));
      return true;
    } catch (error) {
      log.error('Error storing auth data:', error);
      return false;
    }
  },

  getAuthData: async () => {
    try {
      const token = await storage.getString(AUTH_TOKEN_KEY);
      const refreshToken = await storage.getString(REFRESH_TOKEN_KEY);
      const userData = await storage.getString(USER_DATA_KEY);
      const permissions = await storage.getString(USER_PERMISSIONS_KEY);

      if (token && userData) {
        return {
          token,
          refreshToken,
          user: JSON.parse(userData) as User,
          permissions: permissions ? (JSON.parse(permissions) as UserPermission[]) : [],
        };
      }
      return null;
    } catch (error) {
      log.error('Error getting auth data:', error);
      return null;
    }
  },

  // Clear authentication data (Logout)
  clearAuthData: async () => {
    try {
      await storage.remove(AUTH_TOKEN_KEY);
      await storage.remove(REFRESH_TOKEN_KEY);
      await storage.remove(USER_DATA_KEY);
      await storage.remove(USER_PERMISSIONS_KEY);
      return true;
    } catch (error) {
      log.error('Error clearing auth data:', error);
      return false;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await storage.getString(AUTH_TOKEN_KEY);
      return !!token;
    } catch (error) {
      log.error('Error checking authentication:', error);
      return false;
    }
  },

  // Refresh Access Token
  refreshAccessToken: async () => {
    try {
      const refreshToken = await storage.getString(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        log.warn('No refresh token found');
        return null;
      }

      const response = await authApi.refreshToken(refreshToken);

      // Defensive response shape validation
      if (!response || !response.data) {
        log.error('Refresh token response missing data:', response);
        return null;
      }

      const { access, refresh } = response.data;

      if (!access) {
        log.error('Refresh token response missing access token:', response.data);
        return null;
      }

      // Persist new access token
      await storage.setString(AUTH_TOKEN_KEY, access);

      // Persist rotated refresh token only if present
      if (refresh) {
        await storage.setString(REFRESH_TOKEN_KEY, refresh);
      }

      return access;
    } catch (error) {
      log.error('Error refreshing token:', error);
      return null;
    }
  },
};

export default authService;
