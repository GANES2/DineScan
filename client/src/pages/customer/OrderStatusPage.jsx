import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import io from 'socket.io-client';
import { CheckCircle2, Clock, ChefHat, Utensils, ShoppingBag, XCircle, Home, Receipt, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OrderStatusPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://172.20.10.2:5001');

    // Safety timeout: If data not loaded in 10s, show error screen
    const timeout = setTimeout(() => {
      if (!order) setError(true);
    }, 10000);

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/number/${orderNumber}`);
        setOrder(data);
        clearTimeout(timeout);
        
        // Join room using internal ID for status updates
        socket.emit('join-room', `order-${data.id}`);
      } catch (error) {
        console.error('Order not found');
        setError(true);
        clearTimeout(timeout);
      }
    };
    fetchOrder();

    socket.on('status-changed', (updatedOrder) => {
      setOrder(updatedOrder);
    });

    return () => {
      socket.disconnect();
      clearTimeout(timeout);
    };
  }, [orderNumber]);

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-gray-50">
      <XCircle size={64} className="text-red-500 mb-6" />
      <h2 className="text-2xl font-black text-primary mb-2">Order Not Found</h2>
      <p className="text-gray-500 mb-8 font-medium leading-relaxed">The order you're looking for doesn't exist or has been cleared from our system.</p>
      <button onClick={() => navigate('/menu')} className="btn-primary w-full max-w-xs shadow-xl shadow-primary/20">Back to Menu</button>
    </div>
  );

  if (!order) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-bold text-gray-400">Syncing Order Data...</p>
    </div>
  );

  const steps = [
    { id: 'WAITING_PAYMENT', label: 'Waiting Payment', icon: Clock },
    { id: 'WAITING_CASHIER_PAYMENT', label: 'Waiting Cashier', icon: Receipt },
    { id: 'PAID', label: 'Payment Received', icon: CheckCircle2 },
    { id: 'PREPARING', label: 'In Kitchen', icon: ChefHat },
    { id: 'READY', label: 'Ready to Serve', icon: Utensils },
    { id: 'COMPLETED', label: 'Completed', icon: ShoppingBag },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.orderStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'CANCELLED': return 'bg-red-500';
      case 'READY': return 'bg-green-500';
      case 'PAID': return 'bg-blue-500';
      default: return 'bg-accent';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-primary text-white p-8 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10 max-w-2xl mx-auto flex justify-between items-start">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">Order Status</p>
            <h1 className="text-3xl font-black mb-1">{order.orderNumber}</h1>
            <p className="text-white/80">Table: <span className="text-accent-light font-bold">{order.table.tableNumber}</span></p>
          </div>
          <button 
            onClick={() => navigate('/menu')}
            className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
          >
            <Home size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 -mt-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => {
              toast.success('Waiter is on the way!', { icon: '💁‍♂️' });
            }}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
              <Bell size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Call Waiter</span>
          </button>
          
          <button 
            onClick={() => {
               toast.success('Bill request sent to cashier', { icon: '📄' });
            }}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center">
              <Receipt size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Request Bill</span>
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm mb-6">
          {order.orderStatus === 'CANCELLED' ? (
            <div className="text-center py-6">
              <XCircle size={64} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-600">Order Cancelled</h2>
              <p className="text-gray-500 mt-2">Please contact our staff for more information.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex || (idx === currentStepIndex && order.orderStatus !== 'WAITING_PAYMENT' && order.orderStatus !== 'WAITING_CASHIER_PAYMENT');
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;

                // Only show relevant steps
                if (order.paymentMethod === 'ONLINE' && step.id === 'WAITING_CASHIER_PAYMENT') return null;
                if (order.paymentMethod === 'CASH' && step.id === 'WAITING_PAYMENT') return null;

                return (
                  <div key={step.id} className="flex items-start gap-6 relative">
                    {idx < steps.length - 1 && (
                      <div className={`absolute left-[19px] top-10 w-[2px] h-[calc(100%+32px)] ${isCompleted ? 'bg-accent' : 'bg-gray-100'}`} />
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${
                      isCompleted ? 'bg-accent text-white scale-110' : isCurrent ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                    </div>
                    <div>
                      <h4 className={`font-bold transition-all ${isCurrent ? 'text-xl text-primary' : isCompleted ? 'text-gray-400' : 'text-gray-300'}`}>
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <p className="text-sm text-gray-500 mt-1 animate-pulse font-medium">
                          {order.orderStatus === 'WAITING_CASHIER_PAYMENT' 
                            ? 'Please head to the cashier to pay.' 
                            : 'We are processing your request...'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Details Card */}
        <section className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50">
          <div className="flex items-center gap-2 mb-6">
            <Receipt size={20} className="text-gray-400" />
            <h2 className="font-bold text-xl">Order Details</h2>
          </div>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-primary">{item.menu.name} <span className="text-accent text-sm ml-1">x{item.quantity}</span></p>
                  {item.notes && <p className="text-xs text-gray-400 mt-0.5 italic">"{item.notes}"</p>}
                </div>
                <p className="font-semibold text-gray-600">Rp {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500 font-medium">Payment Method</span>
                <span className="font-bold text-primary">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-xl">
                <span className="font-extrabold text-primary">Total Paid</span>
                <span className="font-black text-accent">Rp {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </section>

        {order.orderStatus === 'WAITING_CASHIER_PAYMENT' && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-6 bg-accent text-white p-6 rounded-3xl shadow-xl shadow-accent/30"
          >
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Clock size={20} />
              Payment Required
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              Silakan lakukan pembayaran di kasir dengan menunjukkan nomor order: 
              <strong className="block text-2xl mt-2 tracking-widest">{order.orderNumber}</strong>
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default OrderStatusPage;
