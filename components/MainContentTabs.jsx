"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadBox from './UploadBox';
import ConfigPanel from './ConfigPanel';
import ProductsGrid from './ProductsGrid';
import { PackageSearch, PenTool } from 'lucide-react';

export default function MainContentTabs() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'custom'

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24 flex flex-col items-center">
      
      {/* Sleek Segmented Control */}
      <div className="bg-[#1a1a1b]/60 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl flex items-center mb-10 mx-auto sticky top-[90px] z-40">
        <button
          onClick={() => setActiveTab('products')}
          className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-[160px] ${
            activeTab === 'products' ? 'text-white' : 'text-white/50 hover:text-white/80'
          }`}
        >
          {activeTab === 'products' && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl"
              initial={false}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <PackageSearch className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Products Gallery</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-[160px] ${
            activeTab === 'custom' ? 'text-white' : 'text-white/50 hover:text-white/80'
          }`}
        >
          {activeTab === 'custom' && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl"
              initial={false}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <PenTool className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Custom Print</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'products' ? (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl font-bold text-white mb-4">Print Shop</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-brand-orange to-[rgba(249,115,22,0.3)] mx-auto rounded-full mb-4"></div>
                <p className="text-white/60">
                  Browse our curated selection of high-quality 3D printed products and accessories, ready to ship.
                </p>
              </div>
              <ProductsGrid />
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl font-bold text-white mb-4">Custom Orders</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-brand-orange to-[rgba(249,115,22,0.3)] mx-auto rounded-full mb-4"></div>
                <p className="text-white/60">
                  Upload your own 3D models (STL files), configure your material preferences, and get an instant quote.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_500px] gap-8 lg:gap-10 items-start w-full">
                <div className="w-full relative h-[100%]">
                  <UploadBox />
                </div>
                <div className="w-full lg:sticky lg:top-24 pb-10">
                  <ConfigPanel />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
