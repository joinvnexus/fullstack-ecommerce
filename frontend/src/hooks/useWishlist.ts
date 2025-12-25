'use client';

import { useState, useEffect } from 'react';
import useWishlistStore from '@/store/wishlistStore';
import { useAuth } from './useAuth';

export const useWishlist = () => {
  const { user } = useAuth();
  const {
    wishlists,
    defaultWishlist,
    isLoading,
    error,
    loadWishlists,
    loadDefaultWishlist,
    addToWishlist,
    removeFromWishlist,
    createWishlist,
    updateWishlist,
    deleteWishlist,
    moveItem,
    checkProductInWishlist,
    isProductInWishlist,
  } = useWishlistStore();

  const [selectedWishlist, setSelectedWishlist] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDefaultWishlist();
      loadWishlists();
    }
  }, [user]);

  const addToDefaultWishlist = async (productId: string, notes?: string) => {
    if (!defaultWishlist) {
      await loadDefaultWishlist();
    }
    if (defaultWishlist) {
      await addToWishlist(defaultWishlist._id, productId, notes);
    }
  };

  const removeFromDefaultWishlist = async (productId: string) => {
    if (defaultWishlist) {
      await removeFromWishlist(defaultWishlist._id, productId);
    }
  };

  const toggleProductInWishlist = async (productId: string) => {
    if (!user) {
      // Redirect to login or show login modal
      return { action: 'login_required' };
    }

    const isInWishlist = isProductInWishlist(productId);
    
    if (isInWishlist) {
      // Find which wishlist contains the product
      const wishlist = wishlists.find(w =>
        w.items.some(item => item.productId._id === productId)
      );
      if (wishlist) {
        await removeFromWishlist(wishlist._id, productId);
        return { action: 'removed', wishlistName: wishlist.name };
      }
    } else {
      await addToDefaultWishlist(productId);
      return { action: 'added', wishlistName: defaultWishlist?.name };
    }

    return { action: 'none' };
  };

  return {
    // State
    wishlists,
    defaultWishlist,
    selectedWishlist,
    isLoading,
    error,
    
    // Actions
    setSelectedWishlist,
    addToWishlist,
    removeFromWishlist,
    addToDefaultWishlist,
    removeFromDefaultWishlist,
    toggleProductInWishlist,
    createWishlist,
    updateWishlist,
    deleteWishlist,
    moveItem,
    checkProductInWishlist,
    isProductInWishlist,
    
    // Helpers
    getProductWishlistStatus: (productId: string) => {
      const wishlist = wishlists.find(w =>
        w.items.some(item => item.productId._id === productId)
      );
      return {
        isInWishlist: !!wishlist,
        wishlistId: wishlist?._id,
        wishlistName: wishlist?.name,
      };
    },
    
    // Stats
    totalWishlistItems: wishlists.reduce(
      (total, wishlist) => total + wishlist.items.length,
      0
    ),
  };
};