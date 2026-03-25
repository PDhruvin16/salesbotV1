import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import storage from '../utils/Storage';
import log from '../utils/Logger';
import authApi from './authApi';
import Config from 'react-native-config';
export interface ApiResponse<T> {
  status: boolean;
  error: number;
  data: T;
  message: string;
}

interface ReactNativeFile {
  uri: string;
  name: string;
  type: string;
}

// Base URL from .env configuration
const getBaseURL = (): string => {
  try {
    if (Config?.BASE_URL) {
      log.info(' Using BASE_URL from .env:', Config.BASE_URL);
      return Config.BASE_URL;
    }
  } catch (error) {
    log.warn('Failed to read BASE_URL from .env:', error);
  }

  // Fallback - should not be reached if .env is configured correctly
  const fallbackURL = 'https://prodapi.salesbot.cloud';
  log.warn(' Using fallback BASE_URL:', fallbackURL);
  return fallbackURL;
};

// Base URL with safe access
export const BASE_URL = getBaseURL();
log.info('API Base URL initialized:', BASE_URL);

type AxiosJsonResponse<T> = Promise<T>;

interface ReactNativeFormData extends FormData {
  _parts?: [string, string | number | boolean | ReactNativeFile][];
}

// Extend InternalAxiosRequestConfig with custom properties
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  isMultipart?: boolean;
  _retry?: boolean;
  isRefreshRequest?: boolean;
}

function isReactNativeFormData(data: unknown): data is ReactNativeFormData {
  return (
    typeof data === 'object' &&
    data !== null &&
    '_parts' in data &&
    Array.isArray((data as any)._parts)
  );
}

