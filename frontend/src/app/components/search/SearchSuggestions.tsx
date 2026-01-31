'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Clock, Tag, X } from 'lucide-react';
import { Product, Category } from '@/types';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'popular' | 'recent';
  product?: Product;
  category?: Category;
  count?: number;
}

interface SearchSuggestionsProps {
  query: string;
  suggestions: SearchSuggestion[];
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  onClearRecent?: () => void;
  isVisible: boolean;
  className?: string;
}

const SearchSuggestions = ({
  query,
  suggestions,
  onSuggestionClick,
  onClearRecent,
  isVisible,
  className
}: SearchSuggestionsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            onSuggestionClick(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onSuggestionClick]);

  if (!isVisible || suggestions.length === 0) return null;

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return <Search size={16} className="text-gray-400" />;
      case 'category':
        return <Tag size={16} className="text-blue-500" />;
      case 'popular':
        return <TrendingUp size={16} className="text-orange-500" />;
      case 'recent':
        return <Clock size={16} className="text-gray-500" />;
      default:
        return <Search size={16} className="text-gray-400" />;
    }
  };

  const getSuggestionPrefix = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'popular':
        return '🔥';
      case 'recent':
        return '🕒';
      case 'category':
        return '📁';
      default:
        return '';
    }
  };

  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  const suggestionOrder: SearchSuggestion['type'][] = ['product', 'category', 'popular', 'recent'];

  return (
    <div
      ref={suggestionRef}
      className={cn(
        "absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto",
        className
      )}
    >
      {suggestionOrder.map(type => {
        const typeSuggestions = groupedSuggestions[type];
        if (!typeSuggestions || typeSuggestions.length === 0) return null;

        return (
          <div key={type}>
            {/* Section Header */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {type === 'product' && 'Products'}
                  {type === 'category' && 'Categories'}
                  {type === 'popular' && 'Popular Searches'}
                  {type === 'recent' && 'Recent Searches'}
                </span>
                {type === 'recent' && onClearRecent && (
                  <button
                    onClick={onClearRecent}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X size={12} />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Suggestions */}
            {typeSuggestions.map((suggestion, index) => {
              const globalIndex = suggestions.indexOf(suggestion);
              const isSelected = selectedIndex === globalIndex;

              return (
                <button
                  key={suggestion.id}
                  onClick={() => onSuggestionClick(suggestion)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors",
                    isSelected && "bg-blue-50"
                  )}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getSuggestionIcon(suggestion.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getSuggestionPrefix(suggestion) && (
                        <span className="text-sm">
                          {getSuggestionPrefix(suggestion)}
                        </span>
                      )}
                      <span className="text-sm text-gray-900 truncate">
                        {suggestion.text}
                      </span>
                    </div>

                    {/* Additional Info */}
                    {suggestion.type === 'product' && suggestion.product && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          ${suggestion.product.price.amount.toFixed(2)}
                        </span>
                        {suggestion.product.stock > 0 ? (
                          <span className="text-xs text-green-600">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-600">Out of Stock</span>
                        )}
                      </div>
                    )}

                    {suggestion.type === 'category' && suggestion.category && (
                      <span className="text-xs text-gray-500">
                        {suggestion.category.productCount || 0} products
                      </span>
                    )}

                    {suggestion.count && (
                      <span className="text-xs text-gray-500">
                        {suggestion.count} searches
                      </span>
                    )}
                  </div>

                  {/* Arrow for selection */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        );
      })}

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
          <span>{suggestions.length} suggestions</span>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;
export type { SearchSuggestion };