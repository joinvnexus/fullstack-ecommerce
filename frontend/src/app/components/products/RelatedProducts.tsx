'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
  className?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const RelatedProducts = ({
  products,
  title = "Related Products",
  className,
  showViewAll = false,
  onViewAll
}: RelatedProductsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = isExpanded ? products : products.slice(0, 4);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        {showViewAll && products.length > 4 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-green-600 hover:text-green-700"
            onClick={onViewAll}
          >
            View All
            <ArrowRight size={16} className="ml-2" />
          </Button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            viewMode="grid"
          />
        ))}
      </div>

      {/* Show More/Less Button */}
      {products.length > 4 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            {isExpanded ? 'Show Less' : `Show ${products.length - 4} More Products`}
          </Button>
        </div>
      )}

      {/* Related Products Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-green-900">
              Similar Products
            </p>
            <p className="text-xs text-green-700">
              Products from the same category that you might like
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
