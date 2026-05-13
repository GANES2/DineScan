import { create } from 'zustand';

const useCartStore = create((set) => ({
  items: [],
  addItem: (product, notes = '') => set((state) => {
    const existing = state.items.find((i) => i.id === product.id);
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1, notes } : i
        ),
      };
    }
    return { items: [...state.items, { ...product, quantity: 1, notes }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map((i) =>
      i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
    ).filter(i => i.quantity > 0),
  })),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    const items = useCartStore.getState().items;
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },
}));

export default useCartStore;
