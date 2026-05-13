import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // --- DATA AWAL ---
      menus: [
        { id: 1, name: 'Nasi Goreng Spesial', price: 35000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff06b3?q=80&w=400', available: true },
        { id: 2, name: 'Mie Ayam Jamur', price: 28000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400', available: true },
        { id: 3, name: 'Ayam Bakar Madu', price: 42000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=400', available: true },
        { id: 4, name: 'Es Teh Manis', price: 5000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400', available: true },
        { id: 5, name: 'Es Jeruk Peras', price: 12000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=400', available: true },
        { id: 6, name: 'Kopi Susu Gula Aren', price: 18000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400', available: true },
        { id: 7, name: 'Brownies Ice Cream', price: 25000, category: 'Dessert', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=400', available: true },
        { id: 8, name: 'Pisang Goreng Keju', price: 15000, category: 'Dessert', image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=400', available: true },
        { id: 9, name: 'Promo Hemat A', price: 45000, category: 'Promo', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400', available: true },
        { id: 10, name: 'Promo Hemat B', price: 55000, category: 'Promo', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400', available: true },
        { id: 11, name: 'Sate Ayam 10 Tusuk', price: 30000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=400', available: true },
        { id: 12, name: 'Juice Alpukat', price: 15000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1590477922224-d930a9578e07?q=80&w=400', available: true },
      ],
      tables: [
        { id: 'TBL-001', code: 'MEJA-01', status: 'AVAILABLE' },
        { id: 'TBL-002', code: 'MEJA-02', status: 'AVAILABLE' },
        { id: 'TBL-003', code: 'MEJA-03', status: 'AVAILABLE' },
        { id: 'TBL-004', code: 'MEJA-04', status: 'AVAILABLE' },
        { id: 'TBL-005', code: 'MEJA-05', status: 'AVAILABLE' },
      ],
      orders: [],
      cart: [],
      activeTable: null,

      // --- CART ACTIONS ---
      setActiveTable: (tableCode) => {
        const table = get().tables.find(t => t.code === tableCode);
        set({ activeTable: table || null });
      },
      addToCart: (menu) => {
        const currentCart = get().cart;
        const existing = currentCart.find(item => item.id === menu.id);
        if (existing) {
          set({
            cart: currentCart.map(item =>
              item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...menu, quantity: 1 }] });
        }
      },
      removeFromCart: (id) => {
        set({ cart: get().cart.filter(item => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) return get().removeFromCart(id);
        set({
          cart: get().cart.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),

      // --- ORDER ACTIONS ---
      placeOrder: (paymentMethod, customerInfo) => {
        const { cart, activeTable } = get();
        if (cart.length === 0 || !activeTable) return null;

        const orderId = `ORD-${Date.now()}`;
        const newOrder = {
          id: orderId,
          table: activeTable,
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          items: [...cart],
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          status: paymentMethod === 'ONLINE' ? 'WAITING_PAYMENT' : 'WAITING_CASHIER_PAYMENT',
          paymentMethod,
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          orders: [newOrder, ...state.orders],
          cart: [],
        }));
        return orderId;
      },

      updateOrderStatus: (orderId, newStatus) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          ),
        }));
      },

      // --- ADMIN ACTIONS ---
      addMenu: (menu) => set(state => ({ menus: [...state.menus, { ...menu, id: Date.now() }] })),
      updateMenu: (id, updatedMenu) => set(state => ({
        menus: state.menus.map(m => m.id === id ? { ...m, ...updatedMenu } : m)
      })),
      deleteMenu: (id) => set(state => ({ menus: state.menus.filter(m => m.id !== id) })),
    }),
    { name: 'dinescan-storage' }
  )
);
