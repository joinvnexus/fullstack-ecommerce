'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { Address } from '@/types';

const addressSchema = z.object({
  label: z.string().min(1, 'Please enter a label'),
  fullName: z.string().min(2, 'Please enter full name'),
  street: z.string().min(1, 'Please enter street address'),
  city: z.string().min(1, 'Please enter city'),
  state: z.string().min(1, 'Please enter state/province'),
  country: z.string().min(1, 'Please enter country'),
  zipCode: z.string().min(1, 'Please enter ZIP code'),
  phone: z.string().min(1, 'Please enter phone number'),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  editingAddress?: { index: number; data: Address } | null;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  editingAddress,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: editingAddress?.data || {
      label: '',
      fullName: '',
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      phone: '',
      isDefault: false,
    },
  });

  const handleSubmit = async (data: AddressFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handled by parent
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h3 className="font-medium mb-4">
        {editingAddress ? 'Edit Address' : 'Add New Address'}
      </h3>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              {...form.register('label')}
              type="text"
              placeholder="e.g. Home, Office"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.label && (
              <ErrorMessage message={form.formState.errors.label.message!} />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              {...form.register('fullName')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.fullName && (
              <ErrorMessage message={form.formState.errors.fullName.message!} />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            {...form.register('street')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {form.formState.errors.street && (
            <ErrorMessage message={form.formState.errors.street.message!} />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              {...form.register('city')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.city && (
              <ErrorMessage message={form.formState.errors.city.message!} />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State / Province
            </label>
            <input
              {...form.register('state')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.state && (
              <ErrorMessage message={form.formState.errors.state.message!} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              {...form.register('country')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.country && (
              <ErrorMessage message={form.formState.errors.country.message!} />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
            </label>
            <input
              {...form.register('zipCode')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.zipCode && (
              <ErrorMessage message={form.formState.errors.zipCode.message!} />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              {...form.register('phone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.phone && (
              <ErrorMessage message={form.formState.errors.phone.message!} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input {...form.register('isDefault')} type="checkbox" id="isDefault" />
          <label htmlFor="isDefault" className="text-sm">
            Set as default address
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <LoadingSpinner size="sm" />}
            Save
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
