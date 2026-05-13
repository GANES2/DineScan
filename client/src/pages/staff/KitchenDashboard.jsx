import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Flame, Clock, CheckCircle2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const KitchenDashboard = () => {
  const { orders, updateOrderStatus } = useStore();

  const kitchenOrders = orders.filter(o => ['PAID', 'PREPARING', 'READY'].includes(o.orderStatus));

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PAID': return { label: 'Menunggu', color: 'bg-gray-100 text-gray-500', icon: Clock };
      case 'PREPARING': return { label: 'Dimasak', color: 'bg-orange-100 text-orange-600', icon: Flame };
      case 'READY': return { label: 'Siap', color: 'bg-green-100 text-green-600', icon: CheckCircle2 };
      default: return { label: status, color: 'bg-gray-100', icon: Clock };
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] p-10 text-white">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center font-black">DS</div>
          <div>
            <h1 className="text-3xl font-black">Kitchen Board</h1>
            <p className="text-gray-500 text-sm mt-1">Status Produksi Makanan & Minuman</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
            <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Total Active</p>
            <p className="text-xl font-black text-orange-500">{kitchenOrders.length}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Waiting Column */}
        <KitchenColumn title="Waiting to Prepare" count={kitchenOrders.filter(o => o.orderStatus === 'PAID').length}>
          {kitchenOrders.filter(o => o.orderStatus === 'PAID').map(order => (
            <KitchenCard 
              key={order.id} 
              order={order} 
              onAction={() => {
                updateOrderStatus(order.id, 'PREPARING');
                toast.success('Mulai memproses pesanan');
              }}
              actionLabel="Mulai Masak"
              actionIcon={<Play size={16} />}
              btnClass="bg-blue-600 hover:bg-blue-700"
            />
          ))}
        </KitchenColumn>

        {/* Preparing Column */}
        <KitchenColumn title="In Production" count={kitchenOrders.filter(o => o.orderStatus === 'PREPARING').length} active>
          {kitchenOrders.filter(o => o.orderStatus === 'PREPARING').map(order => (
            <KitchenCard 
              key={order.id} 
              order={order} 
              onAction={() => {
                updateOrderStatus(order.id, 'READY');
                toast.success('Pesanan siap diantar');
              }}
              actionLabel="Tandai Siap"
              actionIcon={<CheckCircle2 size={16} />}
              btnClass="bg-orange-500 hover:bg-orange-600"
            />
          ))}
        </KitchenColumn>

        {/* Ready Column */}
        <KitchenColumn title="Ready to Serve" count={kitchenOrders.filter(o => o.orderStatus === 'READY').length}>
          {kitchenOrders.filter(o => o.orderStatus === 'READY').map(order => (
            <KitchenCard 
              key={order.id} 
              order={order} 
              onAction={() => {
                updateOrderStatus(order.id, 'COMPLETED');
                toast.success('Pesanan selesai disajikan');
              }}
              actionLabel="Selesai / Diantar"
              actionIcon={<CheckCircle2 size={16} />}
              btnClass="bg-green-600 hover:bg-green-700"
              isReady
            />
          ))}
        </KitchenColumn>
      </div>
    </div>
  );
};

const KitchenColumn = ({ title, count, children, active }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center px-2">
      <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${active ? 'text-orange-500' : 'text-gray-500'}`}>
        {title}
      </h3>
      <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black">{count}</span>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const KitchenCard = ({ order, onAction, actionLabel, actionIcon, btnClass, isReady }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className={`bg-white/5 border border-white/10 p-6 rounded-[2.5rem] hover:border-white/20 transition-all ${isReady ? 'opacity-50' : ''}`}
  >
    <div className="flex justify-between items-start mb-6">
      <div>
        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{order.orderNumber}</span>
        <h4 className="text-xl font-black text-white">{order.table?.tableNumber}</h4>
        <p className="text-[10px] font-bold text-orange-500 mt-1 uppercase tracking-wider">{order.customerName}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Waktu</p>
        <p className="text-xs font-black text-orange-500">
          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>

    <div className="space-y-3 mb-8">
      {order.items.map(item => (
        <div key={item.id} className="flex justify-between text-xs">
          <span className="font-bold text-gray-300">
            <span className="text-orange-500 mr-2 font-black">{item.quantity}x</span>
            {item.menu?.name}
          </span>
        </div>
      ))}
    </div>

    <button 
      onClick={onAction}
      className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${btnClass}`}
    >
      {actionIcon}
      {actionLabel}
    </button>
  </motion.div>
);

export default KitchenDashboard;
