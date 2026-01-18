'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import AddressForm from './AddressForm';
import AddressCard from './AddressCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const AddressesSection: React.FC = () => {
  const { getAddresses, addAddress, updateAddress, deleteAddress } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<{ index: number; data: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (error) {
      toast.error('Failed to load addresses');
    }
  };

  const handleAddAddress = async (data: any) => {
    try {
      setIsLoading(true);
      await addAddress(data);
      toast.success('Address added successfully');
      setShowAddressForm(false);
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to add address');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async (data: any) => {
    if (!editingAddress) return;

    try {
      setIsLoading(true);
      await updateAddress(editingAddress.index, data);
      toast.success('Address updated successfully');
      setShowAddressForm(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to update address');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (index: number) => {
    const address = addresses[index];
    setEditingAddress({ index, data: address });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (index: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(index);
        toast.success('Address deleted successfully');
        fetchAddresses();
      } catch (error) {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleCancelForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <button
          onClick={() => {
            setShowAddressForm(true);
            setEditingAddress(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      {showAddressForm && (
        <div className="mb-6">
          <AddressForm
            editingAddress={editingAddress}
            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
            onCancel={handleCancelForm}
            isLoading={isLoading}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address, index) => (
          <AddressCard
            key={index}
            address={address}
            index={index}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
          />
        ))}
      </div>

      {addresses.length === 0 && !showAddressForm && (
        <div className="text-center py-12">
          <Home className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No addresses found
          </h3>
          <p className="mt-2 text-gray-600">
            Add an address to use for delivery.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressesSection;
