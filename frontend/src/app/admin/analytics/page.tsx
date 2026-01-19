'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Calendar,
  BarChart3,
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
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { AdminStatsCard } from '../components/AdminStatsCard';
import { adminApi } from '@/lib/api/adminApi';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 245000,
    totalOrders: 1234,
    totalCustomers: 567,
    conversionRate: 3.2,
    averageOrderValue: 198.50,
    topProducts: [
      { name: 'Product A', sales: 245 },
      { name: 'Product B', sales: 189 },
      { name: 'Product C', sales: 156 },
      { name: 'Product D', sales: 134 },
      { name: 'Product E', sales: 98 },
    ],
    revenueByMonth: [
      { month: 'Jan', revenue: 24000, orders: 120 },
      { month: 'Feb', revenue: 28000, orders: 140 },
      { month: 'Mar', revenue: 32000, orders: 160 },
      { month: 'Apr', revenue: 35000, orders: 175 },
      { month: 'May', revenue: 38000, orders: 190 },
      { month: 'Jun', revenue: 42000, orders: 210 },
      { month: 'Jul', revenue: 45000, orders: 225 },
      { month: 'Aug', revenue: 48000, orders: 240 },
      { month: 'Sep', revenue: 52000, orders: 260 },
      { month: 'Oct', revenue: 55000, orders: 275 },
      { month: 'Nov', revenue: 58000, orders: 290 },
      { month: 'Dec', revenue: 62000, orders: 310 },
    ],
    customerAcquisition: [
      { month: 'Jan', newCustomers: 45 },
      { month: 'Feb', newCustomers: 52 },
      { month: 'Mar', newCustomers: 48 },
      { month: 'Apr', newCustomers: 61 },
      { month: 'May', newCustomers: 55 },
      { month: 'Jun', newCustomers: 67 },
      { month: 'Jul', newCustomers: 72 },
      { month: 'Aug', newCustomers: 68 },
      { month: 'Sep', newCustomers: 75 },
      { month: 'Oct', newCustomers: 79 },
      { month: 'Nov', newCustomers: 82 },
      { month: 'Dec', newCustomers: 88 },
    ],
    orderStatusDistribution: [
      { name: 'Delivered', value: 68, color: '#10B981' },
      { name: 'Processing', value: 20, color: '#3B82F6' },
      { name: 'Shipped', value: 8, color: '#F59E0B' },
      { name: 'Cancelled', value: 4, color: '#EF4444' },
    ],
    categoryPerformance: [
      { category: 'Electronics', revenue: 125000, percentage: 51 },
      { category: 'Clothing', revenue: 65000, percentage: 27 },
      { category: 'Home & Kitchen', revenue: 35000, percentage: 14 },
      { category: 'Books', revenue: 20000, percentage: 8 },
    ],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // In real implementation, fetch from API
      // const response = await adminApi.analytics.getData();
      // setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Track your business performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Last 12 months</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          title="Total Revenue"
          value={`৳${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          trend={{ value: 12.5, label: 'from last month' }}
        />
        <AdminStatsCard
          title="Total Orders"
          value={analyticsData.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          color="blue"
          trend={{ value: 8.2, label: 'from last month' }}
        />
        <AdminStatsCard
          title="Total Customers"
          value={analyticsData.totalCustomers.toLocaleString()}
          icon={Users}
          color="purple"
          trend={{ value: 15.3, label: 'from last month' }}
        />
        <AdminStatsCard
          title="Conversion Rate"
          value={`${analyticsData.conversionRate}%`}
          icon={TrendingUp}
          color="orange"
          trend={{ value: 2.1, label: 'from last month' }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Orders Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue & Orders Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `৳${(value || 0).toLocaleString()}` : (value || 0),
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.orderStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.orderStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Acquisition */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Acquisition</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.customerAcquisition}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Bar dataKey="newCustomers" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.categoryPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="category" type="category" stroke="#666" width={100} />
                <Tooltip formatter={(value) => [`৳${(value || 0).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <div className="space-y-4">
          {analyticsData.topProducts.map((product, index) => (
            <div key={product.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                  {index + 1}
                </div>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="text-sm text-gray-600">
                {product.sales} sales
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;