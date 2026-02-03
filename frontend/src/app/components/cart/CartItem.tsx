'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus, Heart } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedCartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onMoveToWishlist?: (itemId: string) => void;
  showVariants?: boolean;
  className?: string;
}

const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  showVariants = true,
  className
}: EnhancedCartItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const product = item.productId && typeof item.productId !== 'string' ? item.productId : null;
  const primaryImage = product?.images?.find(img => img.isPrimary) || product?.images?.[0];

  const handleQuantityChange = async (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    try {
      setIsUpdating(true);
      await onUpdateQuantity(item._id!, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (confirm('Are you sure you want to remove this item from cart?')) {
      try {
        await onRemove(item._id!);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    }
  };

  if (!product) {
    return (
      <div className={cn("p-6 border-b border-gray-200", className)}>
        <div className="text-center text-gray-500">
          Product information not available
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 border-b border-gray-200", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="relative h-24 w-24 rounded-md overflow-hidden bg-gray-100">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.title}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}

            {/* Stock status badge */}
            {product.stock === 0 && (
              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                Out
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {product.title}
              </h3>

              {/* Variant information */}
              {showVariants && item.variantId && (
                <div className="mt-1">
                  <span className="text-sm text-gray-600">
                    Variant: {item.variantId}
                  </span>
                </div>
              )}

              {/* SKU */}
              <p className="text-sm text-gray-500 mt-1">
                SKU: {product.sku}
              </p>

              {/* Unit Price */}
              <p className="text-sm text-gray-600 mt-1">
                Unit Price: ${item.unitPrice.toFixed(2)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              {onMoveToWishlist && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMoveToWishlist(item._id!)}
                  className="text-gray-400 hover:text-red-500"
                  title="Move to wishlist"
                >
                  <Heart size={16} />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-gray-400 hover:text-red-500"
                title="Remove from cart"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          {/* Quantity Controls and Price */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={item.quantity <= 1 || isUpdating}
                  className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={isUpdating}
                  className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Stock Information */}
              <div className="text-sm text-gray-600">
                {product.stock > 0 ? (
                  <span className={cn(
                    product.stock <= 5 && "text-orange-600 font-medium"
                  )}>
                    {product.stock} in stock
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of stock</span>
                )}
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </div>
              {item.quantity > 1 && (
                <div className="text-sm text-gray-500">
                  ${item.unitPrice.toFixed(2)} × {item.quantity}
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-800">
                ⚠️ Only {product.stock} left in stock. Order soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;