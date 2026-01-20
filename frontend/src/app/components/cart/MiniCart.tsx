'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Cart } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MiniCartProps {
  cart: Cart | null;
  isLoading?: boolean;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  className?: string;
}

const MiniCart = ({
  cart,
  isLoading = false,
  onUpdateQuantity,
  onRemoveItem,
  className
}: MiniCartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const itemCount = cart?.items.length || 0;
  const totalAmount = cart?.subtotal || 0;

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggleCart = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleQuantityChange = async (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      await onUpdateQuantity?.(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await onRemoveItem?.(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <>
      {/* Cart Button */}
      <button
        ref={buttonRef}
        onClick={handleToggleCart}
        className={cn(
          "relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg",
          className
        )}
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <ShoppingCart size={20} />

        {/* Item count badge */}
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center min-w-[1.5rem]">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div
          ref={cartRef}
          className={cn(
            "absolute top-16 right-0 w-96 max-h-[80vh] bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden",
            isAnimating && "animate-in slide-in-from-top-2"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Shopping Cart ({itemCount})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Content */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cart && cart.items.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {cart.items.slice(0, 5).map((item) => {
                  const product = item.productId && typeof item.productId !== 'string' ? item.productId : null;
                  const primaryImage = product?.images?.find(img => img.isPrimary) || product?.images?.[0];

                  return (
                    <div key={item._id} className="p-4 hover:bg-gray-50">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                            {primaryImage ? (
                              <Image
                                src={primaryImage.url}
                                alt={primaryImage.alt || product?.title || 'Product'}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs text-gray-400">No img</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product?.title || 'Product'}
                          </h4>
                          <p className="text-xs text-gray-600">
                            ${item.unitPrice.toFixed(2)} × {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            ${ (item.unitPrice * item.quantity).toFixed(2) }
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => handleRemoveItem(item._id!)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => handleQuantityChange(item._id!, item.quantity, -1)}
                              disabled={item.quantity <= 1}
                              className="px-1 py-0.5 hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 py-0.5 text-xs min-w-[1.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id!, item.quantity, 1)}
                              className="px-1 py-0.5 hover:bg-gray-50"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Show more items indicator */}
                {cart.items.length > 5 && (
                  <div className="p-4 text-center text-sm text-gray-600">
                    And {cart.items.length - 5} more item{cart.items.length - 5 !== 1 ? 's' : ''}...
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-900">Total:</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <div className="space-y-2">
                <Link href="/cart">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    View Full Cart
                  </Button>
                </Link>

                <Link href="/checkout">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MiniCart;