'use client';

import React from 'react';
import { User, Mail, Phone, MapPin, Package, CreditCard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AccountLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  children,
  activeTab,
  onTabChange
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user?.name}</h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;