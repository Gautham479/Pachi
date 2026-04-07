"use client";

import React from 'react';
import { Zap, Box, Palette, Layers, ShoppingCart, UploadCloud } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ConfigPanel() {
  const { config, setConfig, selectedFile, mockPrice, addToCart } = useStore();

  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center gap-2 mb-8">
        <Zap className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-bold text-white">Configure Your Print</h3>
      </div>

      <div className="space-y-6">
        {/* Material & Color Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-white">
              <Box className="w-4 h-4 text-primary-500" /> Material
            </label>
            <select 
              value={config.material}
              onChange={(e) => setConfig({ material: e.target.value })}
              className="w-full bg-surface-bg border border-surface-border rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm font-semibold shadow-inner"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238B8581' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '2.5rem' }}
            >
              <option value="PLA">PLA</option>
              <option value="ABS">ABS</option>
              <option value="PETG">PETG</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-white">
              <Palette className="w-4 h-4 text-primary-500" /> Color
            </label>
            <select 
              value={config.color}
              onChange={(e) => setConfig({ color: e.target.value })}
              className="w-full bg-surface-bg border border-surface-border rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm font-semibold shadow-inner"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238B8581' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '2.5rem' }}
            >
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
            </select>
          </div>
        </div>

        {/* Quality Dropdown */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-white">
            <Layers className="w-4 h-4 text-primary-500" /> Quality
          </label>
          <select 
            value={config.quality}
            onChange={(e) => setConfig({ quality: e.target.value })}
            className="w-full bg-surface-bg border border-surface-border rounded-xl px-4 py-3.5 text-white appearance-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm font-semibold shadow-inner"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238B8581' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '2.5rem' }}
          >
            <option value="Standard (0.2mm)">Standard (0.2mm) - Balanced quality</option>
            <option value="Draft (0.3mm)">Draft (0.3mm)</option>
            <option value="High (0.1mm)">High (0.1mm)</option>
          </select>
        </div>

        {/* Strength Slider */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-white">
               <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg> Strength
            </label>
            <span className="text-sm font-bold text-primary-500">{config.strength}%</span>
          </div>
          
          <input 
            type="range" 
            min="10" 
            max="100" 
            step="10"
            value={config.strength}
            onChange={(e) => setConfig({ strength: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-surface-border rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          
          <div className="flex justify-between text-xs text-[#8B8581] font-semibold mt-1">
            <span>Light (10%)</span>
            <span>Medium (50%)</span>
            <span>Solid (100%)</span>
          </div>
        </div>

        <div className="pt-8 pb-2">
          <div className="h-[1px] w-full bg-surface-border mb-8"></div>
          
          <div 
            className={`rounded-2xl border flex flex-col items-center justify-center p-6 transition-all text-center
              ${!selectedFile 
                ? 'border-surface-border border-dashed bg-surface-bg' 
                : 'border-primary-500/30 bg-primary-500/5'
              }
            `}
          >
            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-xs text-[#8B8581] uppercase tracking-wider font-bold">Estimated Cost</p>
                <div className="text-4xl font-black text-white py-1">
                  <span className="text-primary-500 text-3xl align-super mr-1">₹</span>{mockPrice}
                </div>
                <p className="text-xs text-accent-500 flex items-center justify-center gap-1 font-medium mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                  Ready to print
                </p>
              </div>
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-surface-border/80 mb-3" />
                <p className="text-[#DCD1CC] font-bold text-base">Upload file on the left</p>
                <p className="text-xs text-[#8B8581] font-medium mt-1">Pricing instantly appears here</p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 pt-2">
          <button 
            disabled={!selectedFile}
            onClick={addToCart}
            className={`flex items-center gap-2 py-4 px-6 rounded-xl font-bold transition-all shadow-sm
              ${selectedFile 
                ? 'bg-surface-bg border border-surface-border text-white hover:border-primary-500/50 hover:bg-surface-border/50' 
                : 'bg-surface-bg text-[#8B8581] border border-surface-border cursor-not-allowed opacity-50'
              }
            `}
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>

          <button 
            disabled={!selectedFile}
            className={`py-4 px-6 rounded-xl font-bold transition-all w-full
              ${selectedFile 
                ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20 active:scale-[0.98]' 
                : 'bg-surface-bg text-[#DCD1CC]/30 cursor-not-allowed border border-surface-border/50'
              }
            `}
          >
            {selectedFile ? 'Checkout Now' : 'Pending Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
