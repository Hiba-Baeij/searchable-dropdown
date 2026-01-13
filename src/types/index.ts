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

export interface SearchableDropdownProps {
  onSelect?: (item: SearchResult) => void;
  onSearch?: () => void;
  placeholder?: string;
  minLength?: number;
  debounceMs?: number;
}
