import { useMemo } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { QUERY_CLIENT_CONFIG } from '../constants';

export function useQueryClient() {
    const queryClient = useMemo(
        () => new QueryClient(QUERY_CLIENT_CONFIG),
        []
    );

    return queryClient;
}
