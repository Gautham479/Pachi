"use client";

import React from 'react';
import { Zap, Box, Palette, Layers, ShoppingCart, UploadCloud, Sliders } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

const AVAILABLE_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'Gray', hex: '#6b7280' },
  { name: 'Beige', hex: '#d6c4a8' },
  { name: 'Latte Brown', hex: '#8b6b4a' },
  { name: 'Ivory White', hex: '#f8f5e9' },
];

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236366f1' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
  backgroundPosition: 'right 0.75rem center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1.25em 1.25em',
  paddingRight: '2.5rem',
};

export default function ConfigPanel() {
  const { config, setConfig, selectedFile, mockPrice, addToCart } = useStore();

  return (
    <div className="relative rounded-2xl border border-primary-500/20 bg-surface-card/70 backdrop-blur-xl p-6 sm:p-8 overflow-hidden"
      style={{ boxShadow: '0 0 40px rgba(99,102,241,0.08), 0 20px 60px rgba(0,0,0,0.1)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 pointer-events-none" />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary-500/40 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent-500/40 rounded-tr-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary-500" />
        </div>
        <h3 className="text-lg font-black text-fg">Configure Your Print</h3>
        <motion.div
          className="ml-auto w-2 h-2 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      <div className="space-y-6 relative">
        {/* Material */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-black text-fg">
            <Box className="w-4 h-4 text-primary-500" /> Material
          </label>
          <select
            value={config.material}
            onChange={(e) => setConfig({ material: e.target.value })}
            className="w-full bg-surface-muted/60 border border-surface-border rounded-xl px-4 py-3.5 text-fg appearance-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all text-sm font-bold backdrop-blur-sm"
            style={selectStyle}
          >
            <option value="PLA">PLA</option>
            <option value="PETG">PETG</option>
            <option value="ABS">ABS</option>
            <option value="TPU">TPU</option>
          </select>
        </div>

        {/* Color Mode */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-black text-fg">
            <Palette className="w-4 h-4 text-primary-500" /> Color Option
          </label>

          <div className="grid grid-cols-2 gap-2">
            {['Single Color', 'Multicolor'].map((mode) => (
              <button
                key={mode}
                onClick={() => setConfig({ colorMode: mode, color: mode === 'Multicolor' ? 'Multicolor' : config.color })}
                className={`py-2.5 px-3 rounded-xl text-sm font-bold border transition-all ${
                  config.colorMode === mode
                    ? 'border-primary-500/60 bg-primary-500/15 text-primary-500 shadow-sm'
                    : 'border-surface-border bg-surface-muted/40 text-fg-muted hover:border-primary-500/30 hover:text-fg'
                }`}
                style={config.colorMode === mode ? { boxShadow: '0 0 10px rgba(99,102,241,0.2)' } : {}}
              >
                {mode}
              </button>
            ))}
          </div>

          {config.colorMode !== 'Multicolor' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <div className="flex gap-2 flex-wrap">
                {AVAILABLE_COLORS.map((color) => (
                  <button
                    key={color.name}
                    title={color.name}
                    onClick={() => setConfig({ color: color.name })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      config.color === color.name
                        ? 'border-primary-500 scale-110 shadow-lg'
                        : 'border-surface-border hover:border-primary-500/50'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
              <p className="text-xs text-fg-subtle font-semibold">Selected: {config.color}</p>
            </motion.div>
          )}
        </div>

        {/* Quality */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-black text-fg">
            <Layers className="w-4 h-4 text-primary-500" /> Quality
          </label>
          <select
            value={config.quality}
            onChange={(e) => setConfig({ quality: e.target.value })}
            className="w-full bg-surface-muted/60 border border-surface-border rounded-xl px-4 py-3.5 text-fg appearance-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all text-sm font-bold backdrop-blur-sm"
            style={selectStyle}
          >
            <option value="Draft (0.3mm)">Draft (0.3mm)</option>
            <option value="Standard (0.2mm)">Standard (0.2mm)</option>
            <option value="High (0.1mm)">High (0.1mm)</option>
          </select>
        </div>

        {/* Strength */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-black text-fg">
            <Sliders className="w-4 h-4 text-primary-500" />
            Infill Strength
            <span className="ml-auto text-primary-500 font-black text-base">{config.strength}%</span>
          </label>

          <div className="relative">
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={config.strength}
              onChange={(e) => setConfig({ strength: Number(e.target.value) })}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--app-primary-500) 0%, var(--app-accent-500) ${config.strength}%, var(--app-surface-border) ${config.strength}%)`,
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-fg-subtle font-semibold">
            <span>Light (10%)</span>
            <span>Solid (100%)</span>
          </div>
        </div>

        {/* Price display */}
        <div className={`rounded-xl border p-5 text-center transition-all ${
          selectedFile
            ? 'border-primary-500/30 bg-primary-500/10'
            : 'border-surface-border bg-surface-muted/30'
        }`}
          style={selectedFile ? { boxShadow: '0 0 20px rgba(99,102,241,0.15)' } : {}}
        >
          {selectedFile ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-1"
            >
              <p className="text-xs text-fg-subtle uppercase tracking-widest font-bold">Estimated Price</p>
              <p className="text-5xl font-black gradient-text">₹{mockPrice}</p>
              <p className="text-xs text-fg-muted flex items-center justify-center gap-1 mt-1">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                Includes material & processing
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <UploadCloud className="w-8 h-8 text-fg-subtle" />
              <p className="text-fg-muted font-semibold text-sm">Upload your model to see price</p>
              <p className="text-xs text-fg-subtle">Instant pricing, no signup needed</p>
            </div>
          )}
        </div>

        {/* Add to Cart */}
        <motion.button
          disabled={!selectedFile}
          onClick={addToCart}
          whileHover={selectedFile ? { scale: 1.02 } : {}}
          whileTap={selectedFile ? { scale: 0.98 } : {}}
          className={`w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all ${
            selectedFile
              ? 'btn-glow bg-gradient-to-r from-primary-500 to-accent-500 text-white'
              : 'bg-surface-muted border border-surface-border text-fg-subtle cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </motion.button>
      </div>
    </div>
  );
}
