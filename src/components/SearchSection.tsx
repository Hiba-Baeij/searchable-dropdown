import { useState } from 'react';
import { Box, Paper, Text, Group, Stack } from '@mantine/core';
import { SearchResult } from '../types';
import { MantineCombobox } from './MantineCombobox';
import { useProductsQuery } from '../hooks/useProductsQuery';
import { useDebounce } from '../hooks/useDebounce';
import { SEARCH_CONFIG } from '../constants';

interface SearchSectionProps {
    onSelect: (item: SearchResult) => void;
}

export function SearchSection({ onSelect }: SearchSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const debouncedQuery = useDebounce(searchQuery, SEARCH_CONFIG.DEFAULT_DEBOUNCE_MS);

    // Allow empty queries to fetch initial 10 items when dropdown opens
    const allowEmptyQuery = searchQuery.length === 0;

    const {
        results: results,
        isLoading: isLoading,
        isFetchingNextPage: isFetchingNextPage,
        hasMore: hasMore,
        loadMore: loadMore,
    } = useProductsQuery(debouncedQuery, {
        enabled: true,
        pageSize: SEARCH_CONFIG.PAGE_SIZE,
        allowEmpty: allowEmptyQuery,
    });

    const getItemId = (item: SearchResult) => item.id;
    const getItemLabel = (item: SearchResult) => item.name;

    const handleQueryChange = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <Stack gap="xl" mb="xl">
            {/* Mantine UI Implementation Example */}
            <Paper shadow="sm" p="xl" radius="md" withBorder>
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Box>
                            <Text fw={600} size="lg" mb={4}>
                                Mantine UI Combobox
                            </Text>
                            <Text c="dimmed" size="sm">
                                Built using Mantine UI's Combobox component
                            </Text>
                        </Box>
                    </Group>
                    <MantineCombobox
                        placeholder="Search for items (e.g., 'laptop', 'phone', 'watch')..."
                        onSelect={onSelect}
                        results={results}
                        isLoading={isLoading}
                        isFetchingNextPage={isFetchingNextPage}
                        hasMore={hasMore}
                        loadMore={loadMore}
                        query={debouncedQuery}
                        onQueryChange={handleQueryChange}
                        getItemId={getItemId}
                        getItemLabel={getItemLabel}
                    />
                </Stack>
            </Paper>

        </Stack>
    );
}
