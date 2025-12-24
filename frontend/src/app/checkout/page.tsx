'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Truck, Shield, Lock, Loader2, Smartphone, Globe } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { ordersApi, paymentsApi } from '@/lib/api';

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
    sameAsShipping: z.boolean(),
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
  paymentPhone: z.string().optional(), // For bKash/Nagad
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
  const [paymentStep, setPaymentStep] = useState<'order' | 'payment'>('order');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const shippingMethods = [
    { name: 'Standard Shipping', cost: 0, estimatedDays: 7 },
    { name: 'Express Shipping', cost: 10, estimatedDays: 2 },
    { name: 'Next Day Delivery', cost: 25, estimatedDays: 1 },
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
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      paymentMethod: 'card',
    },
  });

  const sameAsShipping = watch('billingAddress.sameAsShipping');
  const selectedShippingMethod = watch('shippingMethod');
  const selectedPaymentMethod = watch('paymentMethod');
  const paymentPhone = watch('paymentPhone');

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/login?redirect=/checkout');
    }
    fetchPaymentMethods();
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

  useEffect(() => {
    // Show phone input for bKash/Nagad
    setShowPhoneInput(selectedPaymentMethod === 'bkash' || selectedPaymentMethod === 'nagad');
  }, [selectedPaymentMethod]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await paymentsApi.getPaymentMethods();
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const createOrder = async (data: CheckoutFormData) => {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return false;
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
      const newOrder = response.data;
      setCreatedOrder(newOrder);
      setPaymentStep('payment');

      return true;
    } catch (error: any) {
      console.error('Order creation failed:', error);
      alert(error.message || 'Failed to create order. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const processPayment = async () => {
    if (!createdOrder) return;

    try {
      setIsSubmitting(true);

      const paymentData = {
        orderId: createdOrder._id,
        paymentMethod: selectedPaymentMethod,
        phone: paymentPhone,
      };

      const response = await paymentsApi.processPayment(paymentData);

      if (response.data.order.status === 'processing') {
        setOrderSuccess(true);
        useCartStore.getState().clearCart();
      } else {
        alert('Payment failed. Please try again or use a different payment method.');
      }
    } catch (error: any) {
      console.error('Payment processing failed:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentIcon = (methodId: string) => {
    switch (methodId) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'bkash':
      case 'nagad':
        return <Smartphone className="h-5 w-5" />;
      case 'paypal':
        return <Globe className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentInstructions = () => {
    switch (selectedPaymentMethod) {
      case 'card':
        return {
          title: 'Demo Card Payment',
          instructions: [
            'This is a demo payment system.',
            'No real money will be charged.',
            'Click "Complete Payment" to simulate successful payment.',
            'In production, this would integrate with Stripe or other payment gateways.',
          ],
        };
      case 'bkash':
        return {
          title: 'bKash Payment',
          instructions: [
            'Enter your bKash registered phone number.',
            'In real implementation, you would be redirected to bKash app.',
            'Complete payment in your bKash app.',
            'Return to this page after payment.',
          ],
        };
      case 'nagad':
        return {
          title: 'Nagad Payment',
          instructions: [
            'Enter your Nagad registered phone number.',
            'In real implementation, you would be redirected to Nagad app.',
            'Complete payment in your Nagad app.',
            'Return to this page after payment.',
          ],
        };
      case 'paypal':
        return {
          title: 'PayPal Payment',
          instructions: [
            'In real implementation, you would be redirected to PayPal.',
            'Login to your PayPal account.',
            'Complete the payment.',
            'Return to this page after payment.',
          ],
        };
      default:
        return { title: 'Payment', instructions: [] };
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    await createOrder(data);
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{selectedPaymentMethod}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => router.push(`/orders/${createdOrder._id}`)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  View Order Details
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
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

  if (paymentStep === 'payment' && createdOrder) {
    const instructions = getPaymentInstructions();

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <button
                onClick={() => setPaymentStep('order')}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Order Details
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                {getPaymentIcon(selectedPaymentMethod)}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{instructions.title}</h2>
                  <p className="text-gray-600">
                    Order #{createdOrder.orderNumber} • ${createdOrder.totals.grandTotal?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Secure Payment</h3>
              </div>
              <p className="text-blue-700">
                This is a demo payment system. No real money will be charged.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              
              <div className="space-y-6">
                {/* Phone input for bKash/Nagad */}
                {showPhoneInput && (
                  <div className="p-4 border border-gray-300 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedPaymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={paymentPhone || ''}
                      onChange={(e) => setValue('paymentPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter your {selectedPaymentMethod === 'bkash' ? 'bKash' : 'Nagad'} registered phone number
                    </p>
                  </div>
                )}

                {/* Instructions */}
                <div className="p-4 border border-gray-300 rounded-lg">
                  <h4 className="font-medium mb-3">Instructions:</h4>
                  <ul className="space-y-2 text-gray-600">
                    {instructions.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Demo Notice */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="text-yellow-600">⚠️</div>
                    <div>
                      <p className="font-medium text-yellow-800">Demo Mode</p>
                      <p className="text-sm text-yellow-600 mt-1">
                        This is a demonstration. No actual payment will be processed. 
                        Your order will be marked as "processing" for demo purposes.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentStep('order')}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={isSubmitting || (showPhoneInput && !paymentPhone)}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Complete ${selectedPaymentMethod === 'bkash' ? 'bKash' : selectedPaymentMethod === 'nagad' ? 'Nagad' : ''} Payment`
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold mb-4">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cart.items.length})</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${selectedShippingMethod.cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(cart.subtotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${createdOrder.totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
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
                  {/* ... Shipping Address fields (same as before) ... */}
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

                {/* ... Billing Address fields ... */}
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
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex flex-col p-4 border rounded-lg cursor-pointer ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            value={method.id}
                            {...register('paymentMethod')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="ml-3 flex items-center gap-2">
                            <span className="text-lg">{method.icon}</span>
                            <span className="font-medium">{method.name}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{method.description}</p>
                        <p className="mt-1 text-xs text-blue-600">{method.demoInfo}</p>
                      </label>
                    ))
                  ) : (
                    <div className="col-span-2 p-4 border border-gray-300 rounded-lg">
                      <p className="text-gray-600">Loading payment methods...</p>
                    </div>
                  )}
                </div>

                {/* Payment method specific info */}
                {selectedPaymentMethod === 'bkash' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <Smartphone size={16} />
                      <span className="font-medium">bKash Payment</span>
                    </div>
                    <p className="text-sm text-green-600">
                      You'll need to enter your bKash registered phone number on the next step.
                    </p>
                  </div>
                )}

                {selectedPaymentMethod === 'nagad' && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-700 mb-2">
                      <Smartphone size={16} />
                      <span className="font-medium">Nagad Payment</span>
                    </div>
                    <p className="text-sm text-purple-600">
                      You'll need to enter your Nagad registered phone number on the next step.
                    </p>
                  </div>
                )}

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">ℹ️</span>
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Demo Mode</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        All payments are simulated. No real money will be charged.
                      </p>
                    </div>
                  </div>
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
                    <p className="text-sm text-gray-600 mt-1">
                      Pay with {selectedPaymentMethod === 'card' ? 'Card' : 
                                selectedPaymentMethod === 'bkash' ? 'bKash' :
                                selectedPaymentMethod === 'nagad' ? 'Nagad' : 'PayPal'}
                    </p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Lock size={16} />
                    <span className="text-sm font-medium">Demo Checkout</span>
                  </div>
                  <p className="mt-1 text-xs text-blue-600">
                    No real payment will be processed. This is for demonstration purposes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
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