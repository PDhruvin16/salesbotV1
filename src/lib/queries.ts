// Central React Query exports for the app.
// Re-export from hooks/useQueries so web/mobile code can import from a single place.

export {
  queryClient,
  useAppQuery,
  useAppMutation,
  queryKeys,
  useLoginMutation,
} from '../hooks/useQueries';
