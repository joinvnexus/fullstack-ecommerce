'use client';

import { useState } from 'react';
import { Save, Store, CreditCard, Truck, Mail, Shield } from 'lucide-react';
import { AdminButton } from '../components/AdminButton';

type SettingsType = {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  stripeEnabled: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
  bkashEnabled: boolean;
  bkashAppKey: string;
  bkashAppSecret: string;
  nagadEnabled: boolean;
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  estimatedDeliveryDays: number;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  sessionTimeout: number;
  passwordMinLength: number;
  twoFactorEnabled: boolean;
};

type SettingsKeys = keyof SettingsType;
type FieldType = 'text' | 'email' | 'password' | 'number' | 'checkbox' | 'select';

interface SettingsField {
  key: SettingsKeys;
  label: string;
  type: FieldType;
  options?: string[];
  dependsOn?: SettingsKeys;
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<SettingsType>({
    // Store Settings
    storeName: 'ShopEasy',
    storeEmail: 'admin@shopeasy.com',
    storePhone: '+8801234567890',
    storeAddress: 'Dhaka, Bangladesh',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',

    // Payment Settings
    stripeEnabled: true,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...',
    bkashEnabled: true,
    bkashAppKey: 'bkash_app_key',
    bkashAppSecret: 'bkash_app_secret',
    nagadEnabled: false,

    // Shipping Settings
    freeShippingThreshold: 1000,
    standardShippingRate: 100,
    expressShippingRate: 200,
    estimatedDeliveryDays: 3,

    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@shopeasy.com',
    smtpPassword: 'password',

    // Security Settings
    sessionTimeout: 24,
    passwordMinLength: 8,
    twoFactorEnabled: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async (section: string) => {
    try {
      setSaving(true);
      // In real implementation, save to API
      console.log(`Saving ${section} settings:`, settings);
      alert(`${section} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof SettingsType, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sections = [
    {
      id: 'store',
      title: 'Store Settings',
      icon: Store,
      fields: [
        { key: 'storeName', label: 'Store Name', type: 'text' as const },
        { key: 'storeEmail', label: 'Store Email', type: 'email' as const },
        { key: 'storePhone', label: 'Store Phone', type: 'text' as const },
        { key: 'storeAddress', label: 'Store Address', type: 'text' as const },
        { key: 'currency', label: 'Currency', type: 'select' as const, options: ['BDT', 'USD', 'EUR'] },
        { key: 'timezone', label: 'Timezone', type: 'select' as const, options: ['Asia/Dhaka', 'UTC', 'America/New_York'] },
      ],
    },
    {
      id: 'payment',
      title: 'Payment Settings',
      icon: CreditCard,
      fields: [
        { key: 'stripeEnabled', label: 'Enable Stripe', type: 'checkbox' as const },
        { key: 'stripePublicKey', label: 'Stripe Public Key', type: 'text' as const, dependsOn: 'stripeEnabled' },
        { key: 'stripeSecretKey', label: 'Stripe Secret Key', type: 'password' as const, dependsOn: 'stripeEnabled' },
        { key: 'bkashEnabled', label: 'Enable bKash', type: 'checkbox' as const },
        { key: 'bkashAppKey', label: 'bKash App Key', type: 'text' as const, dependsOn: 'bkashEnabled' },
        { key: 'bkashAppSecret', label: 'bKash App Secret', type: 'password' as const, dependsOn: 'bkashEnabled' },
        { key: 'nagadEnabled', label: 'Enable Nagad', type: 'checkbox' as const },
      ],
    },
    {
      id: 'shipping',
      title: 'Shipping Settings',
      icon: Truck,
      fields: [
        { key: 'freeShippingThreshold', label: 'Free Shipping Threshold (৳)', type: 'number' as const },
        { key: 'standardShippingRate', label: 'Standard Shipping Rate (৳)', type: 'number' as const },
        { key: 'expressShippingRate', label: 'Express Shipping Rate (৳)', type: 'number' as const },
        { key: 'estimatedDeliveryDays', label: 'Estimated Delivery Days', type: 'number' as const },
      ],
    },
    {
      id: 'email',
      title: 'Email Settings',
      icon: Mail,
      fields: [
        { key: 'smtpHost', label: 'SMTP Host', type: 'text' as const },
        { key: 'smtpPort', label: 'SMTP Port', type: 'text' as const },
        { key: 'smtpUser', label: 'SMTP Username', type: 'text' as const },
        { key: 'smtpPassword', label: 'SMTP Password', type: 'password' as const },
      ],
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: Shield,
      fields: [
        { key: 'sessionTimeout', label: 'Session Timeout (hours)', type: 'number' as const },
        { key: 'passwordMinLength', label: 'Minimum Password Length', type: 'number' as const },
        { key: 'twoFactorEnabled', label: 'Enable Two-Factor Authentication', type: 'checkbox' as const },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Configure your store settings</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field) => {
                    // Skip dependent fields if dependency is false
                    const dependsOn = (field as SettingsField).dependsOn;
                    if (dependsOn !== undefined && !settings[dependsOn]) {
                      return null;
                    }

                    if (field.type === 'checkbox') {
                      return (
                        <div key={field.key} className="flex items-center">
                          <input
                            id={field.key}
                            type="checkbox"
                            checked={settings[field.key as keyof SettingsType] as boolean || false}
                            onChange={(e) => updateSetting(field.key as keyof SettingsType, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={field.key} className="ml-2 text-sm text-gray-700">
                            {field.label}
                          </label>
                        </div>
                      );
                    }

                    if (field.type === 'select') {
                      return (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                          </label>
                          <select
                            value={settings[field.key as keyof SettingsType] as string || ''}
                            onChange={(e) => updateSetting(field.key as keyof SettingsType, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select {field.label.toLowerCase()}</option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    return (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <input
                          type={field.type as 'text' | 'email' | 'password' | 'number'}
                          value={settings[field.key as keyof SettingsType] as string || ''}
                          onChange={(e) => updateSetting(field.key as keyof SettingsType, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-end">
                  <AdminButton
                    onClick={() => handleSave(section.title)}
                    loading={saving}
                    icon={Save}
                  >
                    Save {section.title}
                  </AdminButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsPage;