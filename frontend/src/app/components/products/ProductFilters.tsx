'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categorySlug: string) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  selectedRating: number;
  onRatingChange: (rating: number) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  onReset: () => void;
  onClose?: () => void;
  isMobile?: boolean;
  className?: string;
}

const ProductFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  selectedBrands,
  onBrandsChange,
  selectedRating,
  onRatingChange,
  inStockOnly,
  onInStockChange,
  onReset,
  onClose,
  isMobile = false,
  className
}: ProductFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    brands: true,
    rating: true,
    availability: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Dell', 'HP']; // Mock data

  return (
    <div className={cn("bg-white rounded-lg shadow-md p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {isMobile && onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Categories</h3>
            {expandedSections.categories ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>

          {expandedSections.categories && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              <button
                onClick={() => onCategoryChange('')}
                className={cn(
                  "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  selectedCategory === ''
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => onCategoryChange(category.slug)}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    selectedCategory === category.slug
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {category.name}
                  {category.productCount && (
                    <span className="text-gray-500 ml-2">({category.productCount})</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Price Range</h3>
            {expandedSections.price ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>

          {expandedSections.price && (
            <div className="mt-3 space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => onPriceChange(e.target.value, maxPrice)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    min="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={maxPrice}
                    onChange={(e) => onPriceChange(minPrice, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Brands</h3>
            {expandedSections.brands ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>

          {expandedSections.brands && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onBrandsChange([...selectedBrands, brand]);
                      } else {
                        onBrandsChange(selectedBrands.filter(b => b !== brand));
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Rating</h3>
            {expandedSections.rating ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>

          {expandedSections.rating && (
            <div className="mt-3 space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => onRatingChange(rating)}
                  className={cn(
                    "flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    selectedRating === rating
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('availability')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Availability</h3>
            {expandedSections.availability ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>

          {expandedSections.availability && (
            <div className="mt-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={inStockOnly}
                  onCheckedChange={onInStockChange}
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          )}
        </div>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full"
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;