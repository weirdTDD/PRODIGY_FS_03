import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart } from '../types';

interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      setCart: (cart) => set({ cart }),
      clearCart: () => set({ cart: null }),
      itemCount: () => {
        const cart = get().cart;
        if (!cart) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);
