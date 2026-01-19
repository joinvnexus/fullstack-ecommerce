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
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-card px-4 py-3 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
          <div className="text-lg font-semibold">Admin Dashboard</div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 bg-card text-card-foreground border-r transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto lg:z-auto`}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <LayoutDashboard size={20} className="text-primary-foreground" />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <div className="text-lg font-bold">ShopEasy Admin</div>
                    <div className="text-xs text-muted-foreground">Dashboard v2.0</div>
                  </div>
                )}
              </Link>
            </div>

            {/* User info */}
            {!sidebarCollapsed && (
              <div className="p-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary-foreground">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </div>
            )}

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
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={20} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && item.subItems && (
                        <ChevronRight size={16} />
                      )}
                    </Link>

                    {/* Sub items */}
                    {!sidebarCollapsed && item.subItems && activeMenu === item.id && (
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
                                  ? 'text-primary'
                                  : 'text-muted-foreground hover:text-foreground'
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
            <div className="p-4 border-t space-y-2">
              {/* Collapse button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full"
              >
                {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              </Button>
              {!sidebarCollapsed && (
                <>
                  <Link
                    href="/"
                    className="flex items-center space-x-3 px-4 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                  >
                    <Home size={18} />
                    <span>Back to Store</span>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="flex items-center space-x-3 w-full justify-start text-destructive hover:bg-destructive/10"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="bg-card border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        {pathname !== '/admin' && (
                          <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              <BreadcrumbPage>
                                {menuItems.find(m => m.id === activeMenu)?.label || 'Page'}
                              </BreadcrumbPage>
                            </BreadcrumbItem>
                          </>
                        )}
                      </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl font-bold">
                      {menuItems.find(m => m.id === activeMenu)?.label || 'Dashboard'}
                    </h1>
                    <p className="text-muted-foreground">
                      Welcome back, {user.name}!
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Search */}
                  <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search..."
                      className="pl-10 w-64"
                    />
                  </div>
                  {/* Notifications */}
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  {/* Theme toggle */}
                  <ModeToggle />
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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}