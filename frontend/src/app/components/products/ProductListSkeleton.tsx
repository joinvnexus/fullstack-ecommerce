import React from 'react';

interface ProductListSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
  className?: string;
}

/**
 * Grid view skeleton - matches ProductCard grid layout
 */
const GridSkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200 w-full"></div>
      
      <div className="p-4">
        {/* Brand placeholder */}
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        
        {/* Title placeholder */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        
        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
          <div className="h-3 bg-gray-200 rounded w-12 ml-2"></div>
        </div>
        
        {/* Price and button placeholder */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * List view skeleton - matches ProductCard list layout
 */
const ListSkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Image placeholder */}
        <div className="md:w-64 lg:w-72 h-48 md:h-auto bg-gray-200"></div>
        
        <div className="flex-1 p-6">
          {/* Title placeholder */}
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          
          {/* Brand placeholder */}
          <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
          
          {/* Description lines */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          {/* Rating placeholder */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
            <div className="h-3 bg-gray-200 rounded w-16 ml-2"></div>
          </div>
          
          {/* Price placeholder */}
          <div className="h-7 bg-gray-200 rounded w-24 mb-4"></div>
        </div>
        
        {/* Action button placeholder */}
        <div className="p-6 flex md:flex-col items-center justify-center gap-3">
          <div className="h-12 w-full md:w-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

const ProductListSkeleton: React.FC<ProductListSkeletonProps> = ({
  count = 12,
  viewMode = 'grid',
  className = '',
}) => {
  const SkeletonCard = viewMode === 'list' ? ListSkeletonCard : GridSkeletonCard;

  return (
    <div className={className}>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(count)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {[...Array(count)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListSkeleton;
