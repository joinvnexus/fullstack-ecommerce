'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Trash2 } from 'lucide-react';
import { adminApi, Product } from '@/lib/api/adminApi';
import { AdminTable, Column } from '../components/AdminTable';
import { StatusBadge } from '../components/StatusBadge';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);


  const itemsPerPage = 20;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchTerm, selectedStatus, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.products.getAll({
        limit: itemsPerPage,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        sort: 'createdAt',
        order: 'desc'
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminApi.products.getAll({ limit: 100 });
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(response.data.map((p: Product) => p.category?.name).filter(Boolean))
      );
      setCategories(uniqueCategories.map(name => ({ name, value: name })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };



  const handleDelete = async (product: Product) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await adminApi.products.delete(product._id);
        setProducts(products.filter(p => p._id !== product._id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to delete');
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        const productIds = selectedProducts.map(p => p._id);
        await adminApi.products.bulkUpdate({
          action: 'delete',
          productIds,
          data: {}
        });
        setProducts(products.filter(p => !productIds.includes(p._id)));
        setSelectedProducts([]);
      } catch (error) {
        console.error('Error deleting products:', error);
      }
    }
  };



  const columns: Column<Product>[] = [
    {
      key: 'title',
      header: 'Product',
      render: (value, item) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {item.images?.[0] ? (
              <img
                src={item.images[0].url}
                alt={item.images[0].alt}
                className="h-10 w-10 rounded object-cover"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{item.title}</div>
            <div className="text-sm text-gray-500 line-clamp-1">
              {item.description.substring(0, 50)}...
            </div>
          </div>
        </div>
      ),
    },
    { key: 'sku', header: 'SKU' },
    {
      key: 'price',
      header: 'Price',
      render: (value) => `৳${value.amount.toLocaleString()}`,
    },
    { key: 'stock', header: 'Stock' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'category',
      header: 'Category',
      render: (value) => value?.name || 'Uncategorized',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
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
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('all');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <AdminTable
        data={products}
        columns={columns}
        loading={loading}
        selectable={true}
        onSelectionChange={setSelectedProducts}
        onEdit={(product) => window.location.href = `/admin/products/edit/${product._id}`}
        onDelete={handleDelete}
        emptyMessage="No products found"
      />

      {/* Bulk actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium">
                {selectedProducts.length} product(s) selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;