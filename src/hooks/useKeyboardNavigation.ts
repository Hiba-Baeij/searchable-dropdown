import { useState, useEffect, useRef, useCallback } from 'react';
import { SearchResult } from '../types';
import { KEYBOARD_KEYS } from '../constants';

interface UseKeyboardNavigationOptions {
    isOpen: boolean;
    results: SearchResult[];
    onSelect: (item: SearchResult) => void;
    onClose: () => void;
}

export function useKeyboardNavigation({
    isOpen,
    results,
    onSelect,
    onClose,
}: UseKeyboardNavigationOptions) {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        setSelectedIndex(-1);
    }, [results.length]);

    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, results.length);
    }, [results.length]);

    useEffect(() => {
        if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
            const element = itemRefs.current[selectedIndex];
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    }, [selectedIndex]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (!isOpen || results.length === 0) {
                if (event.key === KEYBOARD_KEYS.ESCAPE) {
                    onClose();
                }
                return;
            }

            switch (event.key) {
                case KEYBOARD_KEYS.ARROW_DOWN:
                    event.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < results.length - 1 ? prev + 1 : prev
                    );
                    break;
                case KEYBOARD_KEYS.ARROW_UP:
                    event.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                    break;
                case KEYBOARD_KEYS.ENTER:
                    event.preventDefault();
                    if (selectedIndex >= 0 && selectedIndex < results.length) {
                        onSelect(results[selectedIndex]);
                    }
                    break;
                case KEYBOARD_KEYS.ESCAPE:
                    event.preventDefault();
                    onClose();
                    setSelectedIndex(-1);
                    break;
            }
        },
        [isOpen, results, selectedIndex, onSelect, onClose]
    );

    const handleMouseEnter = useCallback((index: number) => {
        setSelectedIndex(index);
    }, []);

    const setItemRef = useCallback((index: number, el: HTMLDivElement | null) => {
        itemRefs.current[index] = el;
    }, []);

    return {
        selectedIndex,
        handleKeyDown,
        handleMouseEnter,
        setItemRef,
    };
}
