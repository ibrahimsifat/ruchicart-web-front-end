export interface CartItem {
  id: string;
  name: string;
  image: string;
  variations?: Record<string, string | string[]>;
  price: number;
  quantity: number;
  addOns?: number[];
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}
