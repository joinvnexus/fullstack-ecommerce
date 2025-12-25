'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  className?: string;
  showLabel?: boolean;
}

const WishlistButton = ({
  productId,
  productName,
  size = 'md',
  variant = 'icon',
  showLabel = false,
  className = '',
}: WishlistButtonProps) => {
  const { user } = useAuth();
  const { 
    toggleProductInWishlist, 
    isProductInWishlist,
    getProductWishlistStatus 
  } = useWishlist();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const isInWishlist = isProductInWishlist(productId);
  const wishlistStatus = getProductWishlistStatus(productId);

  const handleClick = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleProductInWishlist(productId);
      
      if (result.action === 'added') {
        // Show success message
        console.log(`Added ${productName || 'product'} to ${result.wishlistName}`);
      } else if (result.action === 'removed') {
        // Show removed message
        console.log(`Removed from ${result.wishlistName}`);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (variant === 'button') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
            isInWishlist
              ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          } ${className}`}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={iconSizes[size]}
            className={isInWishlist ? 'fill-red-500' : ''}
          />
          {showLabel && (
            <span className="text-sm font-medium">
              {isInWishlist ? 'Saved' : 'Save'}
            </span>
          )}
        </button>

        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-2">Login Required</h3>
              <p className="text-gray-600 mb-4">
                Please login to add items to your wishlist.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`flex items-center justify-center rounded-full border transition-all hover:scale-105 ${
          sizeClasses[size]
        } ${
          isInWishlist
            ? 'bg-red-50 border-red-200 text-red-500'
            : 'bg-white border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-200'
        } ${className}`}
        title={
          isInWishlist
            ? `Remove from ${wishlistStatus.wishlistName}`
            : 'Add to wishlist'
        }
      >
        <Heart
          size={iconSizes[size]}
          className={isInWishlist ? 'fill-red-500' : ''}
        />
      </button>

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Login Required</h3>
            <p className="text-gray-600 mb-4">
              Please login to add items to your wishlist.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistButton;