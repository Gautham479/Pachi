"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { ShieldCheck, Truck, CreditCard, ChevronLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useStore(state => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Derived totals
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const deliveryFee = subtotal >= 400 ? 0 : 40;
  const totalAmount = subtotal + deliveryFee;

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
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

      // If keys are not set, it's a debug order
      if (data.razorpayOrderId.startsWith('DEBUG_ORD')) {
        await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mock_success: true,
            internal_order_id: data.orderId
          })
        });
        alert(`Payment successful in Mock Mode! Order ${data.orderId} registered.`);
        router.push('/');
        return;
      }

      // Initialize Razorpay box
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // Needs setting in .env if public
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
            alert('Payment Successful!');
            router.push('/'); 
            // In real world, maybe clear cart and push to /success
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
          color: "#f59e0b" // match primary amber
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
    <div className="min-h-screen bg-surface-bg py-8 font-sans text-fg">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-fg-muted hover:text-fg font-medium mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to standard gallery
        </button>

        <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          
          {/* Shipping Inputs Form */}
          <form onSubmit={handleCheckout} className="space-y-8 bg-surface-card border border-surface-border p-8 rounded-3xl shadow-sm">
            
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-medium">
                {error}
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="text-primary-500" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-fg-muted mb-1.5">Full Name</label>
                  <input required name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-fg-muted mb-1.5">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-fg-muted mb-1.5">Phone Number</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="+91 9876543210" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Truck className="text-primary-500" />
                Shipping Details
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-fg-muted mb-1.5">Address Line</label>
                  <textarea required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[80px]" placeholder="123 Printing Lane, Apt 4B" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-fg-muted mb-1.5">City</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-fg-muted mb-1.5">State</label>
                    <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-fg-muted mb-1.5">Pincode</label>
                    <input required name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 bg-cta hover:opacity-90 text-cta-contrast shadow-lg shadow-black/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                <CreditCard className="w-6 h-6" />
                {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
              </button>
            </div>
          </form>

          {/* Money Calculation Block */}
          <div className="bg-surface-card border border-surface-border rounded-3xl sticky top-24 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 bg-surface-muted/30">
              <h3 className="text-xl font-bold mb-6 text-fg">Order Summary</h3>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex justify-between items-center bg-surface-bg p-3 rounded-xl border border-surface-border shadow-sm">
                    <div className="overflow-hidden">
                      <p className="font-bold text-fg text-sm truncate pr-4">{item.fileName}</p>
                      <p className="text-xs text-fg-muted mt-0.5">{item.config.material} • {item.config.quality.split(' ')[0]}</p>
                    </div>
                    <div className="font-extrabold text-primary-500">
                      ₹{item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-surface-border">
              <div className="space-y-3 font-medium text-sm">
                <div className="flex justify-between text-fg-muted">
                  <span>Subtotal</span>
                  <span className="text-fg">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-fg-muted">
                  <div className="flex flex-col">
                    <span>Delivery</span>
                    {subtotal < 400 && <span className="text-[10px] text-primary-600">Free delivery over ₹400</span>}
                  </div>
                  {deliveryFee === 0 ? (
                    <span className="text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded text-xs">FREE</span>
                  ) : (
                    <span className="text-fg">₹{deliveryFee}</span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-surface-border border-dashed flex justify-between items-end">
                <span className="text-lg font-bold text-fg-muted">Total</span>
                <span className="text-4xl font-black text-fg">₹{totalAmount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
