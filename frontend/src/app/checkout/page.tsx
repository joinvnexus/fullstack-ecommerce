'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Truck, Shield, Lock } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { ordersApi } from '@/lib/api';

const checkoutSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
  }),
  billingAddress: z.object({
    sameAsShipping: z.boolean().default(true),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  shippingMethod: z.object({
    name: z.string(),
    cost: z.number(),
    estimatedDays: z.number(),
  }),
  paymentMethod: z.enum(['card', 'paypal', 'bkash', 'nagad']),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, isLoading: cartLoading } = useCartStore();
  const { user, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const shippingMethods = [
    { name: 'Standard Shipping', cost: 0, estimatedDays: 7 },
    { name: 'Express Shipping', cost: 10, estimatedDays: 2 },
    { name: 'Next Day Delivery', cost: 25, estimatedDays: 1 },
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'paypal', name: 'PayPal' },
    { id: 'bkash', name: 'bKash' },
    { id: 'nagad', name: 'Nagad' },
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        email: user?.email || '',
        phone: user?.phone || '',
      },
      shippingMethod: shippingMethods[0],
      billingAddress: {
        sameAsShipping: true,
      },
      paymentMethod: 'card',
    },
  });

  const sameAsShipping = watch('billingAddress.sameAsShipping');
  const selectedShippingMethod = watch('shippingMethod');

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (sameAsShipping) {
      setValue('billingAddress.street', '');
      setValue('billingAddress.city', '');
      setValue('billingAddress.state', '');
      setValue('billingAddress.country', '');
      setValue('billingAddress.zipCode', '');
    }
  }, [sameAsShipping, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        shippingAddress: data.shippingAddress,
        billingAddress: sameAsShipping ? undefined : data.billingAddress,
        shippingMethod: data.shippingMethod,
        notes: data.notes,
        guestId: cart.guestId,
      };

      const response = await ordersApi.create(orderData);
      setCreatedOrder(response.data);
      setOrderSuccess(true);

      // Clear cart after successful order
      useCartStore.getState().clearCart();

    } catch (error: any) {
      console.error('Order creation failed:', error);
      alert(error.message || 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">
              Please add items to your cart before checkout.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderSuccess && createdOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Order Confirmed!</h2>
            <p className="mt-2 text-gray-600">
              Your order has been successfully placed.
            </p>
            
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">{createdOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(createdOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">
                      ${createdOrder.totals.grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-blue-600">{createdOrder.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => router.push(`/orders/${createdOrder._id}`)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  View Order Details
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="text-blue-600" size={24} />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      {...register('shippingAddress.street')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.shippingAddress?.street && (
                      <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.street.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      {...register('shippingAddress.city')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.shippingAddress?.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      {...register('shippingAddress.state')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.shippingAddress?.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      {...register('shippingAddress.country')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.shippingAddress?.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.country.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      {...register('shippingAddress.zipCode')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.shippingAddress?.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.zipCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      {...register('shippingAddress.phone')}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.shippingAddress?.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      {...register('shippingAddress.email')}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.shippingAddress?.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="text-blue-600" size={24} />
                  <h2 className="text-xl font-semibold">Billing Address</h2>
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('billingAddress.sameAsShipping')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Same as shipping address</span>
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        {...register('billingAddress.street')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        {...register('billingAddress.city')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        {...register('billingAddress.state')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        {...register('billingAddress.country')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        {...register('billingAddress.zipCode')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Method</h2>
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.name}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                        selectedShippingMethod?.name === method.name
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          value={JSON.stringify(method)}
                          {...register('shippingMethod')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <span className="font-medium">{method.name}</span>
                          <p className="text-sm text-gray-500">
                            Estimated delivery: {method.estimatedDays} business days
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        {method.cost === 0 ? 'FREE' : `$${method.cost.toFixed(2)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-blue-600" size={24} />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        watch('paymentMethod') === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        value={method.id}
                        {...register('paymentMethod')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        {method.icon && <method.icon className="inline mr-2" size={20} />}
                        <span className="font-medium">{method.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Special instructions for your order..."
                />
              </div>
            </div>

            {/* Right column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                    <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      ${selectedShippingMethod?.cost?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ${(cart.subtotal * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>
                        ${
                          (
                            cart.subtotal + 
                            (selectedShippingMethod?.cost || 0) + 
                            (cart.subtotal * 0.1)
                          ).toFixed(2)
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Lock size={16} />
                    <span className="text-sm font-medium">Secure checkout</span>
                  </div>
                  <p className="mt-1 text-xs text-blue-600">
                    Your payment information is encrypted and secure.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                  By placing your order, you agree to our{' '}
                  <a href="/terms" className="text-blue-600 hover:text-blue-800">
                    Terms of Service
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;