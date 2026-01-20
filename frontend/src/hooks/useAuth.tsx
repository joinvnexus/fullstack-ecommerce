'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { User, AuthResponse } from '@/types';
import React from 'react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
  getAddresses: () => Promise<any>;
  addAddress: (data: any) => Promise<any>;
  updateAddress: (index: number, data: any) => Promise<any>;
  deleteAddress: (index: number) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status by fetching profile
    fetchProfile().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authApi.getProfile();
      setUser(response.data);
    } catch (error) {
      // Token expired or invalid
      setToken(null);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      const { user } = response.data;

      setUser(user);
      setToken('authenticated'); // Indicate authenticated state

      // Redirect based on role
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authApi.register(data);

      const { user } = response.data;

      setUser(user);
      setToken('authenticated');

      // New users are customers, redirect to account
      router.push('/account');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      setToken(null);
      router.push('/login');
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await authApi.updateProfile(data);
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (data: any) => {
    try {
      await authApi.changePassword(data);
    } catch (error) {
      throw error;
    }
  };

  const getAddresses = async () => {
    try {
      const response = await authApi.getAddresses();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const addAddress = async (data: any) => {
    try {
      const response = await authApi.addAddress(data);
      // Update user addresses
      const updatedUser = { ...user!, addresses: response.data };
      setUser(updatedUser);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateAddress = async (index: number, data: any) => {
    try {
      const response = await authApi.updateAddress(index, data);
      // Update user addresses
      const updatedUser = { ...user!, addresses: response.data };
      setUser(updatedUser);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteAddress = async (index: number) => {
    try {
      const response = await authApi.deleteAddress(index);
      // Update user addresses
      const updatedUser = { ...user!, addresses: response.data };
      setUser(updatedUser);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  };

   return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};