import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { SearchResult } from '../types';
import { SEARCH_CONFIG } from '../constants';

const API_BASE_URL = 'https://api.escuelajs.co/api/v1/products';

interface ProductsResponse {
  data: SearchResult[];
  hasMore: boolean;
  total: number;
}

async function fetchProducts(
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

export function useProductsQuery(
  title: string,
  enabled: boolean = true,
  pageSize: number = SEARCH_CONFIG.PAGE_SIZE
) {
  return useQuery({
    queryKey: ['products', title, 1],
    queryFn: () => fetchProducts(title, 1, pageSize),
    enabled: enabled && title.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH,
    staleTime: 30 * 1000,
  });
}

export function useProductsInfiniteQuery(
  title: string,
  enabled: boolean = true,
  pageSize: number = SEARCH_CONFIG.PAGE_SIZE,
  allowEmpty: boolean = false
) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', title],
    queryFn: ({ pageParam = 1 }) => {
      return fetchProducts(title, pageParam, pageSize);
    },
    enabled: enabled && (allowEmpty || title.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 30 * 1000,
  });
}