// Function to generate curl command for debugging
function generateCurl(config: CustomAxiosRequestConfig) {
  let curl = [`curl -X ${config.method?.toUpperCase() || 'GET'}`];

  // Full URL
  const fullUrl = config.baseURL ? `${config.baseURL.replace(/\/$/, '')}${config.url}` : config.url;
  curl.push(`"${fullUrl}"`);

  // Headers (exclude Content-Type for FormData as curl will set it automatically)
  if (config.headers) {
    const isFormData = config.data instanceof FormData;
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    for (let key in config.headers) {
      if (config.headers.hasOwnProperty(key)) {
        // Skip Content-Type for FormData, curl handles it with -F
        if (isFormData && key.toLowerCase() === 'content-type') {
          continue;
        }
        const value = sensitiveHeaders.includes(key.toLowerCase())
          ? '[REDACTED]'
          : config.headers[key];
        curl.push(`-H "${key}: ${value}"`);
      }
    }
  }

  // Body data
  if (config.data) {
    try {
      const data = config.data;

      // Handle FormData properly
      if (data instanceof FormData) {
        // Preferred RN path: guarded access to internal _parts
        if (isReactNativeFormData(data)) {
          data._parts!.forEach(([fieldName, fieldValue]) => {
            if (typeof fieldValue === 'object' && fieldValue !== null && 'uri' in fieldValue) {
              const file = fieldValue as ReactNativeFile;
              curl.push(`-F "${fieldName}=@${file.name};type=${file.type}"`);
            } else {
              curl.push(`-F "${fieldName}=${String(fieldValue)}"`);
            }
          });
        } else {
          try {
            if (typeof (data as any).entries === 'function') {
              for (const [key, value] of (data as any).entries()) {
                if (typeof value === 'object' && value !== null && 'uri' in value) {
                  const file = value as ReactNativeFile;
                  curl.push(`-F "${key}=@${file.name};type=${file.type}"`);
                } else {
                  curl.push(`-F "${key}=${String(value)}"`);
                }
              }
            } else {
              curl.push('# FormData body present (unable to introspect fields safely)');
            }
          } catch (fallbackError) {
            log.warn('FormData fallback serialization failed:', fallbackError);
            curl.push('# FormData body present (serialization failed)');
          }
        }
      } else if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          curl.push(`-d '${JSON.stringify(parsed)}'`);
        } catch (catchError: unknown) {
          if (catchError instanceof Error) {
            log.warn('JSON parse failed:', catchError.message);
          } else {
            log.warn('JSON parse failed:', catchError);
          }
          curl.push(`-d '${data}'`);
        }
      } else if (typeof data === 'object') {
        curl.push(`-d '${JSON.stringify(data)}'`);
      }
    } catch (err) {
      log.warn('Could not serialize request data for cURL:', err);
    }
  }

  return curl.join(' \\\n  ');
}

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // Increased from 30s to 60s for slow network/backend responses
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    'x-type': 'mobile',
  },
}) as AxiosInstance & {
  get<T = unknown>(url: string, config?: unknown): AxiosJsonResponse<T>;
  post<T = unknown>(url: string, data?: unknown, config?: unknown): AxiosJsonResponse<T>;
  put<T = unknown>(url: string, data?: unknown, config?: unknown): AxiosJsonResponse<T>;
  delete<T = unknown>(url: string, config?: unknown): AxiosJsonResponse<T>;
};
// Request interceptor
axiosClient.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure x-type header is always present
    if (!config.headers['x-type']) {
      config.headers['x-type'] = 'mobile';
    }

    // Handle multipart/form-data
    if (config.data instanceof FormData) {
      config.isMultipart = true;
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (config.isMultipart) {
      // If explicitly marked as multipart, ensure the header is set
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    // Debug: Log the equivalent curl command
    if (__DEV__) {
      log.debug('🚀 Axios Request -> cURL equivalent:');
      log.debug(generateCurl(config));
      log.debug('📤 Request Config:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization ? config.headers.Authorization : undefined,
        },
        data:
          config.data instanceof FormData
            ? `FormData with ${(config.data as ReactNativeFormData)._parts?.length || 0} parts`
            : config.data,
        isMultipart: config.isMultipart,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Debug: Log response
    if (__DEV__) {
      log.debug('✅ Axios Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }
    return response.data;
  },
  async (error) => {
    // Debug: Log error
    if (__DEV__) {
      log.debug('❌ Axios Error:', {
        status: error.response?.status,
        statusText: error.message,
        url: error.config?.url,
        data: error.response?.data,
        message: error.response?.data?.message,
      });
    }
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Handle timeout errors with retry logic
    if (
      error.code === 'ECONNABORTED' ||
      error.message?.includes('timeout') ||
      error.message === 'Network Error'
    ) {
      const retryCount = (originalRequest as any)._retryCount || 0;
      const maxRetries = 3;
      const retryDelay = 1000 * (retryCount + 1); // Exponential backoff: 1s, 2s, 3s

      if (retryCount < maxRetries) {
        (originalRequest as any)._retryCount = retryCount + 1;

        log.warn(
          `Timeout on ${originalRequest.url} - Retrying (${
            retryCount + 1
          }/${maxRetries}) after ${retryDelay}ms`,
        );

        // Wait before retrying
        await new Promise<void>((resolve) => setTimeout(resolve, retryDelay));

        try {
          return axiosClient(originalRequest);
        } catch (retryError) {
          // If retry fails, continue to error handling below
          log.error(`Retry ${retryCount + 1} failed:`, retryError);
        }
      } else {
        log.error(`Max retries (${maxRetries}) exceeded for ${originalRequest.url}`);
      }
    }

    const isRefreshCall =
      originalRequest.isRefreshRequest || originalRequest.url?.includes('/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      log.debug('401 Unauthorized - attempting token refresh');

      originalRequest._retry = true;

      try {
        const refreshToken = storage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await authApi.refreshToken(refreshToken);

        /**
         * ✅ Explicit contract:
         * authApi.refreshToken returns:
         * { access: string; refresh?: string }
         */
        const tokenData = refreshResponse.data;

        storage.setTokens({
          access: tokenData.access,
          refresh: tokenData.refresh ?? refreshToken,
        });

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${tokenData.access}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        log.debug('Token refresh failed:', refreshError);

        storage.clearAuth();

        const { default: AuthEvents, AUTH_LOGOUT_EVENT } = await import('../utils/AuthEvents');
        AuthEvents.emit(AUTH_LOGOUT_EVENT);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
// import axios from 'axios';

// export const AuthClient = axios.create({
//     baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://prodapi.salesbot.cloud',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// export const ApiClient = axios.create({
//     baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://prodapi.salesbot.cloud',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

 