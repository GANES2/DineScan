import React from 'react';
import { useStore } from '../../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CreditCard, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, placeOrder, activeTable } = useStore();
  const navigate = useNavigate();
  const [customer, setCustomer] = React.useState({ name: '', phone: '' });
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (method) => {
    if (!customer.name || !customer.phone) {
      return toast.error('Mohon isi nama dan nomor HP Anda');
    }
    const orderId = placeOrder(method, customer);
    if (orderId) {
      toast.success('Pesanan berhasil dibuat!');
      if (method === 'ONLINE') {
        navigate(`/payment/${orderId}`);
      } else {
        navigate(`/status/${orderId}`);
      }
    }
  };

  if (cart.length === 0) return (
    <div className="flex flex-col items-center justify-center h-screen p-10 bg-gray-50">
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
        <Trash2 size={40} />
      </div>
      <h2 className="text-xl font-bold mb-2">Keranjang Kosong</h2>
      <p className="text-gray-400 text-sm text-center mb-8">Wah, perutmu masih kosong nih. Yuk tambah makanan!</p>
      <Link to={activeTable ? `/table/${activeTable.code}` : '/'} className="btn-primary w-full max-w-xs">Kembali ke Menu</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-40">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black">Keranjang Saya</h1>
      </div>

      <div className="space-y-4">
        {cart.map(item => (
          // ... (existing cart items mapping)
          <div key={item.id} className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex gap-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="flex-grow flex flex-col justify-between py-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm">{item.name}</h3>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400"><Trash2 size={16} /></button>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-orange-500 font-black text-sm">Rp {item.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-full border border-gray-100">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-xs">-</button>
                  <span className="font-bold text-xs">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-sm text-xs">+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CUSTOMER INFO FORM */}
      <div className="mt-10 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#0B1220]">Informasi Pelanggan</h3>
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Nama Lengkap"
            className="w-full bg-gray-50 rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-orange-500/10 border border-transparent focus:border-orange-500 transition-all"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
          <input 
            type="tel" 
            placeholder="Nomor WhatsApp (Untuk Promo)"
            className="w-full bg-gray-50 rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-orange-500/10 border border-transparent focus:border-orange-500 transition-all"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          />
        </div>
        <p className="text-[10px] text-gray-400 italic px-2">* Informasi ini digunakan untuk pengiriman status pesanan & promo spesial.</p>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-6 bg-white border-t border-gray-100 rounded-t-[3rem] shadow-2xl">
        <div className="flex justify-between items-center mb-6 px-2">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Total Pembayaran</p>
          <p className="text-xl font-black text-orange-500">Rp {cartTotal.toLocaleString()}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleCheckout('CASH')}
            className="p-4 bg-gray-900 text-white rounded-2xl flex flex-col items-center gap-1 hover:bg-black transition-all"
          >
            <DollarSign size={20} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase">Bayar di Kasir</span>
          </button>
          <button 
            onClick={() => handleCheckout('ONLINE')}
            className="p-4 bg-orange-500 text-white rounded-2xl flex flex-col items-center gap-1 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            <CreditCard size={20} />
            <span className="text-[10px] font-black uppercase">Bayar Online</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
