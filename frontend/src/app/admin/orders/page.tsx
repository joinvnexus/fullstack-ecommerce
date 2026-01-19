'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye } from 'lucide-react';
import { adminApi } from '@/lib/api/adminApi';
import { AdminTable, Column } from '../components/AdminTable';
import { StatusBadge } from '../components/StatusBadge';

interface Order {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  totals: {
    grandTotal: number;
  };
  status: string;
  payment: {
    status: string;
  };
  createdAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

  const itemsPerPage = 20;

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.orders.getAll({
        limit: itemsPerPage,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        // search: searchTerm || undefined, // TODO: Add search functionality
        // sort: 'createdAt',
        // order: 'desc'
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (order: Order, newStatus: string) => {
    if (confirm(`Are you sure you want to change order status to ${newStatus}?`)) {
      try {
        await adminApi.orders.updateStatus(order._id, newStatus);
        setOrders(orders.map(o =>
          o._id === order._id ? { ...o, status: newStatus } : o
        ));
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
      }
    }
  };

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      header: 'Order Number',
      render: (value) => (
        <div className="font-medium text-blue-600">
          {value}
        </div>
      ),
    },
    {
      key: 'userId',
      header: 'Customer',
      render: (value) => (
        <div>
          <div className="font-medium">{value?.name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{value?.email || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'totals',
      header: 'Total',
      render: (value) => `৳${value?.grandTotal?.toLocaleString() || '0'}`,
    },
    {
      key: 'status',
      header: 'Order Status',
      render: (value, item) => (
        <select
          value={value}
          onChange={(e) => handleStatusUpdate(item, e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (value) => <StatusBadge status={value?.status || 'pending'} />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('all');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <AdminTable
        data={orders}
        columns={columns}
        loading={loading}
        onView={(order) => window.location.href = `/admin/orders/${order._id}`}
        emptyMessage="No orders found"
      />

      {/* Bulk actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium">
                {selectedOrders.length} order(s) selected
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;