'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Tag, Folder } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import Link from 'next/link';

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
    handleSearch,
    handleSuggestionClick,
    getPopularSearches,
    clearSearch,
  } = useSearch();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    getPopularSearches();
  }, []);

  // Close suggestions when clicking outside
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
    
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery),
    ].slice(0, 5);
    
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      handleSearch(query);
      setIsOpen(false);
      onSearch?.(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    clearSearch();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    saveRecentSearch(suggestion.text || suggestion.title);
    handleSuggestionClick(suggestion);
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const hasSuggestions = 
    suggestions.products.length > 0 ||
    suggestions.categories.length > 0 ||
    suggestions.tags.length > 0;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (query.length >= 2 || recentSearches.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder="Search products, categories, brands..."
            className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              variant === 'expanded' ? 'py-3 text-lg' : ''
            }`}
            autoFocus={autoFocus}
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
          {/* Recent searches */}
          {recentSearches.length > 0 && query.length < 2 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <Clock size={16} className="mr-2" />
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleSearch(search);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded"
                  >
                    <span className="text-gray-700">{search}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = recentSearches.filter((_, i) => i !== index);
                        setRecentSearches(updated);
                        localStorage.setItem('recentSearches', JSON.stringify(updated));
                      }}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product suggestions */}
          {suggestions.products.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Tag size={16} className="mr-2" />
                Products
              </div>
              <div className="space-y-2">
                {suggestions.products.map((product: any) => (
                  <button
                    key={product._id}
                    onClick={() => handleSuggestionSelect({
                      ...product,
                        type: 'product',
                    })}
                    className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded"
                  >
                    <span className="text-gray-700">{product.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;