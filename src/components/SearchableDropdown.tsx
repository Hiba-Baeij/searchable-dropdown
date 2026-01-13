import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { TextInput, Box, Paper, ScrollArea, Loader, Text } from '@mantine/core';
import { useInView } from 'react-intersection-observer';
import { useProductsQuery } from '../hooks/useProductsQuery';
import { useDebounce } from '../hooks/useDebounce';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { SearchableDropdownItem } from './SearchableDropdownItem';
import { SearchableDropdownProps, SearchResult } from '../types';
import { SEARCH_CONFIG, ARIA_LABELS } from '../constants';

export function SearchableDropdown({
    onSelect,
    placeholder = 'Search...',
    debounceMs = SEARCH_CONFIG.DEFAULT_DEBOUNCE_MS,
}: SearchableDropdownProps) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const debouncedQuery = useDebounce(inputValue, debounceMs);

    // Allow empty queries to fetch initial 10 items when dropdown opens
    const allowEmptyQuery = inputValue.length === 0;

    const {
        results,
        isLoading,
        isFetchingNextPage: isLoadingMore,
        hasMore,
        loadMore,
    } = useProductsQuery(debouncedQuery, {
        enabled: true,
        pageSize: SEARCH_CONFIG.PAGE_SIZE,
        allowEmpty: allowEmptyQuery,
    });

    useEffect(() => {
        if (results.length > 0) {
            setIsOpen(true);
        } else if (inputValue.length > 0 && results.length === 0 && !isLoading) {
            setIsOpen(false);
        }
    }, [inputValue.length, results.length, isLoading]);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }, []);

    const handleSelect = useCallback(
        (item: SearchResult) => {
            setInputValue(item.title);
            setIsOpen(false);
            onSelect?.(item);
        },
        [onSelect]
    );

    const handleFocus = useCallback(() => {
        if (results.length > 0) {
            setIsOpen(true);
        }
    }, [results.length]);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            setIsOpen(false);
        }, SEARCH_CONFIG.BLUR_DELAY_MS);
    }, []);

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
    }, [isOpen, results.length]);

    // Use react-intersection-observer for infinite scroll
    const { ref: sentinelRef } = useInView({
        root: scrollViewport as Element | null,
        rootMargin: '0px',
        threshold: 0.1,
        onChange: (inView) => {
            if (inView && hasMore && !isLoadingMore && isOpen) {
                loadMore();
            }
        },
    });

    const { selectedIndex, handleKeyDown, handleMouseEnter, setItemRef } =
        useKeyboardNavigation({
            isOpen,
            results,
            onSelect: handleSelect,
            onClose: () => setIsOpen(false),
        });

    const dropdownStyles = useMemo(
        () => ({
            position: 'absolute' as const,
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: 4,
            maxHeight: SEARCH_CONFIG.DROPDOWN_MAX_HEIGHT,
            overflow: 'hidden' as const,
        }),
        []
    );

    return (
        <Box style={{ position: 'relative', width: '100%' }}>
            <TextInput
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                rightSection={isLoading ? <Loader size={16} /> : null}
                aria-label={ARIA_LABELS.SEARCH_INPUT}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            />
            {isOpen && (
                <Paper shadow="md" p={0} style={dropdownStyles}>
                    <ScrollArea ref={scrollAreaRef} h={SEARCH_CONFIG.DROPDOWN_MAX_HEIGHT}>
                        <div role="listbox" aria-label={ARIA_LABELS.DROPDOWN_MENU}>
                            {results.length === 0 && !isLoading && (
                                <Box p="md">
                                    <Text c="dimmed" size="sm" role="status" aria-live="polite">
                                        {ARIA_LABELS.NO_RESULTS}
                                    </Text>
                                </Box>
                            )}
                            {results.map((item, index) => (
                                <SearchableDropdownItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    selectedIndex={selectedIndex}
                                    query={debouncedQuery}
                                    onSelect={handleSelect}
                                    onMouseEnter={handleMouseEnter}
                                    setItemRef={setItemRef}
                                />
                            ))}

                            {hasMore && (
                                <div
                                    ref={sentinelRef}
                                    style={{ height: '1px', width: '100%' }}
                                    aria-hidden="true"
                                />
                            )}
                            {isLoadingMore && (
                                <Box p="sm" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Loader size={16} aria-label={ARIA_LABELS.LOADING} />
                                </Box>
                            )}
                        </div>
                    </ScrollArea>
                </Paper>
            )}
        </Box>
    );
}
