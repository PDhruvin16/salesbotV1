import { type AxiosRequestConfig, type AxiosResponse, AxiosError } from "axios";
import { ApiClient, AuthClient } from "./client";
import { useAuth } from "../hooks/useAuth";
import { RootState, store } from "../redux/store";
import { API_ENDPOINTS } from "./endpoints";
import { clearAuthData, setAuthData } from "../redux/slices/authSlice";

let isRefreshing = false;
let failedQueue: {
    resolve: (value?: AxiosResponse<any>) => void;
    reject: (error: any) => void;
    config: AxiosRequestConfig;
}[] = [];
export const updateAuthData = (data: Partial<RootState["auth"]>) => {
    const currentUser = store.getState().auth;
    store.dispatch(
      setAuthData({
        ...currentUser,
        ...data,
      })
    );
  };
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(async ({ resolve, reject, config }) => {
        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
            resolve(await ApiClient(config));
        } else {
            reject(error);
        }
    });

    failedQueue = [];
};

ApiClient.interceptors.request.use(
    (config) => {
        // React Native does not have `localStorage`. We read the token from Redux-persisted auth state.
        const state = store.getState();
        const token = state.auth?.access;

        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

ApiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<any>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: originalRequest });
                });
            }

            isRefreshing = true;

            try {

                const state = store.getState();
                console.log(state.auth.refresh,"state.auth.refresh");
                const response = await AuthClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
                  refresh: state.auth.refresh,
                });

                console.log(response.data,"response.data");

                const tokens = response.data.data;
                updateAuthData(tokens);

                processQueue(null, tokens.access);

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${tokens.access}`,
                };
                return ApiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                store.dispatch(clearAuthData());
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default ApiClient;
 