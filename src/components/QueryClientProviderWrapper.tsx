import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useQueryClient } from '../hooks/useQueryClient';

interface QueryClientProviderWrapperProps {
    children: ReactNode;
}

export function QueryClientProviderWrapper({ children }: QueryClientProviderWrapperProps) {
    const queryClient = useQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
