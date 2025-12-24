'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle } from 'lucide-react';

interface StripeCheckoutProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripeCheckout = ({ orderId, amount, onSuccess, onError }: StripeCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create payment intent
      const response = await fetch('/api/payments/stripe/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const { data } = await response.json();

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      // 2. Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              // Add billing details if needed
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      onError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (paymentSuccess) {
    return (
      <div className="text-center p-6 border border-green-200 bg-green-50 rounded-lg">
        <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
        <p className="text-green-600">
          Your payment has been processed successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Credit/Debit Card</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-2xl font-bold">${amount.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Your payment is secured with Stripe
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>Secure payment</span>
            <span className="mx-2">•</span>
            <span>SSL encrypted</span>
          </div>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Accepted Cards</h4>
        <div className="flex gap-2">
          <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs font-bold">VISA</span>
          </div>
          <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs font-bold">MC</span>
          </div>
          <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs font-bold">AMEX</span>
          </div>
          <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs font-bold">DIS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;