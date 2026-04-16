"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadBox from './UploadBox';
import ConfigPanel from './ConfigPanel';
import ProductsGrid from './ProductsGrid';
import { PackageSearch, PenTool } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function MainContentTabs() {
  const activeTab = useStore((state) => state.activeTab);
  const setActiveTab = useStore((state) => state.setActiveTab);
  const searchQuery = useStore((state) => state.searchQuery);
  const visibleTab = searchQuery.trim() ? 'products' : activeTab;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24 flex flex-col items-center">

      {/* Tab switcher */}
      <div
        id="content"
        className="relative bg-surface-card/70 backdrop-blur-xl border border-surface-border/60 p-1.5 rounded-2xl flex items-center mb-12 mx-auto sticky top-[72px] z-40 shadow-xl overflow-hidden"
        style={{ boxShadow: '0 0 30px rgba(99,102,241,0.1), 0 8px 32px rgba(0,0,0,0.1)' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 pointer-events-none" />

        {[
          { id: 'products', label: 'Products Gallery', icon: <PackageSearch className="w-4 h-4" /> },
          { id: 'custom', label: 'Custom Print', icon: <PenTool className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 min-w-[160px] z-10 ${
              visibleTab === tab.id ? 'text-white' : 'text-fg-muted hover:text-fg'
            }`}
          >
            {visibleTab === tab.id && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-full relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {visibleTab === 'products' ? (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-black text-fg mb-3">Print Shop</h2>
                <div className="h-[2px] w-20 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mb-4" />
                <p className="text-fg-muted">
                  Browse our curated selection of high-quality 3D printed products and accessories, ready to ship.
                </p>
              </div>
              <ProductsGrid />
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              id="quote"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-black text-fg mb-3">Custom Orders</h2>
                <div className="h-[2px] w-20 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mb-4" />
                <p className="text-fg-muted">
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
