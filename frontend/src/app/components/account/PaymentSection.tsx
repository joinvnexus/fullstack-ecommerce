'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
      <div className="text-center py-12">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Payment Methods</h3>
        <p className="mt-2 text-gray-600">
          This will show the saved card or bKash/Nagad number. Will be implemented later.
        </p>
      </div>
    </div>
  );
};

export default PaymentSection;