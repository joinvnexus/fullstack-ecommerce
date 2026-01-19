'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { adminApi } from '@/lib/api/adminApi';
import { AdminTable, Column } from '../components/AdminTable';
import { StatusBadge } from '../components/StatusBadge';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
}

const CustomersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('customer');

  const itemsPerPage = 20;

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.users.getAll({
        limit: itemsPerPage,
        role: selectedRole !== 'all' ? selectedRole : undefined,
        search: searchTerm || undefined,
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (user: User, newRole: string) => {
    if (confirm(`Are you sure you want to change user role to ${newRole}?`)) {
      try {
        await adminApi.users.updateRole(user._id, newRole);
        setUsers(users.map(u =>
          u._id === user._id ? { ...u, role: newRole } : u
        ));
      } catch (error) {
        console.error('Error updating user role:', error);
        alert('Failed to update user role');
      }
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (value, item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'role',
      header: 'Role',
      render: (value, item) => (
        <select
          value={value}
          onChange={(e) => handleRoleUpdate(item, e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'customer', label: 'Customers' },
    { value: 'admin', label: 'Admins' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
          <p className="text-gray-600">Manage customer accounts</p>
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRole('customer');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <AdminTable
        data={users}
        columns={columns}
        loading={loading}
        emptyMessage="No users found"
      />
    </div>
  );
};

export default CustomersPage;