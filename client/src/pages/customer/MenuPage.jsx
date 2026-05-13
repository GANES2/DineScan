import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ShoppingCart, Plus, Minus, Search, Utensils, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const MenuPage = () => {
  const { tableCode } = useParams();
  const { menus, cart, activeTable, setActiveTable, addToCart, updateQuantity, loading } = useStore();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const loadTable = async () => {
      if (tableCode) {
        try {
          await setActiveTable(tableCode);
        } catch (err) {
          setFetchError(true);
        }
      }
    };
    loadTable();
  }, [tableCode]);

  const filteredMenus = (menus || []).filter(m => 
    (category === 'All' || m.category?.name === category) &&
    (m.name.toLowerCase().includes(search.toLowerCase()))
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Jika sedang memuat
  if (loading && !activeTable) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-sm font-bold text-gray-400">Menghubungkan ke Meja {tableCode}...</p>
      </div>
    );
  }

  // Jika meja tidak ditemukan setelah loading selesai
  if (!activeTable && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-10 text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-black text-[#0B1220]">Meja Tidak Ditemukan</h2>
        <p className="text-gray-400 text-sm mt-2 mb-6">Maaf, kode meja "{tableCode}" tidak terdaftar di sistem kami.</p>
        <Link to="/" className="px-8 py-3 bg-[#0B1220] text-white rounded-2xl font-bold text-sm">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white p-6 sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#0B1220]">DineScan</h1>
            <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">
              Table: <span className="text-[#0B1220]">{activeTable?.tableNumber || tableCode}</span>
            </p>
          </div>
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
            <Utensils size={20} />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari makanan favoritmu..."
            className="w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto p-6 no-scrollbar">
        {['All', 'Makanan', 'Minuman', 'Dessert', 'Promo'].map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              category === c ? 'bg-[#0B1220] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <AnimatePresence mode="popLayout">
          {filteredMenus.map(menu => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={menu.id}
              className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex gap-4"
            >
              <img src={menu.image} alt={menu.name} className="w-24 h-24 rounded-2xl object-cover" />
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-bold text-sm text-[#0B1220]">{menu.name}</h3>
                  <p className="text-orange-500 font-black text-sm mt-1">Rp {menu.price.toLocaleString()}</p>
                </div>
                
                <div className="flex justify-end">
                  {cart.find(item => item.id === menu.id) ? (
                    <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-full">
                      <button 
                        onClick={() => updateQuantity(menu.id, cart.find(i => i.id === menu.id).quantity - 1)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-xs">{cart.find(i => i.id === menu.id).quantity}</span>
                      <button 
                        onClick={() => updateQuantity(menu.id, cart.find(i => i.id === menu.id).quantity + 1)}
                        className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        addToCart(menu);
                        toast.success('Ditambahkan ke keranjang');
                      }}
                      className="bg-[#0B1220] text-white p-2.5 rounded-full shadow-lg shadow-black/10"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cart Float */}
      {cartCount > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 inset-x-6 z-50"
        >
          <Link 
            to="/cart"
            className="bg-[#0B1220] p-4 rounded-[2rem] shadow-2xl flex justify-between items-center text-white border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B1220]">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Pesanan</p>
                <p className="font-black text-sm">Rp {cartTotal.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-orange-500 px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-wider">
              Lihat Keranjang
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default MenuPage;
