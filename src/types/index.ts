export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  data: SearchResult[];
  hasMore: boolean;
  total: number;
}

import { ReactNode } from 'react';

export interface SearchableDropdownProps<T = SearchResult> {
  onSelect?: (item: T) => void;
  onSearch?: () => void;
  placeholder?: string;
  minLength?: number;
  // Data props
  results: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasMore: boolean;
  loadMore: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  // Item rendering
  getItemId: (item: T) => string | number;
  getItemLabel: (item: T) => string;
  renderItem?: (item: T, index: number, selectedIndex: number, query: string) => ReactNode;
}

export interface MantineComboboxExampleProps<T = SearchResult> {
  onSelect?: (item: T) => void;
  placeholder?: string;
  // Data props
  results: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasMore: boolean;
  loadMore: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  // Item rendering
  getItemId: (item: T) => string | number;
  getItemLabel: (item: T) => string;
  renderOption?: (item: T) => ReactNode;
}
