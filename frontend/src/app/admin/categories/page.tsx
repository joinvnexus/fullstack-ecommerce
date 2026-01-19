'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import { adminApi } from '@/lib/api/adminApi';
import { AdminTable, Column } from '../components/AdminTable';

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: {
    _id: string;
    name: string;
  };
  children: Array<{
    _id: string;
    name: string;
  }>;
  sortOrder: number;
  createdAt: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState<string>('all');

  const itemsPerPage = 20;

  useEffect(() => {
    fetchCategories();
  }, [searchTerm, selectedParent]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminApi.categories.getAll({
        limit: itemsPerPage,
        parent: selectedParent !== 'all' ? selectedParent : undefined,
        search: searchTerm || undefined,
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await adminApi.categories.delete(category._id);
        setCategories(categories.filter(c => c._id !== category._id));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    { key: 'slug', header: 'Slug' },
    {
      key: 'parent',
      header: 'Parent',
      render: (value) => value?.name || 'Root',
    },
    {
      key: 'children',
      header: 'Subcategories',
      render: (value) => `${value?.length || 0} items`,
    },
    { key: 'sortOrder', header: 'Sort Order' },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const parentOptions = [
    { value: 'all', label: 'All Categories' },
    { value: '', label: 'Root Categories' },
    ...categories
      .filter(cat => cat.parent === null)
      .map(cat => ({ value: cat._id, label: cat.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Category
          </Link>
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
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Parent filter */}
          <select
            value={selectedParent}
            onChange={(e) => setSelectedParent(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {parentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedParent('all');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <AdminTable
        data={categories}
        columns={columns}
        loading={loading}
        onEdit={(category) => window.location.href = `/admin/categories/${category._id}`}
        onDelete={handleDelete}
        emptyMessage="No categories found"
      />
    </div>
  );
};

export default CategoriesPage;