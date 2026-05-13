import React, { useState } from 'react';
import useCartStore from '../../store/useCartStore';
import api from '../../api/axios';
import { CreditCard, Banknote, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutPage = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('CASH'); // CASH or ONLINE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentDummy, setShowPaymentDummy] = useState(false);
  const navigate = useNavigate();
  const tableInfo = JSON.parse(localStorage.getItem('tableInfo'));

  const handleSubmitOrder = async () => {
    if (items.length === 0) return;
    
    if (!tableInfo || !tableInfo.id) {
      toast.error('Table not identified. Please scan QR code again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        tableId: tableInfo.id,
        items: items.map(i => ({ menuId: i.id, quantity: i.quantity, price: i.price, notes: i.notes })),
        paymentMethod,
        totalAmount: getTotal(),
      };

      const { data } = await api.post('/orders', orderData);
      
      if (paymentMethod === 'ONLINE') {
        setShowPaymentDummy(data);
      } else {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/order-status/${data.orderNumber}`);
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOnlinePaymentSuccess = async () => {
    try {
      // Simulate API call to update status to PAID
      await api.put(`/orders/${showPaymentDummy.id}/status`, { status: 'PAID' });
      toast.success('Payment successful!');
      clearCart();
      navigate(`/order-status/${showPaymentDummy.orderNumber}`);
    } catch (error) {
      toast.error('Payment update failed');
    }
  };

  if (items.length === 0 && !showPaymentDummy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/menu')} className="btn-primary">Go to Menu</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 p-4">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Order Summary */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex gap-3">
                  <span className="font-bold text-accent">{item.quantity}x</span>
                  <div>
                    <p className="font-semibold text-primary">{item.name}</p>
                    {item.notes && <p className="text-[10px] text-gray-400 italic">"{item.notes}"</p>}
                  </div>
                </div>
                <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-dashed pt-4 mt-4 flex justify-between items-center">
              <span className="text-gray-500 font-medium">Total Amount</span>
              <span className="text-2xl font-black text-primary">Rp {getTotal().toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg mb-4">Select Payment Method</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setPaymentMethod('CASH')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === 'CASH' ? 'border-accent bg-accent/5 text-accent' : 'border-gray-100 text-gray-400 grayscale'
              }`}
            >
              <Banknote size={32} className="mb-2" />
              <span className="font-bold text-sm">Pay at Cashier</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('ONLINE')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === 'ONLINE' ? 'border-accent bg-accent/5 text-accent' : 'border-gray-100 text-gray-400 grayscale'
              }`}
            >
              <CreditCard size={32} className="mb-2" />
              <span className="font-bold text-sm">Online Payment</span>
            </button>
          </div>
        </section>

        {/* Action Button */}
        <button 
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="w-full btn-accent flex items-center justify-center gap-2 h-14 shadow-xl shadow-accent/20 disabled:bg-gray-300 disabled:shadow-none"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Place Order Now'}
        </button>
      </main>

      {/* Dummy Payment Modal */}
      <AnimatePresence>
        {showPaymentDummy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="bg-primary p-8 text-center text-white">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <CreditCard size={32} className="text-accent-light" />
                </div>
                <h3 className="text-xl font-bold">Dummy Payment Gateway</h3>
                <p className="text-gray-400 text-sm mt-1">Transaction ID: TX-{Date.now().toString().slice(-6)}</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-500">Order Number</span>
                  <span className="font-bold">{showPaymentDummy.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-500">Payable Amount</span>
                  <span className="text-2xl font-black text-primary">Rp {showPaymentDummy.totalAmount.toLocaleString()}</span>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                  <div className="bg-blue-500 text-white p-1 rounded-full h-fit">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    This is a <strong>sandbox environment</strong>. Click the button below to simulate a successful payment.
                  </p>
                </div>

                <button 
                  onClick={handleOnlinePaymentSuccess}
                  className="w-full btn-primary h-14"
                >
                  Confirm Payment (Success)
                </button>
                <button 
                  onClick={() => setShowPaymentDummy(false)}
                  className="w-full text-gray-400 font-bold text-sm py-2"
                >
                  Cancel Payment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
