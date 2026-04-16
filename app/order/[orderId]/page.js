"use client";

import React, { useEffect, useState, use } from 'react';
import { ShieldCheck, Truck, Package, CheckCircle, Clock, ChevronRight, Receipt } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OrderConfirmationPage(props) {
  const params = use(props.params);
  const { orderId } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch order');
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl border-2 border-primary-500/30 border-t-primary-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-fg-muted font-semibold">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl border border-red-500/20 bg-surface-card/80 backdrop-blur-xl p-10 max-w-md text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-fg mb-4">Order Not Found</h1>
          <p className="text-fg-muted mb-8">{error || "We couldn't locate your order details."}</p>
          <Link href="/" className="inline-flex items-center gap-2 btn-glow bg-gradient-to-r from-primary-500 to-accent-500 text-white font-black px-6 py-3 rounded-xl transition-all">
            Return to Store
          </Link>
        </motion.div>
      </div>
    );
  }

  const { items } = order;
  const isPaid = order.status === 'PAID';

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen py-10 font-sans text-fg relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">

        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-2xl border overflow-hidden ${
            isPaid ? 'border-green-500/30' : 'border-red-500/30'
          } bg-surface-card/70 backdrop-blur-xl p-8 shadow-xl`}
          style={{ boxShadow: isPaid ? '0 0 40px rgba(34,197,94,0.1)' : '0 0 40px rgba(239,68,68,0.1)' }}
        >
          {/* Top accent */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${isPaid ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-orange-400'}`} />

          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isPaid ? 'bg-green-500/15 border border-green-500/30' : 'bg-red-500/15 border border-red-500/30'
                }`}
                style={{ boxShadow: isPaid ? '0 0 20px rgba(34,197,94,0.2)' : '0 0 20px rgba(239,68,68,0.2)' }}
              >
                {isPaid ? (
                  <CheckCircle className="w-10 h-10 text-green-400" />
                ) : (
                  <ShieldCheck className="w-10 h-10 text-red-400" />
                )}
              </motion.div>

              <div>
                <h1 className="text-3xl font-black tracking-tight mb-2 text-fg">
                  {isPaid ? 'Order Confirmed! 🎉' : 'Payment Incomplete or Cancelled'}
                </h1>

                {isPaid ? (
                  <>
                    <p className="text-fg-muted text-base max-w-xl">
                      Thank you so much, {order.customerName}! We are genuinely thrilled to receive your order. Your 3D models are already heading to our print queue and will be crafted with care.
                    </p>
                    <div className="mt-4 bg-primary-500/10 border border-primary-500/20 text-primary-500 px-4 py-3 rounded-xl text-sm">
                      <span className="font-black">NOTE: </span>
                      All details of your order have been safely sent to your mail. For any queries, please don't hesitate to contact us at{' '}
                      <a href="mailto:ngthamtalur@gmail.com" className="font-black underline">ngthamtalur@gmail.com</a>{' '}
                      or call <span className="font-black">9900458138</span>.
                    </div>
                  </>
                ) : (
                  <p className="text-fg-muted text-base max-w-xl">
                    We noticed your payment was cancelled or failed, {order.customerName}. Don't worry, your files are safe! You can try placing the order again whenever you're ready.
                  </p>
                )}

                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-muted/60 border border-surface-border text-sm font-bold text-fg-muted">
                  Order <span className="text-primary-500 uppercase">{order.orderId}</span>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 px-5 py-3 bg-surface-muted/60 hover:bg-surface-muted border border-surface-border text-fg font-bold rounded-xl transition-colors flex-shrink-0">
              <Receipt className="w-4 h-4" />
              View Invoice
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left column */}
          <div className="space-y-6">
            {/* Transaction */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-surface-border/60 bg-surface-card/70 backdrop-blur-xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500/50 to-accent-500/50" />
              <h2 className="text-lg font-black mb-5 flex items-center gap-2 border-b border-surface-border/50 pb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-500/15 border border-primary-500/30 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary-500" />
                </div>
                Transaction Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-fg-muted">Payment status:</span>
                  <span className={`font-black px-2.5 py-1 rounded-lg text-xs ${
                    isPaid ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-surface-border/40">
                  <span className="text-fg-muted">Date:</span>
                  <span className="font-bold text-fg text-xs">{orderDate}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-surface-border/40">
                  <span className="text-fg-muted">Payment ID:</span>
                  <span className="font-bold text-fg text-xs bg-surface-muted px-2 py-1 rounded-lg">{order.razorpayPaymentId || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center bg-primary-500/10 border border-primary-500/20 p-3 rounded-xl mt-2">
                  <span className="text-primary-500 font-black">Amount Paid:</span>
                  <span className="text-xl font-black gradient-text">₹{order.totalAmount}</span>
                </div>
              </div>
            </motion.div>

            {/* Shipping */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-surface-border/60 bg-surface-card/70 backdrop-blur-xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-500/50 to-purple-500/50" />
              <h2 className="text-lg font-black mb-5 flex items-center gap-2 border-b border-surface-border/50 pb-4">
                <div className="w-8 h-8 rounded-lg bg-accent-500/15 border border-accent-500/30 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-accent-500" />
                </div>
                Shipping Address
              </h2>
              <div className="text-sm space-y-2">
                <p className="font-black text-lg text-fg">{order.customerName}</p>
                <p className="text-fg-muted">{order.address}</p>
                <p className="text-fg-muted">{order.city}, {order.state} {order.pincode}</p>
                <p className="pt-2 text-fg-subtle">Phone: {order.phone}</p>
                <p className="text-fg-subtle">Email: {order.email}</p>
              </div>
            </motion.div>
          </div>

          {/* Items summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-surface-border/60 bg-surface-card/70 backdrop-blur-xl p-6 h-fit relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/50 to-primary-500/50" />
            <h2 className="text-lg font-black mb-5 flex items-center gap-2 border-b border-surface-border/50 pb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-400" />
              </div>
              Items Summary
            </h2>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {items && items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="flex justify-between items-start bg-surface-muted/40 border border-surface-border/60 p-4 rounded-xl"
                >
                  <div className="overflow-hidden">
                    <p className="font-black text-fg text-sm pr-4 break-words">{item.fileName}</p>
                    <div className="text-xs text-fg-muted mt-2 space-y-1">
                      <p>Material: <span className="font-bold text-fg">{item.material} - {item.color}</span></p>
                      <p>Quality: <span className="font-bold text-fg">{item.quality}</span></p>
                      <p>Strength: <span className="font-bold text-fg">{item.strength}% Infill</span></p>
                    </div>
                  </div>
                  <div className="font-black text-primary-500 flex-shrink-0 ml-4">₹{item.price}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-surface-border/50 space-y-3 text-sm">
              <div className="flex justify-between text-fg-muted">
                <span>Subtotal ({items.length} items)</span>
                <span className="text-fg font-bold">₹{order.totalAmount - order.deliveryFee}</span>
              </div>
              <div className="flex justify-between items-center text-fg-muted">
                <span>Delivery</span>
                {order.deliveryFee === 0 ? (
                  <span className="text-green-400 font-black text-xs bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">FREE</span>
                ) : (
                  <span className="text-fg font-bold">₹{order.deliveryFee}</span>
                )}
              </div>
              <div className="pt-4 border-t border-surface-border/50 border-dashed flex justify-between items-end">
                <span className="text-lg font-black text-fg-muted">Total</span>
                <span className="text-3xl font-black gradient-text">₹{order.totalAmount}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4 text-center pb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 btn-glow bg-gradient-to-r from-primary-500 to-accent-500 text-white font-black px-8 py-4 rounded-xl transition-all"
          >
            Continue Shopping
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
