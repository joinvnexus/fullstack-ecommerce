import React from 'react';

interface ProductDetailsSkeletonProps {
  className?: string;
}

const ProductDetailsSkeleton: React.FC<ProductDetailsSkeletonProps> = ({
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8 animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
            {/* Thumbnail placeholders */}
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Title */}
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>

            {/* Price */}
            <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>

            {/* Description lines */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
            </div>

            {/* Spacer */}
            <div className="h-8"></div>

            {/* Quantity selector skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>

            {/* Action buttons skeleton */}
            <div className="flex gap-4">
              <div className="h-12 flex-1 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 flex-1 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Features skeleton */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>

            {/* SKU/Category skeleton */}
            <div className="space-y-2 mt-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
