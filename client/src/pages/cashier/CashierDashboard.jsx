import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import io from 'socket.io-client';
import { 
  Search, Bell, LogOut, Printer, CheckCircle, 
  Send, XCircle, LayoutDashboard, Clock, Check, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CashierDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchOrders();
    const socket = io('http://172.20.10.2:5001');
    
    socket.on('new-order', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      toast('New Order Received!', { icon: '🔔' });
    });

    socket.on('order-updated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    });

    return () => socket.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/staff');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  const handleConfirmCash = async (id) => {
    try {
      await api.put(`/orders/${id}/confirm-cash`);
      toast.success('Payment confirmed!');
    } catch (error) {
      toast.error('Confirmation failed');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order moved to ${status}`);
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
    o.table.tableNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-black italic">DS</div>
          <span className="text-xl font-black">Cashier Panel</span>
        </div>

        <nav className="flex-grow space-y-2">
          <button className="w-full flex items-center gap-4 p-4 bg-accent/10 text-accent border border-accent/20 rounded-2xl font-bold">
            <LayoutDashboard size={20} />
            Orders Management
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              {user?.name[0]}
            </div>
            <div>
              <p className="text-sm font-bold">{user?.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="w-full flex items-center gap-4 p-4 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 p-6 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by Order # or Table..."
              className="w-full bg-gray-50 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-accent/10 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <div className="flex-grow overflow-auto p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredOrders.map(order => (
              <motion.div 
                layout
                key={order.id}
                className={`card p-6 border-l-4 ${
                  order.paymentStatus === 'PAID' ? 'border-l-green-500' : 'border-l-orange-500'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                    <h3 className="text-xl font-black text-primary">{order.orderNumber}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full">
                        {order.table.tableNumber}
                      </span>
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${
                        order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">Rp {order.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 font-medium">via {order.paymentMethod}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-600">
                        <span className="font-bold text-primary mr-2">{item.quantity}x</span>
                        {item.menu.name}
                      </span>
                      <span className="font-bold text-gray-400">Rp {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {order.paymentStatus === 'CASH_WAITING_CONFIRMATION' && (
                    <button 
                      onClick={() => handleConfirmCash(order.id)}
                      className="flex-grow bg-green-500 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle size={18} />
                      Confirm Cash Payment
                    </button>
                  )}
                  
                  {order.paymentStatus === 'PAID' && order.orderStatus === 'PAID' && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'SENT_TO_KITCHEN')}
                      className="flex-grow bg-blue-500 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                    >
                      <Send size={18} />
                      Send to Kitchen
                    </button>
                  )}

                  {order.orderStatus === 'READY' && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      className="flex-grow bg-primary text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      Mark as Served
                    </button>
                  )}

                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    <Printer size={18} />
                  </button>
                  
                  {['PAID', 'WAITING_PAYMENT', 'WAITING_CASHIER_PAYMENT'].includes(order.orderStatus) && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl font-mono text-xs"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-black font-sans italic tracking-tighter">DineScan</h2>
                <p className="text-gray-400 font-sans mt-1">Receipt for #{selectedOrder.orderNumber}</p>
                <div className="border-t border-dashed border-gray-300 mt-4 pt-4 flex justify-between">
                  <span>Table: {selectedOrder.table.tableNumber}</span>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                {selectedOrder.items.map(i => (
                  <div key={i.id} className="flex justify-between">
                    <span>{i.quantity}x {i.menu.name}</span>
                    <span>Rp {(i.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4 space-y-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>TOTAL</span>
                  <span>Rp {selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span>{selectedOrder.paymentStatus}</span>
                </div>
              </div>

              <div className="mt-8 text-center text-[10px] text-gray-400 font-sans">
                <p>Thank you for dining with us!</p>
                <p className="mt-1">DineScan System</p>
              </div>

              <button 
                onClick={() => window.print()}
                className="w-full btn-primary font-sans mt-6 h-12"
              >
                Print Receipt
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CashierDashboard;
