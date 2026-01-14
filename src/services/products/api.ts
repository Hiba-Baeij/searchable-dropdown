import { SearchResult } from '../../types';
import { SEARCH_CONFIG } from '../../constants';

const API_BASE_URL = 'https://rickandmortyapi.com/api/character';

interface RickAndMortyApiInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

interface RickAndMortyCharactersResponse {
    info: RickAndMortyApiInfo;
    results: SearchResult[];
}

export interface ProductsResponse {
    data: SearchResult[];
    hasMore: boolean;
    total: number;
}

export async function fetchProducts(
    title: string,
    page: number = 1,
    _pageSize: number = SEARCH_CONFIG.PAGE_SIZE
): Promise<ProductsResponse> {
    const params = new URLSearchParams();

    if (title) {
        params.set('name', title);
    }

    // Rick and Morty API uses fixed page size (20 items) and page-based pagination
    params.set('page', String(page));

    const url = `${API_BASE_URL}?${params.toString()}`;

    const response = await fetch(url);

    // Rick and Morty API returns 404 when there are no results for a given filter.
    // Treat that case as "no results" instead of an error.
    if (response.status === 404) {
        return {
            data: [],
            hasMore: false,
            total: 0,
        };
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const json: RickAndMortyCharactersResponse = await response.json();

    const data: SearchResult[] = json.results ?? [];

    const hasMore = Boolean(json.info?.next);

    return {
        data,
        hasMore,
        total: json.info?.count ?? data.length,
    };
}
