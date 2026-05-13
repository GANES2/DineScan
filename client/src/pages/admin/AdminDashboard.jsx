import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Edit3, BarChart3, UtensilsCrossed, Tablet, Settings, LogOut, TrendingUp, DollarSign, ShoppingBag, QrCode as QrIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { menus, tables, orders, deleteMenu } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  const salesData = [
    { name: '08:00', total: 400 },
    { name: '10:00', total: 700 },
    { name: '12:00', total: 2000 },
    { name: '14:00', total: 1500 },
    { name: '16:00', total: 1800 },
    { name: '18:00', total: 2400 },
    { name: '20:00', total: 1900 },
  ];

  const totalRevenue = orders.filter(o => o.status === 'COMPLETED' || o.status === 'PAID').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#0B1220] rounded-xl flex items-center justify-center text-white font-black italic">DS</div>
          <span className="text-xl font-black text-[#0B1220]">Admin Panel</span>
        </div>

        <nav className="flex-grow space-y-2">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BarChart3 size={20} />} label="Overview" />
          <TabButton active={activeTab === 'menus'} onClick={() => setActiveTab('menus')} icon={<UtensilsCrossed size={20} />} label="Menu Management" />
          <TabButton active={activeTab === 'tables'} onClick={() => setActiveTab('tables')} icon={<Tablet size={20} />} label="Tables & QR" />
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={20} />} label="Order History" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="System Settings" />
        </nav>

        <div className="pt-6 border-t border-gray-100">
           <button className="w-full flex items-center gap-4 p-4 text-gray-400 hover:text-red-500 transition-colors font-bold">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow overflow-auto p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#0B1220] capitalize">{activeTab}</h1>
            <p className="text-gray-400 mt-1">Manage your restaurant operations from here.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <span className="text-sm font-bold">Super Admin</span>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Today Revenue" value={`Rp ${totalRevenue.toLocaleString()}`} icon={<DollarSign className="text-green-500" />} color="bg-green-50" />
              <StatCard label="Total Orders" value={orders.length} icon={<ShoppingBag className="text-blue-500" />} color="bg-blue-50" />
              <StatCard label="Menu Items" value={menus.length} icon={<UtensilsCrossed className="text-orange-500" />} color="bg-orange-50" />
              <StatCard label="Active Tables" value={tables.length} icon={<Tablet className="text-purple-500" />} color="bg-purple-50" />
            </div>

            {/* Chart Area */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 h-[400px]">
              <h3 className="font-black text-xl mb-8">Revenue Analytics</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="adminTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#F97316" strokeWidth={4} fillOpacity={1} fill="url(#adminTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'menus' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Menu Items ({menus.length})</h3>
              <button className="px-6 py-2.5 bg-[#0B1220] text-white rounded-xl text-xs font-black flex items-center gap-2">
                <Plus size={18} /> Add New Menu
              </button>
            </div>
            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Image</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {menus.map(menu => (
                    <tr key={menu.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4"><img src={menu.image} alt={menu.name} className="w-12 h-12 rounded-lg object-cover" /></td>
                      <td className="px-6 py-4 font-bold">{menu.name}</td>
                      <td className="px-6 py-4"><span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black">{menu.category}</span></td>
                      <td className="px-6 py-4 font-black">Rp {menu.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors"><Edit3 size={18} /></button>
                        <button onClick={() => { deleteMenu(menu.id); toast.success('Menu dihapus'); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tables' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map(table => (
              <div key={table.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                  <QRCodeSVG value={`http://localhost:5173/table/${table.code}`} size={120} />
                </div>
                <h4 className="text-xl font-black">{table.code}</h4>
                <p className="text-xs text-gray-400 mt-1 mb-6">Status: <span className="text-green-500 font-bold">{table.status}</span></p>
                <button className="w-full bg-[#0B1220] text-white p-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <QrIcon size={14} /> Download QR
                </button>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Semua Pesanan ({orders.length})</h3>
              <button className="px-6 py-2.5 bg-[#0B1220] text-white rounded-xl text-xs font-black flex items-center gap-2">
                 Download Report (CSV)
              </button>
            </div>
            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Table</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-[10px] text-gray-400">{order.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm">{order.customerName}</p>
                        <p className="text-[10px] text-orange-500 font-bold">{order.customerPhone}</p>
                      </td>
                      <td className="px-6 py-4 font-bold">{order.table.code}</td>
                      <td className="px-6 py-4 font-black">Rp {order.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-wider">{order.status.replace(/_/g, ' ')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${active ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-50'}`}>
    {icon} {label}
  </button>
);

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-6 shadow-sm">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-xl font-black text-[#0B1220]">{value}</h4>
    </div>
  </div>
);

export default AdminDashboard;
