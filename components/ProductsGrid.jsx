"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { AVAILABLE_COLORS, PRODUCT_TYPES } from '@/lib/catalog';

export default function ProductsGrid() {
  const [selectedType, setSelectedType] = useState('All');
  const [productColorOptions, setProductColorOptions] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addDirectItemToCart = useStore((state) => state.addDirectItemToCart);
  const openCart = useStore((state) => state.openCart);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = ['All', ...PRODUCT_TYPES];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const response = await fetch('/api/products?includeOutOfStock=1');
      const data = await response.json().catch(() => []);
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const activeType = searchQuery.trim() ? 'All' : selectedType;

  const filteredProducts = products.filter((product) => {
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
      return {
        ...prev,
        [productId]: { ...current, ...updates },
      };
    });
  };

  return (
    <div>
      {/* Horizontal Product Types Filter */}
      <div className="mb-10 overflow-x-auto pb-2">
        <div className="flex gap-3">
          {filters.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                activeType === type
                  ? 'bg-cta text-cta-contrast shadow-md shadow-black/10 dark:shadow-black/40'
                  : 'bg-surface-muted text-fg-muted hover:text-fg border border-surface-border hover:border-primary-500/30'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p className="text-fg-muted">Loading products...</p>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, idx) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="flex flex-col"
          >
            <Link href={`/products/${product.slug}`}>
              <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all group flex flex-col h-full cursor-pointer transform hover:scale-105">
                {/* Product Image */}
                <div className="w-full aspect-[4/3] relative opacity-90 group-hover:opacity-100 transition-opacity bg-surface-muted overflow-hidden">
                   {product.image ? (
                     <Image
                       src={product.image}
                       alt={product.name}
                       fill
                       className="object-contain w-full h-full p-3"
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     />
                   ) : (
                     <div className={`w-full h-full bg-gradient-to-br ${product.imageColor}`}>
                       <div className="absolute inset-0 bg-white/10" />
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-white font-medium tracking-widest uppercase text-sm drop-shadow-md">
                           3D Model
                         </span>
                       </div>
                     </div>
                   )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-fg font-medium text-lg">{product.name}</h3>
                    <span className="text-primary-600 font-bold">₹{product.price}</span>
                  </div>
                  
                  <p className="text-fg-muted text-sm mb-4 flex-grow">{product.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-surface-muted rounded text-xs text-fg-muted font-medium border border-surface-border">
                      {product.material}
                    </span>
                    <span className="px-2 py-1 bg-surface-muted rounded text-xs text-fg-muted font-medium border border-surface-border">
                      {product.type}
                    </span>
                    {!product.inStock && (
                      <span className="px-2 py-1 bg-amber-500/15 rounded text-xs text-amber-600 font-semibold border border-amber-500/30">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateProductColorOption(product.id, { colorMode: 'Single Color', color: productColorOptions[product.id]?.color || AVAILABLE_COLORS[0].name });
                        }}
                        className={`text-xs rounded-md border px-2 py-1.5 font-semibold ${
                          (productColorOptions[product.id]?.colorMode || 'Single Color') === 'Single Color'
                            ? 'border-primary-500 bg-primary-500/10 text-fg'
                            : 'border-surface-border bg-surface-muted text-fg-muted'
                        }`}
                      >
                        Single Color
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateProductColorOption(product.id, { colorMode: 'Multicolor', color: 'Multicolor' });
                        }}
                        className={`text-xs rounded-md border px-2 py-1.5 font-semibold ${
                          (productColorOptions[product.id]?.colorMode || 'Single Color') === 'Multicolor'
                            ? 'border-primary-500 bg-primary-500/10 text-fg'
                            : 'border-surface-border bg-surface-muted text-fg-muted'
                        }`}
                      >
                        Multicolor
                      </button>
                    </div>

                    {(productColorOptions[product.id]?.colorMode || 'Single Color') === 'Single Color' && (
                      <select
                        value={productColorOptions[product.id]?.color || AVAILABLE_COLORS[0].name}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onChange={(e) => updateProductColorOption(product.id, { colorMode: 'Single Color', color: e.target.value })}
                        className="w-full bg-surface-muted border border-surface-border rounded-md px-2 py-1.5 text-xs text-fg"
                      >
                        {AVAILABLE_COLORS.map((color) => (
                          <option key={color.name} value={color.name}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </Link>

            {/* Add to Cart Button */}
            <button 
              disabled={!product.inStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(product);
              }}
              className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm mt-3 shadow-md shadow-black/10 dark:shadow-black/40 ${
                product.inStock
                  ? 'bg-cta hover:opacity-90 text-cta-contrast'
                  : 'bg-surface-muted text-fg-subtle border border-surface-border cursor-not-allowed shadow-none'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </motion.div>
        ))}
      </div>
      )}
    </div>
  );
}
