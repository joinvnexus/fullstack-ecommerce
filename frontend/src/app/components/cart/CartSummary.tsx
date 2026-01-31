'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, Shield, RefreshCw, CreditCard, Gift, Tag } from 'lucide-react';
import { Cart } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartSummaryProps {
  cart: Cart;
  onApplyDiscount?: (code: string) => void;
  onRemoveDiscount?: () => void;
  showCheckoutButton?: boolean;
  checkoutUrl?: string;
  className?: string;
}

const CartSummary = ({
  cart,
  onApplyDiscount,
  onRemoveDiscount,
  showCheckoutButton = true,
  checkoutUrl = '/checkout',
  className
}: CartSummaryProps) => {
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Calculate shipping cost (mock logic)
  const calculateShipping = (subtotal: number) => {
    return subtotal >= 50 ? 0 : 9.99;
  };

  // Calculate tax (mock logic - 8.5% for this example)
  const calculateTax = (subtotal: number, shipping: number) => {
    return (subtotal + shipping) * 0.085;
  };

  const shipping = calculateShipping(cart.subtotal);
  const tax = calculateTax(cart.subtotal, shipping);
  const finalTotal = cart.subtotal + shipping + tax - cart.discount;

  useEffect(() => {
    // Update cart totals when calculations change
    // This would typically be handled by the cart store
  }, [shipping, tax, finalTotal]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    try {
      setIsApplyingDiscount(true);
      await onApplyDiscount?.(discountCode);
      setDiscountCode('');
    } catch (error) {
      console.error('Failed to apply discount:', error);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

      {/* Item count */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
        <span className="text-gray-600">
          {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
        </span>
        <span className="font-medium text-gray-900">
          {formatCurrency(cart.subtotal)}
        </span>
      </div>

      {/* Price breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>

        {cart.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(cart.discount)}</span>
          </div>
        )}
      </div>

      {/* Discount code */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter discount code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleApplyDiscount}
            disabled={!discountCode.trim() || isApplyingDiscount}
            size="sm"
            className="px-4"
          >
            {isApplyingDiscount ? 'Applying...' : 'Apply'}
          </Button>
        </div>
        {cart.discount > 0 && onRemoveDiscount && (
          <button
            onClick={onRemoveDiscount}
            className="text-xs text-red-600 hover:text-red-800 mt-2"
          >
            Remove discount
          </button>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between text-xl font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>
        {cart.subtotal < 50 && (
          <p className="text-sm text-gray-600 mt-1">
            Add {formatCurrency(50 - cart.subtotal)} more for free shipping
          </p>
        )}
      </div>

      {/* Checkout button */}
      {showCheckoutButton && (
        <Link href={checkoutUrl}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium">
            Proceed to Checkout
          </Button>
        </Link>
      )}

      {/* Trust indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Truck size={16} className="text-green-600" />
            <span>Free shipping on orders over $50</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield size={16} className="text-blue-600" />
            <span>Secure checkout with SSL encryption</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <RefreshCw size={16} className="text-purple-600" />
            <span>30-day return policy</span>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-700 mb-2">Accepted Payment Methods</p>
          <div className="flex gap-2">
            {/* Mock payment method icons */}
            <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
              Visa
            </div>
            <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
              MC
            </div>
            <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
              Amex
            </div>
            <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
              PayPal
            </div>
          </div>
        </div>

        {/* Gift options */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
            <Gift size={16} />
            <span>Add gift message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;