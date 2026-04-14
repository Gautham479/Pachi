"use client";

import React from 'react';
import { Zap, Box, Palette, Layers, ShoppingCart, UploadCloud } from 'lucide-react';
import { useStore } from '../store/useStore';

const AVAILABLE_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'Gray', hex: '#6b7280' },
  { name: 'Beige', hex: '#d6c4a8' },
  { name: 'Latte Brown', hex: '#8b6b4a' },
  { name: 'Ivory White', hex: '#f8f5e9' },
];

export default function ConfigPanel() {
  const { config, setConfig, selectedFile, mockPrice, addToCart } = useStore();

  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center gap-2 mb-8">
        <Zap className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-bold text-fg">Configure Your Print</h3>
      </div>

      <div className="space-y-6">
        {/* Material Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-fg">
            <Box className="w-4 h-4 text-primary-500" /> Material
          </label>
          <select 
            value={config.material}
            onChange={(e) => setConfig({ material: e.target.value })}
            className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-3.5 text-fg appearance-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm font-semibold shadow-inner"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2371717a' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '2.5rem' }}
          >
            <option value="PLA">PLA</option>
            <option value="PETG">PETG</option>
            <option value="ABS">ABS</option>
            <option value="TPU">TPU</option>
          </select>
        </div>

        {/* Color Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-fg">
            <Palette className="w-4 h-4 text-primary-500" /> Color Option
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setConfig({ colorMode: 'Single Color' })}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                config.colorMode !== 'Multicolor'
                  ? 'border-primary-500 bg-primary-500/10 text-fg'
                  : 'border-surface-border bg-surface-muted text-fg-muted hover:text-fg'
              }`}
            >
              Single Color
            </button>
            <button
              type="button"
              onClick={() => setConfig({ colorMode: 'Multicolor', color: 'Multicolor' })}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                config.colorMode === 'Multicolor'
                  ? 'border-primary-500 bg-primary-500/10 text-fg'
                  : 'border-surface-border bg-surface-muted text-fg-muted hover:text-fg'
              }`}
            >
              Multicolor
            </button>
          </div>

          {config.colorMode !== 'Multicolor' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setConfig({ colorMode: 'Single Color', color: color.name })}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    config.color === color.name
                      ? 'border-primary-500 bg-primary-500/10 text-fg'
                      : 'border-surface-border bg-surface-muted text-fg-muted hover:text-fg'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quality Dropdown */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-fg">
            <Layers className="w-4 h-4 text-primary-500" /> Quality
          </label>
          <select 
            value={config.quality}
            onChange={(e) => setConfig({ quality: e.target.value })}
            className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-3.5 text-fg appearance-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm font-semibold shadow-inner"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2371717a' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '2.5rem' }}
          >
            <option value="Standard (0.2mm)">Standard (0.2mm) - Balanced quality</option>
            <option value="Draft (0.3mm)">Draft (0.3mm)</option>
            <option value="High (0.1mm)">High (0.1mm)</option>
          </select>
        </div>

        {/* Strength Slider */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-fg">
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
          
          <div className="flex justify-between text-xs text-fg-muted font-semibold mt-1">
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
                <p className="text-xs text-fg-muted uppercase tracking-wider font-bold">Estimated Cost</p>
                <div className="text-4xl font-black text-fg py-1">
                  <span className="text-primary-500 text-3xl align-super mr-1">₹</span>{mockPrice}
                </div>
                <p className="text-xs text-primary-500 flex items-center justify-center gap-1 font-medium mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                  Ready to print
                </p>
              </div>
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-surface-border/80 mb-3" />
                <p className="text-fg-muted font-bold text-base">Upload file on the left</p>
                <p className="text-xs text-fg-subtle font-medium mt-1">Pricing instantly appears here</p>
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
                ? 'bg-surface-muted border border-surface-border text-fg hover:border-primary-500/50 hover:bg-surface-border/50' 
                : 'bg-surface-muted text-fg-subtle border border-surface-border cursor-not-allowed opacity-50'
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
                ? 'bg-cta text-cta-contrast hover:opacity-90 shadow-lg shadow-black/10 dark:shadow-black/40 active:scale-[0.98]' 
                : 'bg-surface-muted text-fg-subtle cursor-not-allowed border border-surface-border/50'
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
