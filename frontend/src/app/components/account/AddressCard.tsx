'use client';

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Address } from '@/types';

interface AddressCardProps {
  address: Address;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  index,
  onEdit,
  onDelete
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium">{address.label}</h3>
          {address.isDefault && (
            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              Default
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(index)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(index)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
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
        <p>Phone: {address.phone}</p>
      </div>
    </div>
  );
};

export default AddressCard;