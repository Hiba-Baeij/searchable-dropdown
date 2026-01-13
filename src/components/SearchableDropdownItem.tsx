import { memo } from 'react';
import { Box, Text } from '@mantine/core';
import { SearchResult } from '../types';
import { highlightText } from '../utils/textHighlight';

interface SearchableDropdownItemProps {
    item: SearchResult;
    index: number;
    selectedIndex: number;
    query: string;
    onSelect: (item: SearchResult) => void;
    onMouseEnter: (index: number) => void;
    setItemRef: (index: number, el: HTMLDivElement | null) => void;
}

const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
};

export const SearchableDropdownItem = memo<SearchableDropdownItemProps>(
    ({ item, index, selectedIndex, query, onSelect, onMouseEnter, setItemRef }) => {
        const isSelected = index === selectedIndex;

        return (
            <Box
                ref={(el) => setItemRef(index, el)}
                p="sm"
                style={{
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--mantine-color-blue-1)' : 'transparent',
                    transition: 'background-color 0.15s ease',
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(item);
                }}
                onMouseEnter={() => onMouseEnter(index)}
            >
                <Text
                    size="sm"
                    fw={600}
                    c="dark.9"
                    style={{ marginBottom: 4 }}
                >
                    {highlightText(item.title, query)}
                </Text>
                <Text size="xs" c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>{formatPrice(item.price)}</span>
                    <span>·</span>
                    <span>{item.category.name}</span>
                </Text>
            </Box>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.item.id === nextProps.item.id &&
            prevProps.index === nextProps.index &&
            prevProps.selectedIndex === nextProps.selectedIndex &&
            prevProps.query === nextProps.query
        );
    }
);

SearchableDropdownItem.displayName = 'SearchableDropdownItem';
