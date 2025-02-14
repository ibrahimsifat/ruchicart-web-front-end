import { AddOn, FormattedVariation } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: {
    name: string;
    values: {
      label: string[];
      optionPrice: number;
    };
  }[];
  add_ons?: AddOn[];
  variations?: Record<string, FormattedVariation[]>;
}

interface CartStore {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
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
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.id === item.id &&
              JSON.stringify(i.variations) ===
                JSON.stringify(item.variations) &&
              JSON.stringify(i.add_ons) === JSON.stringify(item.add_ons)
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += item.quantity;
            return {
              items: updatedItems,
              itemCount: state.itemCount + item.quantity,
              total: state.total + item.price * item.quantity,
            };
          }

          return {
            items: [...state.items, item],
            itemCount: state.itemCount + item.quantity,
            total: state.total + item.price * item.quantity,
          };
        }),
      removeItem: (id) =>
        set((state) => {
          const itemToRemove = state.items.find((item) => item.id === id);
          if (!itemToRemove) return state;
          console.log(itemToRemove, "itemToRemove", itemToRemove.quantity);
          return {
            items: state.items.filter((item) => item.id !== id),
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
      name: "ruchicart-cart",
    }
  )
);
