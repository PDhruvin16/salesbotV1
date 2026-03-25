import {
  QueryClient,
  useMutation,
  useQuery,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import authApi, { type LoginRequest, type LoginResponseData } from '../lib/authApi';
import leadApi, { type Lead } from '../lib/leadsApi';

// Small helper to safely read numeric `status` from unknown error objects
const getStatus = (error: unknown): number | undefined => {
  if (error && typeof error === 'object') {
    const errObj = error as Record<string, unknown>;

    // Prefer Axios-style nested response status when available
    if ('response' in errObj && errObj.response && typeof errObj.response === 'object') {
      const resp = errObj.response as Record<string, unknown>;
      if ('status' in resp && typeof resp.status === 'number') {
        return resp.status;
      }
    }

    // Fallback to top-level status
    if ('status' in errObj && typeof errObj.status === 'number') {
      return errObj.status;
    }
  }
  return undefined;
};

// App-wide QueryClient with sensible defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: unknown) => {
        const status = getStatus(error);
        if (status !== undefined && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: (failureCount: number, error: unknown) => {
        const status = getStatus(error);
        if (status !== undefined && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      retryDelay: 1000,
    },
  },
});

/* ============================================================
   Shared React Query helpers
   ============================================================ */

const defaultQueryOptions = {
  retry: (failureCount: number, error: unknown) => {
    const status = getStatus(error);
    if (status !== undefined && status >= 400 && status < 500) {
      return false;
    }
    return failureCount < 2;
  },
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  refetchOnMount: true,
} as const;

const defaultMutationOptions = {
  retry: (failureCount: number, error: unknown) => {
    const status = getStatus(error);
    if (status !== undefined && status >= 400 && status < 500) {
      return false;
    }
    return failureCount < 1;
  },
  retryDelay: 1000,
} as const;

/** Centralized query helper that merges shared defaults with per-call overrides.
 *  Note: staleTime and gcTime will only be included when the caller passes them.
 */
export const useAppQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  options: UseQueryOptions<TQueryFnData, TError, TData> & {
    queryKey: QueryKey;
    queryFn: () => Promise<TQueryFnData>;
  },
) => {
  const finalOptions: UseQueryOptions<TQueryFnData, TError, TData> = {
    retry: options.retry ?? defaultQueryOptions.retry,
    retryDelay: options.retryDelay ?? defaultQueryOptions.retryDelay,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? defaultQueryOptions.refetchOnWindowFocus,
    refetchOnReconnect: options.refetchOnReconnect ?? defaultQueryOptions.refetchOnReconnect,
    refetchOnMount: options.refetchOnMount ?? defaultQueryOptions.refetchOnMount,
    ...options,
  };

  if (Object.prototype.hasOwnProperty.call(options, 'staleTime')) {
    finalOptions.staleTime = options.staleTime;
  }

  const optionsRecord = options as unknown as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(optionsRecord, 'gcTime')) {
    const finalOptionsRecord = finalOptions as unknown as Record<string, unknown>;
    finalOptionsRecord.gcTime = optionsRecord.gcTime;
  }

  return useQuery(finalOptions);
};

/** Centralized mutation helper that merges shared defaults with per-call overrides. */
export const useAppMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
) =>
  useMutation({
    ...defaultMutationOptions,
    ...options,
    retry: options.retry ?? defaultMutationOptions.retry,
    retryDelay: options.retryDelay ?? defaultMutationOptions.retryDelay,
  });

/* ==========================
   Auth Mutation Hooks
   ========================== */

/**
 * Hook for logging in a user with email and password.
 * Handles API request, error handling, and retry logic automatically.
 *
 * @example
 * const loginMutation = useLoginMutation({
 *   onSuccess: (response) => {
 *     // Handle successful login
 *   },
 *   onError: (error) => {
 *     // Handle login error
 *   }
 * });
 *
 * loginMutation.mutate({ email: 'user@example.com', password: 'password' });
 */
export const useLoginMutation = (
  options?: UseMutationOptions<LoginResponseData, unknown, LoginRequest>,
) =>
  useAppMutation<LoginResponseData, unknown, LoginRequest>({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authApi.login(credentials);
      return response.data;
    },
    ...(options || {}),
  });

/* ==========================
   queryKeys
   ========================== */

export const queryKeys = {
  auth: {
    base: ['auth'] as const,
    login: ['auth', 'login'] as const,
  },
  distributor: {
    base: ['distributor'] as const,
    countries: ['distributor', 'countries'] as const,
    states: ['distributor', 'states'] as const,
    territories: ['distributor', 'territories'] as const,
    zones: ['distributor', 'zones'] as const,
  },
  leads: {
    base: ['leads'] as const,
    list: ['leads', 'list'] as const,
    // later you can add: detail: (id: string) => ['leads', 'detail', id] as const
  },
} as const;

/* ==========================
   Distributor hooks - TO BE IMPLEMENTED
   Note: distributorApi is not yet implemented. These hooks are placeholders.
   ========================== */

// export const useCountriesQuery = () =>
//   useAppQuery({
//     queryKey: queryKeys.distributor.countries,
//     queryFn: distributorApi.fetchCountries,
//   });

// export const useStatesQuery = () =>
//   useAppQuery({
//     queryKey: queryKeys.distributor.states,
//     queryFn: distributorApi.fetchStates,
//   });

// export const useTerritoriesQuery = () =>
//   useAppQuery({
//     queryKey: queryKeys.distributor.territories,
//     queryFn: distributorApi.fetchTerritories,
//   });

// export const useZonesQuery = () =>
//   useAppQuery({
//     queryKey: queryKeys.distributor.zones,
//     queryFn: distributorApi.fetchZones,
//   });

// export const useCreateDistributorMutation = (
//   options?: UseMutationOptions<CreateDistributorResponse, unknown, CreateDistributorPayload>,
// ) =>
//   useAppMutation<CreateDistributorResponse, unknown, CreateDistributorPayload>({
//     mutationFn: distributorApi.create,
//     ...(options || {}),
//   });

/* ==========================
   Lead hooks
   ========================== */

export const useLeadsQuery = () =>
  useAppQuery<Lead[]>({
    queryKey: queryKeys.leads.list,
    queryFn: leadApi.fetchLeads,
  });
