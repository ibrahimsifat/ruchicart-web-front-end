import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string | number | undefined;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      total: 0,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
              itemCount: state.itemCount + 1,
              total: state.total + item.price,
            };
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
            itemCount: state.itemCount + 1,
            total: state.total + item.price,
          };
        }),
      removeItem: (id) =>
        set((state) => {
          const itemToRemove = state.items.find((i) => i.id === id);
          if (!itemToRemove) return state;
          return {
            items: state.items.filter((i) => i.id !== id),
            itemCount: state.itemCount - itemToRemove.quantity,
            total: state.total - itemToRemove.price * itemToRemove.quantity,
          };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;
          const quantityDiff = quantity - item.quantity;
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
            itemCount: state.itemCount + quantityDiff,
            total: state.total + item.price * quantityDiff,
          };
        }),
      clearCart: () => set({ items: [], itemCount: 0, total: 0 }),
    }),
    {
      name: "food-delivery-cart",
    }
  )
);
