import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { TextInput, Box, Paper, ScrollArea, Loader, Text } from '@mantine/core';
import { useInView } from 'react-intersection-observer';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { SearchableDropdownItem } from './SearchableDropdownItem';
import { SearchableDropdownProps, SearchResult } from '../types';
import { SEARCH_CONFIG, ARIA_LABELS } from '../constants';

export function SearchableDropdown<T = SearchResult>({
    onSelect,
    placeholder = 'Search...',
    results,
    isLoading,
    isFetchingNextPage: isLoadingMore,
    hasMore,
    loadMore,
    query,
    onQueryChange,
    getItemId,
    getItemLabel,
    renderItem,
}: SearchableDropdownProps<T>) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        onQueryChange(newValue);
    }, [onQueryChange]);

    const handleSelect = useCallback(
        (item: T) => {
            setInputValue(getItemLabel(item));
            setIsOpen(false);
            onSelect?.(item);
        },
        [onSelect, getItemLabel]
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
    }, [query]);

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
        useKeyboardNavigation<T>({
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
                            {results.map((item, index) => {
                                if (renderItem) {
                                    return (
                                        <Box
                                            key={getItemId(item)}
                                            ref={(el) => setItemRef(index, el as HTMLDivElement | null)}
                                            onMouseEnter={() => handleMouseEnter(index)}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSelect(item);
                                            }}
                                        >
                                            {renderItem(item, index, selectedIndex, query)}
                                        </Box>
                                    );
                                }
                                // Default rendering for SearchResult type
                                return (
                                    <SearchableDropdownItem
                                        key={getItemId(item)}
                                        item={item as SearchResult}
                                        index={index}
                                        selectedIndex={selectedIndex}
                                        query={query}
                                        onSelect={handleSelect as (item: SearchResult) => void}
                                        onMouseEnter={handleMouseEnter}
                                        setItemRef={setItemRef}
                                    />
                                );
                            })}

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
