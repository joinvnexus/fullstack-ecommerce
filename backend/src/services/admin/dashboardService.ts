import Order from '../../models/Order.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';

export const getDashboardStats = async () => {
  const [totalRevenue, totalOrders, totalCustomers, totalProducts] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $in: ['processing', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totals.grandTotal' } } }
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ status: 'active' }),
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'name email')
    .select('orderNumber status totals.grandTotal createdAt');

  // Top products
  const topProducts = await Product.aggregate([
    { $match: { status: 'active' } },
    { $sample: { size: 5 } },
    { $project: { title: 1, price: 1, stock: 1 } }
  ]);

  return {
    success: true,
    data: {
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        totalCustomers,
        totalProducts,
      },
      recentOrders,
      topProducts,
    },
  };
};