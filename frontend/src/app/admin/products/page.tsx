'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Download, 
  Upload,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedStatus, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll({ 
        page: currentPage, 
        limit: itemsPerPage,
        status: 'all' // Get all products including drafts
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productsApi.getAll({ limit: 100 });
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(response.data.map((p: any) => p.category?.name).filter(Boolean))
      );
      setCategories(uniqueCategories.map(name => ({ name, value: name })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        typeof product.category === 'object' && 
        product.category?.name === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  };

  const handleStatusChange = async (productId: string, status: string) => {
    try {
      // In real implementation, update via API
      const updatedProducts = products.map(product =>
        product._id === productId 
          ? { ...product, status: status as 'draft' | 'active' | 'archived' } 
          : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        // In real implementation, delete via API
        const updatedProducts = products.filter(product => product._id !== productId);
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to delete');
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        const updatedProducts = products.filter(
          product => !selectedProducts.includes(product._id)
        );
        setProducts(updatedProducts);
        setSelectedProducts([]);
      } catch (error) {
        console.error('Error deleting products:', error);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload size={18} />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={18} />
            Export
          </button>
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

        {/* Bulk actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
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
                <button className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                  <Check size={16} />
                  Mark as Active
                </button>
              </div>
              <button
                onClick={() => setSelectedProducts([])}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.images[0].alt}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${product.price.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`h-2 w-16 rounded-full ${
                          product.stock > 20 ? 'bg-green-100' :
                          product.stock > 5 ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          <div 
                            className={`h-full rounded-full ${
                              product.stock > 20 ? 'bg-green-600' :
                              product.stock > 5 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm">{product.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={product.status}
                        onChange={(e) => handleStatusChange(product._id, e.target.value)}
                        className={`text-sm rounded px-2 py-1 ${
                          product.status === 'active' ? 'bg-green-100 text-green-800' :
                          product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {typeof product.category === 'object' ? product.category.name : 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of{' '}
              <span className="font-medium">{filteredProducts.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;