import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from "../types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  itemCount: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (existing) =>
            existing.product._id === item.product._id &&
            existing.size === item.size &&
            existing.color === item.color
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity
          };
          set({ items: updated });
          return;
        }

        set({ items: [...items, item] });
      },
      updateItem: (itemId, quantity) => {
        const updated = get().items.map((item) =>
          item._id === itemId ? { ...item, quantity } : item
        );
        set({ items: updated });
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item._id !== itemId) });
      },
      clearCart: () => set({ items: [] }),
      itemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      totalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
    }),
    {
      name: "cart-storage"
    }
  )
);
