import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, cartApi } from '@/lib/api/cart';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemsCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (item, quantity = 1) => {
        try {
          const response = await cartApi.add(item.id, { ...item, quantity });
          set((state) => ({
            items: [...state.items, response]
          }));
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          throw error;
        }
      },

      removeItem: async (id) => {
        try {
          await cartApi.remove(id);
          set((state) => ({
            items: state.items.filter((item) => item.id !== id)
          }));
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          throw error;
        }
      },

      updateQuantity: async (id, quantity) => {
        if (quantity < 1) return;
        try {
          await cartApi.update(id, { quantity });
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            )
          }));
        } catch (error) {
          console.error('Failed to update cart item:', error);
          throw error;
        }
      },

      clearCart: async () => {
        try {
          await cartApi.clear();
          set({ items: [] });
        } catch (error) {
          console.error('Failed to clear cart:', error);
          throw error;
        }
      },

      getTotal: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemsCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);