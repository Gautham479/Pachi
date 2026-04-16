"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Layers } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AVAILABLE_COLORS, PRODUCT_TYPES } from '@/lib/catalog';

function ProductCard({ product, handleAddToCart, updateProductColorOption, productColorOptions }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const uniqueImages = [...new Set(allImages)];

  useEffect(() => {
    let interval;
    if (isHovered && uniqueImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % uniqueImages.length);
      }, 1000);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, uniqueImages.length]);

  const displayImage = uniqueImages[currentImageIndex] || '';

  return (
    <div className="flex flex-col h-full group">
      <Link href={`/products/${product.slug}`} className="flex-grow flex flex-col cursor-pointer">
        <motion.div
          className="relative rounded-2xl border border-surface-border/60 bg-surface-card/60 backdrop-blur-sm overflow-hidden flex flex-col h-full transition-all duration-300"
          whileHover={{ y: -4 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          style={{
            boxShadow: isHovered ? '0 0 30px rgba(99,102,241,0.15), 0 20px 40px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          {/* Hover border glow */}
          <div className={`absolute inset-0 rounded-2xl border border-primary-500/0 transition-all duration-300 pointer-events-none ${isHovered ? 'border-primary-500/30' : ''}`} />

          {/* Image */}
          <div className="w-full aspect-[4/3] relative bg-surface-muted overflow-hidden">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={product.name}
                fill
                className={`object-contain w-full h-full p-3 transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${product.imageColor} flex items-center justify-center`}>
                <span className="text-white/60 font-bold tracking-widest uppercase text-sm">3D Model</span>
              </div>
            )}

            {/* Image dots */}
            {uniqueImages.length > 1 && isHovered && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                {uniqueImages.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-primary-500 w-4' : 'bg-white/40 w-1.5'}`} />
                ))}
              </div>
            )}

            {/* Out of stock overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-surface-bg/60 backdrop-blur-sm flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-fg font-bold text-base line-clamp-1 group-hover:text-primary-500 transition-colors">{product.name}</h3>
              <span className="text-primary-500 font-black ml-3 text-sm">₹{product.price}</span>
            </div>

            <p className="text-fg-muted text-sm mb-4 flex-grow line-clamp-2 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-2 py-1 bg-primary-500/10 rounded-lg text-xs text-primary-500 font-bold border border-primary-500/20">
                {product.material}
              </span>
              <span className="px-2 py-1 bg-surface-muted rounded-lg text-xs text-fg-muted font-bold border border-surface-border">
                {product.type}
              </span>
            </div>

            {/* Color options */}
            <div className="space-y-2 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                {['Single Color', 'Multicolor'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateProductColorOption(product.id, {
                        colorMode: mode,
                        color: mode === 'Multicolor' ? 'Multicolor' : (productColorOptions[product.id]?.color || AVAILABLE_COLORS[0].name)
                      });
                    }}
                    className={`text-xs rounded-lg border px-2 py-1.5 font-bold transition-all ${
                      (productColorOptions[product.id]?.colorMode || 'Single Color') === mode
                        ? 'border-primary-500/50 bg-primary-500/10 text-primary-500'
                        : 'border-surface-border bg-surface-muted/40 text-fg-muted hover:border-primary-500/30'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {(productColorOptions[product.id]?.colorMode || 'Single Color') === 'Single Color' && (
                <select
                  value={productColorOptions[product.id]?.color || AVAILABLE_COLORS[0].name}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onChange={(e) => updateProductColorOption(product.id, { colorMode: 'Single Color', color: e.target.value })}
                  className="w-full bg-surface-muted/60 border border-surface-border rounded-lg px-2 py-1.5 text-xs text-fg focus:outline-none focus:border-primary-500/50 transition-colors backdrop-blur-sm"
                >
                  {AVAILABLE_COLORS.map((color) => (
                    <option key={color.name} value={color.name}>{color.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Add to Cart */}
      <motion.button
        disabled={!product.inStock}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
        whileHover={product.inStock ? { scale: 1.02 } : {}}
        whileTap={product.inStock ? { scale: 0.98 } : {}}
        className={`w-full py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm mt-3 ${
          product.inStock
            ? 'btn-glow bg-gradient-to-r from-primary-500 to-accent-500 text-white'
            : 'bg-surface-muted text-fg-subtle border border-surface-border cursor-not-allowed'
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </motion.button>
    </div>
  );
}

export default function ProductsGrid() {
  const [selectedType, setSelectedType] = useState('All');
  const [productColorOptions, setProductColorOptions] = useState({});
  const products = useStore((state) => state.products);
  const setProducts = useStore((state) => state.setProducts);
  const [loading, setLoading] = useState(!products || products.length === 0);
  const addDirectItemToCart = useStore((state) => state.addDirectItemToCart);
  const openCart = useStore((state) => state.openCart);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = ['All', ...PRODUCT_TYPES];

  useEffect(() => {
    const loadProducts = async () => {
      if (!products || products.length === 0) setLoading(true);
      const response = await fetch('/api/products?includeOutOfStock=1');
      const data = await response.json().catch(() => []);
      if (Array.isArray(data)) setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, [setProducts]);

  const activeType = searchQuery.trim() ? 'All' : selectedType;

  const filteredProducts = (products || []).filter((product) => {
    const typeMatches = activeType === 'All' || product.type === activeType;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const queryMatches =
      normalizedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.type.toLowerCase().includes(normalizedQuery);
    return typeMatches && queryMatches;
  });

  const handleAddToCart = (product) => {
    const productOption = productColorOptions[product.id] || {
      colorMode: 'Single Color',
      color: AVAILABLE_COLORS[0].name,
    };
    addDirectItemToCart({
      fileName: product.name,
      config: {
        material: product.material,
        quality: 'Pre-printed',
        colorMode: productOption.colorMode,
        color: productOption.colorMode === 'Multicolor' ? 'Multicolor' : productOption.color,
        strength: 20
      },
      price: product.price
    });
    openCart();
  };

  const updateProductColorOption = (productId, updates) => {
    setProductColorOptions((prev) => {
      const current = prev[productId] || { colorMode: 'Single Color', color: AVAILABLE_COLORS[0].name };
      return { ...prev, [productId]: { ...current, ...updates } };
    });
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-10 overflow-x-auto pb-2">
        <div className="flex gap-2">
          {filters.map((type) => (
            <motion.button
              key={type}
              onClick={() => setSelectedType(type)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all text-sm ${
                activeType === type
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'bg-surface-card/60 backdrop-blur-sm text-fg-muted hover:text-fg border border-surface-border hover:border-primary-500/30'
              }`}
              style={activeType === type ? { boxShadow: '0 0 15px rgba(99,102,241,0.3)' } : {}}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full aspect-[3/4] bg-surface-muted/60 animate-pulse rounded-2xl border border-surface-border/40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <ProductCard
                  product={product}
                  handleAddToCart={handleAddToCart}
                  updateProductColorOption={updateProductColorOption}
                  productColorOptions={productColorOptions}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProducts.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-muted/60 border border-surface-border flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-fg-subtle" />
              </div>
              <p className="text-fg-muted text-lg font-semibold">No products found matching your criteria.</p>
              <button
                onClick={() => { setSelectedType('All'); useStore.getState().setSearchQuery(''); }}
                className="mt-4 px-5 py-2 bg-primary-500/10 border border-primary-500/30 rounded-xl text-primary-500 font-bold hover:bg-primary-500/20 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
