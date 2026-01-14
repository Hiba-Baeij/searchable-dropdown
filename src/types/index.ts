export interface SearchResult {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
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
  results: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasMore: boolean;
  loadMore: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  getItemId: (item: T) => string | number;
  getItemLabel: (item: T) => string;
  renderItem?: (item: T, index: number, selectedIndex: number, query: string) => ReactNode;
}

export interface MantineComboboxExampleProps<T = SearchResult> {
  onSelect?: (item: T) => void;
  placeholder?: string;
  results: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasMore: boolean;
  loadMore: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  getItemId: (item: T) => string | number;
  getItemLabel: (item: T) => string;
  renderOption?: (item: T) => ReactNode;
}
