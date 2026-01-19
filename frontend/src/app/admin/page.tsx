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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { adminApi, DashboardStats } from '@/lib/api/adminApi';
import { StatusBadge, AdminStatsCard, ChartCard } from './components';

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
        <AdminStatsCard
          title="Total Revenue"
          value={`${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="blue"
          trend={{ value: 12.5, label: "12.5% from last month" }}
        />
        <AdminStatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="green"
          trend={{ value: 8.2, label: "8.2% from last month" }}
        />
        <AdminStatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="purple"
          trend={{ value: 5.7, label: "5.7% from last month" }}
        />
        <AdminStatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="yellow"
        />
        <AdminStatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={CreditCard}
          color="orange"
        />
        <AdminStatsCard
          title="Low Stock"
          value={stats.lowStockProducts}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <ChartCard title="Revenue & Orders Overview">
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
        </ChartCard>

        {/* Order Status Chart */}
        <ChartCard title="Order Status Distribution">
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
        </ChartCard>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <button className="text-sm text-primary hover:text-primary/80">
                View All
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order._id || order.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        {order.orderNumber || order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {order.userId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        ৳{order.totals?.grandTotal?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Selling Products</CardTitle>
              <button className="text-sm text-primary hover:text-primary/80">
                View All
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product._id || product.title || index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <span className="font-bold text-muted-foreground">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{product.title || product.name || 'Unknown Product'}</div>
                      <div className="text-sm text-muted-foreground">
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
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center justify-center space-x-2 p-4">
              <Package className="h-5 w-5 text-blue-600" />
              <span>Add New Product</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center space-x-2 p-4">
              <Truck className="h-5 w-5 text-green-600" />
              <span>Process Orders</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center space-x-2 p-4">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <span>View Payments</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center space-x-2 p-4">
              <Users className="h-5 w-5 text-orange-600" />
              <span>Manage Customers</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;