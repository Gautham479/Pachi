"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <div className="py-2 sm:py-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Col: Text & Headings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-border bg-surface-card text-sm text-fg-muted font-medium mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
            Fast & Easy Online 3D Printing Service
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold text-fg tracking-tight leading-[1.1] mb-6">
            Bambu P2S <span className="text-primary-500"><br/>3D Printing Service</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-fg-muted mb-10 max-w-xl leading-relaxed font-light">
            Get an instant price in 30 seconds. Upload your STL file, pick material, and order online. No signup needed.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
            <div className="flex items-center gap-2 text-fg-muted border border-surface-border px-5 py-2.5 rounded-full bg-surface-muted/80">
              <RefreshCcw className="w-4 h-4" />
              Free Reprint If We Make a Mistake
            </div>
            <div className="flex items-center gap-2 text-fg-muted border border-surface-border px-5 py-2.5 rounded-full bg-surface-muted/80">
              <ShieldCheck className="w-4 h-4" />
              QC Checked Before Shipping
            </div>
          </div>
        </motion.div>

        {/* Right Col: Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-surface-border shadow-2xl bg-surface-card/50 flex items-center justify-center p-4">
               {/* 
                  Since I do not have direct access to your local chat attachments, 
                  please place the image as "printer.png" inside your public folder! 
               */}
               <img 
                 src="/printer.png" 
                 alt="Bambu P2S 3D Printer" 
                 className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                 onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/600x800/1e293b/3b82f6?text=Save+Image+As+\\npublic/printer.png"
                 }}
               />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
