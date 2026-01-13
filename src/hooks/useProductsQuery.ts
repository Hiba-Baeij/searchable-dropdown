import { useMemo, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
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

export interface UseProductsQueryOptions {
  enabled?: boolean;
  pageSize?: number;
  allowEmpty?: boolean;
  minSearchLength?: number;
}

export interface UseProductsQueryResult {
  results: SearchResult[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasMore: boolean;
  fetchNextPage: () => void;
  loadMore: () => void;
}

export function useProductsQuery(
  query: string,
  options: UseProductsQueryOptions = {}
): UseProductsQueryResult {
  const {
    enabled = true,
    pageSize = SEARCH_CONFIG.PAGE_SIZE,
    allowEmpty = false,
    minSearchLength = SEARCH_CONFIG.MIN_SEARCH_LENGTH,
  } = options;

  const shouldFetch = enabled && (allowEmpty || query.length >= minSearchLength);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage: fetchNextPageInternal,
  } = useInfiniteQuery({
    queryKey: ['products', 'infinite', query],
    queryFn: ({ pageParam = 1 }) => {
      return fetchProducts(query, pageParam, pageSize);
    },
    enabled: shouldFetch,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 30 * 1000,
  });

  // Flatten all pages into a single array
  const results = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const hasMore = hasNextPage ?? false;
  const isLoadingMore = isFetchingNextPage;

  // Load more results helper
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    fetchNextPageInternal();
  }, [isLoadingMore, hasMore, fetchNextPageInternal]);

  return {
    results,
    isLoading,
    isFetchingNextPage: isLoadingMore,
    hasMore,
    fetchNextPage: fetchNextPageInternal,
    loadMore,
  };
}

// Legacy exports for backward compatibility
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
