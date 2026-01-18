'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileSectionProps {
  user: any;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const { updateProfile, changePassword } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await changePassword(data);
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              {...profileForm.register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {profileForm.formState.errors.name && (
              <ErrorMessage message={profileForm.formState.errors.name.message!} />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <LoadingSpinner size="sm" />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current password
            </label>
            <input
              {...passwordForm.register('currentPassword')}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordForm.formState.errors.currentPassword && (
              <ErrorMessage message={passwordForm.formState.errors.currentPassword.message!} />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New password
            </label>
            <input
              {...passwordForm.register('newPassword')}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordForm.formState.errors.newPassword && (
              <ErrorMessage message={passwordForm.formState.errors.newPassword.message!} />
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <LoadingSpinner size="sm" />}
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSection;