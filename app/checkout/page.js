"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { ShieldCheck, Truck, CreditCard, ChevronLeft, Package, MapPin, FileText, CheckCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useStore(state => state.cart);
  const clearCart = useStore(state => state.clearCart);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '', 
    email: '',
    phone: '',
    pincode: '',
    city: '',
    state: '',
    address1: '',
    address2: '',
    notes: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const deliveryFee = 0; // Delivery charges removed for now
  const totalAmount = subtotal + deliveryFee;
  const canCheckout = true;

  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      router.push('/');
    }
  }, [cart, router, isSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Pincode auto-fetch logic
    if (name === 'pincode' && value.length === 6 && /^\d+$/.test(value)) {
      fetchPincodeData(value);
    }
  };

  const fetchPincodeData = async (pin) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          city: postOffice.District || postOffice.Region || '',
          state: postOffice.State || ''
        }));
      }
    } catch (err) {
      console.error('Failed to fetch pincode details', err);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!canCheckout) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          ...formData
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (data.razorpayOrderId.startsWith('DEBUG_ORD')) {
        await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mock_success: true,
            internal_order_id: data.orderId
          })
        });
        setIsSuccess(true);
        clearCart();
        router.push(`/order/${data.orderId}`);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: data.amount * 100,
        currency: data.currency,
        name: "Pachi 3D",
        description: `Order ${data.orderId}`,
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setIsSuccess(true);
            clearCart();
            router.push(`/order/${data.orderId}`); 
          } else {
            setError(verifyData.error || 'Payment verification failed');
          }
        },
        prefill: {
          name: formData.customerName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#993B2A" 
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-8 font-sans text-gray-200">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white font-medium mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to gallery
        </button>

        <h1 className="text-2xl font-bold mb-8 text-white">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
          
          {/* Shipping Inputs Form */}
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8 bg-[#12100E] border border-orange-900/30 p-8 rounded-2xl shadow-xl">
            
            {error && (
              <div className="px-4 py-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl font-medium text-sm">
                {error}
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Full Name *</label>
                <input required name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3.5 text-gray-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3.5 text-gray-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Phone Number *</label>
                <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3.5 text-gray-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="border-t border-gray-800/80 pt-8 space-y-5">
              <h2 className="text-lg font-bold text-gray-300 flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-orange-500" />
                Shipping Address
              </h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">PIN Code *</label>
                <input required maxLength={6} name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3.5 text-gray-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600 tracking-wider" placeholder="6-digit PIN Code" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">City *</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3.5 text-gray-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600" placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">State *</label>
                  <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3.5 text-gray-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600" placeholder="State" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Address Line 1 *</label>
                <input required name="address1" value={formData.address1} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3.5 text-gray-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600" placeholder="House/Flat No, Building Name" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Address Line 2 (Optional)</label>
                <input name="address2" value={formData.address2} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3.5 text-gray-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600" placeholder="Street, Area, Landmark" />
              </div>
            </div>

            <div className="border-t border-gray-800/80 pt-8 space-y-5">
              <h2 className="text-lg font-bold text-gray-300 flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-orange-500" />
                Order Notes
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Special Instructions (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3.5 text-gray-200 focus:outline-none focus:border-orange-500/50 min-h-[100px] transition-colors placeholder-gray-600" placeholder="Any special instructions for the print team?" />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
               <div className="border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 bg-[#0A0A0A]/50">
                 <ShieldCheck className="text-orange-500 w-6 h-6" />
                 <div className="space-y-0.5">
                   <p className="text-xs font-bold text-gray-300">Quality Checked</p>
                   <p className="text-[10px] text-gray-500">Printed with care & inspected</p>
                 </div>
               </div>
               <div className="border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 bg-[#0A0A0A]/50">
                 <Package className="text-orange-500 w-6 h-6" />
                 <div className="space-y-0.5">
                   <p className="text-xs font-bold text-gray-300">Secure Packaging</p>
                   <p className="text-[10px] text-gray-500">Safe transit guaranteed</p>
                 </div>
               </div>
               <div className="border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 bg-[#0A0A0A]/50">
                 <CreditCard className="text-orange-500 w-6 h-6" />
                 <div className="space-y-0.5">
                   <p className="text-xs font-bold text-gray-300">Secure Payment</p>
                   <p className="text-[10px] text-gray-500">100% encrypted checkout</p>
                 </div>
               </div>
            </div>

          </form>

          {/* Checkout Right Side Panel */}
          <div className="bg-[#12100E] border border-gray-800/80 rounded-2xl sticky top-8 shadow-xl">
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="bg-[#0A0A0A] border border-gray-800 p-4 rounded-xl">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm text-gray-200 truncate pr-4">{item.fileName}</p>
                    </div>
                    <div className="flex gap-2 text-[10px] uppercase font-bold text-gray-500 mt-2 mb-3">
                       <span className="bg-gray-900 px-2 py-1 rounded">{item.config.material}</span>
                       <span className="bg-gray-900 px-2 py-1 rounded">{item.config.color}</span>
                       <span className="bg-gray-900 px-2 py-1 rounded">{item.config.strength}% Infill</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="flex gap-2">
                <input className="flex-1 bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50 placeholder-gray-600" placeholder="DISCOUNT CODE" />
                <button className="px-6 py-3 bg-[#1A1210] hover:bg-[#251815] border border-orange-900/30 text-orange-500 font-bold text-sm rounded-xl transition-colors">Apply</button>
              </div>

              <div className="space-y-3 font-medium text-sm pt-4 border-t border-gray-800">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-200">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Shipping</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    <span className="text-gray-200">₹{deliveryFee}</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-2xl font-black text-white">Total</span>
                  <p className="text-[10px] text-gray-500">Includes all taxes</p>
                </div>
                <span className="text-4xl font-black text-[#FF6347]">₹{totalAmount}</span>
              </div>



              <button 
                type="submit" 
                form="checkout-form"
                disabled={loading || !canCheckout}
                className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-[#9B3D2B] hover:bg-[#8A3525] text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none mt-2"
              >
                <CreditCard className="w-5 h-5" />
                {loading ? 'Processing...' : `Place Secure Order`}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 pt-2">
                <ShieldCheck className="w-3 h-3" />
                Payments secured by Razorpay
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
