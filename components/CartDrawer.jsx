"use client";

import React from 'react';
import { X, Trash2, ShoppingCart, Rocket } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart, removeFromCart } = useStore();

  if (!isCartOpen) return null;

  const totalCost = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={closeCart}
      />
      
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-surface-bg border-l border-surface-border shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-border/50 bg-surface-card">
          <div className="flex items-center gap-3 text-white font-bold text-xl">
            <ShoppingCart className="w-5 h-5 text-primary-500" />
            Your Cart
          </div>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-surface-border rounded-full transition-colors text-[#8B8581] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/60 text-center text-lg">Your Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-surface-card border border-surface-border rounded-xl p-4 flex flex-col relative">
                  <div className="flex justify-between items-start mb-2 pr-6">
                    <p className="text-white font-bold truncate max-w-[250px]">{item.fileName}</p>
                    <p className="text-white font-extrabold whitespace-nowrap">₹{item.price}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-1 text-xs text-[#8B8581]">
                    <p>Material: <span className="text-[#DCD1CC] font-medium">{item.config.material}</span></p>
                    <p>Color: <span className="text-[#DCD1CC] font-medium">{item.config.color}</span></p>
                    <p>Quality: <span className="text-[#DCD1CC] font-medium">{item.config.quality.split(' ')[0]}</span></p>
                    <p>Strength: <span className="text-[#DCD1CC] font-medium">{item.config.strength}%</span></p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 text-[#8B8581] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-surface-border/50 bg-surface-card p-6 pb-8 md:pb-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#8B8581] font-medium text-lg">Total Cost</span>
              <span className="text-3xl text-white font-black">₹{totalCost}</span>
            </div>
            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-primary-500/20">
              <Rocket className="w-5 h-5" /> 
              Proceed to secure checkout
            </button>
          </div>
        )}

      </div>
    </>
  );
}
