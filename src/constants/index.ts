export const SEARCH_CONFIG = {
    DEFAULT_DEBOUNCE_MS: 300,
    MIN_SEARCH_LENGTH: 1,
    PAGE_SIZE: 10,
    BLUR_DELAY_MS: 200,
    DROPDOWN_MAX_HEIGHT: 300,
} as const;

export const KEYBOARD_KEYS = {
    ARROW_DOWN: 'ArrowDown',
    ARROW_UP: 'ArrowUp',
    ENTER: 'Enter',
    ESCAPE: 'Escape',
} as const;

export const ARIA_LABELS = {
    SEARCH_INPUT: 'Search for items',
    DROPDOWN_MENU: 'Search results',
    LOADING: 'Loading results',
    NO_RESULTS: 'No results found',
} as const;

export const QUERY_CLIENT_CONFIG = {
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
} as const;
