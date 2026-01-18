'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  CreditCard,
  Truck,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { adminApi, DashboardStats } from '@/lib/api/adminApi';
import { StatusBadge } from './components/StatusBadge';

// Install recharts
// npm install recharts

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminApi.dashboard.getStats();
      const dashboardData: DashboardStats = response.data;

      setStats({
        totalRevenue: dashboardData.stats.totalRevenue,
        totalOrders: dashboardData.stats.totalOrders,
        totalCustomers: dashboardData.stats.totalCustomers,
        totalProducts: dashboardData.stats.totalProducts,
        pendingOrders: 0, // TODO: Calculate from orders data
        lowStockProducts: 0, // TODO: Calculate from products data
      });

      setRecentOrders(dashboardData.recentOrders || []);
      setTopProducts(dashboardData.topProducts || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Sales data for chart
  const salesData = [
    { month: 'Jan', revenue: 4000, orders: 24 },
    { month: 'Feb', revenue: 3000, orders: 13 },
    { month: 'Mar', revenue: 5000, orders: 28 },
    { month: 'Apr', revenue: 2780, orders: 19 },
    { month: 'May', revenue: 1890, orders: 12 },
    { month: 'Jun', revenue: 2390, orders: 18 },
    { month: 'Jul', revenue: 3490, orders: 25 },
  ];

  // Order status data for pie chart
  const orderStatusData = [
    { name: 'Delivered', value: 65, color: '#10B981' },
    { name: 'Processing', value: 20, color: '#3B82F6' },
    { name: 'Pending', value: 10, color: '#F59E0B' },
    { name: 'Cancelled', value: 5, color: '#EF4444' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp size={14} className="mr-1" />
                <span>12.5% from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp size={14} className="mr-1" />
                <span>8.2% from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp size={14} className="mr-1" />
                <span>5.7% from last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
              <div className="text-sm text-gray-600 mt-1">Active items</div>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              <div className="text-sm text-gray-600 mt-1">Need attention</div>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold">{stats.lowStockProducts}</p>
              <div className="text-sm text-gray-600 mt-1">Need restock</div>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue & Orders Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {order.orderNumber || order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.userId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ৳{order.totals?.grandTotal?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Top Selling Products</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product._id || product.title || index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-gray-700">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{product.title || product.name || 'Unknown Product'}</div>
                      <div className="text-sm text-gray-500">
                        {product.stock ? `${product.stock} units in stock` : 'Stock info unavailable'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      ৳{product.price?.amount ? product.price.amount.toLocaleString() : 'N/A'}
                    </div>
                    <div className="text-sm text-green-600">Active</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="h-5 w-5 text-blue-600" />
            <span>Add New Product</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Truck className="h-5 w-5 text-green-600" />
            <span>Process Orders</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <span>View Payments</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-5 w-5 text-orange-600" />
            <span>Manage Customers</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;