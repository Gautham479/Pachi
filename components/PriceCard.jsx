"use client";

import React from 'react';
import { ShoppingCart, UploadCloud } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function PriceCard() {
  const { selectedFile, mockPrice } = useStore();

  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden shadow-xl mt-6">
      <div className="p-6">
        <div className="flex flex-col items-center justify-center p-8 bg-surface-bg rounded-xl border border-surface-border text-center mb-6 min-h-[160px] transition-all">
          {selectedFile ? (
            <div className="animate-in fade-in zoom-in duration-300">
              <p className="text-sm text-fg-subtle font-medium tracking-wide uppercase mb-2">Estimated Price</p>
              <h2 className="text-4xl sm:text-5xl font-black text-fg tracking-tight">
                <span className="text-primary-500 mr-1">₹</span>{mockPrice}
              </h2>
              <p className="text-xs text-primary-500 mt-3 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Includes material & processing
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mb-4">
                <UploadCloud size={24} />
              </div>
              <p className="text-fg-muted font-medium">Upload your model to see price</p>
              <p className="text-sm text-fg-subtle mt-1">Instant pricing, no signup needed</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-3">
          <button 
            disabled={!selectedFile}
            className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-all
              ${selectedFile 
                ? 'bg-cta text-cta-contrast hover:opacity-90 hover:shadow-lg shadow-black/10 dark:shadow-black/40 active:scale-95' 
                : 'bg-surface-border text-fg-subtle cursor-not-allowed'
              }
            `}
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
          <button 
            disabled={!selectedFile}
            className={`py-4 px-6 rounded-xl font-bold transition-all
              ${selectedFile 
                ? 'bg-surface-muted border border-surface-border text-fg hover:border-primary-500 hover:text-primary-500 active:scale-95' 
                : 'bg-surface-muted border border-surface-border/50 text-fg-subtle cursor-not-allowed'
              }
            `}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
