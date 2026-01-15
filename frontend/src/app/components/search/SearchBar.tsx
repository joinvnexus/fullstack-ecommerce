'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Tag, Folder } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import Link from 'next/link';
import Image from 'next/image';

interface SearchBarProps {
  variant?: 'compact' | 'expanded';
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar = ({
  variant = 'compact',
  autoFocus = false,
  onSearch,
  className = '',
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    query,
    suggestions,
    popularSearches,
    trendingProducts,
    handleSearch,
    handleSuggestionClick,
    getPopularSearches,
    clearSearch,
  } = useSearch();

  // Load recent searches & popular on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    getPopularSearches();
  }, [getPopularSearches]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      handleSearch(query, true);
      setIsOpen(false);
      onSearch?.(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value, false);
    setIsOpen(e.target.value.length >= 1);
  };

  const handleClear = () => {
    clearSearch();
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSuggestionSelect = (suggestion: any) => {
    saveRecentSearch(suggestion.text || suggestion.title || suggestion.name);
    handleSuggestionClick(suggestion);
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const showRecent = recentSearches.length > 0 && query.length < 2;
  const hasContent = showRecent || suggestions.products.length > 0 || suggestions.categories.length > 0 || suggestions.tags.length > 0 || popularSearches.length > 0;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products, categories, brands..."
            className={`w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              variant === 'expanded' ? 'py-3 text-base' : 'text-sm'
            }`}
            autoFocus={autoFocus}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && hasContent && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[70vh] overflow-y-auto divide-y divide-gray-100">
          
          {/* Recent Searches */}
          {showRecent && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm font-semibold text-gray-700">
                  <Clock size={16} className="mr-2" />
                  Recent Searches
                </div>
                <button onClick={clearRecentSearches} className="text-xs text-gray-500 hover:text-red-600">
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      handleSearch(search, true);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <span className="text-gray-800 group-hover:text-primary">{search}</span>
                    <X size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Suggestions */}
          {suggestions.products.length > 0 && (
            <div className="p-4">
              <div className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Tag size={16} className="mr-2" />
                Products
              </div>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.products.map((product: any) => (
                  <button
                    key={product._id}
                    onClick={() => handleSuggestionSelect({
                      ...product,
                      text: product.title,
                      type: 'product',
                      slug: product.slug
                    })}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                  >
                    {product.images?.[0]?.url && (
                      <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0].url}
                          alt={product.title}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.price?.amount ? `৳${product.price.amount}` : 'Price on request'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {suggestions.categories.length > 0 && (
            <div className="p-4">
              <div className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Folder size={16} className="mr-2" />
                Categories
              </div>
              <div className="space-y-1">
                {suggestions.categories.map((cat: any) => (
                  <button
                    key={cat._id}
                    onClick={() => handleSuggestionSelect({
                      ...cat,
                      text: cat.name,
                      type: 'category',
                      slug: cat.slug
                    })}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {suggestions.tags.length > 0 && (
            <div className="p-4">
              <div className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Tag size={16} className="mr-2" />
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.tags.map((tag: string) => (
                  <button
                    key={tag}
                    onClick={() => handleSuggestionSelect({ text: tag, type: 'tag' })}
                    className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular / Trending (fallback when no query) */}
          {!query && popularSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <TrendingUp size={16} className="mr-2" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      handleSearch(term, true);
                      setIsOpen(false);
                    }}
                    className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when typing but no results */}
          {query.length >= 2 && !hasContent && (
            <div className="p-6 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;