"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId?: string;
  productName: string;
  presentation?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  image?: string;
  notes?: string;
};

type CartState = {
  items: CartItem[];
  channel: "MAYOREO" | "MENUDEO";
  isOpen: boolean;
  setChannel: (c: "MAYOREO" | "MENUDEO") => void;
  add: (item: CartItem) => void;
  remove: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      channel: "MENUDEO",
      isOpen: false,

      setChannel: (c) => set({ channel: c }),

      add: (item) => {
        const existing = get().items.findIndex(
          (it) =>
            it.productName === item.productName &&
            it.presentation === item.presentation
        );
        if (existing >= 0) {
          // Si ya existe el mismo producto+presentación, sumar cantidad
          const items = [...get().items];
          items[existing].quantity += item.quantity;
          set({ items, isOpen: true });
        } else {
          set({ items: [...get().items, item], isOpen: true });
        }
      },

      remove: (index) =>
        set({ items: get().items.filter((_, i) => i !== index) }),

      updateQuantity: (index, qty) => {
        if (qty <= 0) {
          get().remove(index);
          return;
        }
        const items = [...get().items];
        items[index] = { ...items[index], quantity: qty };
        set({ items });
      },

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getSubtotal: () =>
        get().items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0),

      getItemCount: () =>
        get().items.reduce((sum, it) => sum + 1, 0),
    }),
    {
      name: "mariscos-jona-cart",
      partialize: (state) => ({
        items: state.items,
        channel: state.channel,
      }),
    }
  )
);
