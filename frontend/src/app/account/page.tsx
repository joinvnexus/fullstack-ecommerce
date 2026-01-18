'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Mail, Phone, MapPin, Package, CreditCard, Settings, LogOut,
  Edit, Trash2, Plus, Eye, Home, ShoppingBag, ToggleLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import { toast } from 'sonner';



const AccountPage = () => {
  const profileSchema = useMemo(() => z.object({
    name: z.string().min(2, 'নাম অন্তত ২ অক্ষরের হতে হবে'),
    phone: z.string().optional(),
  }), []);

  const passwordSchema = useMemo(() => z.object({
    currentPassword: z.string().min(1, 'বর্তমান পাসওয়ার্ড দিন'),
    newPassword: z.string().min(6, 'নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে'),
  }), []);

  const addressSchema = useMemo(() => z.object({
    label: z.string().min(1, 'লেবেল দিন'),
    fullName: z.string().min(2, 'পুরো নাম দিন'),
    street: z.string().min(1, 'রাস্তা দিন'),
    city: z.string().min(1, 'শহর দিন'),
    state: z.string().min(1, 'রাজ্য/প্রদেশ দিন'),
    country: z.string().min(1, 'দেশ দিন'),
    zipCode: z.string().min(1, 'জিপ কোড দিন'),
    phone: z.string().min(1, 'ফোন নম্বর দিন'),
    isDefault: z.boolean().optional(),
  }), []);

  type ProfileFormData = z.infer<typeof profileSchema>;
  type PasswordFormData = z.infer<typeof passwordSchema>;
  type AddressFormData = z.infer<typeof addressSchema>;

  const {
    user, updateProfile, changePassword, logout, isLoading: authLoading,
    getAddresses, addAddress, updateAddress, deleteAddress
  } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<{ index: number; data: any } | null>(null);
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

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('অর্ডার লোড করতে সমস্যা হয়েছে');
    }
  };

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (error) {
      toast.error('ঠিকানা লোড করতে সমস্যা হয়েছে');
    }
  };

  const profileResolver = useMemo(() => zodResolver(profileSchema), [profileSchema]);
  const passwordResolver = useMemo(() => zodResolver(passwordSchema), [passwordSchema]);
  const addressResolver = useMemo(() => zodResolver(addressSchema), [addressSchema]);

  const profileForm = useForm<ProfileFormData>({
    resolver: profileResolver,
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: passwordResolver,
  });

  const addressForm = useForm<AddressFormData>({
    resolver: addressResolver,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      await updateProfile(data);
      toast.success('প্রোফাইল আপডেট হয়েছে');
    } catch (error) {
      toast.error('প্রোফাইল আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true);
      await changePassword(data);
      toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে');
      passwordForm.reset();
    } catch (error) {
      toast.error('পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true);
      if (editingAddress) {
        await updateAddress(editingAddress.index, data);
        toast.success('ঠিকানা আপডেট হয়েছে');
      } else {
        await addAddress(data);
        toast.success('ঠিকানা যোগ হয়েছে');
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      addressForm.reset();
      fetchAddresses();
    } catch (error) {
      toast.error('ঠিকানা সেভ করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (index: number) => {
    const address = addresses[index];
    setEditingAddress({ index, data: address });
    addressForm.reset(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (index: number) => {
    if (confirm('এই ঠিকানা ডিলিট করবেন?')) {
      try {
        await deleteAddress(index);
        toast.success('ঠিকানা ডিলিট হয়েছে');
        fetchAddresses();
      } catch (error) {
        toast.error('ঠিকানা ডিলিট করতে সমস্যা হয়েছে');
      }
    }
  };

  const menuItems = [
    { id: 'profile', label: 'প্রোফাইল', icon: User },
    { id: 'orders', label: 'অর্ডারস', icon: Package },
    { id: 'addresses', label: 'ঠিকানা', icon: MapPin },
    { id: 'payment', label: 'পেমেন্ট মেথডস', icon: CreditCard },
    { id: 'settings', label: 'সেটিংস', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">আমার অ্যাকাউন্ট</h1>

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
                        onClick={() => setActiveTab(item.id)}
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
                      <span>লগআউট</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">প্রোফাইল তথ্য</h2>

                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        পুরো নাম
                      </label>
                      <input
                        {...profileForm.register('name')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {profileForm.formState.errors.name && (
                        <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ইমেইল ঠিকানা
                      </label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">ইমেইল পরিবর্তন করা যাবে না</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ফোন নম্বর
                      </label>
                      <input
                        {...profileForm.register('phone')}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">পাসওয়ার্ড পরিবর্তন</h2>

                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        বর্তমান পাসওয়ার্ড
                      </label>
                      <input
                        {...passwordForm.register('currentPassword')}
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        নতুন পাসওয়ার্ড
                      </label>
                      <input
                        {...passwordForm.register('newPassword')}
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'পরিবর্তন হচ্ছে...' : 'পরিবর্তন করুন'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">আমার অর্ডারস</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">কোন অর্ডার নেই</h3>
                    <p className="mt-2 text-gray-600">
                      যখন আপনি অর্ডার করবেন, এখানে দেখাবে।
                    </p>
                    <button
                      onClick={() => router.push('/products')}
                      className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      শপিং শুরু করুন
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">অর্ডার #{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                            <p className="text-sm font-medium mt-1">
                              {order.totals.grandTotal} {order.currency}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/orders/${order._id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <Eye size={14} />
                          বিস্তারিত দেখুন
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">সেভ করা ঠিকানা</h2>
                  <button
                    onClick={() => {
                      setShowAddressForm(true);
                      setEditingAddress(null);
                      addressForm.reset();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    নতুন ঠিকানা
                  </button>
                </div>

                {showAddressForm && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">
                      {editingAddress ? 'ঠিকানা এডিট করুন' : 'নতুন ঠিকানা যোগ করুন'}
                    </h3>
                    <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">লেবেল</label>
                          <input
                            {...addressForm.register('label')}
                            type="text"
                            placeholder="যেমন: বাড়ি, অফিস"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">পুরো নাম</label>
                          <input
                            {...addressForm.register('fullName')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">রাস্তা</label>
                        <input
                          {...addressForm.register('street')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">শহর</label>
                          <input
                            {...addressForm.register('city')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">রাজ্য/প্রদেশ</label>
                          <input
                            {...addressForm.register('state')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">দেশ</label>
                          <input
                            {...addressForm.register('country')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">জিপ কোড</label>
                          <input
                            {...addressForm.register('zipCode')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ফোন</label>
                          <input
                            {...addressForm.register('phone')}
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          {...addressForm.register('isDefault')}
                          type="checkbox"
                          id="isDefault"
                        />
                        <label htmlFor="isDefault" className="text-sm">ডিফল্ট ঠিকানা হিসেবে সেট করুন</label>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isLoading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddress(null);
                          }}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-600"
                        >
                          বাতিল
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">{address.label}</h3>
                          {address.isDefault && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              ডিফল্ট
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 text-gray-600 text-sm">
                        <p className="font-medium">{address.fullName}</p>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                        <p>ফোন: {address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {addresses.length === 0 && !showAddressForm && (
                  <div className="text-center py-12">
                    <Home className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">কোন ঠিকানা নেই</h3>
                    <p className="mt-2 text-gray-600">
                      ডেলিভারির জন্য ঠিকানা যোগ করুন।
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">পেমেন্ট মেথডস</h2>
                <div className="text-center py-12">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">পেমেন্ট মেথডস</h3>
                  <p className="mt-2 text-gray-600">
                    এখানে সেভ করা কার্ড বা bKash/Nagad নম্বর দেখাবে। পরে implement করা হবে।
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">সেটিংস</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">ইমেইল নোটিফিকেশন</h3>
                      <p className="text-sm text-gray-600">অর্ডার আপডেটের ইমেইল পান</p>
                    </div>
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">ডার্ক মোড</h3>
                      <p className="text-sm text-gray-600">থিম পরিবর্তন করুন</p>
                    </div>
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;