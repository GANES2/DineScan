import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Printer, CheckCircle, Send, XCircle, LayoutDashboard, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CashierDashboard = () => {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.table.code.toLowerCase().includes(search.toLowerCase());
    if (filter === 'ALL') return matchesSearch;
    return o.status === filter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-600';
      case 'WAITING_CASHIER_PAYMENT': return 'bg-orange-100 text-orange-600';
      case 'WAITING_PAYMENT': return 'bg-blue-100 text-blue-600';
      case 'PREPARING': return 'bg-purple-100 text-purple-600';
      case 'READY': return 'bg-teal-100 text-teal-600';
      case 'CANCELLED': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0B1220] p-8 text-white flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black">DS</div>
          <h1 className="text-xl font-black">Cashier Hub</h1>
        </div>

        <nav className="flex-grow space-y-2">
           <button className="w-full flex items-center gap-4 p-4 bg-orange-500 text-white rounded-2xl font-bold">
             <LayoutDashboard size={20} /> Orders
           </button>
        </nav>

        <div className="pt-6 border-t border-white/10">
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Logged in as</p>
           <p className="font-bold">Staff Kasir 01</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-auto p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-[#0B1220]">Manajemen Pesanan</h2>
            <p className="text-gray-400 mt-1">Kelola transaksi dan status pesanan hari ini.</p>
          </div>
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Order ID atau Meja..."
              className="w-full bg-white rounded-2xl py-3 pl-12 pr-4 text-sm shadow-sm outline-none border border-transparent focus:border-orange-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {['ALL', 'WAITING_CASHIER_PAYMENT', 'WAITING_PAYMENT', 'PAID', 'PREPARING', 'READY', 'COMPLETED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filter === f ? 'bg-[#0B1220] text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              {f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredOrders.map(order => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 group hover:shadow-2xl hover:shadow-black/5 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{order.id}</span>
                    <h3 className="text-xl font-black text-[#0B1220] mt-1">{order.table.code}</h3>
                    <p className="text-[11px] font-bold text-orange-500 flex items-center gap-1 mt-1">
                      <Users size={12} /> {order.customerName}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-[2rem] p-6 mb-6 space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                       <span className="font-bold text-gray-600"><span className="text-orange-500 mr-2">{item.quantity}x</span> {item.name}</span>
                       <span className="font-black text-gray-400">Rp {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-black text-sm uppercase">Total</span>
                    <span className="font-black text-lg text-orange-500">Rp {order.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {order.status === 'WAITING_CASHIER_PAYMENT' && (
                    <button 
                      onClick={() => {
                        updateOrderStatus(order.id, 'PAID');
                        toast.success('Pembayaran Tunai Dikonfirmasi');
                      }}
                      className="flex-grow bg-green-500 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-600"
                    >
                      <CheckCircle size={16} /> Konfirmasi Bayar
                    </button>
                  )}
                  {order.status === 'PAID' && (
                    <button 
                      onClick={() => {
                        updateOrderStatus(order.id, 'PREPARING');
                        toast.success('Pesanan dikirim ke Dapur');
                      }}
                      className="flex-grow bg-[#0B1220] text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <Send size={16} /> Kirim ke Dapur
                    </button>
                  )}
                  <button className="p-4 bg-gray-100 text-gray-400 rounded-2xl hover:text-[#0B1220]">
                    <Printer size={18} />
                  </button>
                  {['WAITING_PAYMENT', 'WAITING_CASHIER_PAYMENT'].includes(order.status) && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                      className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default CashierDashboard;
