import { useState, useEffect, useMemo, useRef } from 'react';
import { Combobox, useCombobox, TextInput, Loader, Text, ScrollArea, ActionIcon } from '@mantine/core';
import { useInView } from 'react-intersection-observer';
import { MantineComboboxExampleProps, SearchResult } from '../types';
import { SEARCH_CONFIG } from '../constants';
import { highlightText } from '../utils/textHighlight';

export function MantineCombobox<T = SearchResult>({
    onSelect,
    placeholder = 'Search for items...',
    results,
    isLoading,
    isFetchingNextPage: isLoadingMore,
    hasMore,
    loadMore,
    query,
    onQueryChange,
    getItemId,
    getItemLabel,
    renderOption,
}: MantineComboboxExampleProps<T>) {
    const [value, setValue] = useState('');

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const options = useMemo(() => {
        return results.map((item) => {
            const itemId = getItemId(item).toString();
            return (
                <Combobox.Option value={itemId} key={itemId}>
                    {renderOption ? (
                        renderOption(item)
                    ) : (
                        <>
                            <Text size="sm" fw={400}>
                                {highlightText(getItemLabel(item), query)}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {(item as SearchResult).status} • {(item as SearchResult).species}
                            </Text>
                        </>
                    )}
                </Combobox.Option>
            );
        });
    }, [results, getItemId, getItemLabel, renderOption, query]);

    const handleOptionSubmit = (val: string) => {
        const selectedItem = results.find((item) => getItemId(item).toString() === val);
        if (selectedItem) {
            setValue(getItemLabel(selectedItem));
            combobox.closeDropdown();
            onSelect?.(selectedItem);
        }
    };

    const handleClear = () => {
        setValue('');
        onQueryChange('');
        combobox.closeDropdown();
    };

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
                        const newValue = event.currentTarget.value;
                        setValue(newValue);
                        onQueryChange(newValue);
                        if (newValue) {
                            combobox.openDropdown();
                        } else {
                            combobox.closeDropdown();
                        }
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    rightSection={
                        isLoading ? (
                            <Loader size={16} />
                        ) : value ? (
                            <ActionIcon
                                size="sm"
                                variant="transparent"
                                onClick={handleClear}
                                aria-label="Clear"
                            >
                                ×
                            </ActionIcon>
                        ) : (
                            <Combobox.Chevron />
                        )
                    }
                    rightSectionPointerEvents={isLoading ? 'none' : 'auto'}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    <ScrollArea
                        ref={scrollAreaRef}
                        h={SEARCH_CONFIG.DROPDOWN_MAX_HEIGHT}
                    >
                        {results.length === 0 && !isLoading && query.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH && (
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
