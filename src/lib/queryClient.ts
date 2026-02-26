import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes (prevents spamming expensive backend calls)
            gcTime: 10 * 60 * 1000, // 10 minutes cache storage
            retry: 1, // Gracefully retry once on transient network errors
            refetchOnWindowFocus: false, // Don't refetch expensive data just by switching tabs
        },
    },
});
