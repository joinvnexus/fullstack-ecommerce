'use client';

import { useState } from 'react';
import { Smartphone, AlertCircle } from 'lucide-react';

interface BkashCheckoutProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const BkashCheckout = ({ orderId, amount, onSuccess, onError }: BkashCheckoutProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create bKash payment
      const response = await fetch('/api/payments/bkash/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId, amount }),
      });

      const { data, success } = await response.json();

      if (!success) {
        throw new Error('Failed to create bKash payment');
      }

      // Redirect to bKash payment page
      window.location.href = data.bkashURL;
    } catch (err: any) {
      setError(err.message);
      onError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Smartphone className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-semibold">bKash Payment</h3>
      </div>

      <div className="mb-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 mb-1">Payment Instructions</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>1. You will be redirected to bKash</li>
                <li>2. Enter your bKash PIN to complete payment</li>
                <li>3. Return to this page after payment</li>
                <li>4. Payment will be verified automatically</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount to Pay</span>
            <div>
              <span className="text-2xl font-bold">৳{(amount * 85).toFixed(2)}</span>
              <span className="text-sm text-gray-500 ml-2">(${amount.toFixed(2)})</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Redirecting...' : 'Pay with bKash'}
      </button>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
            <div className="text-sm text-gray-600">Need bKash help?</div>
            <div className="font-medium">16247</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BkashCheckout;