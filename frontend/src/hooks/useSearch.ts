'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSearchStore from '@/store/searchStore';
import { useDebounce } from './useDebounce';

export const useSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    query,
    results,
    suggestions,
    popularSearches,
    trendingProducts,
    isLoading,
    error,
    totalResults,
    currentPage,
    totalPages,
    filters,
    setQuery,
    setFilters,
    search,
    getSuggestions,
    getPopularSearches,
    getTrendingProducts,
    clearSearch,
    resetFilters,
  } = useSearchStore();

  const debouncedQuery = useDebounce(query, 300);

  // Initialize from URL
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const minPrice = searchParams.get('minPrice') || undefined;
    const maxPrice = searchParams.get('maxPrice') || undefined;
    const inStock = searchParams.get('inStock') || undefined;
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    setQuery(urlQuery);
    setFilters({
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStock: inStock ? inStock === 'true' : undefined,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
    });

    if (urlQuery) {
      search({
        page: parseInt(searchParams.get('page') || '1'),
      });
    }
  }, []);

  // Search when query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch();
    }
  }, [debouncedQuery, filters]);

  const performSearch = useCallback(async (page = 1) => {
    await search({ page });
    
    // Update URL
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.set('inStock', filters.inStock.toString());
    if (filters.sortBy !== 'relevance') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);
    if (page > 1) params.set('page', page.toString());
    
    router.push(`/search?${params.toString()}`);
  }, [query, filters, router]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length >= 2) {
      performSearch(1);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    performSearch(page);
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'product') {
      router.push(`/products/${suggestion.slug}`);
    } else if (suggestion.type === 'category') {
      router.push(`/products?category=${suggestion.slug}`);
    } else {
      setQuery(suggestion.text);
      performSearch(1);
    }
  };

  return {
    // State
    query,
    results,
    suggestions,
    popularSearches,
    trendingProducts,
    isLoading,
    error,
    totalResults,
    currentPage,
    totalPages,
    filters,

    // Actions
    setFilters,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleSuggestionClick,
    getPopularSearches,
    getTrendingProducts,
    clearSearch,
    resetFilters,
    performSearch,
  };
};