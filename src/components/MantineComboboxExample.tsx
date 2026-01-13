import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Combobox, useCombobox, TextInput, Loader, Text, ScrollArea } from '@mantine/core';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from '../hooks/useDebounce';
import { useProductsInfiniteQuery } from '../hooks/useProductsQuery';
import { SearchResult } from '../types';
import { SEARCH_CONFIG } from '../constants';

interface MantineComboboxExampleProps {
    onSelect?: (item: SearchResult) => void;
    placeholder?: string;
}

export function MantineComboboxExample({
    onSelect,
    placeholder = 'Search for items...'
}: MantineComboboxExampleProps) {
    const [value, setValue] = useState('');

    const debouncedQuery = useDebounce(value, SEARCH_CONFIG.DEFAULT_DEBOUNCE_MS);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    // Allow empty queries to fetch initial 10 items when combobox opens
    const allowEmptyQuery = value.length === 0;

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useProductsInfiniteQuery(
        debouncedQuery,
        true,
        SEARCH_CONFIG.PAGE_SIZE,
        allowEmptyQuery
    );

    // Flatten all pages into a single array
    const results = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.data);
    }, [data]);

    const hasMore = hasNextPage ?? false;
    const isLoadingMore = isFetchingNextPage;



    // Load more results for infinite scroll
    const loadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) return;
        fetchNextPage();
    }, [isLoadingMore, hasMore, fetchNextPage]);

    const options = useMemo(() => {
        return results.map((item) => (
            <Combobox.Option value={item.id.toString()} key={item.id}>
                <Text size="sm" fw={500}>
                    {item.title}
                </Text>
                <Text size="xs" c="dimmed">
                    ${item.price.toFixed(2)} • {item.category.name}
                </Text>
            </Combobox.Option>
        ));
    }, [results]);

    const handleOptionSubmit = (val: string) => {
        const selectedItem = results.find((item) => item.id.toString() === val);
        if (selectedItem) {
            setValue(selectedItem.title);
            combobox.closeDropdown();
            onSelect?.(selectedItem);
        }
    };

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Reset scroll position when search query changes
    useEffect(() => {
        const scrollElement = scrollAreaRef.current?.querySelector('[data-scroll-viewport]');
        if (scrollElement) {
            scrollElement.scrollTop = 0;
        }
    }, [debouncedQuery]);

    // Get scroll viewport element for IntersectionObserver root
    const scrollViewport = useMemo(() => {
        return (
            scrollAreaRef.current?.querySelector('[data-scroll-viewport]') ||
            scrollAreaRef.current?.querySelector('.mantine-ScrollArea-viewport') ||
            scrollAreaRef.current?.querySelector('[class*="viewport"]') ||
            null
        );
    }, [results.length]);

    // Use react-intersection-observer for infinite scroll
    const { ref: sentinelRef } = useInView({
        root: scrollViewport as Element | null,
        rootMargin: '0px',
        threshold: 0.1,
        onChange: (inView) => {
            if (inView && hasMore && !isLoadingMore) {
                loadMore();
            }
        },
    });

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={handleOptionSubmit}
            withinPortal={false}
        >
            <Combobox.Target>
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => {
                        setValue(event.currentTarget.value);
                        combobox.openDropdown();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    rightSection={
                        isLoading ? (
                            <Loader size={16} />
                        ) : (
                            <Combobox.Chevron />
                        )
                    }
                    rightSectionPointerEvents="none"
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    <ScrollArea
                        ref={scrollAreaRef}
                        h={SEARCH_CONFIG.DROPDOWN_MAX_HEIGHT}
                    >
                        {results.length === 0 && !isLoading && value.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH && (
                            <Text size="sm" c="dimmed" p="md" ta="center">
                                No results found
                            </Text>
                        )}
                        {options}
                        {/* Sentinel element for infinite scroll detection */}
                        {hasMore && (
                            <div
                                ref={sentinelRef}
                                style={{ height: '1px', width: '100%' }}
                                aria-hidden="true"
                            />
                        )}
                        {isLoadingMore && (
                            <Text size="sm" c="dimmed" p="sm" ta="center">
                                Loading more...
                            </Text>
                        )}
                    </ScrollArea>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
