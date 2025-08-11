import { CartProduct } from "@/types/cart";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand/react";

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateProductQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      addToCart: (product: CartProduct) => {
        const { cart } = get();
        const existingProduct = cart.find((item) => item.id === product.id);
        if (existingProduct) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            ),
          });
        } else set({ cart: [...cart, product] });
      },
      removeFromCart: (id: string) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ cart: [] }),
      updateProductQuantity: (id: string, quantity: number) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
