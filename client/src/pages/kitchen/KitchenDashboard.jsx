import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import io from 'socket.io-client';
import { ChefHat, LogOut, Clock, CheckCircle2, Play, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchOrders();
    const socket = io('http://172.20.10.2:5001');
    
    socket.on('order-updated', (updatedOrder) => {
      // If order is sent to kitchen or updated
      fetchOrders();
    });

    socket.on('new-order', () => {
      // For orders that might skip cashier if paid online
      fetchOrders();
    });

    return () => socket.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/staff');
      // Kitchen only sees orders that are PAID or SENT_TO_KITCHEN or PREPARING
      const kitchenOrders = data.filter(o => 
        ['SENT_TO_KITCHEN', 'PAID', 'PREPARING', 'READY'].includes(o.orderStatus)
      );
      setOrders(kitchenOrders);
    } catch (error) {
      toast.error('Failed to load kitchen orders');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order status: ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 bg-[#1E293B] text-white flex flex-col items-center lg:items-stretch p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-black italic">DS</div>
          <span className="text-xl font-black hidden lg:block">Kitchen Hub</span>
        </div>

        <nav className="flex-grow space-y-4">
          <button className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 bg-accent text-white rounded-2xl font-bold shadow-lg shadow-accent/20">
            <Flame size={20} />
            <span className="hidden lg:block">Live Orders</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 text-gray-500 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden lg:block">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Kitchen Board */}
      <main className="flex-grow flex flex-col p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Production Board</h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live Kitchen Sync Active
            </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-[#1E293B] p-4 rounded-2xl border border-white/5 text-center min-w-[120px]">
               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Pending</p>
               <p className="text-2xl font-black text-white">{orders.filter(o => o.orderStatus !== 'READY').length}</p>
             </div>
             <div className="bg-[#1E293B] p-4 rounded-2xl border border-white/5 text-center min-w-[120px]">
               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Completed Today</p>
               <p className="text-2xl font-black text-accent">12</p>
             </div>
          </div>
        </div>

        {/* Board Columns */}
        <div className="flex-grow flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {/* Waiting/New Column */}
          <div className="flex-shrink-0 w-96 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={16} />
                Waiting to Prepare
              </h2>
              <span className="bg-white/5 text-gray-400 px-2 py-0.5 rounded text-[10px] font-bold">
                {orders.filter(o => ['SENT_TO_KITCHEN', 'PAID'].includes(o.orderStatus)).length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {orders.filter(o => ['SENT_TO_KITCHEN', 'PAID'].includes(o.orderStatus)).map(order => (
                <KitchenOrderCard key={order.id} order={order} onAction={() => updateStatus(order.id, 'PREPARING')} actionLabel="Start Cooking" actionIcon={<Play size={16} />} color="blue" />
              ))}
            </div>
          </div>

          {/* Preparing Column */}
          <div className="flex-shrink-0 w-96 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2 text-accent">
              <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Flame size={16} />
                In Production
              </h2>
              <span className="bg-accent/10 text-accent px-2 py-0.5 rounded text-[10px] font-bold">
                {orders.filter(o => o.orderStatus === 'PREPARING').length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {orders.filter(o => o.orderStatus === 'PREPARING').map(order => (
                <KitchenOrderCard key={order.id} order={order} onAction={() => updateStatus(order.id, 'READY')} actionLabel="Mark as Ready" actionIcon={<CheckCircle2 size={16} />} color="accent" />
              ))}
            </div>
          </div>

          {/* Ready/Served Column */}
          <div className="flex-shrink-0 w-96 flex flex-col opacity-60">
            <div className="flex items-center justify-between mb-4 px-2 text-green-500">
              <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={16} />
                Ready to Serve
              </h2>
              <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[10px] font-bold">
                {orders.filter(o => o.orderStatus === 'READY').length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {orders.filter(o => o.orderStatus === 'READY').map(order => (
                <KitchenOrderCard key={order.id} order={order} isReady />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const KitchenOrderCard = ({ order, onAction, actionLabel, actionIcon, color, isReady }) => {
  const timeDiff = Math.floor((Date.now() - new Date(order.updatedAt).getTime()) / 60000);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-[#1E293B] rounded-2xl p-6 border border-white/5 relative overflow-hidden group transition-all hover:border-white/10 ${isReady ? 'grayscale' : ''}`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full bg-${color === 'accent' ? 'accent' : 'blue-500'}`} />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-black text-white">{order.orderNumber}</h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Table {order.table.tableNumber}</p>
        </div>
        <div className="text-right">
          <p className={`text-[10px] font-bold ${timeDiff > 10 ? 'text-red-500' : 'text-gray-500'}`}>
            {timeDiff}m ago
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between items-start border-b border-white/5 pb-2 last:border-0">
            <div className="flex-grow">
              <p className="text-sm font-bold text-gray-200">
                <span className="text-accent mr-2 text-base font-black">{item.quantity}x</span>
                {item.menu.name}
              </p>
              {item.notes && <p className="text-[10px] text-orange-400 italic mt-1 bg-orange-400/10 px-2 py-1 rounded inline-block">Notes: {item.notes}</p>}
            </div>
          </div>
        ))}
      </div>

      {onAction && (
        <button 
          onClick={onAction}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            color === 'accent' 
              ? 'bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-light' 
              : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {actionIcon}
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default KitchenDashboard;
