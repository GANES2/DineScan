import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Clock, CheckCircle2, ChefHat, Utensils, ArrowLeft, Receipt, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusPage = () => {
  const { orderId } = useParams();
  const { orders } = useStore();
  const order = orders.find(o => o.orderNumber === orderId);

  if (!order) return <div className="p-10 text-center">Order tidak ditemukan.</div>;

  const steps = [
    { id: 'WAITING_CASHIER_PAYMENT', label: 'Menunggu Kasir', icon: Receipt, desc: 'Silakan lakukan pembayaran di kasir.' },
    { id: 'WAITING_PAYMENT', label: 'Menunggu Pembayaran', icon: Clock, desc: 'Selesaikan pembayaran online Anda.' },
    { id: 'PAID', label: 'Dibayar', icon: CheckCircle2, desc: 'Pembayaran dikonfirmasi. Pesanan masuk antrean.' },
    { id: 'PREPARING', label: 'Dapur', icon: ChefHat, desc: 'Chef sedang menyiapkan masakanmu!' },
    { id: 'READY', label: 'Siap Saji', icon: Utensils, desc: 'Pesananmu sudah siap dan sedang diantar!' },
    { id: 'COMPLETED', label: 'Selesai', icon: CheckCircle2, desc: 'Terima kasih sudah berkunjung!' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order?.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to={`/table/${order?.table?.tableNumber}/menu`} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-black text-[#0B1220]">Status Pesanan</h1>
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mb-4 relative">
            {order?.orderStatus === 'PREPARING' ? <ChefHat size={40} className="animate-bounce" /> : <Clock size={40} />}
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-4 border-orange-500 rounded-full animate-ping" />
          </div>
          <h2 className="text-2xl font-black text-[#0B1220]">{steps[currentStepIndex]?.label || order.status}</h2>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed px-10">{steps[currentStepIndex]?.desc}</p>
        </div>

        <div className="space-y-8 relative">
           <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gray-100" />
           {steps.filter(s => {
             if (order.paymentMethod === 'ONLINE' && s.id === 'WAITING_CASHIER_PAYMENT') return false;
             if (order.paymentMethod === 'CASH' && s.id === 'WAITING_PAYMENT') return false;
             return true;
           }).map((step, idx) => {
             const stepIdx = steps.findIndex(s => s.id === step.id);
             const isActive = stepIdx <= currentStepIndex;
             return (
               <div key={step.id} className={`flex items-center gap-6 relative z-10 transition-all ${isActive ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${isActive ? 'bg-[#0B1220] text-orange-500' : 'bg-gray-200 text-gray-400 shadow-none'}`}>
                   <step.icon size={24} />
                 </div>
                 <div>
                   <p className="font-black text-sm">{step.label}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Step {idx + 1}</p>
                 </div>
               </div>
             )
           })}
        </div>
      </div>

      <div className="bg-[#0B1220] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Receipt size={100} />
        </div>
        <h3 className="font-black text-lg mb-6">Ringkasan Order</h3>
        <div className="space-y-4 mb-8">
           {order.items.map(item => (
             <div key={item.id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-black text-orange-500">{item.quantity}x</span>
                  <span className="text-gray-300">{item.menu?.name}</span>
                </div>
                <span className="font-bold">Rp {(item.price * item.quantity).toLocaleString()}</span>
             </div>
           ))}
        </div>
        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
           <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Bayar</span>
           <span className="text-2xl font-black text-orange-500">Rp {order?.totalAmount?.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="flex-grow bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold shadow-sm">
          <Bell size={18} className="text-orange-500" />
          Panggil Pelayan
        </button>
        <button className="flex-grow bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold shadow-sm">
          <Receipt size={18} className="text-orange-500" />
          Minta Bill
        </button>
      </div>
    </div>
  );
};

export default StatusPage;
