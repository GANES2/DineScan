import { create } from 'zustand';
import api from '../api/axios';
import { io } from 'socket.io-client';

const socket = io(window.location.hostname === 'localhost' 
  ? 'http://localhost:5001' 
  : `http://${window.location.hostname}:5001`);

export const useStore = create((set, get) => ({
  menus: [],
  tables: [],
  orders: [],
  cart: [],
  activeTable: null,
  loading: false,

  // --- INITIALIZATION ---
  init: async () => {
    try {
      set({ loading: true });
      const [menuRes, tableRes, orderRes] = await Promise.all([
        api.get('/menus'),
        api.get('/tables'),
        api.get('/orders/staff')
      ]);
      set({ 
        menus: menuRes.data.menus, // AMBIL ARRAY MENUS NYA SAJA
        tables: tableRes.data, 
        orders: orderRes.data,
        loading: false 
      });

      // Socket Listeners
      socket.on('new-order', (order) => {
        set(state => ({ orders: [order, ...state.orders] }));
      });

      socket.on('order-updated', (updatedOrder) => {
        set(state => ({
          orders: state.orders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
        }));
      });

    } catch (error) {
      console.error('Init Error:', error);
      set({ loading: false });
    }
  },

  // --- CART ACTIONS ---
  setActiveTable: async (tableCode) => {
    try {
      set({ loading: true });
      const tableRes = await api.get(`/tables/${tableCode}`);
      set({ activeTable: tableRes.data, loading: false });
    } catch (error) {
      console.error('Table Error:', error);
      set({ loading: false });
      throw error;
    }
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

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) return set({ cart: get().cart.filter(item => item.id !== id) });
    set({
      cart: get().cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => set({ cart: [] }),

  // --- ORDER ACTIONS ---
  placeOrder: async (paymentMethod, customerInfo) => {
    const { cart, activeTable } = get();
    try {
      const orderData = {
        tableId: activeTable.id,
        paymentMethod,
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: cart.map(item => ({
          menuId: item.id,
          quantity: item.quantity,
          price: item.price,
          notes: ''
        })),
        customerName: customerInfo.name, // If your backend schema supports this
        customerPhone: customerInfo.phone
      };

      const res = await api.post('/orders', orderData);
      set({ cart: [] });
      return res.data.orderNumber;
    } catch (error) {
      console.error('Place Order Error:', error);
      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
    } catch (error) {
      console.error('Update Status Error:', error);
    }
  },

  confirmCashPayment: async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/confirm-cash`);
    } catch (error) {
      console.error('Confirm Cash Error:', error);
    }
  }
}));
