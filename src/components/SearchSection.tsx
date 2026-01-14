import { useState } from 'react';
import { Box, Paper, Text, Group, Stack } from '@mantine/core';
import { SearchResult } from '../types';
import { MantineCombobox } from './MantineCombobox';
// import { SearchableDropdown } from './SearchableDropdown';
import { useProductsQuery } from '../hooks/useProductsQuery';
import { useDebounce } from '../hooks/useDebounce';
import { SEARCH_CONFIG } from '../constants';

interface SearchSectionProps {
    onSelect: (item: SearchResult) => void;
}

export function SearchSection({ onSelect }: SearchSectionProps) {
    // Separate query states for each component
    // const [searchQuery1, setSearchQuery1] = useState('');
    const [searchQuery2, setSearchQuery2] = useState('');

    // const debouncedQuery1 = useDebounce(searchQuery1, SEARCH_CONFIG.DEFAULT_DEBOUNCE_MS);
    const debouncedQuery2 = useDebounce(searchQuery2, SEARCH_CONFIG.DEFAULT_DEBOUNCE_MS);

    // Allow empty queries to fetch initial 10 items when dropdown opens
    // const allowEmptyQuery1 = searchQuery1.length === 0;
    const allowEmptyQuery2 = searchQuery2.length === 0;

    // const {
    //     results: results1,
    //     isLoading: isLoading1,
    //     isFetchingNextPage: isFetchingNextPage1,
    //     hasMore: hasMore1,
    //     loadMore: loadMore1,
    // } = useProductsQuery(debouncedQuery1, {
    //     enabled: true,
    //     pageSize: SEARCH_CONFIG.PAGE_SIZE,
    //     allowEmpty: allowEmptyQuery1,
    // });

    const {
        results: results2,
        isLoading: isLoading2,
        isFetchingNextPage: isFetchingNextPage2,
        hasMore: hasMore2,
        loadMore: loadMore2,
    } = useProductsQuery(debouncedQuery2, {
        enabled: true,
        pageSize: SEARCH_CONFIG.PAGE_SIZE,
        allowEmpty: allowEmptyQuery2,
    });

    // Helper functions for item handling
    const getItemId = (item: SearchResult) => item.id;
    const getItemLabel = (item: SearchResult) => item.title;

    // const handleQueryChange1 = (query: string) => {
    //     setSearchQuery1(query);
    // };

    const handleQueryChange2 = (query: string) => {
        setSearchQuery2(query);
    };

    return (
        <Stack gap="xl" mb="xl">
            {/* Manual Implementation Example */}
            {/* <Paper shadow="sm" p="xl" radius="md" withBorder>
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Box>
                            <Text fw={600} size="lg" mb={4}>
                                1. Manual Implementation
                            </Text>
                            <Text c="dimmed" size="sm">
                                Custom-built searchable dropdown with advanced features
                            </Text>
                        </Box>
                    </Group>
                    <SearchableDropdown
                        placeholder="Search for items (e.g., 'laptop', 'phone', 'watch')..."
                        onSelect={onSelect}
                        results={results1}
                        isLoading={isLoading1}
                        isFetchingNextPage={isFetchingNextPage1}
                        hasMore={hasMore1}
                        loadMore={loadMore1}
                        query={debouncedQuery1}
                        onQueryChange={handleQueryChange1}
                        getItemId={getItemId}
                        getItemLabel={getItemLabel}
                    />
                </Stack>
            </Paper> */}

            {/* Mantine UI Implementation Example */}
            <Paper shadow="sm" p="xl" radius="md" withBorder>
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Box>
                            <Text fw={600} size="lg" mb={4}>
                                2. Mantine UI Combobox
                            </Text>
                            <Text c="dimmed" size="sm">
                                Built using Mantine UI's Combobox component
                            </Text>
                        </Box>
                    </Group>
                    <MantineCombobox
                        placeholder="Search for items (e.g., 'laptop', 'phone', 'watch')..."
                        onSelect={onSelect}
                        results={results2}
                        isLoading={isLoading2}
                        isFetchingNextPage={isFetchingNextPage2}
                        hasMore={hasMore2}
                        loadMore={loadMore2}
                        query={debouncedQuery2}
                        onQueryChange={handleQueryChange2}
                        getItemId={getItemId}
                        getItemLabel={getItemLabel}
                    />
                </Stack>
            </Paper>

        </Stack>
    );
}
