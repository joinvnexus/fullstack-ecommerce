'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CreditCard,
  Truck,
  Shield,
  Lock,
  Loader2,
  Smartphone,
} from 'lucide-react';

import useCartStore from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { ordersApi } from '@/lib/api';

// ✅ Stripe component
import StripeCheckout from '../components/payments/StripeCheckout';

const checkoutSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    zipCode: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
  }),
  shippingMethod: z.object({
    name: z.string(),
    cost: z.number(),
    estimatedDays: z.number(),
  }),
  paymentMethod: z.enum(['stripe', 'bkash', 'nagad']),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const router = useRouter();
  const { cart } = useCartStore();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<'order' | 'payment'>('order');

  const shippingMethods = [
    { name: 'Standard Shipping', cost: 0, estimatedDays: 7 },
    { name: 'Express Shipping', cost: 10, estimatedDays: 2 },
  ];

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'stripe',
      shippingMethod: shippingMethods[0],
      shippingAddress: {
        email: user?.email || '',
        phone: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');
  const selectedShippingMethod = watch('shippingMethod');

  const totalAmount =
    cart.subtotal +
    selectedShippingMethod.cost +
    cart.subtotal * 0.1;

  // ✅ CREATE ORDER
  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);

      const res = await ordersApi.create({
        shippingAddress: data.shippingAddress,
        shippingMethod: data.shippingMethod,
        notes: data.notes,
      });

      setCreatedOrder(res.data);
      setPaymentStep('payment');
    } catch (err) {
      alert('Order creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= PAYMENT STEP =================
  if (paymentStep === 'payment' && createdOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold text-center">
            Pay for Order #{createdOrder.orderNumber}
          </h2>

          {/* ✅ STRIPE */}
          {selectedPaymentMethod === 'stripe' && (
            <StripeCheckout
              orderId={createdOrder._id}
              amount={totalAmount}
              onSuccess={() => {
                useCartStore.getState().clearCart();
                router.push(`/orders/${createdOrder._id}`);
              }}
              onError={(error: string) => alert(error)}
            />
          )}

          {/* ✅ BKASH */}
          {selectedPaymentMethod === 'bkash' && (
            <button
              onClick={() => alert('bKash demo payment success')}
              className="w-full bg-green-600 text-white py-3 rounded-md"
            >
              Pay with bKash
            </button>
          )}

          {/* ✅ NAGAD */}
          {selectedPaymentMethod === 'nagad' && (
            <button
              onClick={() => alert('Nagad demo payment success')}
              className="w-full bg-purple-600 text-white py-3 rounded-md"
            >
              Pay with Nagad
            </button>
          )}
        </div>
      </div>
    );
  }

  // ================= CHECKOUT FORM =================
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-6"
      >
        <h1 className="text-2xl font-bold">Checkout</h1>

        {/* PAYMENT METHOD */}
        <div>
          <h2 className="font-semibold mb-3">Payment Method</h2>

          <label className="flex items-center gap-2 mb-2">
            <input type="radio" value="stripe" {...register('paymentMethod')} />
            <CreditCard size={18} /> Stripe (Card)
          </label>

          <label className="flex items-center gap-2 mb-2">
            <input type="radio" value="bkash" {...register('paymentMethod')} />
            <Smartphone size={18} /> bKash
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" value="nagad" {...register('paymentMethod')} />
            <Smartphone size={18} /> Nagad
          </label>
        </div>

        {/* ORDER SUMMARY */}
        <div className="border-t pt-4">
          <p>Subtotal: ${cart.subtotal.toFixed(2)}</p>
          <p>Shipping: ${selectedShippingMethod.cost}</p>
          <p>Tax: ${(cart.subtotal * 0.1).toFixed(2)}</p>
          <p className="font-bold">Total: ${totalAmount.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-md"
        >
          {isSubmitting ? 'Creating Order...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
