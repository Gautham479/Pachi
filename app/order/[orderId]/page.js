"use client";

import React, { useEffect, useState, use } from 'react';
import { ShieldCheck, Truck, Package, CheckCircle, Clock, ChevronRight, Download, Receipt } from 'lucide-react';
import Link from 'next/link';

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
        <div className="bg-surface-card border border-red-500/20 p-8 rounded-3xl max-w-md text-center shadow-lg">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-fg mb-4">Order Not Found</h1>
          <p className="text-fg-muted mb-8">{error || "We couldn't locate your order details."}</p>
          <Link href="/" className="inline-block bg-primary-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const { items } = order;

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-surface-bg py-10 font-sans text-fg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Success Header */}
        <div className={`bg-surface-card border-t-4 ${order.status === 'PAID' ? 'border-t-green-500' : 'border-t-red-500'} border border-surface-border p-8 rounded-b-3xl rounded-t-xl shadow-sm text-center md:text-left md:flex items-center justify-between`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={`w-20 h-20 ${order.status === 'PAID' ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-full flex items-center justify-center flex-shrink-0`}>
              {order.status === 'PAID' ? (
                 <CheckCircle className="w-10 h-10 text-green-500" />
              ) : (
                 <ShieldCheck className="w-10 h-10 text-red-500" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-fg">
                {order.status === 'PAID' ? 'Order Confirmed! 🎉' : 'Payment Incomplete or Cancelled'}
              </h1>
              
              {order.status === 'PAID' ? (
                <>
                  <p className="text-fg-muted text-lg">
                    Thank you so much, {order.customerName}! We are genuinely thrilled to receive your order. Your 3D models are already heading to our print queue and will be crafted with care.
                  </p>
                  <div className="mt-4 bg-primary-500/10 border border-primary-500/20 text-primary-600 px-4 py-3 rounded-xl text-sm text-left">
                    <span className="font-bold">NOTE: </span>
                    All details of your order have been safely sent to your mail. For any queries, please don't hesitate to contact us at <a href="mailto:ngthamtalur@gmail.com" className="font-bold underline">ngthamtalur@gmail.com</a> or call <span className="font-bold">9900458138</span>.
                  </div>
                </>
              ) : (
                <p className="text-fg-muted text-lg">
                  We noticed your payment was cancelled or failed, {order.customerName}. Don't worry, your files are safe! You can try placing the order again whenever you're ready.
                </p>
              )}
              
              <p className="text-sm font-medium text-fg-muted mt-5 inline-block bg-surface-muted px-3 py-1 rounded-full">
                Order <span className="text-primary-500 font-bold uppercase">{order.orderId}</span>
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
             <button className="flex items-center gap-2 px-6 py-3 bg-surface-muted hover:bg-surface-border border border-surface-border text-fg font-bold rounded-xl transition-colors">
               <Receipt className="w-5 h-5" />
               View Invoice
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Order Details Left Column */}
          <div className="space-y-8">
            <div className="bg-surface-card border border-surface-border p-6 rounded-3xl shadow-sm">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-surface-border pb-4">
                 <Clock className="w-5 h-5 text-primary-500" />
                 Transaction Details
               </h2>
               <div className="space-y-4 text-sm">
                 <div className="flex justify-between items-center">
                   <span className="text-fg-muted">Payment status:</span>
                   <span className="bg-green-500/10 text-green-500 font-bold px-2 py-1 rounded">
                     {order.status}
                   </span>
                 </div>
                 <div className="flex py-2 justify-between items-center border-b border-surface-border/50">
                   <span className="text-fg-muted">Date:</span>
                   <span className="font-semibold text-fg">{orderDate}</span>
                 </div>
                 <div className="flex py-2 justify-between items-center border-b border-surface-border/50">
                   <span className="text-fg-muted">Payment ID:</span>
                   <span className="font-semibold text-fg text-xs bg-surface-muted px-2 py-1 rounded">{order.razorpayPaymentId || "N/A"}</span>
                 </div>
                 <div className="flex py-2 justify-between items-center bg-primary-500/10 p-3 rounded-xl mt-4 border border-primary-500/20 text-primary-600 font-bold">
                   <span>Amount Paid:</span>
                   <span className="text-lg">₹{order.totalAmount}</span>
                 </div>
               </div>
            </div>

            <div className="bg-surface-card border border-surface-border p-6 rounded-3xl shadow-sm">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-surface-border pb-4">
                 <Truck className="w-5 h-5 text-primary-500" />
                 Shipping Address
               </h2>
               <div className="text-sm space-y-2 text-fg">
                 <p className="font-bold text-lg">{order.customerName}</p>
                 <p>{order.address}</p>
                 <p>{order.city}, {order.state} {order.pincode}</p>
                 <p className="pt-2 text-fg-muted">Phone: {order.phone}</p>
                 <p className="text-fg-muted">Email: {order.email}</p>
               </div>
            </div>
          </div>

          {/* Items Summary Right Column */}
          <div className="bg-surface-card border border-surface-border p-6 rounded-3xl shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-surface-border pb-4">
               <Package className="w-5 h-5 text-primary-500" />
               Items Summary
            </h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items && items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start bg-surface-bg p-4 rounded-xl border border-surface-border shadow-sm">
                  <div className="overflow-hidden">
                    <p className="font-bold text-fg text-sm pr-4 break-words">{item.fileName}</p>
                    <div className="text-xs text-fg-muted mt-2 space-y-1">
                      <p>Material: <span className="font-medium text-fg">{item.material} - {item.color}</span></p>
                      <p>Quality: <span className="font-medium text-fg">{item.quality}</span></p>
                      <p>Strength: <span className="font-medium text-fg">{item.strength}% Infill</span></p>
                    </div>
                  </div>
                  <div className="font-extrabold text-primary-500 flex-shrink-0 ml-4">
                    ₹{item.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-surface-border space-y-3 font-medium text-sm">
              <div className="flex justify-between text-fg-muted">
                <span>Subtotal ({items.length} items)</span>
                <span className="text-fg">₹{order.totalAmount - order.deliveryFee}</span>
              </div>
              <div className="flex justify-between items-center text-fg-muted">
                <span>Delivery</span>
                {order.deliveryFee === 0 ? (
                  <span className="text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded text-xs">FREE</span>
                ) : (
                  <span className="text-fg">₹{order.deliveryFee}</span>
                )}
              </div>
              <div className="pt-4 border-t border-surface-border border-dashed flex justify-between items-end mt-4">
                <span className="text-lg font-bold text-fg-muted">Total</span>
                <span className="text-3xl font-black text-fg">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-8 text-center pb-12">
          <Link href="/" className="inline-flex items-center gap-2 bg-cta hover:opacity-90 text-cta-contrast font-bold px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95">
            Continue Shopping
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
