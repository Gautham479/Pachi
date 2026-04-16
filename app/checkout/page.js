"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, CreditCard, ChevronLeft, Package, MapPin, FileText, CheckCircle, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically loads the Razorpay script — guarantees window.Razorpay
// is available before the modal opens (works reliably on Vercel/production)
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

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
  const deliveryFee = 0;
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
        body: JSON.stringify({ items: cart, ...formData })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (data.razorpayOrderId.startsWith('DEBUG_ORD')) {
        await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mock_success: true, internal_order_id: data.orderId })
        });
        setIsSuccess(true);
        clearCart();
        router.push(`/order/${data.orderId}`);
        return;
      }

      // Ensure Razorpay script is loaded before opening modal
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Payment gateway failed to load. Please check your connection and try again.');
        setLoading(false);
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
          try {
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
              setError(verifyData.error || 'Payment verification failed. Please contact support.');
            }
          } catch (verifyErr) {
            console.error('Verification fetch error:', verifyErr);
            setError('Failed to verify payment. Please contact support with your order ID: ' + data.orderId);
          }
        },
        prefill: { name: formData.customerName, email: formData.email, contact: formData.phone },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
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

  const inputClass = "w-full bg-surface-muted/40 border border-surface-border rounded-xl px-4 py-3.5 text-fg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-fg-subtle text-sm backdrop-blur-sm";
  const labelClass = "block text-sm font-bold text-fg-muted mb-2";

  return (
    <div className="min-h-screen py-8 font-sans relative overflow-hidden">
      {/* Razorpay script is loaded dynamically in handleCheckout for Vercel compatibility */}

      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back button */}
        <motion.button
          onClick={() => router.back()}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-fg-muted hover:text-fg font-bold mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to gallery
        </motion.button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-fg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-500" />
            </div>
            Secure Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start">

          {/* Form */}
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-semibold text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contact */}
            <div className="rounded-2xl border border-surface-border/60 bg-surface-card/60 backdrop-blur-xl p-6 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500/50 to-accent-500/50" />
              <h2 className="text-base font-black text-fg flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-500/15 border border-primary-500/30 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" />
                </div>
                Contact Information
              </h2>
              <div>
                <label className={labelClass}>Full Name *</label>
                <input required name="customerName" value={formData.customerName} onChange={handleInputChange} className={inputClass} placeholder="John Doe" />
              </div>
              <div>
                <label className={labelClass}>Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} placeholder="you@example.com" />
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input required name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="+91 98765 43210" />
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-2xl border border-surface-border/60 bg-surface-card/60 backdrop-blur-xl p-6 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-500/50 to-purple-500/50" />
              <h2 className="text-base font-black text-fg flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent-500/15 border border-accent-500/30 flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 text-accent-500" />
                </div>
                Shipping Address
              </h2>
              <div>
                <label className={labelClass}>PIN Code *</label>
                <input required maxLength={6} name="pincode" value={formData.pincode} onChange={handleInputChange} className={inputClass} placeholder="6-digit PIN Code" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City *</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} className={inputClass} placeholder="City" />
                </div>
                <div>
                  <label className={labelClass}>State *</label>
                  <input required name="state" value={formData.state} onChange={handleInputChange} className={inputClass} placeholder="State" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Address Line 1 *</label>
                <input required name="address1" value={formData.address1} onChange={handleInputChange} className={inputClass} placeholder="House/Flat No, Building Name" />
              </div>
              <div>
                <label className={labelClass}>Address Line 2 (Optional)</label>
                <input name="address2" value={formData.address2} onChange={handleInputChange} className={inputClass} placeholder="Street, Area, Landmark" />
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-2xl border border-surface-border/60 bg-surface-card/60 backdrop-blur-xl p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/50 to-primary-500/50" />
              <h2 className="text-base font-black text-fg flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                </div>
                Order Notes
              </h2>
              <div>
                <label className={labelClass}>Special Instructions (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className={`${inputClass} min-h-[100px] resize-none`} placeholder="Any special instructions for the print team?" />
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <ShieldCheck className="w-5 h-5 text-primary-500" />, title: 'Quality Checked', sub: 'Printed with care & inspected' },
                { icon: <Package className="w-5 h-5 text-accent-500" />, title: 'Secure Packaging', sub: 'Safe transit guaranteed' },
                { icon: <CreditCard className="w-5 h-5 text-purple-400" />, title: 'Secure Payment', sub: '100% encrypted checkout' },
              ].map((badge, i) => (
                <div key={i} className="rounded-xl border border-surface-border/60 bg-surface-card/40 backdrop-blur-sm p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted/60 border border-surface-border flex items-center justify-center">
                    {badge.icon}
                  </div>
                  <p className="text-xs font-black text-fg">{badge.title}</p>
                  <p className="text-[10px] text-fg-subtle leading-tight">{badge.sub}</p>
                </div>
              ))}
            </div>
          </form>

          {/* Order summary */}
          <div className="rounded-2xl border border-primary-500/20 bg-surface-card/70 backdrop-blur-xl sticky top-8 overflow-hidden"
            style={{ boxShadow: '0 0 30px rgba(99,102,241,0.1)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

            <div className="p-6 md:p-8 space-y-6">
              <h2 className="font-black text-fg text-lg">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="bg-surface-muted/40 border border-surface-border/60 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-sm text-fg truncate pr-4">{item.fileName}</p>
                      <p className="text-primary-500 font-black text-sm whitespace-nowrap">₹{item.price}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[item.config.material, item.config.color, `${item.config.strength}% Infill`].map((tag) => (
                        <span key={tag} className="text-[10px] uppercase font-black text-fg-subtle bg-surface-muted px-2 py-0.5 rounded-md border border-surface-border">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount */}
              <div className="flex gap-2">
                <input className="flex-1 bg-surface-muted/40 border border-surface-border rounded-xl px-4 py-3 text-sm text-fg focus:outline-none focus:border-primary-500/50 placeholder:text-fg-subtle backdrop-blur-sm" placeholder="DISCOUNT CODE" />
                <button className="px-5 py-3 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 text-primary-500 font-black text-sm rounded-xl transition-colors">Apply</button>
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm pt-2 border-t border-surface-border/50">
                <div className="flex justify-between text-fg-muted">
                  <span>Subtotal</span>
                  <span className="text-fg font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-fg-muted">
                  <span>Shipping</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-400 font-black text-xs bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">FREE</span>
                  ) : (
                    <span className="text-fg font-bold">₹{deliveryFee}</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border/50 flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black text-fg">Total</p>
                  <p className="text-[10px] text-fg-subtle">Includes all taxes</p>
                </div>
                <span className="text-4xl font-black gradient-text">₹{totalAmount}</span>
              </div>

              {/* Place order */}
              <motion.button
                type="submit"
                form="checkout-form"
                disabled={loading || !canCheckout}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 btn-glow bg-gradient-to-r from-primary-500 to-accent-500 text-white transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Place Secure Order
                  </>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-fg-subtle">
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
