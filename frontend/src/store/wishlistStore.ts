import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistApi } from '@/lib/api';

interface WishlistItem {
  _id: string;
  productId: any;
  addedAt: string;
  notes?: string;
}

interface Wishlist {
  _id: string;
  name: string;
  items: WishlistItem[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WishlistStore {
  wishlists: Wishlist[];
  defaultWishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadWishlists: () => Promise<void>;
  loadDefaultWishlist: () => Promise<void>;
  createWishlist: (name: string) => Promise<void>;
  addToWishlist: (wishlistId: string, productId: string, notes?: string) => Promise<void>;
  removeFromWishlist: (wishlistId: string, productId: string) => Promise<void>;
  moveItem: (fromWishlistId: string, toWishlistId: string, productId: string) => Promise<void>;
  updateWishlist: (wishlistId: string, updates: { name: string }) => Promise<void>;
  deleteWishlist: (wishlistId: string) => Promise<void>;
  checkProductInWishlist: (productId: string) => Promise<{
    isInWishlist: boolean;
    wishlistId?: string;
    wishlistName?: string;
  }>;
  isProductInWishlist: (productId: string) => boolean;
  clearWishlists: () => void;
}

const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlists: [],
      defaultWishlist: null,
      isLoading: false,
      error: null,

      loadWishlists: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.getWishlists();
          set({ 
            wishlists: response.data,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      loadDefaultWishlist: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.getDefaultWishlist();
          set({ 
            defaultWishlist: response.data,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      createWishlist: async (name: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.createWishlist({ name });
          
          set(state => ({
            wishlists: [...state.wishlists, response.data],
            isLoading: false,
          }));
        } catch (error: any) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      addToWishlist: async (wishlistId: string, productId: string, notes?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.addToWishlist(wishlistId, { productId, notes });
          
          set(state => ({
            wishlists: state.wishlists.map(wishlist =>
              wishlist._id === wishlistId ? response.data : wishlist
            ),
            defaultWishlist: state.defaultWishlist?._id === wishlistId 
              ? response.data 
              : state.defaultWishlist,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      removeFromWishlist: async (wishlistId: string, productId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.removeFromWishlist(wishlistId, productId);
          
          set(state => ({
            wishlists: state.wishlists.map(wishlist =>
              wishlist._id === wishlistId ? response.data : wishlist
            ),
            defaultWishlist: state.defaultWishlist?._id === wishlistId 
              ? response.data 
              : state.defaultWishlist,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      moveItem: async (fromWishlistId: string, toWishlistId: string, productId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.moveItem({
            fromWishlistId,
            toWishlistId,
            productId,
          });
          
          set(state => ({
            wishlists: state.wishlists.map(wishlist => {
              if (wishlist._id === fromWishlistId) {
                return response.data.fromWishlist;
              }
              if (wishlist._id === toWishlistId) {
                return response.data.toWishlist;
              }
              return wishlist;
            }),
            defaultWishlist: state.defaultWishlist?._id === fromWishlistId 
              ? response.data.fromWishlist 
              : state.defaultWishlist?._id === toWishlistId
              ? response.data.toWishlist
              : state.defaultWishlist,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      updateWishlist: async (wishlistId: string, updates: { name: string }) => {
        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.updateWishlist(wishlistId, updates);
          
          set(state => ({
            wishlists: state.wishlists.map(wishlist =>
              wishlist._id === wishlistId ? response.data : wishlist
            ),
            defaultWishlist: state.defaultWishlist?._id === wishlistId 
              ? response.data 
              : state.defaultWishlist,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      deleteWishlist: async (wishlistId: string) => {
        try {
          set({ isLoading: true, error: null });
          await wishlistApi.deleteWishlist(wishlistId);
          
          set(state => ({
            wishlists: state.wishlists.filter(wishlist => wishlist._id !== wishlistId),
            defaultWishlist: state.defaultWishlist?._id === wishlistId 
              ? null 
              : state.defaultWishlist,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },

      checkProductInWishlist: async (productId: string) => {
        try {
          const response = await wishlistApi.checkProductInWishlist(productId);
          return response.data;
        } catch (error: any) {
          return { isInWishlist: false };
        }
      },

      isProductInWishlist: (productId: string) => {
        const { wishlists } = get();
        return wishlists.some(wishlist =>
          Array.isArray(wishlist.items) &&
          wishlist.items.some(item => item?.productId?._id === productId)
        );
      },

      clearWishlists: () => {
        set({ wishlists: [], defaultWishlist: null });
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlistStore;