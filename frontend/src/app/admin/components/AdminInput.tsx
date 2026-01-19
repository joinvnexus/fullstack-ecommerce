'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import ErrorMessage from '@/app/components/ui/ErrorMessage';

interface AdminInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

export function AdminInput({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  size = 'md',
  fullWidth = false,
  className = '',
  id,
  ...props
}: AdminInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const baseClasses = 'border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300';
  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseClasses} ${errorClasses} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={16} className="text-gray-400" />
          </div>
        )}

        <input
          id={inputId}
          className={`${combinedClasses} ${Icon && iconPosition === 'left' ? 'pl-10' : ''} ${Icon && iconPosition === 'right' ? 'pr-10' : ''}`}
          {...props}
        />

        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon size={16} className="text-gray-400" />
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} className="mt-1" />}
    </div>
  );
}