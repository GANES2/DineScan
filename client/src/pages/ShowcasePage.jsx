import React from 'react';
import { 
  QrCode, Search, ShoppingCart, CreditCard, Clock, 
  ChefHat, LayoutDashboard, TrendingUp, DollarSign, 
  Users, CheckCircle2, ChevronRight, ArrowRight,
  Monitor, Smartphone, Database, Layers, Receipt,
  Flame, Bell, LogOut, Printer, Send, XCircle, Plus,
  MapPin, Phone, Mail, Globe, Sparkles, ShoppingBag,
  Zap, Shield, Smartphone as PhoneIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { motion } from 'framer-motion';

// --- STYLES & TOKENS ---
const COLORS = {
  bg: '#0B1220',
  accent: '#F97316',
  accentSoft: '#FFEDD5',
  card: '#FFFFFF',
  surface: '#F8FAFC',
  border: '#E5E7EB',
  text: '#1E293B',
  muted: '#64748B'
};

const ShowcasePage = () => {
  const salesData = [
    { name: '08:00', total: 400 },
    { name: '10:00', total: 700 },
    { name: '12:00', total: 2000 },
    { name: '14:00', total: 1500 },
    { name: '16:00', total: 1800 },
    { name: '18:00', total: 2400 },
    { name: '20:00', total: 1900 },
  ];

  const paymentData = [
    { name: 'Online', value: 72, color: '#F97316' },
    { name: 'Cash', value: 28, color: '#0B1220' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] font-sans text-[#1E293B] selection:bg-[#F97316] selection:text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION (TOP LEFT CONCEPT) */}
      <section className="relative pt-20 pb-32 px-10 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8 z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-[#F97316] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <QrCode className="text-white" size={28} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">DineScan</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
              QR Table Ordering <br />
              <span className="text-[#F97316]">& Cashier System</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
              Sistem pemesanan makanan/minuman menggunakan QR meja dengan integrasi payment gateway dan manajemen order untuk kasir dan kitchen.
            </p>
          </motion.div>

          {/* Standing QR Card Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-64 bg-white p-6 rounded-[32px] shadow-2xl shadow-orange-500/10 border-b-8 border-gray-200"
          >
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Scan to Order</p>
              <div className="w-32 h-32 bg-white p-2 rounded-xl border-2 border-gray-100 flex items-center justify-center">
                <QrCode size={100} className="text-[#0B1220]" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#0B1220] text-white rounded-full flex items-center justify-center font-bold text-xs">05</span>
                <span className="font-black text-lg">MEJA 05</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2. CUSTOMER FLOW (6 MOCKUP HP) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          <PhoneMockup title="Scan QR Meja" delay={0.1}>
            <div className="h-full bg-black/90 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 border-2 border-dashed border-orange-500 rounded-2xl mb-4 flex items-center justify-center animate-pulse">
                <QrCode className="text-orange-500" size={40} />
              </div>
              <p className="text-white font-bold">Scanning...</p>
              <p className="text-white/40 text-[10px] mt-2 italic">Arahkan kamera ke barcode meja</p>
            </div>
          </PhoneMockup>

          <PhoneMockup title="Menu List" delay={0.2}>
            <div className="bg-white h-full p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-xs">Meja 05</h3>
                <ShoppingCart size={14} className="text-orange-500" />
              </div>
              <div className="space-y-3">
                <div className="h-2 w-20 bg-gray-100 rounded-full mb-4" />
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-2 p-2 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0" />
                    <div className="flex-grow space-y-1">
                      <div className="h-2 w-full bg-gray-200 rounded-full" />
                      <div className="h-2 w-1/2 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PhoneMockup>

          <PhoneMockup title="Cart" delay={0.3}>
            <div className="bg-white h-full p-4 flex flex-col">
              <h3 className="font-black text-xs mb-4">Your Cart</h3>
              <div className="flex-grow space-y-2">
                <div className="flex justify-between items-center text-[10px] border-b pb-2">
                   <span className="font-bold">2x Nasi Goreng</span>
                   <span>Rp 70.000</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                   <span className="font-bold">1x Es Teh</span>
                   <span>Rp 10.000</span>
                </div>
              </div>
              <div className="bg-orange-500 text-white p-2 rounded-xl text-center text-[10px] font-bold">Checkout (Rp 80.000)</div>
            </div>
          </PhoneMockup>

          <PhoneMockup title="Checkout" delay={0.4}>
            <div className="bg-white h-full p-4">
              <h3 className="font-black text-xs mb-4">Payment Method</h3>
              <div className="space-y-2">
                 <div className="border-2 border-orange-500 p-2 rounded-xl flex items-center gap-2">
                   <CreditCard size={12} className="text-orange-500" />
                   <span className="text-[10px] font-bold">Online Payment</span>
                 </div>
                 <div className="border p-2 rounded-xl flex items-center gap-2 opacity-50">
                   <DollarSign size={12} />
                   <span className="text-[10px] font-bold">Pay at Cashier</span>
                 </div>
              </div>
              <div className="mt-10 bg-gray-900 text-white p-2 rounded-xl text-center text-[10px] font-bold">Place Order</div>
            </div>
          </PhoneMockup>

          <PhoneMockup title="Payment" delay={0.5}>
            <div className="bg-[#1E293B] h-full p-4 flex flex-col items-center justify-center text-center">
              <Shield className="text-green-500 mb-4" size={32} />
              <h4 className="text-white text-[12px] font-bold">Payment Gateway</h4>
              <div className="w-full h-1 bg-white/10 rounded-full mt-4">
                 <div className="w-3/4 h-full bg-green-500 rounded-full" />
              </div>
              <p className="text-white/40 text-[8px] mt-2">Processing secure payment...</p>
            </div>
          </PhoneMockup>

          <PhoneMockup title="Order Status" delay={0.6}>
            <div className="bg-white h-full p-4">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
                  <ChefHat size={16} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Preparing</h4>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-green-500 rounded-full" />
                   <div className="h-1 flex-grow bg-gray-100" />
                 </div>
                 <p className="text-[9px] font-bold text-center text-gray-400">Chef is cooking your order!</p>
              </div>
            </div>
          </PhoneMockup>
        </div>
      </section>

      {/* 3. STAFF DASHBOARDS (HORIZONTAL WRAPPER) */}
      <section className="bg-white py-32 px-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto space-y-32">
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
            {/* 3.1 DASHBOARD KASIR */}
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white"><LayoutDashboard /></div>
                  <div>
                    <h2 className="text-3xl font-black">Cashier Dashboard</h2>
                    <p className="text-gray-400">Manajemen pesanan & konfirmasi pembayaran tunai.</p>
                  </div>
               </div>
               <div className="card border border-gray-100 shadow-2xl rounded-[32px] overflow-hidden">
                  <div className="bg-gray-900 p-4 flex justify-between items-center">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Active Orders</span>
                    <Search className="text-white/40" size={16} />
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                      <tr>
                        <th className="p-5 text-left">Order #</th>
                        <th className="p-5 text-left">Table</th>
                        <th className="p-5 text-left">Method</th>
                        <th className="p-5 text-left">Total</th>
                        <th className="p-5 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <OrderRow id="#ORD-250514-0007" table="Meja 05" method="Cash" price="Rp 103.000" status="WAITING" />
                      <OrderRow id="#ORD-250514-0006" table="Meja 02" method="Online" price="Rp 85.000" status="PAID" />
                      <OrderRow id="#ORD-250514-0005" table="Meja 03" method="Online" price="Rp 120.000" status="PREPARING" />
                    </tbody>
                  </table>
               </div>
            </div>

            {/* 3.2 KITCHEN ORDER BOARD */}
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white"><Flame /></div>
                  <div>
                    <h2 className="text-3xl font-black">Kitchen Board</h2>
                    <p className="text-gray-400">Kanban pemrosesan pesanan secara real-time.</p>
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-4 h-[400px]">
                  <KitchenColumn title="Waiting" color="bg-gray-100" text="text-gray-500">
                    <KitchenCard id="#0007" table="T5" items="2x Nasi Goreng" action="Start Preparing" btn="bg-blue-500" />
                  </KitchenColumn>
                  <KitchenColumn title="Preparing" color="bg-orange-50" text="text-orange-500">
                    <KitchenCard id="#0006" table="T2" items="1x Mie Ayam" action="Mark as Ready" btn="bg-green-500" />
                  </KitchenColumn>
                  <KitchenColumn title="Ready" color="bg-green-50" text="text-green-500">
                    <KitchenCard id="#0005" table="T3" items="3x Es Teh" isReady />
                  </KitchenColumn>
               </div>
            </div>
          </div>

          {/* 3.3 ADMIN ANALYTICS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
             <div className="xl:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black">Admin Analytics</h2>
                    <p className="text-gray-400">Pantau performa bisnis Anda secara real-time.</p>
                  </div>
                  <div className="flex gap-4">
                    <StatBox label="Today Revenue" value="Rp 2.450.000" icon={<TrendingUp size={16}/>} />
                    <StatBox label="Total Order" value="128" icon={<ShoppingBag size={16}/>} />
                  </div>
                </div>
                <div className="card p-8 h-[350px] border border-gray-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F97316" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                      <Tooltip />
                      <Area type="monotone" dataKey="total" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
             <div className="card p-8 border border-gray-100 flex flex-col">
                <h3 className="font-black text-xl mb-6">Payment Methods</h3>
                <div className="flex-grow flex items-center justify-center h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={paymentData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 mt-6">
                   <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#F97316]"/> <span>Online Payment</span></div>
                      <span className="font-bold">72%</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#0B1220]"/> <span>Cash / Tunai</span></div>
                      <span className="font-bold">28%</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. INFOGRAPHIC FOOTER (QR, TECH, FLOW, ERD) */}
      <section className="bg-[#0B1220] py-32 px-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           
           {/* QR CODES EXAMPLE */}
           <div className="space-y-6">
              <h3 className="text-white font-black text-xl flex items-center gap-2"><QrCode className="text-orange-500" /> Table QR Codes</h3>
              <div className="grid grid-cols-3 gap-2">
                 {[1, 2, 3, 4, 5].map(i => (
                   <div key={i} className="bg-white/5 border border-white/10 p-2 rounded-xl text-center">
                      <QrCode size={40} className="mx-auto text-white/20 mb-2" />
                      <span className="text-[10px] text-white font-bold tracking-tighter">MEJA 0{i}</span>
                   </div>
                 ))}
                 <div className="bg-orange-500/10 border border-orange-500/20 p-2 rounded-xl flex items-center justify-center text-orange-500">
                    <Plus size={20} />
                 </div>
              </div>
           </div>

           {/* TECH STACK */}
           <div className="space-y-6">
              <h3 className="text-white font-black text-xl flex items-center gap-2"><Layers className="text-orange-500" /> Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                 {['React + Vite', 'Tailwind CSS', 'Node.js', 'Express.js', 'MySQL', 'Prisma', 'Socket.IO', 'JWT', 'Framer Motion'].map(t => (
                   <span key={t} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[11px] text-gray-300 font-medium">
                     {t}
                   </span>
                 ))}
              </div>
           </div>

           {/* PAYMENT FLOW */}
           <div className="space-y-6">
              <h3 className="text-white font-black text-xl flex items-center gap-2"><CreditCard className="text-orange-500" /> Payment Flow</h3>
              <div className="space-y-4">
                 <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <p className="text-orange-500 text-[10px] font-black uppercase mb-2">Digital Flow</p>
                    <p className="text-white/60 text-[10px] leading-relaxed">Checkout → <span className="text-white">Payment Gateway</span> → Success → Paid → Kitchen</p>
                 </div>
                 <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <p className="text-blue-400 text-[10px] font-black uppercase mb-2">Cash Flow</p>
                    <p className="text-white/60 text-[10px] leading-relaxed">Checkout → <span className="text-white">Waiting Cashier</span> → Confirm → Paid → Kitchen</p>
                 </div>
              </div>
           </div>

           {/* ERD SIMPLE & RECEIPT */}
           <div className="space-y-6">
              <h3 className="text-white font-black text-xl flex items-center gap-2"><Database className="text-orange-500" /> Database ERD</h3>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                 <div className="space-y-3 text-[10px] font-mono text-white/40">
                    <div className="flex items-center gap-2"><span className="text-orange-500">Table</span> [id, tableNumber, status, qrCode]</div>
                    <div className="flex items-center gap-2"><span className="text-blue-400">Order</span> [id, orderNumber, tableId, total, status]</div>
                    <div className="flex items-center gap-2"><span className="text-green-400">Menu</span> [id, name, price, categoryId, image]</div>
                    <div className="flex items-center gap-2"><span className="text-purple-400">User</span> [id, name, email, role, password]</div>
                 </div>
              </div>
           </div>
        </div>

        {/* BOTTOM RECEIPT MOCKUP */}
        <div className="max-w-[1440px] mx-auto mt-20 flex justify-center">
           <div className="bg-white w-full max-w-sm rounded-3xl p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#F97316]" />
              <div className="text-center mb-8">
                 <h2 className="text-2xl font-black italic tracking-tighter">DineScan</h2>
                 <p className="text-gray-400 text-xs mt-2">QR Order Receipt</p>
              </div>
              <div className="border-t border-dashed border-gray-200 py-4 space-y-2 text-xs">
                 <div className="flex justify-between"><span>2x Nasi Goreng Spesial</span><span>Rp 70.000</span></div>
                 <div className="flex justify-between"><span>1x Ayam Bakar Madu</span><span>Rp 42.000</span></div>
                 <div className="flex justify-between"><span>2x Es Teh Manis</span><span>Rp 10.000</span></div>
              </div>
              <div className="border-t border-gray-900 pt-4 mt-4 flex justify-between items-center">
                 <span className="font-black text-lg uppercase">Total</span>
                 <span className="font-black text-2xl text-[#F97316]">Rp 122.000</span>
              </div>
              <div className="mt-8 text-center text-[10px] text-gray-300 font-mono">
                 <p>#ORD-250514-0007</p>
                 <p className="mt-2">THANK YOU FOR DINING WITH US</p>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
};

// --- SUBCOMPONENTS ---

const PhoneMockup = ({ children, title, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    className="space-y-4"
  >
    <div className="relative mx-auto border-[6px] border-gray-900 rounded-[2.5rem] h-[360px] w-[180px] shadow-2xl overflow-hidden bg-white">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 flex items-center justify-center z-20">
         <div className="w-12 h-1 bg-white/20 rounded-full" />
      </div>
      {/* Screen Content */}
      <div className="h-full pt-6">
        {children}
      </div>
    </div>
    <p className="text-center text-[11px] font-black uppercase tracking-widest text-white/60">{title}</p>
  </motion.div>
);

const OrderRow = ({ id, table, method, price, status }) => (
  <tr className="hover:bg-gray-50/80 transition-colors group">
    <td className="p-5 font-mono text-[11px] font-bold text-gray-400 group-hover:text-primary">{id}</td>
    <td className="p-5"><span className="px-3 py-1 bg-gray-100 rounded-full font-bold text-[11px]">{table}</span></td>
    <td className="p-5 font-medium text-gray-500">{method}</td>
    <td className="p-5 font-black text-primary">{price}</td>
    <td className="p-5">
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
        status === 'PAID' ? 'bg-green-100 text-green-600' : 
        status === 'WAITING' ? 'bg-orange-100 text-orange-600' : 
        'bg-blue-100 text-blue-600'
      }`}>
        {status}
      </span>
    </td>
  </tr>
);

const KitchenColumn = ({ title, color, text, children }) => (
  <div className="flex flex-col h-full">
    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${text}`}>{title}</h4>
    <div className={`${color} rounded-3xl p-3 flex-grow space-y-3 border border-gray-100`}>
      {children}
    </div>
  </div>
);

const KitchenCard = ({ id, table, items, action, btn, isReady }) => (
  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between mb-2">
      <span className="font-mono text-[10px] font-bold text-gray-400">{id}</span>
      <span className="font-black text-[10px]">{table}</span>
    </div>
    <p className="text-[10px] font-bold text-gray-600 mb-3">{items}</p>
    {!isReady && (
      <button className={`w-full py-2 ${btn} text-white text-[9px] font-black rounded-lg uppercase`}>
        {action}
      </button>
    )}
    {isReady && (
      <div className="w-full py-2 bg-green-50 text-green-600 text-[9px] font-black rounded-lg uppercase text-center flex items-center justify-center gap-1">
        <CheckCircle2 size={10} /> Ready
      </div>
    )}
  </div>
);

const StatBox = ({ label, value, icon }) => (
  <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 flex items-center gap-3">
    <div className="text-orange-500">{icon}</div>
    <div className="text-right">
       <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">{label}</p>
       <p className="font-black text-sm text-primary leading-none">{value}</p>
    </div>
  </div>
);

export default ShowcasePage;
