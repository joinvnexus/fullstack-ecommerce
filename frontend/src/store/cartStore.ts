import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types';
import { cartApi } from '@/lib/api';

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  guestId: string | null;
  
  // Actions
  initializeCart: () => Promise<void>;
  getOrCreateGuestId: () => string;
  addItem: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  mergeCart: () => Promise<void>;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,
      guestId: null,

      initializeCart: async () => {
        try {
          set({ isLoading: true });
          
          // Generate guest ID if not exists
          const guestId = get().getOrCreateGuestId();
          
          // Fetch cart from API
          const response = await cartApi.getCart(guestId);
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      getOrCreateGuestId: () => {
        let guestId = get().guestId;
        
        if (!guestId) {
          // Generate new guest ID
          guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          set({ guestId });
          
          // Store in localStorage for persistence
          localStorage.setItem('guestId', guestId);
        }
        
        return guestId;
      },

      addItem: async (productId: string, quantity: number, variantId?: string) => {
        try {
          set({ isLoading: true });
          
          const guestId = get().getOrCreateGuestId();
          const response = await cartApi.addItem({
            productId,
            quantity,
            variantId,
            guestId,
          });
          
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        try {
          set({ isLoading: true });
          
          const guestId = get().getOrCreateGuestId();
          const response = await cartApi.updateItem(itemId, {
            quantity,
            guestId,
          });
          
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      removeItem: async (itemId: string) => {
        try {
          set({ isLoading: true });
          
          const guestId = get().getOrCreateGuestId();
          const response = await cartApi.removeItem(itemId, guestId);
          
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true });
          
          const guestId = get().getOrCreateGuestId();
          const response = await cartApi.clearCart(guestId);
          
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      syncCart: async () => {
        try {
          set({ isLoading: true });
          await get().initializeCart();
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      mergeCart: async () => {
        try {
          const guestId = get().guestId;
          if (!guestId) return;

          set({ isLoading: true });
          await cartApi.mergeCart({ guestId });
          
          // Clear guest ID after merge
          set({ guestId: null });
          localStorage.removeItem('guestId');
          
          // Refresh cart
          await get().initializeCart();
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        guestId: state.guestId,
      }),
    }
  )
);

export default useCartStore;