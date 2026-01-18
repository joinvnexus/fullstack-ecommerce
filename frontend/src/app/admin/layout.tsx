'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    permission: null // Everyone can see dashboard
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    href: '/admin/products',
    permission: 'products.read',
    subItems: [
      { label: 'All Products', href: '/admin/products', permission: 'products.read' },
      { label: 'Add New', href: '/admin/products/new', permission: 'products.create' },
      { label: 'Categories', href: '/admin/categories', permission: 'products.read' },
    ]
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingBag,
    href: '/admin/orders',
    permission: 'orders.read'
  },
  {
    id: 'users',
    label: 'Customers',
    icon: Users,
    href: '/admin/customers',
    permission: 'customers.read'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/admin/analytics',
    permission: 'analytics.read'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings',
    permission: 'settings.update'
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    // Check if user is admin
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login?redirect=' + encodeURIComponent(pathname));
    }

    // Set active menu based on path
    const currentMenu = menuItems.find(item => 
      pathname.startsWith(item.href)
    );
    if (currentMenu) {
      setActiveMenu(currentMenu.id);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="text-lg font-semibold">Admin Dashboard</div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 lg:static lg:inset-auto lg:z-auto`}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <div className="text-lg font-bold">ShopEasy Admin</div>
                  <div className="text-xs text-gray-400">Dashboard v1.0</div>
                </div>
              </Link>
            </div>

            {/* User info */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {menuItems
                  .filter(item => !item.permission || hasPermission(item.permission.split('.')[0] as any, item.permission.split('.')[1] as any))
                  .map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setActiveMenu(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        activeMenu === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </div>
                      {item.subItems && (
                        <ChevronRight size={16} />
                      )}
                    </Link>

                    {/* Sub items */}
                    {item.subItems && activeMenu === item.id && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.subItems
                          .filter(subItem => !subItem.permission || hasPermission(subItem.permission.split('.')[0] as any, subItem.permission.split('.')[1] as any))
                          .map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center px-4 py-2 rounded text-sm transition-colors ${
                                pathname === subItem.href
                                  ? 'text-blue-400'
                                  : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
              <div className="space-y-3">
                <Link
                  href="/"
                  className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                >
                  <Home size={18} />
                  <span>Back to Store</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-red-300 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {menuItems.find(m => m.id === activeMenu)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-gray-600">
                    Welcome back, {user.name}!
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="hidden md:block">
                    <div className="text-sm text-gray-600">
                      Last login: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}