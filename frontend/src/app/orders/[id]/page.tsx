'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, CheckCircle, Clock, Truck, Printer, Download } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';

const OrderDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await ordersApi.getOrder(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const printOrder = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Order header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order.orderNumber}
                </h1>
                <p className="mt-1 text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={printOrder}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download className="mr-2 h-4 w-4" />
                  Invoice
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order details */}
              <div className="lg:col-span-2">
                {/* Order status */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Order Status</h2>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      order.status === 'pending' ? 'bg-yellow-50' :
                      order.status === 'processing' ? 'bg-blue-50' :
                      order.status === 'shipped' ? 'bg-purple-50' :
                      order.status === 'delivered' ? 'bg-green-50' :
                      'bg-red-50'
                    }`}>
                      {order.status === 'pending' && <Clock className="h-5 w-5 text-yellow-600" />}
                      {order.status === 'processing' && <Package className="h-5 w-5 text-blue-600" />}
                      {order.status === 'shipped' && <Truck className="h-5 w-5 text-purple-600" />}
                      {order.status === 'delivered' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      <span className="font-medium capitalize">{order.status}</span>
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <p className="text-sm text-gray-600">Tracking Number</p>
                        <p className="font-medium">{order.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order items */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            ${item.unitPrice.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Billing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <p className="font-medium">{order.shippingAddress.street}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
                      <p className="text-gray-600">Phone: {order.shippingAddress.phone}</p>
                      <p className="text-gray-600">Email: {order.shippingAddress.email}</p>
                    </div>
                  </div>

                  {order.billingAddress && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <p className="font-medium">{order.billingAddress.street}</p>
                        <p className="text-gray-600">
                          {order.billingAddress.city}, {order.billingAddress.state}{' '}
                          {order.billingAddress.zipCode}
                        </p>
                        <p className="text-gray-600">{order.billingAddress.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${order.totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>${order.totals.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${order.totals.tax.toFixed(2)}</span>
                    </div>
                    {order.totals.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${order.totals.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${order.totals.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-12 bg-gray-200 rounded"></div>
                        <span className="text-gray-700 capitalize">{order.payment.provider}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Status: <span className="capitalize">{order.payment.status}</span>
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Shipping Method</h3>
                      <p className="text-gray-700">{order.shippingMethod.name}</p>
                      <p className="text-sm text-gray-600">
                        Estimated delivery: {order.shippingMethod.estimatedDays} business days
                      </p>
                    </div>

                    {order.notes && (
                      <div>
                        <h3 className="font-medium mb-2">Order Notes</h3>
                        <p className="text-gray-600">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;