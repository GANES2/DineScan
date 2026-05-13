import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const { orderId } = useParams(); // Ini adalah orderNumber (misal: ORD-123)
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useStore();
  
  // Mencari berdasarkan orderNumber
  const order = orders.find(o => o.orderNumber === orderId);

  const handleSuccess = async () => {
    if (order) {
      // Mengirimkan ID database yang asli ke server
      await updateOrderStatus(order.id, 'PAID');
      toast.success('Pembayaran Berhasil!');
      navigate(`/status/${orderId}`);
    }
  };

  if (!order) return <div className="p-10 text-center text-white bg-[#0B1220] min-h-screen">Order {orderId} tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-[#0B1220] p-8 flex flex-col items-center justify-center text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white rounded-[3rem] p-8 text-[#0B1220] shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-black">Payment Gateway</h2>
          <p className="text-gray-400 text-xs mt-1">Order: {orderId}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-3xl mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400">Merchant</span>
            <span className="text-xs font-black">DineScan Restaurant</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400">Amount</span>
            <span className="text-lg font-black text-orange-500">Rp {order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 border-2 border-orange-500 rounded-2xl flex items-center gap-4">
             <div className="w-8 h-8 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center">
                <CreditCard size={16} />
             </div>
             <span className="text-xs font-bold">QRIS / Virtual Account</span>
          </div>
        </div>

        <button 
          onClick={handleSuccess}
          className="w-full bg-[#0B1220] text-white p-5 rounded-3xl mt-10 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all"
        >
          <CheckCircle2 size={18} className="text-orange-500" />
          Simulasi Bayar Berhasil
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-6 italic">Ini adalah halaman simulasi pembayaran.</p>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
