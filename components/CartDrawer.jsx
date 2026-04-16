"use client";

import React from 'react';
import { X, Trash2, ShoppingCart, Rocket, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart, removeFromCart } = useStore();
  const router = useRouter();

  const totalCost = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-overlay backdrop-blur-sm z-[100]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full md:w-[460px] z-[101] flex flex-col overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-surface-bg/95 backdrop-blur-2xl border-l border-surface-border/60" />
            <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

            {/* Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-surface-border/50">
              <div className="flex items-center gap-3 text-fg font-black text-xl">
                <div className="w-9 h-9 rounded-xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-primary-500" />
                </div>
                Your Cart
                {cart.length > 0 && (
                  <span className="text-sm font-bold text-primary-500 bg-primary-500/10 border border-primary-500/20 px-2 py-0.5 rounded-full">
                    {cart.length} item{cart.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <motion.button
                onClick={closeCart}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-surface-muted rounded-xl transition-colors text-fg-muted hover:text-fg border border-surface-border/50"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 relative custom-scrollbar">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-surface-muted/60 border border-surface-border flex items-center justify-center">
                    <Package className="w-10 h-10 text-fg-subtle" />
                  </div>
                  <p className="text-fg-muted font-semibold text-lg">Your Cart is empty</p>
                  <p className="text-fg-subtle text-sm">Upload a model or browse products to get started</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {cart.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative rounded-xl border border-surface-border/60 bg-surface-card/60 backdrop-blur-sm p-4 overflow-hidden group"
                      >
                        {/* Hover glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        {/* Left accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary-500 to-accent-500 rounded-l-xl" />

                        <div className="flex justify-between items-start mb-2 pr-8 pl-2">
                          <p className="text-fg font-black truncate max-w-[220px] text-sm">{item.fileName}</p>
                          <p className="text-primary-500 font-black whitespace-nowrap text-sm">₹{item.price}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-y-1 text-xs text-fg-muted pl-2">
                          <p>Material: <span className="text-fg font-bold">{item.config.material}</span></p>
                          <p>Color: <span className="text-fg font-bold">{item.config.color}</span></p>
                          <p>Type: <span className="text-fg font-bold">{item.config.colorMode || 'Single Color'}</span></p>
                          <p>Quality: <span className="text-fg font-bold">{item.config.quality.split(' ')[0]}</span></p>
                          <p>Strength: <span className="text-fg font-bold">{item.config.strength}%</span></p>
                        </div>

                        <motion.button
                          onClick={() => removeFromCart(item.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-3 right-3 p-1.5 rounded-lg text-fg-subtle hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative border-t border-surface-border/50 p-6 pb-8 md:pb-6"
              >
                <div className="absolute inset-0 bg-surface-card/60 backdrop-blur-sm" />

                <div className="relative space-y-4">
                  <p className="text-xs text-fg-muted">
                    Build volume: 256 × 256 × 256 mm
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-fg-muted font-semibold">Total Cost</span>
                    <span className="text-3xl font-black gradient-text">₹{totalCost}</span>
                  </div>

                  <motion.button
                    onClick={() => { closeCart(); router.push('/checkout'); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-glow bg-gradient-to-r from-primary-500 to-accent-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Rocket className="w-5 h-5" />
                    Proceed to secure checkout
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
