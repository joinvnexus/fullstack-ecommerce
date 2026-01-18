'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Import all the new components
import AccountLayout from '@/app/components/account/AccountLayout';
import ProfileSection from '@/app/components/account/ProfileSection';
import OrdersSection from '@/app/components/account/OrdersSection';
import AddressesSection from '@/app/components/account/AddressesSection';
import PaymentSection from '@/app/components/account/PaymentSection';
import SettingsSection from '@/app/components/account/SettingsSection';

const AccountPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/account');
      } else if (user.role === 'admin') {
        router.push('/admin');
      }
    }
  }, [user, authLoading, router]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection user={user!} />;
      case 'orders':
        return <OrdersSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'payment':
        return <PaymentSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <ProfileSection user={user!} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AccountLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AccountLayout>
  );
};

export default AccountPage;