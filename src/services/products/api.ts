import { SearchResult } from '../../types';
import { SEARCH_CONFIG } from '../../constants';

const API_BASE_URL = 'https://api.escuelajs.co/api/v1/products';

export interface ProductsResponse {
    data: SearchResult[];
    hasMore: boolean;
    total: number;
}

export async function fetchProducts(
    title: string,
    page: number = 1,
    pageSize: number = SEARCH_CONFIG.PAGE_SIZE
): Promise<ProductsResponse> {
    const offset = (page - 1) * pageSize;
    const url = `${API_BASE_URL}?title=${encodeURIComponent(title)}&offset=${offset}&limit=${pageSize}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data: SearchResult[] = await response.json();

    const hasMore = data.length === pageSize && data.length > 0;

    return {
        data,
        hasMore,
        total: data.length,
    };
}
