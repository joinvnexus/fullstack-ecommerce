import { create } from 'zustand';
import { searchApi } from '@/lib/api';

// AbortController instances for cancelling requests
let searchAbortController: AbortController | null = null;
let suggestionsAbortController: AbortController | null = null;

interface SearchState {
  query: string;
  results: any[];
  suggestions: any;
  popularSearches: string[];
  trendingProducts: any[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };

  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchState['filters']>) => void;
  search: (params?: any) => Promise<void>;
  getSuggestions: (query: string) => Promise<void>;
  getPopularSearches: () => Promise<void>;
  getTrendingProducts: () => Promise<void>;
  clearSearch: () => void;
  resetFilters: () => void;
}

const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  suggestions: {
    products: [],
    categories: [],
    tags: [],
  },
  popularSearches: [],
  trendingProducts: [],
  isLoading: false,
  error: null,
  totalResults: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {
    sortBy: 'relevance',
    sortOrder: 'desc',
  },

  setQuery: (query: string) => {
    set({ query });
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  search: async (params = {}) => {
    // Cancel previous search request
    if (searchAbortController) {
      searchAbortController.abort();
    }
    searchAbortController = new AbortController();

    try {
      set({ isLoading: true, error: null });

      const { query, filters } = get();
      const searchParams = {
        q: query,
        page: params.page || 1,
        limit: params.limit || 20,
        ...filters,
        ...params,
      };

      const response = await searchApi.searchProducts(searchParams, { signal: searchAbortController.signal });

      set({
        results: response.data.products,
        totalResults: response.data.total,
        currentPage: response.data.page,
        totalPages: response.data.totalPages,
        isLoading: false,
      });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Silently ignore aborted requests
        return;
      }
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  getSuggestions: async (query: string) => {
    // Cancel previous suggestions request
    if (suggestionsAbortController) {
      suggestionsAbortController.abort();
    }
    suggestionsAbortController = new AbortController();

    try {
      if (query.length < 2) {
        set({ suggestions: { products: [], categories: [], tags: [] } });
        return;
      }

      const response = await searchApi.getSuggestions({ q: query }, { signal: suggestionsAbortController.signal });
      set({ suggestions: response.data });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Silently ignore aborted requests
        return;
      }
      console.error('Failed to get suggestions:', error);
    }
  },

  getPopularSearches: async () => {
    try {
      const response = await searchApi.getPopularSearches();
      set({ popularSearches: response.data });
    } catch (error) {
      console.error('Failed to get popular searches:', error);
    }
  },

  getTrendingProducts: async () => {
    try {
      const response = await searchApi.getTrendingProducts();
      set({ trendingProducts: response.data });
    } catch (error) {
      console.error('Failed to get trending products:', error);
    }
  },

  clearSearch: () => {
    set({
      query: '',
      results: [],
      suggestions: { products: [], categories: [], tags: [] },
      totalResults: 0,
      currentPage: 1,
      totalPages: 1,
    });
  },

  resetFilters: () => {
    set({
      filters: {
        sortBy: 'relevance',
        sortOrder: 'desc',
      },
    });
  },
}));

export default useSearchStore;